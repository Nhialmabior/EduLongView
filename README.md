# EduLongView

**Tagline:** *See the progress. Understand the patterns. Support every learner.*

EduLongView is an education monitoring and CBC/CBE learner progress and academic monitoring platform designed for teachers and school administrators in refugee and host-community schools, particularly in Kakuma and Kalobeyei, Turkana County, Kenya.

## CBC/CBE Foundation Release Scope

- **Education Structure:** Kenya Grades 1–9, organised as Lower Primary (Grades 1–3), Upper Primary (Grades 4–6), and Junior School (Grades 7–9).
- **Curriculum Foundation:** The interactive Curriculum module lets users select Grades 1–9 and explore the learning areas listed by stage in KICD's 2026 curriculum support-materials guidance. It links to the official KICD curriculum design libraries and displays the seven CBC core competencies. Detailed strands, sub-strands and specific learning outcomes are deliberately not fabricated; they must be imported from the relevant grade-specific design. Curriculum reference data is represented in `KENYA_CBC_CURRICULUM` in `assets/js/data.js`. The `CURRICULUM_RECORD_SCHEMA` defines a traceable structure for importing exact strands, sub-strands, specific learning outcomes, competencies, values, PCIs, learning experiences, assessment methods and KICD source references.
- **Assessment Approach:** Next: import and map grade-specific strands, sub-strands, specific learning outcomes and assessment rubrics from the official KICD curriculum designs. Dashboard index figures are illustrative demo indicators, not official CBC achievement levels.

- **Brand & Visual System:** Clean light workspace paired with a deep navy sidebar, restrained teal accents, subtle gold highlights, and Inter/Manrope typography.
- **Responsive Navigation Shell:** Collapsible desktop sidebar, mobile slide-out drawer, top breadcrumb header, and interactive Academic Year & Term selectors.
- **CBC/CBE Teacher Dashboard:** Learner and learning-progress indicators, interactive grade-filtered trend chart, learning-area overview, recent assessment evidence, and explainable learner-support alerts.
- **Offline-Ready Persistence:** Uses browser `LocalStorage` (`edulongview_state_v2`) with one-click demo dataset reset.

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


## Official Curriculum References

- Kenya Institute of Curriculum Development (KICD), [Lower Primary curriculum designs](https://kicd.ac.ke/cbc-materials/lower-primary/).
- KICD, [Upper Primary curriculum designs](https://kicd.ac.ke/cbc-materials/curriculum-designs/upper-primary-designs/).
- KICD, [Junior School curriculum designs](https://kicd.ac.ke/cbc-materials/curriculum-designs/junior-school-designs/).
- KICD, [2026 Complementary Print Curriculum Support Materials Submission, Evaluation and Approval Guidelines](https://kicd.ac.ke/wp-content/uploads/2026/09/COMPLEMENTARY-MATERIALS-SUBMISSION-DOCUMENT-SEPTEMBER-2026.pdf) — catalogue of learning areas for support materials.
- KICD, [Basic Education Curriculum Framework](https://kicd.ac.ke/curriculum-reform/basic-education-curriculum%20-framework/).
