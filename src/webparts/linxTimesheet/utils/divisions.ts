export interface IDivisionArea {
  division: string;
  areas: string[];
}

export const DIVISIONS: IDivisionArea[] = [
  {
    division: "Consulting Design & Delivery",
    areas: [
      "Sales",
      "Finance",
      "Operations",
      "Leadership",
      "Culture",
      "Other",
    ],
  },
  {
    division: "Growth & Branding",
    areas: [
      "Website",
      "Social Media Management",
      "SEO Analytics & Insights",
      "Marketing Content Design & Creation",
      "Content Posting & Scheduling",
      "Other",
    ],
  },
  {
    division: "Business Development",
    areas: [
      "Lead Generation & Prospecting",
      "Brand Awareness & Market Presence",
      "Discovery Call & Qualification",
      "Pipeline & CRM Management",
      "Client Relation",
      "Other",
    ],
  },
  {
    division: "People & Culture",
    areas: [
      "Recruitment & Talent Acquisition",
      "Compensation and benefits",
      "Employee Relations",
      "Training & Development",
      "HR Operations & System",
      "Onboarding & Offboarding",
      "Other",
    ],
  },
  {
    division: "Accounting & Finance",
    areas: [
      "Account Payable",
      "Accounts Receivable",
      "Cashflow",
      "Accounts Reconciliation",
      "Payroll & Billing",
      "Financial Reporting",
      "Tax & Audit Support",
      "Other",
    ],
  },
  {
    division: "Operations & Administration",
    areas: [
      "Communication & Coordination",
      "Planning & Improvement",
      "Calendar, Meeting & Scheduling Management",
      "Project Management",
      "Administrative Workflow Management",
      "Documentation & Knowledge Management",
      "Internal Controls & Governance Support",
      "Other",
    ],
  },
  {
    division: "Technology & Systems",
    areas: [
      "Training Website",
      "System Development & Integration",
      "Cybersecurity & IT Governance",
      "Automation & Workflow Optimization",
      "IT Support & Issue Resolution",
      "Other",
    ],
  },
  {
    division: "Leadership & Strategy",
    areas: [
      "Vision & Direction Setting",
      "Strategic Planning & Roadmap",
      "Mentorship",
      "Decision-Making & Governance",
      "Performance Management & Accountability",
      "Other",
    ],
  },
];

export const getDivisionOptions = (): { key: string; text: string }[] =>
  DIVISIONS.map((d) => ({ key: d.division, text: d.division }));

export const getAreaOptions = (division: string): { key: string; text: string }[] => {
  const found = DIVISIONS.find((d) => d.division === division);
  return found ? found.areas.map((a) => ({ key: a, text: a })) : [];
};
