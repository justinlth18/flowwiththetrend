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

const ink = "color:#161616;-webkit-text-fill-color:#161616;";
const pink = "color:#ff3d92;-webkit-text-fill-color:#ff3d92;";
const yellowFill = "background-color:#fff200;background-image:linear-gradient(#fff200,#fff200);";
const blackFill = "background-color:#161616;background-image:linear-gradient(#161616,#161616);";
const creamFill = "background-color:#fffdf2;background-image:linear-gradient(#fffdf2,#fffdf2);";
const nightFill = "background-color:#140818;background-image:linear-gradient(#140818,#140818);";

function row(labelText: string, value: string) {
  return `<tr>
    <td class="row-label" style="padding:10px 0;border-top:2px solid #161616;font-family:Trebuchet MS,Arial,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#5c4a3a;-webkit-text-fill-color:#5c4a3a;width:120px;vertical-align:top;">${labelText}</td>
    <td class="ink" style="padding:10px 0;border-top:2px solid #161616;font-family:Trebuchet MS,Arial,sans-serif;font-size:16px;font-weight:700;${ink}">${escapeHtml(value)}</td>
  </tr>`;
}

function briefHtml(inquiry: InquiryInput) {
  const project = label(projectTypeOptions, inquiry.project_type);
  const timing = label(timelineOptions, inquiry.timeline);
  const message = escapeHtml(inquiry.message).replace(/\n/g, "<br>");
  return `<!doctype html>
<html>
  <head>
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <style>
      :root { color-scheme: light only; supported-color-schemes: light only; }
      .page { ${nightFill} }
      .card { ${yellowFill} }
      .pill { ${blackFill} color:#fff200 !important; -webkit-text-fill-color:#fff200 !important; }
      .note { ${creamFill} }
      .ink { ${ink} }
      .pink { ${pink} }
      .row-label { color:#5c4a3a !important; -webkit-text-fill-color:#5c4a3a !important; }
      .note-label { color:#a33b62 !important; -webkit-text-fill-color:#a33b62 !important; }
      .foot { color:#d5d5d5 !important; -webkit-text-fill-color:#d5d5d5 !important; }
      @media (prefers-color-scheme: dark) {
        .page { ${nightFill} }
        .card, .card td { ${yellowFill} }
        .pill { ${blackFill} color:#fff200 !important; -webkit-text-fill-color:#fff200 !important; }
        .note { ${creamFill} }
        .ink { ${ink} }
        .pink { ${pink} }
        .row-label { color:#5c4a3a !important; -webkit-text-fill-color:#5c4a3a !important; }
        .note-label { color:#a33b62 !important; -webkit-text-fill-color:#a33b62 !important; }
        .foot { color:#d5d5d5 !important; -webkit-text-fill-color:#d5d5d5 !important; }
      }
      u + .body .gmail-blend-screen { background:#000; mix-blend-mode:screen; }
      u + .body .gmail-blend-difference { background:#000; mix-blend-mode:difference; }
    </style>
  </head>
  <body class="body page" style="margin:0;padding:0;${nightFill}">
    <div class="gmail-blend-screen">
      <div class="gmail-blend-difference">
        <table role="presentation" class="page" width="100%" cellpadding="0" cellspacing="0" bgcolor="#140818" style="${nightFill}padding:28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" bgcolor="#fff200" style="max-width:560px;${yellowFill}border-radius:28px;">
                <tr>
                  <td class="card" bgcolor="#fff200" style="padding:28px 28px 8px;${yellowFill}font-family:Trebuchet MS,Arial,sans-serif;">
                    <div class="ink" style="font-size:13px;font-weight:800;letter-spacing:0.18em;${ink}">FLOW</div>
                    <div class="pill" style="margin-top:14px;display:inline-block;${blackFill}color:#fff200;-webkit-text-fill-color:#fff200;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;letter-spacing:0.12em;">NEW BRIEF</div>
                    <h1 class="pink" style="margin:12px 0 0;font-size:42px;line-height:0.9;letter-spacing:-0.04em;${pink}">${escapeHtml(inquiry.name)}<br>sent a note.</h1>
                    <p class="ink" style="margin:12px 0 0;font-size:16px;font-weight:700;${ink}">A restaurant, a portfolio, or both. Their address is in the list below.</p>
                  </td>
                </tr>
                <tr>
                  <td class="card" bgcolor="#fff200" style="padding:8px 28px 20px;${yellowFill}">
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
                  <td class="card" bgcolor="#fff200" style="padding:0 28px 28px;${yellowFill}">
                    <div class="note" style="${creamFill}border:3px solid #161616;border-radius:18px;padding:16px 18px;font-family:Trebuchet MS,Arial,sans-serif;">
                      <div class="note-label" style="font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#a33b62;-webkit-text-fill-color:#a33b62;">What the link should do</div>
                      <p class="ink" style="margin:8px 0 0;font-size:16px;line-height:1.45;font-weight:650;${ink}">${message}</p>
                    </div>
                  </td>
                </tr>
              </table>
              <p class="foot" style="font-family:Trebuchet MS,Arial,sans-serif;color:#d5d5d5;-webkit-text-fill-color:#d5d5d5;font-size:12px;">Flow With The Trend · a new tasting brief</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
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
  const replyTo = from.match(/<([^>]+)>/)?.[1] ?? from;
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
        reply_to: replyTo,
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
