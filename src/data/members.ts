export type Member = {
  code: string;
  country: string;
  type: "member-state" | "associated" | "industry";
  flag?: string;
};

export const MEMBERS: Member[] = [
  { code: "AT", country: "Austria", type: "member-state" },
  { code: "BE", country: "Belgium", type: "member-state" },
  { code: "BG", country: "Bulgaria", type: "member-state" },
  { code: "HR", country: "Croatia", type: "member-state" },
  { code: "CY", country: "Cyprus", type: "member-state" },
  { code: "CZ", country: "Czech Republic", type: "member-state" },
  { code: "DE", country: "Germany", type: "member-state" },
  { code: "DK", country: "Denmark", type: "member-state" },
  { code: "EE", country: "Estonia", type: "member-state" },
  { code: "ES", country: "Spain", type: "member-state" },
  { code: "FI", country: "Finland", type: "member-state" },
  { code: "FR", country: "France", type: "member-state" },
  { code: "GR", country: "Greece", type: "member-state" },
  { code: "HU", country: "Hungary", type: "member-state" },
  { code: "IE", country: "Ireland", type: "member-state" },
  { code: "IT", country: "Italy", type: "member-state" },
  { code: "LT", country: "Lithuania", type: "member-state" },
  { code: "LV", country: "Latvia", type: "member-state" },
  { code: "MT", country: "Malta", type: "member-state" },
  { code: "NL", country: "Netherlands", type: "member-state" },
  { code: "PL", country: "Poland", type: "member-state" },
  { code: "PT", country: "Portugal", type: "member-state" },
  { code: "RO", country: "Romania", type: "member-state" },
  { code: "SE", country: "Sweden", type: "member-state" },
  { code: "SI", country: "Slovenia", type: "member-state" },
  { code: "SK", country: "Slovakia", type: "member-state" },
  { code: "CH", country: "Switzerland", type: "associated" },
  { code: "NO", country: "Norway", type: "associated" },
  { code: "IS", country: "Iceland", type: "associated" },
];

export const INDUSTRY_MEMBERS = [
  "IMEC",
  "CEA-Leti",
  "Fraunhofer",
  "STMicroelectronics",
  "Infineon",
  "NXP",
  "ASML",
  "GlobalFoundries",
  "Bosch",
  "Valeo",
  "Nokia",
  "Ericsson",
  "Philips",
  "Siemens",
  "Airbus",
  "Thales",
];
