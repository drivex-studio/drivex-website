import { NextResponse } from "next/server";

// Weekly digest: reads newsletter subscribers from Supabase and emails a summary.
// Triggered by Vercel Cron (see vercel.json). Uses the SAME env vars as the rest of the site, plus:
//   CRON_SECRET  - any long random string you add in Vercel (protects this URL)

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function GET(request) {
  // Only Vercel Cron (or someone with the secret) may run this
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!supabaseUrl || !supabaseKey || !resendKey || !to || !from) {
    console.error("Weekly digest: missing env vars.");
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }

  const base = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/newsletter_subscribers`;
  const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };

  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // New subscribers in the last 7 days
    const newRes = await fetch(
      `${base}?select=name,email,created_at&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=1000`,
      { headers, cache: "no-store" }
    );
    if (!newRes.ok) {
      console.error("Weekly digest: Supabase error", newRes.status, await newRes.text());
      return NextResponse.json({ error: "Supabase query failed." }, { status: 502 });
    }
    const newSubs = await newRes.json();

    // Total subscribers (count only, no rows downloaded)
    let total = "?";
    const countRes = await fetch(`${base}?select=id`, {
      headers: { ...headers, Prefer: "count=exact", Range: "0-0" },
      cache: "no-store",
    });
    const range = countRes.headers.get("content-range"); // e.g. "0-0/42"
    if (range && range.includes("/")) total = range.split("/")[1];

    const rows = newSubs
      .map(
        (s) =>
          `<tr><td style="padding:4px 12px 4px 0">${escapeHtml(s.name)}</td>` +
          `<td style="padding:4px 12px 4px 0">${escapeHtml(s.email)}</td>` +
          `<td style="padding:4px 0">${escapeHtml(String(s.created_at).slice(0, 16).replace("T", " "))} UTC</td></tr>`
      )
      .join("");

    const html = `
      <h2>Weekly newsletter subscribers</h2>
      <p><strong>New this week:</strong> ${newSubs.length}<br/>
         <strong>Total subscribers:</strong> ${escapeHtml(total)}</p>
      ${
        newSubs.length
          ? `<table style="border-collapse:collapse">${rows}</table>`
          : "<p>No new subscribers this week.</p>"
      }
    `;

    const mailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Weekly subscribers: ${newSubs.length} new (${total} total)`,
        html,
      }),
    });

    if (!mailRes.ok) {
      console.error("Weekly digest: Resend error", mailRes.status, await mailRes.text());
      return NextResponse.json({ error: "Email failed." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, newThisWeek: newSubs.length, total });
  } catch (err) {
    console.error("Weekly digest error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
