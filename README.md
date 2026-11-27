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
```

## Running Locally

1. Open the `edulongview/` folder in **VS Code**.
2. Right-click `index.html` and select **Open with Live Server** (or serve via any static HTTP server).
3. Deploy directly to **Netlify** or **GitHub Pages** with zero build steps required.


