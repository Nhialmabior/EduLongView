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
    badge: 'Module Ready for Phase 2',
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
    badge: 'Powered by PapaParse',
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
  },

  escapeHTML(value) {
    return String(value ?? '').replace(/[&<>\"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
  },

  renderFoundationViews() {
    Object.entries(MODULE_BLUEPRINTS).forEach(([route, info]) => {
      const section = document.getElementById(`view-${route}`);
      if (!section) return;

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

  renderLearnerDirectory(section) {
    const learners = this.workspaceState.learners;
    section.innerHTML = `
      <div class="module-shell">
        <div class="module-header">
          <div><span class="module-badge">Learner registry</span><h2>Learners Directory</h2><p>Create and maintain learner profiles. Each performance record will be linked to one learner so their progress can be followed over time.</p></div>
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
          <div class="panel-header"><div><h3 class="panel-title">Registered learners</h3><p class="panel-subtitle">${learners.length} learner profile(s) stored in this browser.</p></div></div>
          <div class="table-responsive"><table class="data-table"><thead><tr><th>Learner</th><th>Admission No.</th><th>Grade</th><th>Class / Stream</th><th>Records</th></tr></thead><tbody>
          ${learners.length ? learners.map((learner) => {
            const count = this.workspaceState.performanceRecords.filter((record) => record.learnerId === learner.id).length;
            return `<tr><td><span class="cell-primary">${this.escapeHTML(learner.fullName)}</span></td><td>${this.escapeHTML(learner.admissionNo)}</td><td>Grade ${this.escapeHTML(learner.grade)}</td><td>${this.escapeHTML(learner.stream || '—')}</td><td>${count}</td></tr>`;
          }).join('') : '<tr><td colspan="5" class="empty-state-cell">No learners registered yet. Add a learner using the form above.</td></tr>'}
          </tbody></table></div>
        </div>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
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
    const records = this.workspaceState.performanceRecords.filter(function(item) { return item.learnerId === learnerId; }).sort(function(a,b) { return String(a.date || a.createdAt).localeCompare(String(b.date || b.createdAt)); });
    const groups = {};
    records.forEach(function(record) { const key = String(record.learningArea || 'Unspecified'); (groups[key] = groups[key] || []).push(record); });
    const areas = Object.keys(groups).map(function(name) {
      const items = groups[name];
      const average = items.reduce(function(sum,item) { return sum + Number(item.percentage || 0); },0) / items.length;
      return { name:name, count:items.length, average:average, change:items.length > 1 ? Number(items[items.length-1].percentage) - Number(items[0].percentage) : null };
    }).sort(function(a,b) { return b.average-a.average; });
    const attendance = records.reduce(function(counts,record) {
      const value = String(record.attendance || 'Not recorded').toLowerCase();
      if (value === 'present') counts.present++;
      else if (value === 'late') counts.late++;
      else if (value === 'absent') counts.absent++;
      else counts.unrecorded++;
      return counts;
    },{present:0,late:0,absent:0,unrecorded:0});
    const strengths = [], support = [], recommendations = [];
    const repeated = areas.filter(function(area) { return area.count >= 2; });
    repeated.filter(function(area) { return area.average >= 70; }).forEach(function(area) { strengths.push(area.name + ': average recorded score ' + area.average.toFixed(1) + '% across ' + area.count + ' records.'); });
    areas.filter(function(area) { return area.change !== null && area.change >= 5; }).forEach(function(area) { strengths.push(area.name + ': first-to-latest result increased by ' + area.change.toFixed(1) + ' percentage points.'); });
    const lowest = repeated.slice().sort(function(a,b) { return a.average-b.average; })[0];
    if (lowest && lowest.average < 60) {
      support.push(lowest.name + ': average recorded score is ' + lowest.average.toFixed(1) + '% across ' + lowest.count + ' records. Review the tasks and skills represented.');
      recommendations.push('Review the learner’s work in ' + lowest.name + ', identify specific skills needing practice, and check progress again.');
    }
    areas.filter(function(area) { return area.change !== null && area.change <= -5; }).forEach(function(area) {
      support.push(area.name + ': first-to-latest result decreased by ' + Math.abs(area.change).toFixed(1) + ' percentage points.');
      recommendations.push('Discuss the recent ' + area.name + ' results with the learner and check for changes in task difficulty, learning conditions or support.');
    });
    if (!strengths.length) strengths.push('The current records do not yet show a repeated learning area averaging 70% or above. Review individual work before drawing conclusions.');
    if (!support.length) support.push('The available records do not show a repeated low average or a decrease of at least five percentage points. Continue monitoring; this does not prove that no support is needed.');
    if (attendance.absent || attendance.late) recommendations.push('Attendance entries show ' + attendance.absent + ' absence(s) and ' + attendance.late + ' late arrival(s). Verify the context with the learner and follow the school attendance process.');
    if (!records.some(function(record) { return String(record.observation || '').trim(); })) recommendations.push('No teacher observations were included. Add factual classroom observations if available.');
    if (records.length < 3) recommendations.push('Evidence is limited to fewer than three records. Add more results over time before making broad conclusions.');
    if (!recommendations.length) recommendations.push('Continue collecting evidence across reporting periods and discuss the learner’s work to agree on suitable next steps.');
    const overall = records.length ? records.reduce(function(sum,item) { return sum + Number(item.percentage || 0); },0) / records.length : 0;
    const periods = Array.from(new Set(records.map(function(record) { return record.year + ' ' + record.term; })));
    const summary = records.length ? learner.fullName + ' has ' + records.length + ' recorded performance entr' + (records.length === 1 ? 'y' : 'ies') + ' across ' + areas.length + ' learning area(s), covering ' + periods.join(', ') + '. The mean of the recorded percentages is ' + overall.toFixed(1) + '%. Interpret this summary alongside the assessment tasks and teacher observations.' : 'There are no performance records for this learner yet. Record evidence before preparing a progress report.';
    return { learner:learner, records:records, areas:areas, attendance:attendance, strengths:strengths, support:support, recommendations:recommendations, summary:summary, overall:overall };
  },

  renderLearnerReports(section, selectedLearnerId) {
    const learners = this.workspaceState.learners;
    const reports = this.workspaceState.learnerReports.slice().sort(function(a,b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    const options = learners.map((learner) => '<option value="' + this.escapeHTML(learner.id) + '" ' + (learner.id === selectedLearnerId ? 'selected' : '') + '>' + this.escapeHTML(learner.fullName) + ' — ' + this.escapeHTML(learner.admissionNo) + ' (Grade ' + this.escapeHTML(learner.grade) + ')</option>').join('');
    section.innerHTML = '<div class="module-shell"><div class="module-header"><div><span class="module-badge">Evidence analysis · Teacher draft</span><h2>Individual Learner Reports</h2><p>Generate an editable report from one learner’s saved performance records. This version uses transparent rules; no external AI model is connected.</p></div></div>' +
      '<div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Prepare a learner report</h3><p class="panel-subtitle">Select a learner to analyse recorded results, attendance and observations.</p></div></div>' +
      (learners.length ? '<form id="reportGenerateForm" class="workspace-form"><div class="workspace-form-grid"><label class="workspace-wide">Learner<select name="learnerId" required><option value="">Select learner</option>' + options + '</select></label></div><div class="workspace-form-actions"><button class="btn btn-primary" type="submit"><i data-lucide="file-text"></i><span>Generate Report Draft</span></button></div></form>' : '<p class="empty-state-cell">Register a learner and enter performance records before generating a report.</p>') + '</div>' +
      (reports.length ? '<div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Saved report drafts</h3><p class="panel-subtitle">Stored only in this browser; not visible to parents.</p></div></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Learner</th><th>Updated</th><th>Status</th><th>Action</th></tr></thead><tbody>' + reports.map((report) => { const learner = learners.find(function(item) { return item.id === report.learnerId; }); return '<tr><td>' + this.escapeHTML(learner ? learner.fullName : 'Learner not found') + '</td><td>' + this.escapeHTML(new Date(report.updatedAt).toLocaleString()) + '</td><td><span class="status-pill pending">Private draft</span></td><td><button type="button" class="btn btn-secondary btn-sm" data-edit-report="' + this.escapeHTML(report.id) + '">Edit draft</button></td></tr>'; }).join('') + '</tbody></table></div></div>' : '') +
      '<div id="reportEditorHost"></div><div class="panel-card workspace-panel"><h3 class="panel-title">Analysis safeguards</h3><p class="panel-subtitle">Only saved learner evidence is analysed. Missing evidence is identified, conclusions are limited, and teacher approval and parent release are not enabled yet.</p></div></div>';
    if (selectedLearnerId) { const latest = reports.find(function(report) { return report.learnerId === selectedLearnerId; }); if (latest) this.renderReportEditor(latest.id); }
    if (window.lucide) window.lucide.createIcons();
  },

  renderReportEditor(reportId) {
    const report = this.workspaceState.learnerReports.find(function(item) { return item.id === reportId; });
    const host = document.getElementById('reportEditorHost');
    if (!report || !host) return;
    const learner = this.workspaceState.learners.find(function(item) { return item.id === report.learnerId; });
    host.innerHTML = '<div class="panel-card workspace-panel"><div class="panel-header"><div><h3 class="panel-title">Review and edit report draft</h3><p class="panel-subtitle">' + this.escapeHTML(learner ? learner.fullName : 'Learner') + ' · Private draft</p></div></div>' +
      '<form id="reportSaveForm" class="workspace-form" data-report-id="' + this.escapeHTML(report.id) + '"><div class="workspace-form-grid">' +
      '<label class="workspace-wide">Performance summary<textarea name="summary" rows="4" required maxlength="3000">' + this.escapeHTML(report.summary) + '</textarea></label>' +
      '<label>Identified strengths<textarea name="strengths" rows="5" required maxlength="3000">' + this.escapeHTML(report.strengths) + '</textarea></label>' +
      '<label>Areas needing attention<textarea name="support" rows="5" required maxlength="3000">' + this.escapeHTML(report.support) + '</textarea></label>' +
      '<label class="workspace-wide">Recommended next steps<textarea name="recommendations" rows="5" required maxlength="3000">' + this.escapeHTML(report.recommendations) + '</textarea></label>' +
      '<label class="workspace-wide">Teacher’s comment<textarea name="teacherComment" rows="4" maxlength="2000">' + this.escapeHTML(report.teacherComment || '') + '</textarea></label></div>' +
      '<div class="workspace-form-actions"><span class="module-badge">Not approved · Not released</span><button class="btn btn-primary" type="submit"><i data-lucide="save"></i><span>Save Teacher Draft</span></button></div></form></div>';
    if (window.lucide) window.lucide.createIcons();
  },

  handleWorkspaceSubmit(event) {
    const form = event.target;
    if (form.id !== 'learnerCreateForm' && form.id !== 'performanceCreateForm' && form.id !== 'reportGenerateForm' && form.id !== 'reportSaveForm') return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    if (form.id === 'reportGenerateForm') {
      const analysis = this.analyseLearner(values.learnerId);
      if (!analysis) return;
      const report = { id:'report-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), learnerId:values.learnerId,
        summary:analysis.summary, strengths:analysis.strengths.map(function(item) { return '• ' + item; }).join('\n'),
        support:analysis.support.map(function(item) { return '• ' + item; }).join('\n'),
        recommendations:analysis.recommendations.map(function(item) { return '• ' + item; }).join('\n'),
        teacherComment:'', evidenceRecordIds:analysis.records.map(function(item) { return item.id; }), evidenceCount:analysis.records.length,
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
      EduDataStore.save(this.workspaceState); this.renderLearnerDirectory(document.getElementById('view-learners')); this.showWorkspaceToast('Learner profile saved.'); return;
    }
    const score = Number(values.score), maxScore = Number(values.maxScore);
    if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || score < 0 || score > maxScore) { window.alert('Enter a valid score. The score achieved cannot be greater than the maximum score.'); return; }
    this.workspaceState.performanceRecords.push({ id:'performance-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), learnerId:values.learnerId, learningArea:values.learningArea.trim(), assessmentTitle:values.assessmentTitle.trim(), assessmentType:values.assessmentType, year:Number(values.year), term:values.term, date:values.date, score:score, maxScore:maxScore, percentage:Number(((score / maxScore) * 100).toFixed(2)), attendance:values.attendance, participation:values.participation, observation:values.observation.trim(), createdAt:new Date().toISOString() });
    EduDataStore.save(this.workspaceState); this.renderPerformanceEntry(document.getElementById('view-assessments')); this.showWorkspaceToast('Performance record saved.');
  },

  bindEvents() {
    // Route links across sidebar and body
    document.addEventListener('submit', (event) => this.handleWorkspaceSubmit(event));
    document.addEventListener('click', (e) => {
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
  }
};
