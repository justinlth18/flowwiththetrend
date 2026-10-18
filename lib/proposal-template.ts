export const hrPortalProposal = {
  clientName: "Schmidt BioMedTech Sdn Bhd",
  title: "HR Performance (MBO) & Salary Increment Portal",
  images: ["mbo-a-1.png", "mbo-a-2.png", "mbo-a-3.jpg", "mbo-b-1.png", "increment-a-1.jpg", "increment-b-1.png"],
  description: `! Prepared for | Schmidt BioMedTech Sdn Bhd
! Prepared by | Justin Looi Teng Hein, Frontend Developer & UI/UX Specialist
! Date | 19 October 2026
! Document ref | PRO-SBT-HR2026-V1

## 1. Executive summary

Schmidt BioMedTech Sdn Bhd currently uses a spreadsheet (FY26 MBO Form.xlsx) and a Word file (Executive_MBO_Evaluation_FY27.dotx) for annual performance reviews and merit increases.

This project turns those workflows into a secure web portal. Two options are set out below, from the interface studies already prepared.

- Tier A, Enterprise Governance: a multi-step workflow for executive bands, with attestation, a live calculation engine, and governance checks.
- Tier B, Streamlined Core: one page for fast entry, clear totals, and a shorter build.

## 2. Executive MBO evaluation

| | Tier A · Enterprise Governance | Tier B · Streamlined Core |
| Experience | Wizard: profile, KPI scoring, then audit sign-off. | One page with collapsible sections. |
| KPI matrix | Pillar objectives with target tracking and automated scoring. | Five-row scorecard with weighted RM totals. |
| Calculation | Salary × quantum × weighted score, ceiling caps, and a 10% deduction per disciplinary warning. | Formula bar with gross and net totals. |
| Audit | SHA-256 attestation, SSO stamps, and LHDN checks. | Timestamped supervisor and employee sign-off. |

### Tier A

{{1|Tier A · Step 1, profile and remuneration baseline}}
{{2|Tier A · Step 2, objectives, scoring, and pool}}
{{3|Tier A · Step 3, award calculation and sign-off}}

### Tier B

{{4|Tier B · Single-page executive MBO evaluation}}

## 3. Salary increment and merit review

| | Tier A · Enterprise Governance | Tier B · Streamlined Core |
| Calibration | Merit slider with floor, ceiling, fiscal runway, and delta modeling. | Slider with Floor, Mid, Recommended, and Ceiling. |
| Performance | Approved MBO score and award history, read in directly. | Performance badge and net award summary. |
| Approval | Department head, then HR, then Board / GGM. | Status bar, with an audit trail after GGM sign-off. |

### Tier A

{{5|Tier A · Merit calibration and approval route}}

### Tier B

{{6|Tier B · Annual salary increment and merit review}}

## 4. Technology and approach

- Frontend: Next.js and React, built to the screens in this proposal.
- Calculations: fixed math, so payout figures do not drift.
- Backend: Node.js and PostgreSQL, or the company's current database or Google Workspace.
- Export: PDF copies that follow the on-screen record.

## 5. Timeline

- Week 1: requirements and database schema.
- Weeks 2–3: interface and formula logic.
- Week 4: approvals, permissions, and PDF export.
- Week 5: acceptance testing, security check, and deployment.

## 6. Investment

Choose one option.

$$ Option A · Enterprise Governance Portal | MYR 8,000
- Multi-step MBO wizard, merit calibration, and fiscal runway.
- SHA-256 attestation and the three-stage approval route.
- PDF export with the audit record.

$$ Option B · Streamlined Core Portal | MYR 6,000
- Single-page MBO form and the salary increment screen.
- Timestamped sign-off for supervisor, employee, and HR.
- Standard PDF summary.

## 7. Payment

- 40% deposit on agreement.
- 40% when acceptance testing is complete on staging.
- 20% on deployment and handoff.

## 8. Needed before development starts

- Hosting choice: internal server, AWS, or another cloud host.
- A sample employee list for the grade quanta: Non-Executive 1.00, Executive 1.25, Manager 1.50.
- Confirmation of the approval route: department head, HR, then GGM.
`,
};
