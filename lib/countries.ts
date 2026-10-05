export type Country = {
  iso: string;
  name: string;
  dial: string;
};

export const countries: Country[] = [
  { iso: "AR", name: "Argentina", dial: "+54" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "AT", name: "Austria", dial: "+43" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "BE", name: "Belgium", dial: "+32" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "BN", name: "Brunei", dial: "+673" },
  { iso: "KH", name: "Cambodia", dial: "+855" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "CL", name: "Chile", dial: "+56" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "CO", name: "Colombia", dial: "+57" },
  { iso: "CZ", name: "Czechia", dial: "+420" },
  { iso: "DK", name: "Denmark", dial: "+45" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "FI", name: "Finland", dial: "+358" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "GR", name: "Greece", dial: "+30" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "HU", name: "Hungary", dial: "+36" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "LA", name: "Laos", dial: "+856" },
  { iso: "MO", name: "Macao", dial: "+853" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "MV", name: "Maldives", dial: "+960" },
  { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "MM", name: "Myanmar", dial: "+95" },
  { iso: "NP", name: "Nepal", dial: "+977" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "PE", name: "Peru", dial: "+51" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "PL", name: "Poland", dial: "+48" },
  { iso: "PT", name: "Portugal", dial: "+351" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "RO", name: "Romania", dial: "+40" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "TW", name: "Taiwan", dial: "+886" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "TR", name: "Turkey", dial: "+90" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
];

const timezoneCountry: Record<string, string> = {
  "Asia/Singapore": "SG",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Kuching": "MY",
  "Asia/Hong_Kong": "HK",
  "Asia/Macau": "MO",
  "Asia/Shanghai": "CN",
  "Asia/Taipei": "TW",
  "Asia/Manila": "PH",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Bangkok": "TH",
  "Asia/Jakarta": "ID",
  "Asia/Makassar": "ID",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Brunei": "BN",
  "Australia/Perth": "AU",
  "Australia/Sydney": "AU",
  "Pacific/Auckland": "NZ",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "America/New_York": "US",
  "America/Los_Angeles": "US",
  "America/Chicago": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
};

export function flagEmoji(iso: string) {
  return iso
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function detectCountryIso(timeZone: string, language: string) {
  const fromZone = timezoneCountry[timeZone];
  if (fromZone && countries.some((country) => country.iso === fromZone)) return fromZone;
  const region = language.split("-")[1]?.toUpperCase();
  if (region && countries.some((country) => country.iso === region)) return region;
  return "US";
}

export function countryByIso(iso: string) {
  return countries.find((country) => country.iso === iso) ?? countries.find((country) => country.iso === "US")!;
}
