# EduLongView

**Tagline:** *See the progress. Understand the patterns. Support every learner.*

EduLongView is an education monitoring and academic analytics platform designed for teachers and school administrators in refugee and host-community schools, particularly in Kakuma and Kalobeyei, Turkana County, Kenya.

## Foundation Release Scope

- **Brand & Visual System:** Clean light workspace paired with a deep navy sidebar, restrained teal accents, subtle gold highlights, and Inter/Manrope typography.
- **Responsive Navigation Shell:** Collapsible desktop sidebar, mobile slide-out drawer, top breadcrumb header, and interactive Academic Year & Term selectors.
- **Executive Teacher Dashboard:** KPI summary cards, interactive Chart.js performance trend line (with stream filtering), subject performance horizontal bar chart, recent assessment logs, and explainable early-warning alerts.
- **Offline-Ready Persistence:** Uses browser `LocalStorage` (`edulongview_state_v1`) with one-click demo dataset reset.

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
