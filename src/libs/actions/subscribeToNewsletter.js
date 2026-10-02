"use server";

// NOTE: We deliberately do NOT import "@supabase/supabase-js" here.
// That library's client was throwing "Cannot destructure property 'auth'
// from null or undefined value" during module load. Calling Supabase's
// REST (PostgREST) API directly with fetch avoids the library entirely,
// so that bug can no longer happen, and nothing runs until the form is
// actually submitted.

async function insertSubscriber({ name, email }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
    return { ok: false, status: 0, body: null };
  }

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/newsletter_subscribers`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify([{ name, email }]),
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body (e.g. return=minimal on success) -- that's fine
  }

  return { ok: res.ok, status: res.status, body };
}

export async function subscribeToNewsletter(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const honeypot = formData.get("website");

  if (honeypot) {
    return { success: false, error: "Something went wrong." };
  }

  if (!name || !email) {
    return { success: false, error: "Please fill in all fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const result = await insertSubscriber({ name, email });

  if (!result.ok) {
    // Postgres unique_violation surfaces as HTTP 409 with code "23505"
    const code = result.body?.code;
    if (result.status === 409 || code === "23505") {
      return { success: false, error: "This email is already subscribed." };
    }
    console.error("Supabase insert error:", result.status, result.body);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true, error: "" };
}
