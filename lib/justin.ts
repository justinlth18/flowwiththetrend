export const justin = {
  name: "Justin Looi Teng Hein",
  chineseName: "吕廷轩",
  role: "Frontend Developer / UI/UX Designer",
  place: "Petaling Jaya, Selangor, Malaysia",
  email: "justinlth18@gmail.com",
  phone: "+60 11-1212-8757",
  phoneHref: "tel:+601112128757",
  summary:
    "I studied cybersecurity, then moved into the screen people actually touch. White-label sites in React and Next.js, interfaces in Figma, and now a contract on CROSSUB: the web dashboard and the inspector app for a property platform.",
  links: [
    { label: "Email", href: "mailto:justinlth18@gmail.com" },
    { label: "WhatsApp", href: "https://wa.me/601112128757" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/justin-looi/" },
    { label: "GitHub", href: "https://github.com/justinlth18" },
    { label: "Instagram", href: "https://www.instagram.com/justinlooi/" },
  ],
} as const;

export const experience = [
  {
    company: "CROSSUB",
    role: "Frontend Developer",
    when: "May 2026 – Present",
    meta: "Contract",
    points: [
      "Contract frontend on a property-management platform for agencies.",
      "The Next.js dashboard: properties, inspections, leasing, maintenance, trust accounting, sales, and internal IT work.",
      "The Expo inspector app for iOS and Android, including camera, location, and field work.",
      "Forms with React Hook Form and Zod, state with Zustand, UI with Tailwind CSS and Radix.",
      "Tests with Vitest, in a pnpm monorepo that talks to a NestJS and Prisma API.",
    ],
  },
  {
    company: "Distinct Creation Sdn. Bhd.",
    role: "Frontend Developer & UI/UX Designer",
    when: "March 2025 – April 2026",
    meta: "",
    points: [
      "White-label web apps in React and Next.js.",
      "High-fidelity desktop and mobile screens in Figma.",
      "Features shipped with design and development in the same conversation.",
    ],
  },
  {
    company: "Trinity42",
    role: "IT Intern",
    when: "July 2023 – October 2023",
    meta: "",
    points: [
      "Internal evaluation portal with multi-tier role-based access, automated email, and user management.",
      "Sensitive records in Accelo, and the workflows around them.",
    ],
  },
  {
    company: "Trinity42",
    role: "Data Entry",
    when: "2022 – 2023",
    meta: "Part time",
    points: ["Moved client records across Duda, Accelo, and Google Sheets so the same person was not stored three ways."],
  },
  {
    company: "Trinity42",
    role: "IT Intern",
    when: "January 2022 – March 2022",
    meta: "",
    points: [
      "Staff training portal in PHP and JavaScript, hosted on SiteGround.",
      "Technical audio and live support for a virtual business launch.",
    ],
  },
] as const;

export const education = [
  {
    school: "Asia Pacific University",
    credential: "Bachelor of Science (Honours) in Computer Science (Cyber Security)",
    when: "2022 – 2024",
  },
  {
    school: "INTI International College Subang",
    credential: "Diploma in Computer Science",
    when: "2020 – 2022",
  },
] as const;

export const skillGroups = [
  {
    name: "From CROSSUB",
    items: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Radix UI",
      "Zustand",
      "React Hook Form",
      "Zod",
      "Framer Motion",
      "Recharts",
      "Vitest",
      "React Native",
      "Expo",
      "pnpm",
      "Prisma",
      "Google Maps",
    ],
  },
  {
    name: "Languages I write in",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "PHP", "Python", "Java", "C++"],
  },
  {
    name: "Design and the web",
    items: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "React", "Next.js", "Material UI", "Tailwind CSS", "WordPress", "Wix"],
  },
  {
    name: "Data and security",
    items: [
      "MySQL",
      "SQL Server",
      "Google Sheets",
      "SAS",
      "RStudio",
      "Penetration testing",
      "Vulnerability assessment",
      "Incident response",
      "Network security",
    ],
  },
  {
    name: "Beside the code",
    items: ["GitHub", "Postman", "Cursor", "Jira", "Notion", "Slack", "Accelo", "Duda", "Canva"],
  },
] as const;

export const languages = [
  { name: "English", level: "Advanced" },
  { name: "Chinese", level: "Native" },
  { name: "Cantonese", level: "Intermediate" },
  { name: "Malay", level: "Basic" },
] as const;
