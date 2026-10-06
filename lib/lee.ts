export const lee = {
  name: "Lee Kar Meng",
  role: "Fresh graduate",
  field: "Bachelor of Business Administration",
  email: "calvin2867@gmail.com",
  phone: "010-2022166",
  phoneHref: "tel:+60102022166",
  summary:
    "Fresh graduate in Business Administration from Universiti Tunku Abdul Rahman, with a base in organisation development, strategic planning, and business management. Recent work spans sales promotion, media administration, kitchen operations, and an IT service desk.",
} as const;

export const experience = [
  {
    company: "Baby Fair",
    role: "Part-time sales promoter",
    when: "7 days",
    points: [
      "Promoted selected products and talked customers through the benefits.",
      "Sold those products on the floor.",
      "Set up the booth for a Christmas event.",
      "Sorted and arranged warehouse stock.",
    ],
  },
  {
    company: "Worthy Media",
    role: "Admin intern",
    when: "3 months",
    points: [
      "Researched brands that fit partner goals.",
      "Made cold calls to brief brands on the programs.",
      "Sent proposals and offers to new brands.",
      "Convinced merchants to join the programs.",
      "Tracked program progress in Excel and followed up with clients.",
    ],
  },
  {
    company: "FNC",
    role: "Part-time sales promoter",
    when: "1 month",
    points: [],
  },
  {
    company: "Bee Cheng Hiang",
    role: "Part-time kitchen crew",
    when: "1 month",
    points: [
      "Weighed meat and kept the records.",
      "Calculated and arranged stock.",
      "Helped prepare the bakkwa.",
    ],
  },
  {
    company: "Wintoo",
    role: "Management trainee",
    when: "1 month",
    points: ["Ran outfield sales.", "Handled after-sales service.", "Followed up with customers."],
  },
  {
    company: "Computacenter",
    role: "IT service desk analyst",
    when: "2 years",
    points: [
      "Supported users with hardware, software, and installation issues.",
      "Diagnosed problems, resolved what I could, and escalated the rest.",
      "Handled user accounts, onboarding, and offboarding.",
      "Logged incidents and tracked them in ServiceNow.",
    ],
  },
] as const;

export const education = [
  {
    school: "Universiti Tunku Abdul Rahman",
    credential: "Bachelor of Business Administration",
    when: "2022 – 2025",
    note: "GPA 2.88 / 4.00",
  },
  {
    school: "Foundations in Art",
    credential: "Stream Y, Management and Accountancy",
    when: "2020 – 2021",
    note: "GPA 3.00 / 4.00",
  },
  {
    school: "Sijil Pelajaran Malaysia",
    credential: "SPM",
    when: "2014 – 2019",
    note: "",
  },
] as const;

export const skills = [
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft Outlook",
  "Marketing",
  "Consumer behavior",
  "Communication",
  "Critical thinking",
  "Strategic management",
] as const;

export const languages = ["English", "Chinese", "Malay"] as const;
