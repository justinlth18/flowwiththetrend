export const nicson = {
  name: "Nicson Chang Zhiyang",
  resumeName: "Chang Zhiyang",
  role: "Regional Manager",
  place: "Kuala Lumpur, Malaysia",
  email: "changzhiyangl@gmail.com",
  phone: "016-2231328",
  phoneHref: "tel:+60162231328",
  summary:
    "Regional manager with experience across more than 40 retail outlets and franchise operations in Malaysia. The work covers sales growth, staff training, SOP compliance, and outlet performance, plus the day-to-day of fixing what slows a store down.",
} as const;

export const experience = [
  {
    company: "Mixue Malaysia",
    role: "Regional Manager",
    when: "2024 – Present",
    place: "Kedah and Perlis",
    current: true,
    points: [
      "Manage and oversee more than 40 outlets.",
      "Watch outlet performance, sales trends, and operational KPIs.",
      "Support franchisees on daily operations, staffing, SOP, and problems on the floor.",
      "Run staff training and operational evaluations so service and the brand stay consistent.",
      "Analyse sales and stock data to find what will lift an outlet.",
      "Coordinate setup and readiness for new store openings.",
    ],
  },
  {
    company: "Pejabat Ahli Parlimen Lembah Pantai",
    role: "Operation Executive",
    when: "Jan 2024 – May 2024",
    place: "",
    current: false,
    points: [
      "Coordinated community programs and public service activities.",
      "Handled public enquiries and operational matters.",
      "Worked with government agencies and relevant authorities.",
      "Supported planning for community engagement.",
    ],
  },
  {
    company: "Track Twenty Two",
    role: "Event person in charge",
    when: "Nov 2022 – Jan 2023",
    place: "",
    current: false,
    points: [
      "Managed warehouse sales events and coordinated the operation.",
      "Handled vendor coordination, the venue, and event logistics.",
      "Supervised part-time crews on the ground.",
      "Helped with planning and customer flow during events.",
    ],
  },
  {
    company: "Arley Baby",
    role: "Sales Executive",
    when: "2021 – 2024",
    place: "",
    current: false,
    points: [
      "Promoted and upsold products while keeping customer relationships.",
      "Managed cashier operations and POS transactions.",
      "Advised customers on products and after-sales support.",
      "Kept the brand image and the service standard on the floor.",
    ],
  },
] as const;

export const education = [
  {
    school: "Tunku Abdul Rahman University of Management and Technology",
    credential: "Bachelor of Public Relations (Honours) with Merit",
    when: "2022 – 2024",
  },
  {
    school: "Tunku Abdul Rahman University of Management and Technology",
    credential: "Diploma in Public Relations with Merit",
    when: "2020 – 2022",
  },
] as const;

export const skills = [
  "Regional operations",
  "Retail and franchise",
  "Sales analysis",
  "Staff training",
  "Leadership",
  "SOP compliance",
  "Customer relationships",
  "Digital marketing",
  "Branding",
  "Business development",
  "Crisis management",
  "Problem solving",
] as const;

export const languages = ["English", "Bahasa Malaysia", "Mandarin", "Cantonese"] as const;
