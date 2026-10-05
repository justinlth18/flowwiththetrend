import { projectTypeOptions, timelineOptions, type InquiryInput } from "@/lib/inquiry";

function label<T extends string>(options: { value: T; label: string }[], value: T | null) {
  if (!value) return "Not given";
  return options.find((option) => option.value === value)?.label ?? value;
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
