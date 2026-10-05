import { projectTypeOptions, timelineOptions, type InquiryInput } from "@/lib/inquiry";

function label<T extends string>(options: { value: T; label: string }[], value: T | null) {
  if (!value) return "Not given";
  return options.find((option) => option.value === value)?.label ?? value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function brief(inquiry: InquiryInput) {
  return [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone ?? "Not given"}`,
    `Project: ${label(projectTypeOptions, inquiry.project_type)}`,
    `Project name: ${inquiry.project_name ?? "Not given"}`,
    `Timing: ${label(timelineOptions, inquiry.timeline)}`,
    "",
    inquiry.message,
  ].join("\n");
}

function row(labelText: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-top:2px solid #161616;font-family:Trebuchet MS,Arial,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#5c4a3a;width:120px;vertical-align:top;">${labelText}</td>
    <td style="padding:10px 0;border-top:2px solid #161616;font-family:Trebuchet MS,Arial,sans-serif;font-size:16px;font-weight:700;color:#161616;">${escapeHtml(value)}</td>
  </tr>`;
}

function briefHtml(inquiry: InquiryInput) {
  const project = label(projectTypeOptions, inquiry.project_type);
  const timing = label(timelineOptions, inquiry.timeline);
  const message = escapeHtml(inquiry.message).replace(/\n/g, "<br>");
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#140818;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#140818;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff200;border-radius:28px;">
            <tr>
              <td style="padding:28px 28px 8px;font-family:Trebuchet MS,Arial,sans-serif;">
                <div style="font-size:13px;font-weight:800;letter-spacing:0.18em;">FLOW</div>
                <div style="margin-top:14px;display:inline-block;background:#161616;color:#fff200;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;letter-spacing:0.12em;">NEW BRIEF</div>
                <h1 style="margin:12px 0 0;font-size:42px;line-height:0.9;letter-spacing:-0.04em;color:#ff3d92;">${escapeHtml(inquiry.name)}<br>sent a note.</h1>
                <p style="margin:12px 0 0;font-size:16px;font-weight:700;color:#161616;">A restaurant, a portfolio, or both. Read it, then reply.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Email", inquiry.email)}
                  ${row("Phone", inquiry.phone ?? "Not given")}
                  ${row("Project", project)}
                  ${row("Name", inquiry.project_name ?? "Not given")}
                  ${row("Timing", timing)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <div style="background:#fffdf2;border:3px solid #161616;border-radius:18px;padding:16px 18px;font-family:Trebuchet MS,Arial,sans-serif;">
                  <div style="font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#a33b62;">What the link should do</div>
                  <p style="margin:8px 0 0;font-size:16px;line-height:1.45;font-weight:650;color:#161616;">${message}</p>
                </div>
                <a href="mailto:${escapeHtml(inquiry.email)}" style="display:inline-block;margin-top:16px;background:#161616;color:#fff200;text-decoration:none;font-family:Trebuchet MS,Arial,sans-serif;font-weight:800;border-radius:999px;padding:12px 18px;">reply to ${escapeHtml(inquiry.name)}</a>
              </td>
            </tr>
          </table>
          <p style="font-family:Trebuchet MS,Arial,sans-serif;color:#d5d5d5;font-size:12px;">Flow With The Trend · a new tasting brief</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function envValue(name: string) {
  return process.env[name]?.trim().replace(/^["']|["']$/g, "") ?? "";
}

export async function notifyInquiry(inquiry: InquiryInput) {
  const apiKey = envValue("RESEND_API_KEY");
  const to = envValue("INQUIRY_NOTIFY_EMAIL");
  const from = envValue("INQUIRY_FROM_EMAIL") || "Flow With The Trend <onboarding@resend.dev>";
  if (!apiKey || !to) return { sent: false, error: "Email is not configured on the server." };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: `New brief from ${inquiry.name}`,
        text: brief(inquiry),
        html: briefHtml(inquiry),
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("inquiry email failed", response.status, detail.slice(0, 300));
      return { sent: false, error: detail.slice(0, 300) };
    }
    return { sent: true, error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "network";
    console.error("inquiry email failed", message);
    return { sent: false, error: message };
  }
}
