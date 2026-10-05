export const projectTypes = ["restaurant", "portfolio", "both", "unsure"] as const;
export const timelines = ["asap", "this-month", "this-season", "browsing"] as const;

export type ProjectType = (typeof projectTypes)[number];
export type Timeline = (typeof timelines)[number];

export const projectTypeOptions: { value: ProjectType; label: string }[] = [
  { value: "restaurant", label: "Restaurant website" },
  { value: "portfolio", label: "Portfolio" },
  { value: "both", label: "A bit of both" },
  { value: "unsure", label: "Not sure yet" },
];

export const timelineOptions: { value: Timeline; label: string }[] = [
  { value: "asap", label: "As soon as you can" },
  { value: "this-month", label: "This month" },
  { value: "this-season", label: "This season" },
  { value: "browsing", label: "Just looking" },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+\d{1,4}(?:[\s().-]*\d){6,14}$/;

export type InquiryInput = {
  name: string;
  email: string;
  phone: string | null;
  project_type: ProjectType;
  project_name: string | null;
  timeline: Timeline | null;
  message: string;
};

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function validateInquiry(
  input: unknown,
): { ok: true; data: InquiryInput } | { ok: false; errors: Record<string, string> } {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const name = clean(source.name, 80);
  const email = clean(source.email, 120);
  const phone = clean(source.phone, 30);
  const projectType = clean(source.projectType, 20);
  const projectName = clean(source.projectName, 80);
  const timeline = clean(source.timeline, 20);
  const message = clean(source.message, 2000);
  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Tell us what to call you.";
  if (!emailPattern.test(email)) errors.email = "That email does not look right.";
  if (phone && (phone.length > 30 || !phonePattern.test(phone))) {
    errors.phone = "Add the number after the country code.";
  }
  if (!projectTypes.includes(projectType as ProjectType)) errors.projectType = "Pick a project type.";
  if (timeline && !timelines.includes(timeline as Timeline)) errors.timeline = "Pick a timeline.";
  if (message.length < 10) errors.message = "Give us a sentence or two.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      email,
      phone: phone || null,
      project_type: projectType as ProjectType,
      project_name: projectName || null,
      timeline: (timeline || null) as Timeline | null,
      message,
    },
  };
}
