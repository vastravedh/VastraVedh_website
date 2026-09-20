import "server-only";

/**
 * Email sender with two providers, tried in order:
 *
 *  1. Gmail SMTP (recommended for reliable delivery to any inbox at low volume).
 *     Set GMAIL_USER (e.g. vastravedh3105@gmail.com) and GMAIL_APP_PASSWORD
 *     (a 16-char Google App Password — NOT the account password).
 *
 *  2. Resend REST API. Set RESEND_API_KEY (+ optional MAIL_FROM). Without a
 *     verified domain, Resend's shared sender is unreliable for real inboxes.
 *
 * If neither is configured, sending is skipped (no-op) and the caller can log
 * the code server-side.
 */

const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const MAIL_FROM =
  process.env.MAIL_FROM ||
  (GMAIL_USER ? `VastraVedh <${GMAIL_USER}>` : "VastraVedh <onboarding@resend.dev>");

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

async function sendViaGmail(input: SendEmailInput): Promise<SendEmailResult> {
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });
    await transport.sendMail({
      from: MAIL_FROM,
      to: Array.isArray(input.to) ? input.to.join(",") : input.to,
      subject: input.subject,
      html: input.html,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "gmail send failed" };
  }
}

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
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
    return { ok: false, error: e instanceof Error ? e.message : "resend send failed" };
  }
}

export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    return sendViaGmail(input);
  }
  if (RESEND_API_KEY) {
    return sendViaResend(input);
  }
  console.warn("[mailer] No email provider configured; skipping:", input.subject);
  return { ok: true, skipped: true };
}
