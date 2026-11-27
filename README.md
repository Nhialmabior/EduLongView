# EduLongView

**Tagline:** *See the progress. Understand the patterns. Support every learner.*

EduLongView is an AI-assisted learner performance analysis and reporting platform. Teachers record learner performance; AI analyses the available evidence and drafts individual reports with recommendations; teachers review and approve those reports before explicitly releasing them to parents or guardians. EduLongView is not a curriculum repository, teaching platform, or automated assessment authority.

EduLongView is designed for teachers and school administrators in refugee and host-community schools, particularly in Kakuma and Kalobeyei, Turkana County, Kenya. It focuses on individual learner performance, AI-assisted analysis, teacher-reviewed reports and controlled parent access.

## Product Scope

- **Learner coverage:** Grades 1–9, grouped as Lower Primary (Grades 1–3), Upper Primary (Grades 4–6), and Junior School (Grades 7–9). Grade bands organise learner records and reporting; EduLongView does not store or deliver curriculum content.
- **Performance records:** Capture learner assessment results, attendance, participation, progress over time, and teacher observations.
- **AI analysis:** Analyse each learner’s recorded evidence to identify strengths, areas needing support, meaningful changes and patterns. AI must not invent missing evidence or make unsupported diagnoses.
- **Individual reports:** Generate understandable learner performance summaries and evidence-based recommendations.
- **Teacher approval:** AI-generated reports remain drafts until reviewed and approved by an authorised teacher.
- **Parent access:** Parents or guardians can see only reports explicitly approved and released for their linked learner.
- **School accounts and roles:** Each school has an isolated account space. A school administrator manages teacher invitations and access; teachers are restricted to their own school. Role assignments are enforced by the backend and database, not editable browser metadata.
- **Privacy and safeguarding:** Keep draft AI analysis and internal teacher notes unavailable to parents unless deliberately approved for release.
- **Brand & Visual System:** Clean light workspace paired with a deep navy sidebar, restrained teal accents, subtle gold highlights, and Inter/Manrope typography.
- **Responsive Navigation Shell:** Collapsible desktop sidebar, mobile slide-out drawer, top breadcrumb header, and interactive Academic Year & Term selectors.
- **Offline-Ready Persistence:** Uses browser LocalStorage (`edulongview_state_v2`) with one-click demo dataset reset.


### Working learner-record features

- Register a learner with full name, unique admission / learner number, Grade 1–9 and class / stream.
- Enter individual performance records linked to a registered learner.
- Capture learning area, assessment/activity, assessment type, year, term, date, score, maximum score, attendance, participation and factual teacher observations.
- Validate score values and calculate a percentage from the entered score and maximum score.
- Persist learner profiles and performance records in browser LocalStorage (`edulongview_state_v2`).
- These records are currently stored locally in the browser. They are not yet synchronised to a school database or shared across teacher devices.


### Bulk results upload

- Upload multiple learner performance records from a CSV file or Excel workbook (.xlsx).
- Download the CSV template to use the expected column names and data format.
- Match every row to a registered learner by admission / learner number.
- Preview rows before importing; invalid rows are reported and excluded.
- Validate reporting term, year, date, score and maximum score. Existing duplicate assessment records are skipped.
- Confirmed imports are saved to the same `performanceRecords` collection as manually entered results, so the learner analysis and report-draft workflow can use the uploaded evidence.
- CSV parsing uses PapaParse and Excel parsing uses SheetJS from CDN libraries; an internet connection is required to load those parsers.
- Like manually entered records, imported records currently remain in this browser's LocalStorage and are not uploaded to a central school database.


### Learner report analysis foundation

- Generate an individual report draft only when the selected learner has saved performance records.
- Calculate descriptive summaries by learning area, including record counts, mean recorded percentages and first-to-latest changes where repeated scored results exist.
- Summarise attendance and participation entries and retain teacher observations alongside the source assessment records.
- Show teachers an evidence snapshot and the source records used to prepare each report draft.
- Identify positive or declining changes only when repeated records in the same learning area support the comparison; avoid treating a single result as a trend.
- Keep each generated report as a private, editable teacher draft. Approval and parent release are not implemented.
- **Important:** this is a transparent rule-based analysis foundation, not a connected generative AI model. A secure backend and AI service integration are still required before the platform can claim to generate AI-written insights.

### FastAPI backend foundation

- Added a Python FastAPI service under `backend/`, with a health endpoint and the protected `POST /api/v1/reports/draft` endpoint.
- Validates request fields, grade range, score values, evidence record count and unique evidence IDs.
- Supports an OpenAI-compatible provider through backend-only environment variables; provider credentials are never placed in frontend code.
- Validates the model's structured response and rejects evidence references that were not included in the request.
- Returns a clear `503` when no AI provider is configured. It does not fabricate AI output.
- Includes a Render deployment blueprint (`render.yaml`) and local setup instructions in [backend/README.md](backend/README.md).
- The API contract remains documented in [api/AI_REPORT_API.md](api/AI_REPORT_API.md).
- **Important:** this is a backend scaffold, not a production-ready school system. The temporary shared bearer token is only for local/server-to-server testing; real teacher identity, school-level authorisation, a secure shared database, audit logging and a safeguarding/data-protection review are still required. Do not expose the shared token in the public website or send real learner data to an external model before those safeguards are implemented.
- The static website's existing rule-based report workflow remains unchanged. No live AI provider is configured and no backend has been deployed yet.

## Project Structure

```text
edulongview/
  index.html
  README.md
  assets/
    css/
      style.css
    js/
      data.js
      navigation.js
      app.js
    images/
      README.md
    icons/
      favicon.svg
      logo-mark.svg
  pages/
    README.md
  api/
    AI_REPORT_API.md
  backend/
    app/
      main.py
    requirements.txt
    .env.example
    README.md
  render.yaml
```

## Running Locally

1. Open the `edulongview/` folder in **VS Code**.
2. Right-click `index.html` and select **Open with Live Server** (or serve via any static HTTP server).
3. Deploy directly to **Netlify** or **GitHub Pages** with zero build steps required.




## Running the backend locally

See [backend/README.md](backend/README.md) for Windows PowerShell setup, environment variables and a sample request. The backend runs separately from the static website. Keep provider keys and the local bearer token in backend environment variables only; never add them to frontend JavaScript or commit a real `.env` file.


### School identity and security foundation

- Added the first SQL schema for schools, school memberships and administrative audit events under `backend/sql/001_school_identity.sql`.
- Added row-level security policies and restricted browser permissions. School membership changes are reserved for a trusted, authenticated backend.
- Added GitHub Actions to run backend tests automatically on pushes and pull requests.
- **Not yet live:** the SQL schema has not been applied, school sign-in is not connected, and teacher invitations are not active. The connected Supabase workspace currently has no active EduLongView project; do not reuse another project's database. A dedicated project and secure backend configuration are required before real school accounts can be enabled.
