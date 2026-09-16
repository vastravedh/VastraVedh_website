import "server-only";

/**
 * Minimal email sender. Uses Resend (https://resend.com) when RESEND_API_KEY
 * is set; otherwise it's a no-op that logs, so the app runs fine without email
 * configured.
 *
 * To enable real emails, set these env vars (App Hosting secrets in prod):
 *   RESEND_API_KEY   — your Resend API key
 *   MAIL_FROM        — verified sender, e.g. "VastraVedh <hello@vastravedh.com>"
 *
 * No extra npm package is needed — we call Resend's REST API directly.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const MAIL_FROM =
  process.env.MAIL_FROM || "VastraVedh <onboarding@resend.dev>";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    // Not configured — don't fail, just skip so the rest of the flow works.
    console.warn("[mailer] RESEND_API_KEY not set; skipping email:", input.subject);
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `Resend error ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
