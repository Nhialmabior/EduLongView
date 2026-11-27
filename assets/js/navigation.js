/**
 * EduLongView — Navigation & Responsive Shell Controller
 */

const MODULE_BLUEPRINTS = {
  'learners': {
    title: 'Learners Directory',
    badge: 'Module Ready for Phase 2',
    description: 'Centralized learner registry with admission numbers, class stream assignments, attendance context, and longitudinal academic profiles.',
    pillars: [
      { title: 'Learner Profiles', detail: 'Longitudinal learning-outcome progress, competency strengths, learner support needs, and teacher intervention notes.' },
      { title: 'Stream & Cohort Filters', detail: 'Filter across Grades 1–9 streams, gender balance, and support categories without losing context.' },
      { title: 'LocalStorage Persistence', detail: 'Add, edit, or search learner records directly in browser storage with instant CSV export.' }
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
    title: 'Assessments & Markbooks',
    badge: 'Module Ready for Phase 2',
    description: 'Create and review formative and summative assessments linked to grade-level learning areas, strands, sub-strands, and outcomes.',
    pillars: [
      { title: 'Structured Mark Entry', detail: 'Teacher-friendly evidence entry with rubric/descriptor selection and validation.' },
      { title: 'Completion Tracking', detail: 'See which subject teachers have submitted marks and which streams are still pending.' },
      { title: 'Automatic Calculations', detail: 'Summaries of achievement evidence and learner progress; avoid ranking learners as the default measure.' }
    ]
  },
  'import-marks': {
    title: 'Import Marks (CSV)',
    badge: 'Powered by PapaParse',
    description: 'Import learner records and assessment evidence using grade-aware CSV templates with validation before saving.',
    pillars: [
      { title: 'Downloadable CSV Templates', detail: 'Pre-formatted templates per stream so teachers can enter marks offline and upload in seconds.' },
      { title: 'Validation & Preview', detail: 'Detect missing admission numbers, out-of-range marks, or duplicate rows before saving.' },
      { title: 'Instant Dashboard Sync', detail: 'Uploaded assessments immediately update Overview charts and Early-Warning indicators.' }
    ]
  },
  'analytics': {
    title: 'Deep Academic Analytics',
    badge: 'Powered by Chart.js',
    description: 'Longitudinal learning progress, competency development, grade-level patterns, and cohort progression insights.',
    pillars: [
      { title: 'Longitudinal Cohort Curves', detail: 'Follow learner development from Grade 1 through Grade 9 while preserving historical records.' },
      { title: 'Subject Gap Analysis', detail: 'Identify topics and subjects pulling down overall learner mean grades.' },
      { title: 'Distribution Histograms', detail: 'Visualize score spreads to distinguish whole-class gaps from individual learner struggles.' }
    ]
  },
  'early-warnings': {
    title: 'Explainable Early Warnings',
    badge: 'Rule-Based Intervention Engine',
    description: 'Transparent academic risk flags showing exactly why a learner needs support—never an opaque black-box score.',
    pillars: [
      { title: 'Clear Trigger Rules', detail: 'Use transparent indicators such as missing learning evidence, attendance concerns, or sustained difficulty with selected outcomes; teachers review every flag.' },
      { title: 'Teacher Action Log', detail: 'Record remedial classes, guardian meetings, and follow-up check-ins per flagged learner.' },
      { title: 'Recovery Monitoring', detail: 'Track whether interventions lift learner performance in subsequent assessments.' }
    ]
  },
  'reports': {
    title: 'Academic Reports & PDFs',
    badge: 'Powered by jsPDF',
    description: 'Generate clean, printable learner report cards, stream broadsheets, and board summary briefs offline.',
    pillars: [
      { title: 'Individual Learner Report Cards', detail: 'Learner progress summaries with learning areas, competency evidence, teacher feedback, and support actions.' },
      { title: 'Administration Term Briefs', detail: 'One-click executive summaries for school principals and education partners.' },
      { title: 'Offline-First Generation', detail: 'Generates crisp vector PDFs directly in the browser without requiring internet access.' }
    ]
  },
  'settings': {
    title: 'School & Threshold Settings',
    badge: 'System Configuration',
    description: 'Customize school identity, early-warning sensitivity thresholds, and local browser data backups.',
    pillars: [
      { title: 'Early-Warning Thresholds', detail: 'Adjust pass marks and percentage-drop sensitivity to match school academic targets.' },
      { title: 'JSON Backup & Restore', detail: 'Export the entire LocalStorage database to a portable file for safe offline backup.' },
      { title: 'Demo Dataset Controls', detail: 'Configure school grade coverage, reporting preferences, and demo data or start with a clean slate.' }
    ]
  }
};

const EduNavigation = {
  init(onRouteChange) {
    this.onRouteChange = onRouteChange;
    this.appShell = document.getElementById('appShell');
    this.pageTitleEl = document.getElementById('topbarPageTitle');
    this.navItems = document.querySelectorAll('.nav-item[data-route]');

    this.renderFoundationViews();
    this.bindEvents();

    const initialRoute = window.location.hash.replace('#', '') || 'overview';
    this.navigate(initialRoute, false);
  },

  renderFoundationViews() {
    Object.entries(MODULE_BLUEPRINTS).forEach(([route, info]) => {
      const section = document.getElementById(`view-${route}`);
      if (!section) return;

      if (route === 'subjects') {
        this.renderLearnerReports(section);
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

  renderLearnerReports(section) {
    const steps = [
      { number: '01', title: 'Record learner performance', detail: 'Teachers enter assessment results, attendance, participation, progress notes and relevant observations for each learner.' },
      { number: '02', title: 'Analyse individual progress', detail: 'The system compares the learner’s recorded evidence over time and across learning areas, identifying strengths, changes and possible gaps.' },
      { number: '03', title: 'Generate an AI report draft', detail: 'AI prepares a clear performance summary and practical recommendations. It must not invent evidence or make unsupported diagnoses.' },
      { number: '04', title: 'Teacher reviews and approves', detail: 'The responsible teacher checks the evidence, edits the report where necessary and decides whether it is ready to share.' },
      { number: '05', title: 'Release to the parent', detail: 'Only an approved and explicitly released report becomes visible to the authorised parent or guardian.' }
    ];

    section.innerHTML = `
      <div class="module-shell">
        <div class="module-header">
          <div>
            <span class="module-badge">AI-assisted · Human-approved</span>
            <h2>Individual Learner Reports</h2>
            <p>EduLongView helps teachers understand each learner’s performance and communicate meaningful progress to parents. It is not a curriculum delivery or teaching platform.</p>
          </div>
          <a href="#overview" class="btn btn-primary" data-route="overview">
            <i data-lucide="arrow-left"></i><span>Back to Overview Dashboard</span>
          </a>
        </div>
        <div class="roadmap-grid">
          ${steps.map((step) => `
            <article class="roadmap-card">
              <span class="module-badge">Step ${step.number}</span>
              <h4 style="margin-top:12px;">${step.title}</h4>
              <p>${step.detail}</p>
            </article>
          `).join('')}
        </div>
        <div class="panel-card" style="margin-top:22px;">
          <div class="panel-header"><div><h3 class="panel-title">Report governance</h3><p class="panel-subtitle">The teacher remains accountable for every report shared with a parent.</p></div></div>
          <div class="roadmap-grid">
            <article class="roadmap-card"><h4>Evidence-based AI</h4><p>Recommendations must be traceable to recorded performance, attendance or teacher observations. Missing information must be identified, not guessed.</p></article>
            <article class="roadmap-card"><h4>Teacher control</h4><p>AI output remains a private draft until a teacher reviews and approves it. AI cannot publish reports independently.</p></article>
            <article class="roadmap-card"><h4>Parent privacy</h4><p>Parents can access only the reports for their linked learner that the school has approved and released.</p></article>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents() {
    // Route links across sidebar and body
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
