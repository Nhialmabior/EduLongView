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
    title: 'CBC Curriculum & Learning Areas',
    badge: 'Kenya CBC/CBE · Grades 1–9',
    description: 'Explore grade-band learning areas and the core competencies that guide learner development across Lower Primary, Upper Primary, and Junior School.',
    pillars: [
      { title: 'Learning Area Progress', detail: 'Track learning-outcome progress by grade and learning area to guide learner support.' },
      { title: 'Competency Assessment', detail: 'Configure school assessment rubrics and achievement descriptors without treating them as national grades.' },
      { title: 'Learning Evidence', detail: 'Record varied evidence of learning, practical tasks, observations, projects, and teacher feedback.' }
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
      { title: 'Demo Dataset Controls', detail: 'Configure school grade coverage, curriculum options, and demo data or start with a clean slate.' }
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
        this.renderCurriculumDirectory(section);
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

  renderCurriculumDirectory(section) {
    const curriculum = window.KENYA_CBC_CURRICULUM || KENYA_CBC_CURRICULUM;
    const gradeOptions = curriculum.grades
      .map((grade) => `<option value="${grade}">Grade ${grade}</option>`)
      .join('');

    section.innerHTML = `
      <div class="module-shell">
        <div class="module-header">
          <div>
            <span class="module-badge">Kenya CBC/CBE · Grades 1–9</span>
            <h2>CBC Curriculum &amp; Learning Areas</h2>
            <p>Browse the learning areas listed for each grade band and open the official KICD curriculum designs for detailed curriculum content.</p>
          </div>
          <a href="#overview" class="btn btn-primary" data-route="overview">
            <i data-lucide="arrow-left"></i>
            <span>Back to Overview Dashboard</span>
          </a>
        </div>

        <div class="panel-card" style="margin-bottom: 22px;">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Grade Curriculum Explorer</h3>
              <p class="panel-subtitle">Choose a grade to see its stage and learning-area catalogue.</p>
            </div>
            <select id="curriculumGradeSelect" class="compact-select" aria-label="Select curriculum grade">
              ${gradeOptions}
            </select>
          </div>
          <div class="curriculum-stage-row" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:14px 0;">
            <span id="curriculumStageSummary" class="module-badge">Lower Primary · Grades 1–3</span>
            <a id="curriculumSourceLink" class="btn btn-secondary" href="${curriculum.stages[0].sourceUrl}" target="_blank" rel="noopener noreferrer">
              <i data-lucide="external-link"></i>
              <span>Open official KICD designs</span>
            </a>
          </div>
          <div id="curriculumAreasGrid" class="roadmap-grid"></div>
          <div id="curriculumAreaDetail" class="panel-card" style="margin-top:18px;background:#F8FAFC;">
            <h3 class="panel-title">Select a learning area</h3>
            <p class="panel-subtitle">Select a card above to view its curriculum-record structure and source guidance.</p>
          </div>
          <p class="panel-subtitle" style="margin-top:16px;">The list reflects KICD's 2026 curriculum support-materials guidance. Religious education, indigenous languages and foreign languages are presented as programme options; the school should configure what it offers.</p>
        </div>

        <div class="panel-card" style="margin-bottom:22px;">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">CBC Core Competencies</h3>
              <p class="panel-subtitle">Competencies developed across learning areas and learning experiences.</p>
            </div>
          </div>
          <div class="roadmap-grid">
            ${curriculum.coreCompetencies.map((competency) => `
              <article class="roadmap-card">
                <h4>${competency}</h4>
                <p>Developed through classroom learning, practical experiences, collaboration, and application.</p>
              </article>
            `).join('')}
          </div>
        </div>

        <div class="panel-card">
          <h3 class="panel-title">Assessment language</h3>
          <p class="panel-subtitle">The KICD rubric descriptors below are shown as reference labels. The exact rubric and evidence requirements should be taken from the relevant learning-area curriculum design and school assessment policy.</p>
          <div class="roadmap-grid" style="margin-top:16px;">
            ${curriculum.assessmentRubric.map((item) => `
              <article class="roadmap-card">
                <h4>${item.code} · ${item.label}</h4>
                <p>Use with teacher-observed evidence and the applicable curriculum design.</p>
              </article>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const gradeSelect = section.querySelector('#curriculumGradeSelect');
    const stageSummary = section.querySelector('#curriculumStageSummary');
    const sourceLink = section.querySelector('#curriculumSourceLink');
    const areasGrid = section.querySelector('#curriculumAreasGrid');
    const areaDetail = section.querySelector('#curriculumAreaDetail');

    const renderGrade = (grade) => {
      const stage = curriculum.stages.find((item) => item.grades.includes(Number(grade)));
      if (!stage) return;

      stageSummary.textContent = `${stage.name} · Grades ${stage.grades[0]}–${stage.grades[stage.grades.length - 1]}`;
      sourceLink.href = stage.sourceUrl;

      const areas = curriculum.learningAreasByStage[stage.name] || [];
      areasGrid.innerHTML = areas.map((area, index) => `
        <button type="button" class="roadmap-card curriculum-area-card" data-area-index="${index}" aria-pressed="false" style="text-align:left;cursor:pointer;width:100%;">
          <h4>${area.name}</h4>
          <p>${area.type}</p>
        </button>
      `).join('');

      areaDetail.innerHTML = `
        <h3 class="panel-title">Curriculum detail status</h3>
        <p class="panel-subtitle">Choose a learning area above. Detailed strands, sub-strands and specific learning outcomes have not yet been imported into EduLongView. They will be added from the official grade-specific KICD design, not generated or guessed.</p>
      `;

      areasGrid.querySelectorAll('[data-area-index]').forEach((card) => {
        card.addEventListener('click', () => {
          const selected = areas[Number(card.dataset.areaIndex)];
          areasGrid.querySelectorAll('[data-area-index]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
          card.setAttribute('aria-pressed', 'true');

          const records = (curriculum.curriculumRecords || []).filter((record) =>
            record.grade === Number(grade) && record.learningArea === selected.name
          );

          const recordMarkup = records.length
            ? records.map((record) => `
                <article class="roadmap-card" style="margin-top:14px;">
                  <div class="module-badge">${record.topic} · ${record.verificationStatus === 'verified' ? 'Source verified' : 'Draft'}</div>
                  <h4 style="margin-top:10px;">${record.strand} — ${record.subStrand}</h4>
                  <strong>Specific learning outcomes</strong>
                  <ol style="margin:8px 0 12px 20px;color:#475569;line-height:1.7;">
                    ${record.specificLearningOutcomes.map((outcome) => `<li>${outcome}</li>`).join('')}
                  </ol>
                  <strong>Suggested learning experiences</strong>
                  <ul style="margin:8px 0 12px 20px;color:#475569;line-height:1.7;">
                    ${record.suggestedLearningExperiences.map((experience) => `<li>${experience}</li>`).join('')}
                  </ul>
                  <p class="panel-subtitle"><strong>Core competencies:</strong> ${record.coreCompetencies.join(', ')}</p>
                  <p class="panel-subtitle"><strong>Values:</strong> ${record.values.join(', ')}</p>
                  <p class="panel-subtitle"><strong>PCIs:</strong> ${record.pertinentAndContemporaryIssues.join(', ')}</p>
                  <p class="panel-subtitle"><strong>Key inquiry questions:</strong> ${record.keyInquiryQuestions.join(' · ')}</p>
                  <p class="panel-subtitle">Source: ${record.source.organization}, ${record.source.documentTitle}, page ${record.source.page} · ${record.curriculumVersion}</p>
                  <a class="text-link" href="${record.source.documentUrl}" target="_blank" rel="noopener noreferrer">Open official KICD source</a>
                </article>
              `).join('')
            : `
                <p class="panel-subtitle">Detailed strands, sub-strands and outcomes for this grade and learning area have not yet been imported. They will be added from the official grade-specific KICD design, not generated or guessed.</p>
              `;

          areaDetail.innerHTML = `
            <span class="module-badge">${selected.type}</span>
            <h3 class="panel-title" style="margin-top:12px;">Grade ${grade} · ${selected.name}</h3>
            <p class="panel-subtitle">${records.length ? `${records.length} source-based curriculum record(s) available.` : 'Curriculum content is not yet available in the local catalogue for this selection.'}</p>
            ${recordMarkup}
            <a class="btn btn-secondary" style="margin-top:16px;" href="${stage.sourceUrl}" target="_blank" rel="noopener noreferrer">
              <i data-lucide="book-open"></i>
              <span>View KICD Grade ${grade} curriculum resources</span>
            </a>
          `;
          if (window.lucide) window.lucide.createIcons();
        });
      });
    };

    gradeSelect.addEventListener('change', () => renderGrade(gradeSelect.value));
    renderGrade(gradeSelect.value);

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
