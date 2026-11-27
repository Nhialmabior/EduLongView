/**
 * EduLongView — Navigation & Responsive Shell Controller
 */

const MODULE_BLUEPRINTS = {
  'learners': {
    title: 'Learners Directory',
    badge: 'Working · Browser storage',
    description: 'Register learners by admission number, grade and class stream, then link individual performance records to each learner.',
    pillars: [
      { title: 'Learner Profiles', detail: 'Current and historical performance records, attendance context, teacher observations, support needs and individual progress history.' },
      { title: 'Stream & Cohort Filters', detail: 'Filter across Grades 1–9 streams, gender balance, and support categories without losing context.' },
      { title: 'Persistent Learner Profiles', detail: 'Learner profiles are saved in this browser and remain available after page refresh. Duplicate admission numbers are blocked.' }
    ]
  },
  'classes': {
    title: 'Classes & Streams',
    badge: 'Working · Browser records',
    description: 'Manage Grade 1 through Grade 9 streams, class teachers, enrollment capacity, and comparative stream benchmarks.',
    pillars: [
      { title: 'Stream Performance Comparison', detail: 'Compare East, West, North, and South streams across identical assessment papers.' },
      { title: 'Class Teacher Allocation', detail: 'Assign homeroom teachers responsible for early-warning follow-ups and parent conferences.' },
      { title: 'Promotion & Rollover', detail: 'Transition cohorts smoothly between academic years while preserving historical records.' }
    ]
  },
  'subjects': {
    title: 'AI Learner Reports',
    badge: 'Teacher-reviewed · Parent release controlled',
    description: 'Turn each learner’s recorded performance into an understandable progress report with AI-generated insights and recommendations. Teachers review and approve every report before parents can see it.',
    pillars: [
      { title: 'Individual Performance Summary', detail: 'Bring together a learner’s recorded assessment results, attendance, progress over time, and teacher observations.' },
      { title: 'AI Insights & Recommendations', detail: 'Highlight strengths, areas needing support, changes in performance, and practical next steps using only available learner evidence.' },
      { title: 'Teacher Approval & Parent Release', detail: 'Keep AI reports as drafts until a teacher reviews and approves them. Parents see only reports explicitly released by the school.' }
    ]
  },
  'assessments': {
    title: 'Learner Performance Records',
    badge: 'Working · Individual records',
    description: 'Capture each learner’s assessment results, attendance context, participation and teacher observations by learning area and reporting period.',
    pillars: [
      { title: 'Structured Mark Entry', detail: 'Simple entry of scores, achievement descriptors where the school uses them, attendance, participation and teacher observations.' },
      { title: 'Completion Tracking', detail: 'Track which learner performance records have been entered, checked or are still missing.' },
      { title: 'Automatic Calculations', detail: 'Calculate learner-level summaries and changes over time without making class ranking the default measure.' }
    ]
  },
  'import-marks': {
    title: 'Import Performance Data',
    badge: 'CSV & Excel Import',
    description: 'Import learner performance records in bulk using grade-aware CSV templates, with validation before saving.',
    pillars: [
      { title: 'Downloadable CSV Templates', detail: 'Templates for learner identifiers, assessment results, attendance and performance observations.' },
      { title: 'Validation & Preview', detail: 'Detect missing learner identifiers, invalid scores, unsupported values and duplicate records before saving.' },
      { title: 'Instant Dashboard Sync', detail: 'Uploaded assessments immediately update Overview charts and Early-Warning indicators.' }
    ]
  },
  'analytics': {
    title: 'Learner Performance Analysis',
    badge: 'Powered by Chart.js',
    description: 'Analyse individual learner progress and class patterns across reporting periods using the evidence entered by teachers.',
    pillars: [
      { title: 'Longitudinal Cohort Curves', detail: 'Compare each learner’s performance across terms and years while preserving their history.' },
      { title: 'Subject Gap Analysis', detail: 'Identify learning areas with improving performance or persistent difficulty and show the evidence behind each insight.' },
      { title: 'Distribution Histograms', detail: 'Distinguish individual support needs from patterns shared across a class or grade.' }
    ]
  },
  'early-warnings': {
    title: 'Explainable Early Warnings',
    badge: 'Rule-Based Intervention Engine',
    description: 'Transparent academic risk flags showing exactly why a learner needs support—never an opaque black-box score.',
    pillars: [
      { title: 'Clear Trigger Rules', detail: 'Use explainable indicators such as repeated low results, falling performance, missing records or attendance concerns. A flag prompts teacher review; it is not a diagnosis.' },
      { title: 'Teacher Action Log', detail: 'Record remedial classes, guardian meetings, and follow-up check-ins per flagged learner.' },
      { title: 'Recovery Monitoring', detail: 'Track whether agreed support actions are followed by measurable improvement in later learner records.' }
    ]
  },
  'reports': {
    title: 'AI Reports & Parent Release',
    badge: 'Powered by jsPDF',
    description: 'Prepare individual learner performance reports from recorded evidence, including AI-generated summaries and recommendations for teacher review.',
    pillars: [
      { title: 'Individual Learner Report Cards', detail: 'Individual reports summarising performance, strengths, areas needing support, teacher comments and recommended next steps.' },
      { title: 'Administration Term Briefs', detail: 'School-level summaries that help authorised staff review trends without exposing private learner reports unnecessarily.' },
      { title: 'Offline-First Generation', detail: 'Provide printable reports after teacher approval; parent release must be a separate, explicit action.' }
    ]
  },
  'settings': {
    title: 'School & Threshold Settings',
    badge: 'System Configuration',
    description: 'Customize school identity, early-warning sensitivity thresholds, and local browser data backups.',
    pillars: [
      { title: 'Early-Warning Thresholds', detail: 'Configure school-approved performance thresholds, reporting periods and support-alert sensitivity.' },
      { title: 'JSON Backup & Restore', detail: 'Export the entire LocalStorage database to a portable file for safe offline backup.' },
      { title: 'Demo Dataset Controls', detail: 'Configure grade coverage, school reporting preferences and demo data or start with a clean slate.' }
    ]
  }
};

const EduNavigation = {
  init(onRouteChange) {
    this.onRouteChange = onRouteChange;
    this.appShell = document.getElementById('appShell');
    this.pageTitleEl = document.getElementById('topbarPageTitle');
    this.navItems = document.querySelectorAll('.nav-item[data-route]');

    this.workspaceState = EduDataStore.load();
    this.ensureWorkspaceCollections();
    this.renderFoundationViews();
    this.bindEvents();

    const initialRoute = window.location.hash.replace('#', '') || 'overview';
    this.navigate(initialRoute, false);
  },

  ensureWorkspaceCollections() {
    if (!Array.isArray(this.workspaceState.learners)) this.workspaceState.learners = [];
    if (!Array.isArray(this.workspaceState.performanceRecords)) this.workspaceState.performanceRecords = [];
    if (!Array.isArray(this.workspaceState.learnerReports)) this.workspaceState.learnerReports = [];
    EduDataStore.save(this.workspaceState);
    this.syncSchoolIdentity();
    this.syncWarningBadge();
  },

  syncSchoolIdentity() {
    const school = this.workspaceState.school || DEFAULT_DEMO_DATA.school;
    const nameElement = document.querySelector('.school-name');
    const locationElement = document.querySelector('.school-location');
    if (nameElement) nameElement.textContent = school.name;
    if (locationElement) locationElement.textContent = school.location;
  },

  calculateEvidenceFlags() {
    const learners = this.workspaceState.learners || [];
    const records = this.workspaceState.performanceRecords || [];
    const school = this.workspaceState.school || DEFAULT_DEMO_DATA.school;
    const attentionThreshold = Number(school.attentionIndexThreshold ?? 50);
    const dropThreshold = Number(school.dropAlertThreshold ?? 12);
    return learners.map((learner) => {
      const learnerRecords = records.filter((record) => record.learnerId === learner.id);
      const scored = learnerRecords.filter((record) => Number.isFinite(Number(record.percentage)));
      const mean = scored.length ? scored.reduce((sum, record) => sum + Number(record.percentage), 0) / scored.length : null;
      const absences = learnerRecords.filter((record) => String(record.attendance).toLowerCase() === 'absent').length;
      const reasons = [];
      if (mean !== null && mean < attentionThreshold) {
        reasons.push(`Mean recorded score is ${mean.toFixed(1)}%, below the ${attentionThreshold}% attention threshold.`);
      }

      const areaGroups = {};
      learnerRecords.forEach((record) => {
        const area = String(record.learningArea || 'Unspecified');
        (areaGroups[area] = areaGroups[area] || []).push(record);
      });
      let largestDrop = null;
      Object.keys(areaGroups).forEach((area) => {
        const ordered = areaGroups[area].slice()
          .sort((a, b) => String(a.date || a.createdAt).localeCompare(String(b.date || b.createdAt)))
          .filter((record) => Number.isFinite(Number(record.percentage)));
        if (ordered.length < 2) return;
        const first = Number(ordered[0].percentage);
        const latest = Number(ordered[ordered.length - 1].percentage);
        const drop = first - latest;
        if (drop >= dropThreshold && (largestDrop === null || drop > largestDrop.drop)) {
          largestDrop = { area, drop };
        }
      });
      if (largestDrop) {
        reasons.push(`${largestDrop.area}: the latest result is ${largestDrop.drop.toFixed(1)} percentage points below the first repeated result, exceeding the ${dropThreshold}-point alert threshold.`);
      }
      if (absences > 2) reasons.push(`${absences} absence entries were recorded.`);
      if (!learnerRecords.length || !reasons.length) return null;
      return { learner, mean, absences, reasons, level: mean !== null && mean < attentionThreshold ? 'High' : 'Moderate' };
    }).filter(Boolean);
  },

  syncWarningBadge() {
    const badge = document.getElementById('sidebarWarningBadge');
    if (badge) badge.textContent = this.calculateEvidenceFlags().length;
  },

  escapeHTML(value) {
    return String(value ?? '').replace(/[&<>\"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
  },

  renderFoundationViews() {
    Object.entries(MODULE_BLUEPRINTS).forEach(([route, info]) => {
      const section = document.getElementById(`view-${route}`);
      if (!section) return;

      if (route === 'classes') {
        this.renderClasses(section);
        return;
      }
      if (route === 'analytics') {
        this.renderAnalytics(section);
        return;
      }
      if (route === 'early-warnings') {
        this.renderEarlyWarnings(section);
        return;
      }
      if (route === 'reports') {
        this.renderReportsWorkspace(section);
        return;
      }
      if (route === 'settings') {
        this.renderSettings(section);
        return;
      }
      if (route === 'subjects') {
        this.renderLearnerReports(section);
        return;
      }
      if (route === 'learners') {
        this.renderLearnerDirectory(section);
        return;
      }
      if (route === 'assessments') {
        this.renderPerformanceEntry(section);
        return;
      }
      if (route === 'import-marks') {
        this.renderImportWorkspace(section);
        return;
      }

      section.innerHTML = `
        <div class="module-shell">
          <div class="module-header">
            <div>
              <span class="module-badge">${info.badge}</span>
              <h2>${info.title}</h2>
              <p>${info.description}</p>
            </div>
            <a href="#overview" class="btn btn-primary" data-route="overview">
              <i data-lucide="arrow-left"></i>
              <span>Back to Overview Dashboard</span>
            </a>
          </div>
          <div class="roadmap-grid">
            ${info.pillars.map(p => `
              <div class="roadmap-card">
                <h4>${p.title}</h4>
                <p>${p.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  },

  renderClasses(section) {
    const learners = this.workspaceState.learners || [];
    const bands = [
      { name: 'Lower Primary', grades: [1, 2, 3] },
      { name: 'Upper Primary', grades: [4, 5, 6] },
      { name: 'Junior School', grades: [7, 8, 9] }
    ];
    const cards = bands.map((band) => {
      const bandLearners = learners.filter((learner) => band.grades.includes(Number(learner.grade)));
      const streams = Array.from(new Set(bandLearners.map((learner) => learner.stream || 'Unassigned')));
      return `<article class="panel-card module-stat-card">
        <span class="module-badge">${band.name}</span>
        <h3>${bandLearners.length} registered learners</h3>
        <p>${streams.length ? streams.join(', ') : 'No class streams registered yet'}</p>
        <div class="module-stat-row"><span>Grades</span><strong>${band.grades.map((grade) => `G${grade}`).join(' · ')}</strong></div>
      </article>`;
    }).join('');
    section.innerHTML = `<div class="module-shell">
      <div class="module-header"><div><span class="module-badge">Grades 1–9</span><h2>Classes & Streams</h2><p>Review registered learners by grade band and class stream.</p></div><a href="#learners" class="btn btn-primary" data-route="learners"><i data-lucide="user-plus"></i><span>Manage Learners</span></a></div>
      <div class="module-stat-grid">${cards}</div>
      <div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Registered class summary</h3><p class="panel-subtitle">${learners.length} learner profile(s) in this browser</p></div></div>
      <div class="table-responsive"><table class="data-table"><thead><tr><th>Grade</th><th>Class / Stream</th><th>Learners</th></tr></thead><tbody>
      ${Array.from({length: 9}, (_, index) => index + 1).map((grade) => {
        const gradeLearners = learners.filter((learner) => Number(learner.grade) === grade);
        const streams = Array.from(new Set(gradeLearners.map((learner) => learner.stream || 'Unassigned')));
        return `<tr><td><strong>Grade ${grade}</strong></td><td>${streams.length ? streams.map((stream) => this.escapeHTML(stream)).join(', ') : '—'}</td><td>${gradeLearners.length}</td></tr>`;
      }).join('')}
      </tbody></table></div></div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  renderAnalytics(section) {
    const records = this.workspaceState.performanceRecords || [];
    const learnerCount = new Set(records.map((record) => record.learnerId)).size;
    const mean = records.length ? records.reduce((sum, record) => sum + Number(record.percentage || 0), 0) / records.length : null;
    section.innerHTML = `<div class="module-shell">
      <div class="module-header"><div><span class="module-badge">Evidence-based analysis</span><h2>Learning Performance Analysis</h2><p>Explore the saved assessment evidence. All figures come from this browser’s learner records.</p></div><a href="#assessments" class="btn btn-secondary" data-route="assessments"><i data-lucide="clipboard-plus"></i><span>Add Evidence</span></a></div>
      <div class="module-stat-grid">
        <article class="panel-card module-stat-card"><span class="kpi-label">Saved records</span><h3>${records.length}</h3><p>Across ${learnerCount} learner(s)</p></article>
        <article class="panel-card module-stat-card"><span class="kpi-label">Mean score</span><h3>${mean === null ? '—' : mean.toFixed(1) + '%'}</h3><p>Recorded percentage mean</p></article>
        <article class="panel-card module-stat-card"><span class="kpi-label">Learning areas</span><h3>${new Set(records.map((record) => record.learningArea)).size}</h3><p>Areas represented</p></article>
      </div>
      <div class="charts-grid"><article class="panel-card"><div class="panel-header"><div><h3 class="panel-title">Performance by learning area</h3><p class="panel-subtitle">Mean saved percentage</p></div></div><div class="chart-canvas-wrap"><canvas id="analyticsSubjectChart"></canvas></div></article>
      <article class="panel-card"><div class="panel-header"><div><h3 class="panel-title">Evidence distribution</h3><p class="panel-subtitle">Saved records by reporting term</p></div></div><div class="chart-canvas-wrap"><canvas id="analyticsTermChart"></canvas></div></article></div>
    </div>`;
    requestAnimationFrame(() => this.renderAnalyticsCharts());
    if (window.lucide) window.lucide.createIcons();
  },

  renderAnalyticsCharts() {
    if (typeof Chart === 'undefined') return;
    const records = this.workspaceState.performanceRecords || [];
    const groups = {};
    records.forEach((record) => {
      const key = record.learningArea || 'Unspecified';
      (groups[key] = groups[key] || []).push(Number(record.percentage || 0));
    });
    const areaLabels = Object.keys(groups);
    const areaMeans = areaLabels.map((key) => groups[key].reduce((sum, value) => sum + value, 0) / groups[key].length);
    const termLabels = ['Term 1', 'Term 2', 'Term 3'];
    const termCounts = termLabels.map((term) => records.filter((record) => record.term === term).length);
    const subjectCanvas = document.getElementById('analyticsSubjectChart');
    const termCanvas = document.getElementById('analyticsTermChart');
    if (subjectCanvas) {
      new Chart(subjectCanvas, { type: 'bar', data: { labels: areaLabels, datasets: [{ label: 'Mean %', data: areaMeans, backgroundColor: '#0F766E', borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 }, x: { ticks: { font: { size: 11 } } } }, plugins: { legend: { display: false } } } });
    }
    if (termCanvas) {
      new Chart(termCanvas, { type: 'doughnut', data: { labels: termLabels, datasets: [{ data: termCounts, backgroundColor: ['#0F213A', '#0F766E', '#D97706'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } });
    }
  },

  renderEarlyWarnings(section) {
    const flags = this.calculateEvidenceFlags();
    section.innerHTML = `<div class="module-shell">
      <div class="module-header"><div><span class="module-badge">Explainable intervention</span><h2>Early-Warning Triage</h2><p>Flags are calculated only from saved evidence and do not represent diagnoses.</p></div><a href="#assessments" class="btn btn-primary" data-route="assessments"><i data-lucide="clipboard-plus"></i><span>Add Learner Evidence</span></a></div>
      ${flags.length ? `<div class="warning-list">${flags.map((flag) => `<div class="warning-item ${flag.level === 'High' ? 'critical' : ''}"><div class="warning-item-top"><div><span class="learner-ident">${this.escapeHTML(flag.learner.fullName)}</span><span class="learner-stream">${this.escapeHTML(flag.learner.stream || `Grade ${flag.learner.grade}`)} · ${this.escapeHTML(flag.learner.admissionNo)}</span></div><span class="risk-tag ${flag.level.toLowerCase() === 'high' ? 'high' : 'moderate'}">${flag.level} Priority</span></div><p class="warning-reason">${flag.reasons.map((reason) => this.escapeHTML(reason)).join(' ')}</p><div class="warning-metrics"><span>Recorded mean: <strong>${flag.mean === null ? '—' : flag.mean.toFixed(1) + '%'}</strong></span><span>Absence entries: <strong>${flag.absences}</strong></span></div></div>`).join('')}</div>` : `<div class="panel-card workspace-panel empty-guidance"><h3>No evidence-based flags</h3><p>No saved learner currently meets the configured low-score, term-drop or repeated-absence rules. Continue reviewing the underlying records.</p></div>`}
    </div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  renderReportsWorkspace(section) {
    const reports = this.workspaceState.learnerReports || [];
    const learners = this.workspaceState.learners || [];
    section.innerHTML = `<div class="module-shell">
      <div class="module-header"><div><span class="module-badge">Private teacher drafts</span><h2>Reports & Print</h2><p>Review and print individual report drafts. Parent release is not enabled in this browser-only workspace.</p></div><a href="#subjects" class="btn btn-primary" data-route="subjects"><i data-lucide="file-plus-2"></i><span>Prepare New Draft</span></a></div>
      <div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Individual report drafts</h3><p class="panel-subtitle">${reports.length} private draft(s)</p></div></div>
      <div class="table-responsive"><table class="data-table"><thead><tr><th>Learner</th><th>Evidence</th><th>Updated</th><th>Status</th><th>Action</th></tr></thead><tbody>${reports.length ? reports.map((report) => {
        const learner = learners.find((item) => item.id === report.learnerId);
        return `<tr><td><strong>${this.escapeHTML(learner?.fullName || 'Learner not found')}</strong></td><td>${report.evidenceCount || 0} records</td><td>${this.escapeHTML(new Date(report.updatedAt).toLocaleString())}</td><td><span class="status-pill pending">Private draft</span></td><td><button type="button" class="btn btn-secondary btn-sm" data-edit-report="${this.escapeHTML(report.id)}">Open draft</button><button type="button" class="btn btn-secondary btn-sm" data-print-report="${this.escapeHTML(report.id)}">Print</button><button type="button" class="btn btn-secondary btn-sm" data-delete-report="${this.escapeHTML(report.id)}">Delete</button></td></tr>`;
      }).join('') : '<tr><td colspan="5" class="empty-state-cell">No report drafts have been generated yet.</td></tr>'}</tbody></table></div></div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  printReport(reportId) {
    const report = this.workspaceState.learnerReports.find((item) => item.id === reportId);
    if (!report) return;
    const learner = this.workspaceState.learners.find((item) => item.id === report.learnerId);
    const popup = window.open('', '_blank', 'width=900,height=700');
    if (!popup) { this.showWorkspaceToast('Allow pop-ups to print a report.'); return; }
    popup.document.write(`<!doctype html><html><head><title>EduLongView Report</title><style>body{font-family:Arial,sans-serif;color:#0f172a;max-width:800px;margin:40px auto;line-height:1.5}h1{font-size:24px}h2{font-size:16px;border-bottom:1px solid #ccc;padding-bottom:6px}.meta{color:#475569}.draft{color:#92400e}pre{white-space:pre-wrap;font-family:Arial,sans-serif}button{padding:8px 14px}@media print{button{display:none}}</style></head><body><button onclick="window.print()">Print report</button><h1>EduLongView Learner Progress Report</h1><p class="draft"><strong>PRIVATE TEACHER DRAFT — NOT APPROVED OR RELEASED</strong></p><p class="meta"><strong>Learner:</strong> ${this.escapeHTML(learner?.fullName || 'Unknown')} · ${this.escapeHTML(learner?.admissionNo || '')} · Grade ${this.escapeHTML(learner?.grade || '—')}</p><h2>Performance summary</h2><pre>${this.escapeHTML(report.summary)}</pre><h2>Identified strengths</h2><pre>${this.escapeHTML(report.strengths)}</pre><h2>Areas needing attention</h2><pre>${this.escapeHTML(report.support)}</pre><h2>Recommended next steps</h2><pre>${this.escapeHTML(report.recommendations)}</pre><h2>Teacher comment</h2><pre>${this.escapeHTML(report.teacherComment || 'No comment recorded.')}</pre></body></html>`);
    popup.document.close();
  },

  renderSettings(section) {
    const school = this.workspaceState.school || DEFAULT_DEMO_DATA.school;
    section.innerHTML = `<div class="module-shell">
      <div class="module-header"><div><span class="module-badge">Browser workspace settings</span><h2>School & Data Settings</h2><p>Configure local demo preferences and protect your browser records with backup tools.</p></div></div>
      <div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">School context</h3><p class="panel-subtitle">School identity displayed in the current browser workspace.</p></div></div>
      <form id="settingsForm" class="workspace-form"><div class="workspace-form-grid"><label>School name<input name="schoolName" maxlength="120" value="${this.escapeHTML(school.name)}" required></label><label>Location<input name="schoolLocation" maxlength="160" value="${this.escapeHTML(school.location)}" required></label><label>Attention threshold (%)<input name="attentionThreshold" type="number" min="0" max="100" value="${Number(school.attentionIndexThreshold)}" required></label><label>Term-drop alert (percentage points)<input name="dropThreshold" type="number" min="0" max="100" value="${Number(school.dropAlertThreshold)}" required></label></div><div class="workspace-form-actions"><button type="submit" class="btn btn-primary"><i data-lucide="save"></i><span>Save Settings</span></button></div></form></div>
      <div class="roadmap-grid"><div class="roadmap-card"><h4>Export backup</h4><p>Download all learner profiles, performance records and report drafts as JSON.</p><button type="button" class="btn btn-secondary btn-sm" data-export-state><i data-lucide="download"></i><span>Export JSON</span></button></div><div class="roadmap-card"><h4>Import backup</h4><p>Restore a previously exported EduLongView backup file.</p><input id="stateRestoreFile" type="file" accept=".json,application/json"></div><div class="roadmap-card"><h4>Reset demo</h4><p>Replace this browser workspace with the original illustrative dataset.</p><button type="button" class="btn btn-secondary btn-sm" data-reset-workspace><i data-lucide="rotate-ccw"></i><span>Reset Workspace</span></button></div></div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  renderLearnerDirectory(section) {
    const learners = this.workspaceState.learners;
    const records = this.workspaceState.performanceRecords;
    const grades = [...new Set(learners.map((learner) => Number(learner.grade)).filter(Number.isInteger))].sort((a,b) => a-b);
    const withRecords = learners.filter((learner) => records.some((record) => record.learnerId === learner.id)).length;
    section.innerHTML = `
      <div class="module-shell">
        <div class="module-header">
          <div><span class="module-badge">Learner registry</span><h2>Learners Directory</h2><p>Create and maintain learner profiles. Each performance record is linked to one learner, building an individual evidence history over time.</p></div>
        </div>
        <div class="learner-overview-grid">
          <div class="learner-overview-card"><span>Total learners</span><strong>${learners.length}</strong><small>Profiles in this browser</small></div>
          <div class="learner-overview-card"><span>With performance data</span><strong>${withRecords}</strong><small>At least one recorded result</small></div>
          <div class="learner-overview-card"><span>Grades represented</span><strong>${grades.length}</strong><small>Across Grades 1–9</small></div>
        </div>
        <div class="panel-card workspace-panel">
          <div class="panel-header"><div><h3 class="panel-title">Register a learner</h3><p class="panel-subtitle">Use the school's learner identifier to avoid duplicate profiles.</p></div></div>
          <form id="learnerCreateForm" class="workspace-form">
            <div class="workspace-form-grid">
              <label>Full name<input name="fullName" required maxlength="120" placeholder="Learner's full name"></label>
              <label>Admission / learner number<input name="admissionNo" required maxlength="40" placeholder="e.g. SCH-001"></label>
              <label>Grade<select name="grade" required><option value="">Select grade</option>${Array.from({length:9},(_,i)=>`<option value="${i+1}">Grade ${i+1}</option>`).join('')}</select></label>
              <label>Class / stream<input name="stream" maxlength="60" placeholder="e.g. Grade 4 East"></label>
            </div>
            <div class="workspace-form-actions"><button class="btn btn-primary" type="submit"><i data-lucide="user-plus"></i><span>Save Learner</span></button></div>
          </form>
        </div>
        <div class="panel-card workspace-panel">
          <div class="panel-header learner-directory-heading"><div><h3 class="panel-title">Registered learners</h3><p class="panel-subtitle"><span id="learnerVisibleCount">${learners.length}</span> of ${learners.length} learner profile(s) · browser storage</p></div></div>
          <div class="learner-directory-tools">
            <label class="learner-search-field"><i data-lucide="search"></i><input id="learnerSearchInput" type="search" placeholder="Search name or admission number" aria-label="Search learners"></label>
            <label class="learner-grade-filter"><span>Filter by grade</span><select id="learnerGradeFilter"><option value="">All grades</option>${grades.map(grade => `<option value="${grade}">Grade ${grade}</option>`).join('')}</select></label>
          </div>
          <div class="table-responsive"><table class="data-table learner-directory-table"><thead><tr><th>Learner</th><th>Admission No.</th><th>Grade</th><th>Class / Stream</th><th>Records</th><th>Profile status</th></tr></thead><tbody id="learnerDirectoryRows">
          ${learners.length ? learners.map((learner) => {
            const count = records.filter((record) => record.learnerId === learner.id).length;
            const searchText = `${learner.fullName} ${learner.admissionNo} ${learner.stream || ''}`.toLowerCase();
            return `<tr data-learner-row data-search="${this.escapeHTML(searchText)}" data-grade="${this.escapeHTML(learner.grade)}"><td><span class="cell-primary">${this.escapeHTML(learner.fullName)}</span></td><td>${this.escapeHTML(learner.admissionNo)}</td><td>Grade ${this.escapeHTML(learner.grade)}</td><td>${this.escapeHTML(learner.stream || '—')}</td><td><span class="learner-record-count">${count}</span></td><td><span class="status-pill ${count ? 'verified' : 'pending'}">${count ? 'Evidence added' : 'No records yet'}</span></td></tr>`;
          }).join('') : '<tr><td colspan="6" class="empty-state-cell">No learners registered yet. Add the first learner using the form above.</td></tr>'}
          </tbody></table></div>
          <p id="learnerNoMatches" class="learner-no-matches" hidden>No learners match these filters. Try another name, admission number or grade.</p>
        </div>
        <p class="import-storage-note">Demo workspace notice: learner profiles and performance records currently remain in this browser only. They are not yet synchronised with the school database.</p>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  filterLearnerDirectory() {
    const search = (document.getElementById('learnerSearchInput')?.value || '').trim().toLowerCase();
    const grade = document.getElementById('learnerGradeFilter')?.value || '';
    const rows = [...document.querySelectorAll('#learnerDirectoryRows [data-learner-row]')];
    let visible = 0;
    rows.forEach((row) => {
      const matches = row.dataset.search.includes(search) && (!grade || row.dataset.grade === grade);
      row.hidden = !matches;
      if (matches) visible++;
    });
    const count = document.getElementById('learnerVisibleCount');
    if (count) count.textContent = visible;
    const noMatches = document.getElementById('learnerNoMatches');
    if (noMatches) noMatches.hidden = visible > 0 || rows.length === 0;
  },

  renderPerformanceEntry(section) {
    const learners = this.workspaceState.learners;
    const records = [...this.workspaceState.performanceRecords].sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    const learnerOptions = learners.map((learner) => `<option value="${this.escapeHTML(learner.id)}">${this.escapeHTML(learner.fullName)} — ${this.escapeHTML(learner.admissionNo)} (Grade ${this.escapeHTML(learner.grade)})</option>`).join('');
    section.innerHTML = `
      <div class="module-shell">
        <div class="module-header">
          <div><span class="module-badge">Individual performance evidence</span><h2>Record Learner Performance</h2><p>Enter the evidence a teacher has observed or assessed. EduLongView stores each entry against the learner and reporting period; AI analysis will use these records later.</p></div>
        </div>
        ${learners.length ? `
        <div class="panel-card workspace-panel">
          <div class="panel-header"><div><h3 class="panel-title">New performance record</h3><p class="panel-subtitle">Scores are stored with their maximum possible value. A percentage is calculated for comparison only.</p></div></div>
          <form id="performanceCreateForm" class="workspace-form">
            <div class="workspace-form-grid">
              <label>Learner<select name="learnerId" required><option value="">Select learner</option>${learnerOptions}</select></label>
              <label>Learning area / subject<input name="learningArea" required maxlength="80" placeholder="e.g. Mathematics"></label>
              <label>Assessment / activity<input name="assessmentTitle" required maxlength="100" placeholder="e.g. Mid-term assessment"></label>
              <label>Assessment type<select name="assessmentType" required><option value="">Select type</option><option>Classwork</option><option>Homework</option><option>Quiz</option><option>Project</option><option>Practical</option><option>Continuous assessment</option><option>End-of-term assessment</option><option>Teacher observation</option></select></label>
              <label>Academic year<input name="year" type="number" min="2020" max="2100" value="${new Date().getFullYear()}" required></label>
              <label>Term<select name="term" required><option>Term 1</option><option>Term 2</option><option>Term 3</option></select></label>
              <label>Date recorded<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required></label>
              <label>Score achieved<input name="score" type="number" min="0" step="0.01" placeholder="e.g. 18" required></label>
              <label>Maximum score<input name="maxScore" type="number" min="0.01" step="0.01" placeholder="e.g. 25" required></label>
              <label>Attendance for this activity<select name="attendance"><option value="Present">Present</option><option value="Late">Late</option><option value="Absent">Absent</option><option value="Not recorded" selected>Not recorded</option></select></label>
              <label>Participation<select name="participation"><option value="">Not recorded</option><option>Actively participated</option><option>Participated with support</option><option>Limited participation</option><option>Not observed</option></select></label>
              <label class="workspace-wide">Teacher observation<textarea name="observation" rows="3" maxlength="1200" placeholder="Record specific, factual observations. Avoid unsupported labels or diagnoses."></textarea></label>
            </div>
            <div class="workspace-form-actions"><button class="btn btn-primary" type="submit"><i data-lucide="save"></i><span>Save Performance Record</span></button></div>
          </form>
        </div>` : `
        <div class="panel-card workspace-panel empty-guidance"><h3>Register learners first</h3><p>Performance records must belong to a specific learner. Create learner profiles before entering their assessment results and observations.</p><a class="btn btn-primary" href="#learners" data-route="learners"><i data-lucide="user-plus"></i><span>Open Learners Directory</span></a></div>`}
        <div class="panel-card workspace-panel">
          <div class="panel-header"><div><h3 class="panel-title">Recent learner performance records</h3><p class="panel-subtitle">Showing the latest ${records.length} saved record(s) on this device.</p></div></div>
          <div class="table-responsive"><table class="data-table"><thead><tr><th>Learner</th><th>Learning area</th><th>Assessment</th><th>Period</th><th>Score</th><th>Attendance</th></tr></thead><tbody>
          ${records.length ? records.map((record) => {
            const learner = learners.find((item) => item.id === record.learnerId);
            return `<tr><td><span class="cell-primary">${this.escapeHTML(learner?.fullName || 'Learner not found')}</span><span class="cell-sub">${this.escapeHTML(learner?.admissionNo || '')}</span></td><td>${this.escapeHTML(record.learningArea)}</td><td><span class="cell-primary">${this.escapeHTML(record.assessmentTitle)}</span><span class="cell-sub">${this.escapeHTML(record.assessmentType)}</span></td><td>${this.escapeHTML(record.year)} · ${this.escapeHTML(record.term)}</td><td><strong>${record.score} / ${record.maxScore}</strong><span class="cell-sub">${record.percentage.toFixed(1)}%</span></td><td>${this.escapeHTML(record.attendance)}</td></tr>`;
          }).join('') : '<tr><td colspan="6" class="empty-state-cell">No performance records yet. Saved entries will appear here.</td></tr>'}
          </tbody></table></div>
        </div>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  handleWorkspaceSubmit(event) {
    const form = event.target;
    if (form.id !== 'learnerCreateForm' && form.id !== 'performanceCreateForm') return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());

    if (form.id === 'learnerCreateForm') {
      const admissionNo = values.admissionNo.trim();
      if (this.workspaceState.learners.some((learner) => learner.admissionNo.toLowerCase() === admissionNo.toLowerCase())) {
        window.alert('That admission / learner number is already registered.');
        return;
      }
      this.workspaceState.learners.push({
        id: `learner-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        fullName: values.fullName.trim(),
        admissionNo,
        grade: Number(values.grade),
        stream: values.stream.trim(),
        createdAt: new Date().toISOString()
      });
      EduDataStore.save(this.workspaceState);
      this.syncWarningBadge();
      this.renderLearnerDirectory(document.getElementById('view-learners'));
      this.showWorkspaceToast('Learner profile saved.');
      return;
    }

    const score = Number(values.score);
    const maxScore = Number(values.maxScore);
    if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || score < 0 || score > maxScore) {
      window.alert('Enter a valid score. The score achieved cannot be greater than the maximum score.');
      return;
    }
    this.workspaceState.performanceRecords.push({
      id: `performance-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      learnerId: values.learnerId,
      learningArea: values.learningArea.trim(),
      assessmentTitle: values.assessmentTitle.trim(),
      assessmentType: values.assessmentType,
      year: Number(values.year),
      term: values.term,
      date: values.date,
      score,
      maxScore,
      percentage: Number(((score / maxScore) * 100).toFixed(2)),
      attendance: values.attendance,
      participation: values.participation,
      observation: values.observation.trim(),
      createdAt: new Date().toISOString()
    });
    EduDataStore.save(this.workspaceState);
    this.syncWarningBadge();
    this.renderPerformanceEntry(document.getElementById('view-assessments'));
    this.showWorkspaceToast('Performance record saved.');
  },

  showWorkspaceToast(message) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
  },

  analyseLearner(learnerId) {
    const learner = this.workspaceState.learners.find(function(item) { return item.id === learnerId; });
    if (!learner) return null;
    const records = this.workspaceState.performanceRecords.filter(function(item) { return item.learnerId === learnerId; }).map(function(record) {
      const stored = record.percentage === null || record.percentage === undefined || record.percentage === '' ? NaN : Number(record.percentage);
      const score = Number(record.score), maxScore = Number(record.maxScore);
      const percentage = Number.isFinite(stored) ? stored : (Number.isFinite(score) && Number.isFinite(maxScore) && maxScore > 0 ? (score / maxScore) * 100 : null);
      return Object.assign({}, record, { calculatedPercentage:percentage });
    }).sort(function(a,b) { return String(a.date || a.createdAt).localeCompare(String(b.date || b.createdAt)); });
    const groups = {};
    records.forEach(function(record) { const key = String(record.learningArea || 'Unspecified'); (groups[key] = groups[key] || []).push(record); });
    const areas = Object.keys(groups).map(function(name) {
      const items = groups[name];
      const valid = items.filter(function(item) { return Number.isFinite(item.calculatedPercentage); });
      const average = valid.length ? valid.reduce(function(sum,item) { return sum + item.calculatedPercentage; },0) / valid.length : null;
      const first = valid[0], latest = valid[valid.length - 1];
      return { name:name, count:items.length, scoredCount:valid.length, average:average,
        firstPercentage:first ? first.calculatedPercentage : null, latestPercentage:latest ? latest.calculatedPercentage : null,
        change:valid.length > 1 ? latest.calculatedPercentage - first.calculatedPercentage : null,
        latestDate:latest ? (latest.date || latest.createdAt || '') : '' };
    }).sort(function(a,b) { return (b.average ?? -1) - (a.average ?? -1); });
    const attendance = records.reduce(function(counts,record) {
      const value = String(record.attendance || 'Not recorded').trim().toLowerCase();
      if (value === 'present') counts.present++;
      else if (value === 'late') counts.late++;
      else if (value === 'absent') counts.absent++;
      else counts.unrecorded++;
      return counts;
    },{present:0,late:0,absent:0,unrecorded:0});
    const participation = records.reduce(function(counts,record) {
      const value = String(record.participation || '').trim();
      if (value) counts[value] = (counts[value] || 0) + 1;
      return counts;
    },{});
    const strengths = [], support = [], recommendations = [];
    areas.filter(function(area) { return area.change !== null && area.change >= 5; }).forEach(function(area) {
      strengths.push(area.name + ': the latest recorded result is ' + area.change.toFixed(1) + ' percentage points higher than the first recorded result (' + area.firstPercentage.toFixed(1) + '% to ' + area.latestPercentage.toFixed(1) + '%).');
    });
    areas.filter(function(area) { return area.change !== null && area.change <= -5; }).forEach(function(area) {
      support.push(area.name + ': the latest recorded result is ' + Math.abs(area.change).toFixed(1) + ' percentage points lower than the first recorded result (' + area.firstPercentage.toFixed(1) + '% to ' + area.latestPercentage.toFixed(1) + '%).');
      recommendations.push('Review the learner’s recent ' + area.name + ' work with them. Check the assessment tasks and learning conditions before deciding what additional support is appropriate.');
    });
    if (!strengths.length) strengths.push('No increase of five or more percentage points between first and latest recorded results was identified in the available repeated learning-area records. This does not rule out individual strengths; review the learner’s work and observations.');
    if (!support.length) support.push('No decrease of five or more percentage points between first and latest recorded results was identified in the available repeated learning-area records. Continue monitoring and review individual tasks.');
    if (attendance.absent || attendance.late) recommendations.push('The uploaded or entered records contain ' + attendance.absent + ' absence entry/entries and ' + attendance.late + ' late entry/entries. Verify the dates and context with the learner before drawing conclusions.');
    if (!records.some(function(record) { return String(record.observation || '').trim(); })) recommendations.push('No teacher observations were recorded with these results. Add factual classroom observations where available.');
    if (records.length < 3) recommendations.push('Only ' + records.length + ' performance record(s) are available. Collect more evidence across activities and reporting periods before making broad conclusions.');
    if (!recommendations.length) recommendations.push('Continue recording results and teacher observations across reporting periods, then review the learner’s progress together.');
    const scoredRecords = records.filter(function(item) { return Number.isFinite(item.calculatedPercentage); });
    const overall = scoredRecords.length ? scoredRecords.reduce(function(sum,item) { return sum + item.calculatedPercentage; },0) / scoredRecords.length : null;
    const periods = Array.from(new Set(records.map(function(record) { return [record.year,record.term].filter(Boolean).join(' '); }).filter(Boolean)));
    const summary = records.length ? learner.fullName + ' has ' + records.length + ' recorded performance entr' + (records.length === 1 ? 'y' : 'ies') + ' across ' + areas.length + ' learning area(s), covering ' + (periods.join(', ') || 'periods not specified') + '. ' + (overall === null ? 'No valid score percentages could be calculated.' : 'The mean of ' + scoredRecords.length + ' recorded assessment percentages is ' + overall.toFixed(1) + '%.') + ' This is a descriptive summary of the records provided, not a diagnosis or final judgement.' : 'There are no performance records for this learner yet. Record evidence before preparing a progress report.';
    return { learner:learner, records:records, areas:areas, attendance:attendance, participation:participation, strengths:strengths, support:support, recommendations:recommendations, summary:summary, overall:overall, scoredCount:scoredRecords.length, periods:periods };
  },

  renderLearnerReports(section, selectedLearnerId) {
    const learners = this.workspaceState.learners;
    const reports = this.workspaceState.learnerReports.slice().sort(function(a,b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    const options = learners.map((learner) => '<option value="' + this.escapeHTML(learner.id) + '" ' + (learner.id === selectedLearnerId ? 'selected' : '') + '>' + this.escapeHTML(learner.fullName) + ' — ' + this.escapeHTML(learner.admissionNo) + ' (Grade ' + this.escapeHTML(learner.grade) + ')</option>').join('');
    const readyLearners = learners.filter((learner) => this.workspaceState.performanceRecords.some((record) => record.learnerId === learner.id));
    section.innerHTML = '<div class="module-shell"><div class="module-header"><div><span class="module-badge">Evidence analysis · Teacher draft</span><h2>Individual Learner Reports</h2><p>Generate an editable report from one learner’s saved performance records. This version uses transparent evidence rules; no external AI model is connected.</p></div></div>' +
      '<div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Prepare a learner report</h3><p class="panel-subtitle">Select a learner with saved performance records. The report will show the evidence used for every generated observation.</p></div></div>' +
      (learners.length ? '<form id="reportGenerateForm" class="workspace-form"><div class="workspace-form-grid"><label class="workspace-wide">Learner<select name="learnerId" required><option value="">Select learner</option>' + options + '</select></label></div><div class="workspace-form-actions"><button class="btn btn-primary" type="submit" ' + (readyLearners.length ? '' : 'disabled') + '><i data-lucide="file-text"></i><span>Generate Report Draft</span></button></div><p class="import-storage-note">' + readyLearners.length + ' of ' + learners.length + ' registered learner(s) have performance records.</p></form>' : '<p class="empty-state-cell">Register a learner and enter performance records before generating a report.</p>') + '</div>' +
      (reports.length ? '<div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Saved report drafts</h3><p class="panel-subtitle">Stored only in this browser; not visible to parents.</p></div></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Learner</th><th>Evidence records</th><th>Updated</th><th>Status</th><th>Action</th></tr></thead><tbody>' + reports.map((report) => { const learner = learners.find(function(item) { return item.id === report.learnerId; }); return '<tr><td>' + this.escapeHTML(learner ? learner.fullName : 'Learner not found') + '</td><td>' + Number(report.evidenceCount || 0) + '</td><td>' + this.escapeHTML(new Date(report.updatedAt).toLocaleString()) + '</td><td><span class="status-pill pending">Private draft</span></td><td><button type="button" class="btn btn-secondary btn-sm" data-edit-report="' + this.escapeHTML(report.id) + '">Review draft</button></td></tr>'; }).join('') + '</tbody></table></div></div>' : '') +
      '<div id="reportEditorHost"></div><div class="panel-card workspace-panel"><h3 class="panel-title">Analysis safeguards</h3><p class="panel-subtitle">The current engine is rule-based, not a connected generative AI model. It uses saved evidence only, identifies limited evidence, and keeps drafts private. Teacher approval and parent release are not enabled yet.</p></div></div>';
    if (selectedLearnerId) { const latest = reports.find(function(report) { return report.learnerId === selectedLearnerId; }); if (latest) this.renderReportEditor(latest.id); }
    if (window.lucide) window.lucide.createIcons();
  },

  renderReportEditor(reportId) {
    const report = this.workspaceState.learnerReports.find(function(item) { return item.id === reportId; });
    const host = document.getElementById('reportEditorHost');
    if (!report || !host) return;
    const learner = this.workspaceState.learners.find(function(item) { return item.id === report.learnerId; });
    const snapshot = report.evidenceSnapshot || {};
    const areas = Array.isArray(snapshot.areas) ? snapshot.areas : [];
    const attendance = snapshot.attendance || {};
    const participation = snapshot.participation || {};
    const evidenceRecords = Array.isArray(snapshot.records) ? snapshot.records : [];
    const areaRows = areas.map((area) => '<tr><td>' + this.escapeHTML(area.name) + '</td><td>' + area.count + '</td><td>' + (area.average === null ? 'Not available' : area.average.toFixed(1) + '%') + '</td><td>' + (area.change === null ? 'Not enough repeated results' : (area.change > 0 ? '+' : '') + area.change.toFixed(1) + ' pp') + '</td></tr>').join('');
    const participationText = Object.keys(participation).length ? Object.keys(participation).map((key) => this.escapeHTML(key) + ': ' + participation[key]).join(' · ') : 'No participation entries recorded';
    const evidenceRows = evidenceRecords.slice(-20).reverse().map((record) => '<tr><td>' + this.escapeHTML(record.date || 'Date not recorded') + '</td><td>' + this.escapeHTML(record.learningArea || '—') + '</td><td>' + this.escapeHTML(record.assessmentTitle || '—') + '</td><td>' + this.escapeHTML(Number.isFinite(Number(record.score)) ? record.score + ' / ' + record.maxScore : '—') + '</td><td>' + (record.percentage !== null && record.percentage !== undefined && Number.isFinite(Number(record.percentage)) ? Number(record.percentage).toFixed(1) + '%' : '—') + '</td><td>' + this.escapeHTML(record.attendance || 'Not recorded') + '</td></tr>').join('');
    const evidencePanel = '<div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Evidence used in this draft</h3><p class="panel-subtitle">Snapshot captured when this report was generated. ' + evidenceRecords.length + ' record(s) were analysed.</p></div></div>' +
      '<div class="import-summary"><span class="import-stat"><strong>' + evidenceRecords.length + '</strong> records</span><span class="import-stat"><strong>' + areas.length + '</strong> learning areas</span><span class="import-stat"><strong>' + (snapshot.scoredCount || 0) + '</strong> scored records</span><span class="import-stat"><strong>' + (snapshot.overall === null || snapshot.overall === undefined ? '—' : Number(snapshot.overall).toFixed(1) + '%') + '</strong> mean</span></div>' +
      '<h4>Learning-area breakdown</h4><div class="table-responsive"><table class="data-table"><thead><tr><th>Learning area</th><th>Records</th><th>Mean</th><th>First-to-latest change</th></tr></thead><tbody>' + (areaRows || '<tr><td colspan="4">No learning-area evidence was captured.</td></tr>') + '</tbody></table></div>' +
      '<p class="import-storage-note">Attendance entries — present: ' + (attendance.present || 0) + ', late: ' + (attendance.late || 0) + ', absent: ' + (attendance.absent || 0) + ', not recorded: ' + (attendance.unrecorded || 0) + '.</p><p class="import-storage-note">Participation entries — ' + participationText + '.</p>' +
      '<h4>Source assessment records</h4><div class="table-responsive"><table class="data-table"><thead><tr><th>Date</th><th>Learning area</th><th>Assessment</th><th>Score</th><th>Percentage</th><th>Attendance</th></tr></thead><tbody>' + (evidenceRows || '<tr><td colspan="6">No source records.</td></tr>') + '</tbody></table></div>' +
      (evidenceRecords.length > 20 ? '<p class="import-storage-note">Showing the latest 20 source records. The report retains the full evidence count.</p>' : '') + '</div>';
    host.innerHTML = evidencePanel + '<div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Review and edit report draft</h3><p class="panel-subtitle">' + this.escapeHTML(learner ? learner.fullName : 'Learner') + ' · Private draft · Not approved or released</p></div></div>' +
      '<form id="reportSaveForm" class="workspace-form" data-report-id="' + this.escapeHTML(report.id) + '"><div class="workspace-form-grid">' +
      '<label class="workspace-wide">Performance summary<textarea name="summary" rows="4" required maxlength="3000">' + this.escapeHTML(report.summary) + '</textarea></label>' +
      '<label>Identified strengths<textarea name="strengths" rows="5" required maxlength="3000">' + this.escapeHTML(report.strengths) + '</textarea></label>' +
      '<label>Areas needing attention<textarea name="support" rows="5" required maxlength="3000">' + this.escapeHTML(report.support) + '</textarea></label>' +
      '<label class="workspace-wide">Recommended next steps<textarea name="recommendations" rows="5" required maxlength="3000">' + this.escapeHTML(report.recommendations) + '</textarea></label>' +
      '<label class="workspace-wide">Teacher’s comment<textarea name="teacherComment" rows="4" maxlength="2000">' + this.escapeHTML(report.teacherComment || '') + '</textarea></label></div>' +
      '<div class="workspace-form-actions"><span class="module-badge">Not approved · Not released</span><button class="btn btn-primary" type="submit"><i data-lucide="save"></i><span>Save Teacher Draft</span></button></div></form></div>';
    if (window.lucide) window.lucide.createIcons();
  },


  renderImportWorkspace(section) {
    const preview = this.pendingImportPreview;
    const learners = this.workspaceState.learners;
    section.innerHTML = `
      <div class="module-shell">
        <div class="module-header"><div><span class="module-badge">Bulk performance data upload</span><h2>Upload Learner Results</h2><p>Import assessment results for many learners in one file. Each row is matched to a registered learner using their admission number before it is added to that learner’s performance history.</p></div></div>
        <div class="panel-card workspace-panel">
          <div class="panel-header"><div><h3 class="panel-title">1. Prepare your results file</h3><p class="panel-subtitle">Download the template, remove its example row, enter one assessment result per row, and keep the column headings unchanged.</p></div></div>
          <div class="import-instructions">
            <p><strong>Required columns:</strong> admissionNo, learningArea, assessmentTitle, assessmentType, year, term, date, score, maxScore.</p>
            <p><strong>Optional columns:</strong> attendance, participation, observation.</p>
            <p>Use the learner’s exact admission number from the Learners Directory. Terms must be Term 1, Term 2 or Term 3. Scores must be numeric and cannot exceed maxScore.</p>
            <div class="workspace-form-actions import-actions"><button type="button" class="btn btn-secondary" data-download-import-template><i data-lucide="download"></i><span>Download CSV Template</span></button></div>
          </div>
        </div>
        <div class="panel-card workspace-panel">
          <div class="panel-header"><div><h3 class="panel-title">2. Upload results file</h3><p class="panel-subtitle">Supported formats: CSV and Excel workbook (.xlsx). Upload a whole class or multiple grades in one file.</p></div></div>
          <div class="import-dropzone"><i data-lucide="file-up"></i><label for="performanceImportFile"><strong>Choose a results file</strong><span>CSV or Excel (.xlsx), maximum 10 MB</span></label><input id="performanceImportFile" type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" /><small>${learners.length} learner profile(s) are registered in this browser.</small></div>
          ${!learners.length ? '<p class="import-warning">Register learners before importing results. Every row must match an existing admission number.</p>' : ''}
        </div>
        <div id="importPreviewHost">${preview ? this.renderImportPreviewMarkup(preview) : ''}</div>
        <div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">How imported results are handled</h3><p class="panel-subtitle">Nothing is saved until you review the preview and confirm the import.</p></div></div>
          <div class="roadmap-grid"><div class="roadmap-card"><h4>Match</h4><p>Rows are matched using admission number, not learner name alone.</p></div><div class="roadmap-card"><h4>Validate</h4><p>Rows with unknown learners, missing values or invalid scores are rejected and explained.</p></div><div class="roadmap-card"><h4>Analyse</h4><p>Confirmed rows join the learner’s existing evidence and become available for individual report analysis.</p></div></div>
          <p class="import-storage-note">Current storage: this version saves imported records in this browser’s LocalStorage. Uploads are not sent to a school server or shared across devices.</p>
        </div>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  renderImportPreviewMarkup(preview) {
    const validCount = preview.rows.filter(row => row.valid).length;
    const invalidCount = preview.rows.length - validCount;
    return `
      <div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">3. Review import preview</h3><p class="panel-subtitle">${this.escapeHTML(preview.fileName)} · ${preview.rows.length} data row(s) found</p></div></div>
        <div class="import-summary"><span class="import-stat valid"><strong>${validCount}</strong> valid rows</span><span class="import-stat invalid"><strong>${invalidCount}</strong> rows needing correction</span></div>
        <div class="table-responsive"><table class="data-table import-preview-table"><thead><tr><th>Row</th><th>Admission No.</th><th>Learner</th><th>Learning area</th><th>Score</th><th>Validation</th></tr></thead><tbody>
          ${preview.rows.slice(0,100).map(row => `<tr><td>${row.rowNumber}</td><td>${this.escapeHTML(row.admissionNo || '—')}</td><td>${this.escapeHTML(row.learnerName || '—')}</td><td>${this.escapeHTML(row.learningArea || '—')}</td><td>${row.scoreLabel}</td><td><span class="status-pill ${row.valid ? 'verified' : 'pending'}">${row.valid ? 'Ready' : this.escapeHTML(row.error)}</span></td></tr>`).join('')}
        </tbody></table></div>
        ${preview.rows.length > 100 ? '<p class="import-storage-note">Preview limited to the first 100 rows. All rows will be checked during import.</p>' : ''}
        <div class="workspace-form-actions import-actions"><button type="button" class="btn btn-secondary" data-clear-import-preview>Clear preview</button><button type="button" class="btn btn-primary" data-confirm-import ${validCount ? '' : 'disabled'}><i data-lucide="database"></i><span>Import ${validCount} Valid Result(s)</span></button></div>
        <p class="import-storage-note">Invalid rows will not be imported. Existing duplicate results will be skipped.</p>
      </div>`;
  },

  async readImportFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { this.showWorkspaceToast('File is larger than 10 MB.'); return; }
    const extension = file.name.split('.').pop().toLowerCase();
    try {
      let rawRows = [];
      if (extension === 'csv') {
        if (!window.Papa) throw new Error('CSV reader unavailable. Refresh the page and try again.');
        rawRows = await new Promise((resolve, reject) => window.Papa.parse(file, { header:true, skipEmptyLines:true, transformHeader:header => header.trim(), complete:result => resolve(result.data), error:reject }));
      } else if (extension === 'xlsx') {
        if (!window.XLSX) throw new Error('Excel reader unavailable. Check your internet connection and refresh.');
        const workbook = window.XLSX.read(await file.arrayBuffer(), { type:'array', cellDates:true });
        rawRows = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval:'', raw:true });
      } else throw new Error('Unsupported file type. Upload CSV or .xlsx.');
      if (!rawRows.length) throw new Error('No result rows found in this file.');
      const normalise = value => String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
      const rows = rawRows.map((raw,index) => {
        const fields = {};
        Object.keys(raw).forEach(key => fields[normalise(key)] = raw[key]);
        const get = (...keys) => { for (const key of keys) { const value=fields[normalise(key)]; if (value !== undefined && value !== '') return value; } return ''; };
        const admissionNo=String(get('admissionNo','admission number','learner number','learner id')).trim();
        const learner=this.workspaceState.learners.find(item => String(item.admissionNo).toLowerCase() === admissionNo.toLowerCase());
        const learningArea=String(get('learningArea','subject','learning area')).trim();
        const assessmentTitle=String(get('assessmentTitle','assessment','activity title')).trim();
        const assessmentType=String(get('assessmentType','assessment type') || 'Imported assessment').trim();
        const year=Number(get('year','academic year'));
        const term=String(get('term','reporting term')).trim();
        let dateValue=get('date','date recorded','assessment date');
        if (dateValue instanceof Date) dateValue=dateValue.toISOString().slice(0,10);
        const date=String(dateValue).trim().slice(0,10);
        const scoreRaw=get('score','score achieved','marks');
        const maxScoreRaw=get('maxScore','maximum score','total marks');
        const score=Number(scoreRaw);
        const maxScore=Number(maxScoreRaw);
        const errors=[];
        if (!admissionNo) errors.push('Missing admission number'); else if (!learner) errors.push('Learner not registered');
        if (!learningArea) errors.push('Missing learning area');
        if (!assessmentTitle) errors.push('Missing assessment title');
        if (!Number.isInteger(year) || year<2020 || year>2100) errors.push('Invalid year');
        if (!['Term 1','Term 2','Term 3'].includes(term)) errors.push('Term must be Term 1, 2 or 3');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) errors.push('Date must be YYYY-MM-DD');
        if (scoreRaw === '' || maxScoreRaw === '' || !Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore<=0 || score<0 || score>maxScore) errors.push('Invalid or missing score / maximum');
        return { rowNumber:index+2, admissionNo, learnerId:learner?.id || '', learnerName:learner?.fullName || '', learningArea, assessmentTitle, assessmentType, year, term, date, score, maxScore,
          percentage:Number.isFinite(score/maxScore)?Number(((score/maxScore)*100).toFixed(2)):0,
          attendance:String(get('attendance') || 'Not recorded').trim(), participation:String(get('participation') || '').trim(),
          observation:String(get('observation','teacher observation') || '').trim(), scoreLabel:Number.isFinite(score)&&Number.isFinite(maxScore)?score+' / '+maxScore:'—',
          valid:errors.length===0, error:errors.join('; ') };
      });
      this.pendingImportPreview={fileName:file.name,rows};
      this.renderImportWorkspace(document.getElementById('view-import-marks'));
      this.showWorkspaceToast('File checked. Review the preview before importing.');
    } catch(error) { this.showWorkspaceToast(error.message || 'Could not read this file.'); }
  },

  confirmImport() {
    const preview=this.pendingImportPreview;
    if (!preview) return;
    const keys=new Set(this.workspaceState.performanceRecords.map(record => [record.learnerId,record.learningArea,record.assessmentTitle,record.year,record.term,record.date].join('|').toLowerCase()));
    let imported=0,duplicates=0;
    preview.rows.forEach(row => {
      if (!row.valid) return;
      const key=[row.learnerId,row.learningArea,row.assessmentTitle,row.year,row.term,row.date].join('|').toLowerCase();
      if (keys.has(key)) { duplicates++; return; }
      keys.add(key);
      this.workspaceState.performanceRecords.push({ id:'performance-'+Date.now()+'-'+Math.random().toString(36).slice(2,8), learnerId:row.learnerId,
        learningArea:row.learningArea,assessmentTitle:row.assessmentTitle,assessmentType:row.assessmentType,year:row.year,term:row.term,date:row.date,
        score:row.score,maxScore:row.maxScore,percentage:row.percentage,attendance:row.attendance,participation:row.participation,observation:row.observation,
        createdAt:new Date().toISOString(),source:'file-import',sourceFile:preview.fileName });
      imported++;
    });
    EduDataStore.save(this.workspaceState);
    this.syncWarningBadge();
    this.pendingImportPreview=null;
    this.renderImportWorkspace(document.getElementById('view-import-marks'));
    this.showWorkspaceToast(imported+' result(s) imported; '+duplicates+' duplicate(s) skipped.');
  },

  downloadImportTemplate() {
    const headers=['admissionNo','learningArea','assessmentTitle','assessmentType','year','term','date','score','maxScore','attendance','participation','observation'];
    const example=['SCH-001','Mathematics','Term 1 Assessment','End-of-term assessment','2026','Term 1','2026-04-10','18','25','Present','Actively participated','Shows working clearly and explains the method used'];
    const csv=[headers,example].map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='edulongview-performance-import-template.csv';document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
  },

  exportWorkspaceBackup() {
    const blob = new Blob([JSON.stringify(this.workspaceState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edulongview-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.showWorkspaceToast('Workspace backup exported.');
  },

  async restoreWorkspaceBackup(file) {
    if (!file) return;
    try {
      const restored = JSON.parse(await file.text());
      if (!restored || typeof restored !== 'object' || !restored.periods) throw new Error('This is not a valid EduLongView backup.');
      restored.learners = Array.isArray(restored.learners) ? restored.learners : [];
      restored.performanceRecords = Array.isArray(restored.performanceRecords) ? restored.performanceRecords : [];
      restored.learnerReports = Array.isArray(restored.learnerReports) ? restored.learnerReports : [];
      EduDataStore.save(restored);
      this.workspaceState = restored;
      this.ensureWorkspaceCollections();
      this.renderFoundationViews();
      this.navigate('settings', false);
      this.showWorkspaceToast('Workspace backup restored.');
    } catch (error) {
      this.showWorkspaceToast(error.message || 'Could not restore this backup.');
    }
  },

  handleWorkspaceSubmit(event) {
    const form = event.target;
    if (form.id !== 'learnerCreateForm' && form.id !== 'performanceCreateForm' && form.id !== 'reportGenerateForm' && form.id !== 'reportSaveForm' && form.id !== 'settingsForm') return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    if (form.id === 'settingsForm') {
      const attentionThreshold = Number(values.attentionThreshold);
      const dropThreshold = Number(values.dropThreshold);
      if (!Number.isFinite(attentionThreshold) || attentionThreshold < 0 || attentionThreshold > 100 || !Number.isFinite(dropThreshold) || dropThreshold < 0 || dropThreshold > 100) {
        window.alert('Enter threshold values from 0 to 100.');
        return;
      }
      this.workspaceState.school = Object.assign({}, this.workspaceState.school || DEFAULT_DEMO_DATA.school, {
        name: values.schoolName.trim(),
        location: values.schoolLocation.trim(),
        attentionIndexThreshold: attentionThreshold,
        dropAlertThreshold: dropThreshold
      });
      EduDataStore.save(this.workspaceState);
      this.syncSchoolIdentity();
      this.syncWarningBadge();
      this.renderSettings(document.getElementById('view-settings'));
      this.showWorkspaceToast('Workspace settings saved.');
      return;
    }
    if (form.id === 'reportGenerateForm') {
      const analysis = this.analyseLearner(values.learnerId);
      if (!analysis) return;
      if (!analysis.records.length) { this.showWorkspaceToast('No performance records found for this learner.'); return; }
      const report = { id:'report-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), learnerId:values.learnerId,
        summary:analysis.summary, strengths:analysis.strengths.map(function(item) { return '• ' + item; }).join('\n'),
        support:analysis.support.map(function(item) { return '• ' + item; }).join('\n'),
        recommendations:analysis.recommendations.map(function(item) { return '• ' + item; }).join('\n'),
        teacherComment:'', evidenceRecordIds:analysis.records.map(function(item) { return item.id; }), evidenceCount:analysis.records.length,
        evidenceSnapshot:{ areas:analysis.areas, attendance:analysis.attendance, participation:analysis.participation, overall:analysis.overall, scoredCount:analysis.scoredCount,
          records:analysis.records.map(function(record) { return { id:record.id, date:record.date || '', learningArea:record.learningArea || '', assessmentTitle:record.assessmentTitle || '', score:record.score, maxScore:record.maxScore, percentage:record.calculatedPercentage, attendance:record.attendance || 'Not recorded', participation:record.participation || '', observation:record.observation || '' }; }) },
        status:'draft', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
      this.workspaceState.learnerReports.push(report);
      EduDataStore.save(this.workspaceState);
      this.renderLearnerReports(document.getElementById('view-subjects'), values.learnerId);
      this.showWorkspaceToast('Private report draft generated.');
      return;
    }
    if (form.id === 'reportSaveForm') {
      const report = this.workspaceState.learnerReports.find((item) => item.id === form.dataset.reportId);
      if (!report) return;
      report.summary = values.summary.trim(); report.strengths = values.strengths.trim(); report.support = values.support.trim();
      report.recommendations = values.recommendations.trim(); report.teacherComment = values.teacherComment.trim();
      report.updatedAt = new Date().toISOString(); report.status = 'draft';
      EduDataStore.save(this.workspaceState);
      this.renderLearnerReports(document.getElementById('view-subjects'), report.learnerId);
      this.showWorkspaceToast('Teacher draft saved. It remains private.');
      return;
    }
    if (form.id === 'learnerCreateForm') {
      const admissionNo = values.admissionNo.trim();
      if (this.workspaceState.learners.some((learner) => learner.admissionNo.toLowerCase() === admissionNo.toLowerCase())) { window.alert('That admission / learner number is already registered.'); return; }
      this.workspaceState.learners.push({ id:'learner-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), fullName:values.fullName.trim(), admissionNo:admissionNo, grade:Number(values.grade), stream:values.stream.trim(), createdAt:new Date().toISOString() });
      EduDataStore.save(this.workspaceState); this.syncWarningBadge(); this.renderLearnerDirectory(document.getElementById('view-learners')); this.showWorkspaceToast('Learner profile saved.'); return;
    }
    const score = Number(values.score), maxScore = Number(values.maxScore);
    if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || score < 0 || score > maxScore) { window.alert('Enter a valid score. The score achieved cannot be greater than the maximum score.'); return; }
    this.workspaceState.performanceRecords.push({ id:'performance-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), learnerId:values.learnerId, learningArea:values.learningArea.trim(), assessmentTitle:values.assessmentTitle.trim(), assessmentType:values.assessmentType, year:Number(values.year), term:values.term, date:values.date, score:score, maxScore:maxScore, percentage:Number(((score / maxScore) * 100).toFixed(2)), attendance:values.attendance, participation:values.participation, observation:values.observation.trim(), createdAt:new Date().toISOString() });
    EduDataStore.save(this.workspaceState); this.syncWarningBadge(); this.renderPerformanceEntry(document.getElementById('view-assessments')); this.showWorkspaceToast('Performance record saved.');
  },

  bindEvents() {
    // Route links across sidebar and body
    document.addEventListener('submit', (event) => this.handleWorkspaceSubmit(event));
    // File uploads, workspace restoration and learner directory filters
    document.addEventListener('change', (event) => {
      if (event.target.id === 'performanceImportFile') {
        this.readImportFile(event.target.files?.[0]);
      }
      if (event.target.id === 'stateRestoreFile') {
        this.restoreWorkspaceBackup(event.target.files?.[0]);
      }
      if (event.target.id === 'learnerGradeFilter') {
        this.filterLearnerDirectory();
      }
    });

    document.addEventListener('input', (event) => {
      if (event.target.id === 'learnerSearchInput') {
        this.filterLearnerDirectory();
      }
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete-report]')) {
        const reportId = e.target.closest('[data-delete-report]').getAttribute('data-delete-report');
        if (window.confirm('Delete this private report draft?')) {
          this.workspaceState.learnerReports = this.workspaceState.learnerReports.filter((report) => report.id !== reportId);
          EduDataStore.save(this.workspaceState);
          this.renderReportsWorkspace(document.getElementById('view-reports'));
          this.showWorkspaceToast('Private report draft deleted.');
        }
        return;
      }
      if (e.target.closest('[data-print-report]')) {
        this.printReport(e.target.closest('[data-print-report]').getAttribute('data-print-report'));
        return;
      }
      if (e.target.closest('[data-export-state]')) {
        this.exportWorkspaceBackup();
        return;
      }
      if (e.target.closest('[data-reset-workspace]')) {
        if (window.confirm('Reset all browser learners, evidence and reports to the demo dataset?')) {
          this.workspaceState = EduDataStore.reset();
          this.ensureWorkspaceCollections();
          this.renderFoundationViews();
          this.navigate('overview', true);
          this.showWorkspaceToast('Browser workspace reset to demo data.');
        }
        return;
      }
      if (e.target.closest('[data-download-import-template]')) { this.downloadImportTemplate(); return; }
      if (e.target.closest('[data-clear-import-preview]')) { this.pendingImportPreview=null; this.renderImportWorkspace(document.getElementById('view-import-marks')); return; }
      if (e.target.closest('[data-confirm-import]')) { this.confirmImport(); return; }
      const editReportTrigger = e.target.closest('[data-edit-report]');
      if (editReportTrigger) {
        const reportId = editReportTrigger.getAttribute('data-edit-report');
        const report = this.workspaceState.learnerReports.find((item) => item.id === reportId);
        if (!report) return;
        if (window.location.hash !== '#subjects') {
          this.navigate('subjects', true);
          this.renderLearnerReports(document.getElementById('view-subjects'), report.learnerId);
        }
        requestAnimationFrame(() => {
          this.renderReportEditor(reportId);
          const host = document.getElementById('reportEditorHost');
          if (host) host.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }
      const routeTrigger = e.target.closest('[data-route]');
      if (routeTrigger) {
        e.preventDefault();
        const targetRoute = routeTrigger.getAttribute('data-route');
        this.navigate(targetRoute, true);
        this.closeMobileSidebar();
      }
    });

    // Desktop sidebar collapse
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        this.appShell.classList.toggle('sidebar-collapsed');
        const isCollapsed = this.appShell.classList.contains('sidebar-collapsed');
        collapseBtn.innerHTML = isCollapsed
          ? '<i data-lucide="panel-left-open"></i>'
          : '<i data-lucide="panel-left-close"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Mobile sidebar open/close
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        this.appShell.classList.add('mobile-nav-open');
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeMobileSidebar());
    }

    // Browser back/forward
    window.addEventListener('hashchange', () => {
      const hashRoute = window.location.hash.replace('#', '') || 'overview';
      this.navigate(hashRoute, false);
    });
  },

  closeMobileSidebar() {
    this.appShell.classList.remove('mobile-nav-open');
  },

  navigate(route, pushHash = true) {
    const targetSection = document.getElementById(`view-${route}`) ? route : 'overview';
    this.syncWarningBadge();

    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${targetSection}`);
    });

    this.navItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-route') === targetSection);
    });

    const activeSection = document.getElementById(`view-${targetSection}`);
    if (activeSection && this.pageTitleEl) {
      this.pageTitleEl.textContent = activeSection.getAttribute('data-title') || 'Overview';
    }

    if (pushHash && window.location.hash !== `#${targetSection}`) {
      window.location.hash = targetSection;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    if (typeof this.onRouteChange === 'function') {
      this.onRouteChange(targetSection);
    }