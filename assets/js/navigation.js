/**
 * EduLongView — Navigation & Responsive Shell Controller
 */

const MODULE_BLUEPRINTS = {
  'learners': {
    title: 'Learners Directory',
    badge: 'Module Ready for Phase 2',
    description: 'Centralized learner registry with admission numbers, class stream assignments, attendance context, and longitudinal academic profiles.',
    pillars: [
      { title: 'Learner Profiles', detail: 'Individual term-over-term score trajectories, subject strengths, and teacher intervention notes.' },
      { title: 'Stream & Cohort Filters', detail: 'Filter across Form 1–4 streams, gender balance, and support categories without losing context.' },
      { title: 'LocalStorage Persistence', detail: 'Add, edit, or search learner records directly in browser storage with instant CSV export.' }
    ]
  },
  'classes': {
    title: 'Classes & Streams',
    badge: 'Module Ready for Phase 2',
    description: 'Manage Form 1 through Form 4 streams, class teachers, enrollment capacity, and comparative stream benchmarks.',
    pillars: [
      { title: 'Stream Performance Comparison', detail: 'Compare East, West, North, and South streams across identical assessment papers.' },
      { title: 'Class Teacher Allocation', detail: 'Assign homeroom teachers responsible for early-warning follow-ups and parent conferences.' },
      { title: 'Promotion & Rollover', detail: 'Transition cohorts smoothly between academic years while preserving historical records.' }
    ]
  },
  'subjects': {
    title: 'Subjects & Grading Scales',
    badge: 'Module Ready for Phase 2',
    description: 'Configure core and elective subjects, department leads, weighting rules, and Kenyan secondary grading boundaries.',
    pillars: [
      { title: 'Department Benchmarks', detail: 'Track STEM vs. Humanities mean performance to allocate remedial teaching hours.' },
      { title: 'Custom Grading Rubrics', detail: 'Configure pass thresholds and grade boundaries aligned with school academic policies.' },
      { title: 'Assessment Weighting', detail: 'Combine CAT 1, Mid-Term, and End-Term marks automatically into weighted term grades.' }
    ]
  },
  'assessments': {
    title: 'Assessments & Markbooks',
    badge: 'Module Ready for Phase 2',
    description: 'Create and audit CATs, practicals, mid-term exams, and end-term evaluations across every class and subject.',
    pillars: [
      { title: 'Structured Mark Entry', detail: 'Fast keyboard-friendly mark entry grids with automatic validation against maximum scores.' },
      { title: 'Completion Tracking', detail: 'See which subject teachers have submitted marks and which streams are still pending.' },
      { title: 'Automatic Calculations', detail: 'Instant class means, standard deviation, pass rates, and rank distributions.' }
    ]
  },
  'import-marks': {
    title: 'Import Marks (CSV)',
    badge: 'Powered by PapaParse',
    description: 'Upload existing teacher spreadsheets in CSV format to automatically map learner admission numbers and compute analytics.',
    pillars: [
      { title: 'Downloadable CSV Templates', detail: 'Pre-formatted templates per stream so teachers can enter marks offline and upload in seconds.' },
      { title: 'Validation & Preview', detail: 'Detect missing admission numbers, out-of-range marks, or duplicate rows before saving.' },
      { title: 'Instant Dashboard Sync', detail: 'Uploaded assessments immediately update Overview charts and Early-Warning indicators.' }
    ]
  },
  'analytics': {
    title: 'Deep Academic Analytics',
    badge: 'Powered by Chart.js',
    description: 'Multi-term longitudinal comparisons, subject correlation matrices, and cohort progression insights.',
    pillars: [
      { title: 'Longitudinal Cohort Curves', detail: 'Follow the same group of learners from Form 1 entry through Form 4 candidacy.' },
      { title: 'Subject Gap Analysis', detail: 'Identify topics and subjects pulling down overall learner mean grades.' },
      { title: 'Distribution Histograms', detail: 'Visualize score spreads to distinguish whole-class gaps from individual learner struggles.' }
    ]
  },
  'early-warnings': {
    title: 'Explainable Early Warnings',
    badge: 'Rule-Based Intervention Engine',
    description: 'Transparent academic risk flags showing exactly why a learner needs support—never an opaque black-box score.',
    pillars: [
      { title: 'Clear Trigger Rules', detail: 'Flags learners below 50% mean, dropping >12% between CATs, or failing 3+ core subjects.' },
      { title: 'Teacher Action Log', detail: 'Record remedial classes, guardian meetings, and follow-up check-ins per flagged learner.' },
      { title: 'Recovery Monitoring', detail: 'Track whether interventions lift learner performance in subsequent assessments.' }
    ]
  },
  'reports': {
    title: 'Academic Reports & PDFs',
    badge: 'Powered by jsPDF',
    description: 'Generate clean, printable learner report cards, stream broadsheets, and board summary briefs offline.',
    pillars: [
      { title: 'Individual Learner Report Cards', detail: 'Clean PDF summaries with subject marks, term trends, and constructive teacher remarks.' },
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
      { title: 'Demo Dataset Controls', detail: 'Switch between realistic Kakuma school demo data or start with a clean slate.' }
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
