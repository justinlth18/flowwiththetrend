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

export async function notifyInquiry(inquiry: InquiryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL || "Flow With The Trend <onboarding@resend.dev>";
  if (!apiKey || !to) return false;

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
      return false;
    }
    return true;
  } catch (error) {
    console.error("inquiry email failed", error instanceof Error ? error.message : "network");
    return false;
  }
}
