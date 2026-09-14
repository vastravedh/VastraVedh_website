import "server-only";

/**
 * Pluggable SMS sender.
 *
 * By default (no provider configured) it just LOGS the message to the server
 * console so the whole order flow works end-to-end without a paid account.
 *
 * To send REAL SMS, sign up with an Indian SMS provider and set env vars:
 *
 *   Fast2SMS (simplest for India):
 *     SMS_PROVIDER=fast2sms
 *     FAST2SMS_API_KEY=your-key
 *
 *   MSG91:
 *     SMS_PROVIDER=msg91
 *     MSG91_AUTH_KEY=your-key
 *     MSG91_SENDER_ID=VSTVDH        (6-char approved sender/DLT header)
 *
 * NOTE: In India, transactional SMS requires DLT registration of your sender
 * ID and templates with the telecom regulator (TRAI). Until that's approved
 * you can only send to your own verified/test numbers.
 */

export interface SmsResult {
  to: string;
  ok: boolean;
  provider: string;
  info?: string;
}

function normalize(phone: string): string {
  // strip spaces, +91, leading 0 -> keep last 10 digits
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-10);
}

export async function sendSms(to: string, message: string): Promise<SmsResult> {
  const provider = (process.env.SMS_PROVIDER || "console").toLowerCase();
  const number = normalize(to);

  try {
    if (provider === "fast2sms") {
      return await sendFast2Sms(number, message);
    }
    if (provider === "msg91") {
      return await sendMsg91(number, message);
    }
    // Default: log only.
    console.log(`\n[SMS → ${number}] ${message}\n`);
    return { to: number, ok: true, provider: "console", info: "logged" };
  } catch (err) {
    console.error("SMS send failed:", err);
    return {
      to: number,
      ok: false,
      provider,
      info: err instanceof Error ? err.message : "error",
    };
  }
}

/** Send the same message to several recipients. */
export async function sendSmsMany(
  recipients: string[],
  message: string
): Promise<SmsResult[]> {
  return Promise.all(recipients.map((r) => sendSms(r, message)));
}

async function sendFast2Sms(
  number: string,
  message: string
): Promise<SmsResult> {
  const key = process.env.FAST2SMS_API_KEY;
  if (!key) throw new Error("FAST2SMS_API_KEY not set");
  const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      message,
      language: "english",
      flash: 0,
      numbers: number,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return {
    to: number,
    ok: res.ok,
    provider: "fast2sms",
    info: JSON.stringify(data).slice(0, 200),
  };
}

async function sendMsg91(number: string, message: string): Promise<SmsResult> {
  const key = process.env.MSG91_AUTH_KEY;
  const sender = process.env.MSG91_SENDER_ID || "VSTVDH";
  if (!key) throw new Error("MSG91_AUTH_KEY not set");
  const res = await fetch("https://control.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: {
      authkey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender,
      // For MSG91 you normally use a template flow; this is a simple fallback.
      mobiles: `91${number}`,
      message,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return {
    to: number,
    ok: res.ok,
    provider: "msg91",
    info: JSON.stringify(data).slice(0, 200),
  };
}
