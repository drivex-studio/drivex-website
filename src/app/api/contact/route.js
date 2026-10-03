import { NextResponse } from "next/server";

// Contact form -> email, sent through Resend's REST API (no extra npm package needed).
// Env vars (set in .env.local and in your hosting dashboard):
//   RESEND_API_KEY      - from resend.com
//   CONTACT_TO_EMAIL    - the inbox that should receive messages
//   CONTACT_FROM_EMAIL  - e.g. "DriveX <hello@yourdomain.com>" (domain must be verified in Resend)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_BUDGETS = ["8-15k", "15-25k", "25k-plus"];

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Strip line breaks so nobody can inject extra email headers via subject/name
const oneLine = (value = "") => String(value).replace(/[\r\n]+/g, " ").trim();

export async function POST(request) {
  try {
    const formData = await request.formData();

    const firstName = oneLine(formData.get("firstName"));
    const lastName = oneLine(formData.get("lastName"));
    const email = oneLine(formData.get("email"));
    const company = oneLine(formData.get("company"));
    const budget = oneLine(formData.get("budget"));
    const message = String(formData.get("message") || "").trim();
    const honeypot = formData.get("website");
    const submissionTime = Number(formData.get("_submissionTime") || 0);

    // Bots: honeypot filled or submitted unrealistically fast.
    // Pretend success so bots learn nothing.
    if (honeypot || submissionTime < 2000) {
      return NextResponse.json({ ok: true });
    }

    // Server-side validation (never trust the browser)
    if (!firstName || !lastName || !message || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    if (!ALLOWED_BUDGETS.includes(budget)) {
      return NextResponse.json({ error: "Invalid budget." }, { status: 400 });
    }
    if (message.length > 5000 || firstName.length > 100 || lastName.length > 100 || company.length > 200) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      console.error("Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL env vars.");
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    const fullName = `${firstName} ${lastName}`;

    const html = `
      <h2>New contact form message</h2>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company) || "-"}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email, // pressing "Reply" in your inbox answers the visitor
        subject: `New inquiry from ${fullName}${company ? ` (${company})` : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return NextResponse.json({ error: "Failed to send." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
