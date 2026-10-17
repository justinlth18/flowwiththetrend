import { envValue } from "@/lib/notify";

const testFrom = "Flow With The Trend <onboarding@resend.dev>";

function resendMessage(detail: string) {
  try {
    const body = JSON.parse(detail) as { message?: string };
    if (body.message) return body.message;
  } catch {
    /* Resend sometimes returns plain text. */
  }
  return detail.replace(/\s+/g, " ").slice(0, 240);
}

async function postCode(apiKey: string, from: string, email: string, code: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your Flow desk code",
      text: `Your desk code is ${code}. It closes in 10 minutes.`,
      html: `<!doctype html>
        <body style="margin:0;background:#140818;padding:28px 12px;">
          <table role="presentation" width="100%" style="max-width:460px;margin:0 auto;background:#fff200;border-radius:28px;">
            <tr><td style="padding:28px;font-family:Trebuchet MS,Arial,sans-serif;color:#161616;">
              <div style="font-weight:800;letter-spacing:0.16em;">FLOW</div>
              <h1 style="margin:12px 0 0;font-size:36px;line-height:0.95;color:#ff3d92;">Your desk code.</h1>
              <p style="font-weight:700;">Type these six numbers to finish the account. They close in 10 minutes.</p>
              <p style="margin:18px 0 0;font-size:40px;letter-spacing:0.28em;font-weight:800;">${code}</p>
            </td></tr>
          </table>
        </body>`,
    }),
  });

  if (response.ok) return { sent: true, error: "" };
  const detail = await response.text();
  return { sent: false, error: resendMessage(detail) };
}

export async function sendDeskCode(email: string, code: string) {
  const apiKey = envValue("RESEND_API_KEY");
  const configured = envValue("INQUIRY_FROM_EMAIL");
  if (!apiKey) return { sent: false, error: "Add RESEND_API_KEY on Vercel, then redeploy." };

  const first = await postCode(apiKey, configured || testFrom, email, code);
  if (first.sent || !configured || configured === testFrom) return first;
  if (!/from|domain|verif/i.test(first.error)) return first;
  return postCode(apiKey, testFrom, email, code);
}
