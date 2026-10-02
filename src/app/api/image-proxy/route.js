import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["cdn.sanity.io"]);

export const runtime = "nodejs";

export async function GET(request) {
  const imageUrl = new URL(request.url).searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Missing "url" parameter' },
      { status: 400 }
    );
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }

  if (
    parsedUrl.protocol !== "https:" ||
    !ALLOWED_HOSTS.has(parsedUrl.hostname)
  ) {
    return NextResponse.json(
      { error: "Host not allowed" },
      { status: 403 }
    );
  }

  try {
    const upstreamResponse = await fetch(parsedUrl.toString(), {
      next: { revalidate: 86400 }
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch upstream image" },
        { status: upstreamResponse.status }
      );
    }

    const contentType =
      upstreamResponse.headers.get("content-type") ?? "";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Upstream response is not an image" },
        { status: 415 }
      );
    }

    return new NextResponse(upstreamResponse.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("[Image Proxy] Fetch error:", error);

    return NextResponse.json(
      { error: "Fetch error" },
      { status: 500 }
    );
  }
}
