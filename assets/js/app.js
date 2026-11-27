/**
 * EduLongView — Live learner evidence dashboard.
 * Dashboard figures are derived from the same browser workspace used by
 * Learners, Performance Records, Analytics and Reports.
 */
(function () {
  let trendChartInstance = null;
  let subjectChartInstance = null;

  const yearSelect = document.getElementById('yearSelect');
  const termSelect = document.getElementById('termSelect');
  const streamFilterSelect = document.getElementById('streamFilterSelect');
  const resetDemoBtn = document.getElementById('resetDemoBtn');

  function getWorkspace() {
    return (typeof EduNavigation !== 'undefined' && EduNavigation.workspaceState) || EduDataStore.load();
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function hasRecordedScore(record) {
    if (record?.percentage === null || record?.percentage === undefined || String(record.percentage).trim() === '') {
      return false;
    }
    const score = Number(record.percentage);
    return Number.isFinite(score);
  }

  function showToast(message) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function getActiveRecords() {
    const state = getWorkspace();
    const year = String(state.activePeriod?.year || yearSelect?.value || new Date().getFullYear());
    const term = String(state.activePeriod?.term || termSelect?.value || 'Term 1');
    const learners = state.learners || [];
    const learnerById = new Map(learners.map((learner) => [learner.id, learner]));
    const records = (state.performanceRecords || []).filter((record) =>
      String(record.year) === year && String(record.term) === term
    );
    const selectedGrade = streamFilterSelect?.value || 'all';
    const filteredRecords = selectedGrade === 'all' ? records : records.filter((record) =>
      String(learnerById.get(record.learnerId)?.grade) === selectedGrade.replace('Grade ', '')
    );
    return { state, year, term, learners, learnerById, records, filteredRecords };
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function updateKPIs(data) {
    const allRecords = data.records;
    const scored = allRecords.filter(hasRecordedScore);
    const mean = scored.length
      ? scored.reduce((sum, record) => sum + Number(record.percentage), 0) / scored.length
      : null;
    const learnersWithEvidence = new Set(allRecords.map((record) => record.learnerId)).size;
    const flags = typeof EduNavigation !== 'undefined' && typeof EduNavigation.calculateEvidenceFlags === 'function'
      ? EduNavigation.calculateEvidenceFlags()
      : [];

    setText('activePeriodHeading', data.year + ' · ' + data.term);
    setText('kpiTotalLearners', data.learners.length.toLocaleString());
    setText('kpiLearnersMeta', learnersWithEvidence + ' with evidence in this period');
    setText('kpiAvgPerformance', mean === null ? '—' : mean.toFixed(1) + '%');
    setText('kpiAvgDelta', mean === null ? 'No scored evidence yet' : 'Mean of ' + scored.length + ' scored records');
    setText('kpiTotalAssessments', allRecords.length.toLocaleString());
    setText('kpiAssessmentsMeta', 'Saved records in selected period');
    setText('kpiFlaggedLearners', flags.length.toLocaleString());
    setText('kpiFlaggedMeta', 'Across all saved periods');

    const sidebarBadge = document.getElementById('sidebarWarningBadge');
    if (sidebarBadge) sidebarBadge.textContent = flags.length;
  }

  function renderRecentAssessments(data) {
    const tbody = document.getElementById('recentAssessmentsBody');
    if (!tbody) return;
    const recent = data.records.slice().sort((a, b) =>
      String(b.date || b.createdAt || '').localeCompare(String(a.date || a.createdAt || ''))
    ).slice(0, 5);

    if (!recent.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state-cell">No performance records have been saved for this period yet.</td></tr>';
      return;
    }

    tbody.innerHTML = recent.map((record) => {
      const learner = data.learnerById.get(record.learnerId);
      const date = record.date || (record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '—');
      const score = hasRecordedScore(record) ? Number(record.percentage).toFixed(1) + '%' : 'Observation';
      return `<tr>
        <td><span class="cell-primary">${escapeHTML(record.learningArea || 'Learning area not set')}</span><span class="cell-sub">${escapeHTML(record.assessmentTitle || record.assessmentType || 'Performance evidence')}</span></td>
        <td>${escapeHTML(learner ? 'Grade ' + learner.grade + (learner.stream ? ' · ' + learner.stream : '') : 'Learner unavailable')}</td>
        <td class="cell-sub">${escapeHTML(date)}</td>
        <td><strong>${escapeHTML(score)}</strong></td>
        <td><span class="status-pill verified">Saved</span></td>
      </tr>`;
    }).join('');
  }

  function renderEarlyWarnings() {
    const container = document.getElementById('earlyWarningSummaryList');
    if (!container) return;
    const flags = window.EduNavigation?.calculateEvidenceFlags
      ? EduNavigation.calculateEvidenceFlags()
      : [];

    if (!flags.length) {
      container.innerHTML = '<div class="empty-state-cell">No learners currently meet the configured evidence-review rules.</div>';
      return;
    }

    container.innerHTML = flags.slice(0, 4).map((flag) => `
      <div class="warning-item ${flag.level === 'High' ? 'critical' : ''}">
        <div class="warning-item-top">
          <div><span class="learner-ident">${escapeHTML(flag.learner.fullName)}</span>
          <span class="learner-stream">Grade ${escapeHTML(flag.learner.grade)} · ${escapeHTML(flag.learner.admissionNo)}</span></div>
          <span class="risk-tag ${flag.level.toLowerCase() === 'high' ? 'high' : 'moderate'}">${flag.level} Priority</span>
        </div>
        <p class="warning-reason">${flag.reasons.map(escapeHTML).join(' ')}</p>
        <div class="warning-metrics"><span>Recorded mean: <strong>${flag.mean === null ? '—' : flag.mean.toFixed(1) + '%'}</strong></span><span>Absence entries: <strong>${flag.absences}</strong></span></div>
      </div>`
    ).join('');
  }

  function showChartEmpty(canvasId, message) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const wrapper = canvas.parentElement;
    if (wrapper) wrapper.innerHTML = '<div class="dashboard-chart-empty">' + escapeHTML(message) + '</div>';
  }

  function restoreChartCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (canvas) return canvas;
    const wrapper = document.querySelector('[data-chart-host="' + canvasId + '"]');
    if (!wrapper) return null;
    wrapper.innerHTML = '<canvas id="' + canvasId + '"></canvas>';
    return document.getElementById(canvasId);
  }

  function renderTrendChart(data) {
    if (trendChartInstance) {
      trendChartInstance.destroy();
      trendChartInstance = null;
    }
    const host = document.querySelector('[data-chart-host="performanceTrendChart"]');
    const scoredRecords = data.filteredRecords.filter(hasRecordedScore);
    if (!scoredRecords.length) {
      if (host) host.innerHTML = '<div class="dashboard-chart-empty">A performance trend will appear when numeric scores are saved. Observation-only records remain available in Recent Records.</div>';
      return;
    }
    const canvas = restoreChartCanvas('performanceTrendChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ordered = scoredRecords.slice().sort((a, b) =>
      String(a.date || a.createdAt || '').localeCompare(String(b.date || b.createdAt || ''))
    ).slice(-10);
    const labels = ordered.map((record) => record.assessmentTitle || record.date || 'Recorded entry');
    const values = ordered.map((record) => Number(record.percentage));

    trendChartInstance = new Chart(canvas, {
      type: 'line',
      data: { labels, datasets: [{
        label: 'Recorded score',
        data: values,
        spanGaps: true,
        borderColor: '#555B61',
        backgroundColor: 'rgba(85, 91, 97, 0.10)',
        borderWidth: 2.5,
        pointBackgroundColor: '#E5C84B',
        pointBorderColor: '#555B61',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        tension: 0.25,
        fill: true
      }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ctx.parsed.y === null ? 'Observation only' : 'Score: ' + ctx.parsed.y.toFixed(1) + '%' } }
        },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: '#ECEEF0' }, ticks: { color: '#737A81', callback: (value) => value + '%' } },
          x: { grid: { display: false }, ticks: { color: '#737A81', maxRotation: 35, minRotation: 0 } }
        }
      }
    });
  }

  function renderSubjectChart(data) {
    if (subjectChartInstance) {
      subjectChartInstance.destroy();
      subjectChartInstance = null;
    }
    const host = document.querySelector('[data-chart-host="subjectOverviewChart"]');
    const scored = data.filteredRecords.filter(hasRecordedScore);
    const groups = {};
    scored.forEach((record) => {
      const area = record.learningArea || 'Unspecified';
      (groups[area] = groups[area] || []).push(Number(record.percentage));
    });
    const labels = Object.keys(groups);
    if (!labels.length) {
      if (host) host.innerHTML = '<div class="dashboard-chart-empty">Learning-area averages will appear when scored evidence is saved.</div>';
      return;
    }
    const canvas = restoreChartCanvas('subjectOverviewChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const means = labels.map((area) => groups[area].reduce((sum, value) => sum + value, 0) / groups[area].length);
    subjectChartInstance = new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets: [{
        label: 'Mean score',
        data: means,
        backgroundColor: means.map((value) => value < 50 ? '#E5C84B' : value >= 70 ? '#555B61' : '#AEB4BA'),
        borderRadius: 5,
        barThickness: 16
      }] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => 'Mean score: ' + ctx.parsed.x.toFixed(1) + '%' } } },
        scales: {
          x: { beginAtZero: true, max: 100, grid: { color: '#ECEEF0' }, ticks: { color: '#737A81', callback: (value) => value + '%' } },
          y: { grid: { display: false }, ticks: { color: '#555B61' } }
        }
      }
    });
  }

  function refreshDashboard() {
    const data = getActiveRecords();
    updateKPIs(data);
    renderRecentAssessments(data);
    renderEarlyWarnings();
    renderTrendChart(data);
    renderSubjectChart(data);
    if (window.lucide) window.lucide.createIcons();
  }

  function bindDashboardControls() {
    const state = getWorkspace();
    if (yearSelect) yearSelect.value = String(state.activePeriod?.year || '2026');
    if (termSelect) termSelect.value = String(state.activePeriod?.term || 'Term 3');

    function savePeriod() {
      const workspace = getWorkspace();
      workspace.activePeriod = workspace.activePeriod || {};
      workspace.activePeriod.year = yearSelect?.value || workspace.activePeriod.year || '2026';
      workspace.activePeriod.term = termSelect?.value || workspace.activePeriod.term || 'Term 3';
      EduDataStore.save(workspace);
      refreshDashboard();
      showToast('Showing ' + workspace.activePeriod.year + ' · ' + workspace.activePeriod.term);
    }
    yearSelect?.addEventListener('change', savePeriod);
    termSelect?.addEventListener('change', savePeriod);
    streamFilterSelect?.addEventListener('change', refreshDashboard);

    resetDemoBtn?.addEventListener('click', () => {
      const confirmed = window.confirm('This will clear learner profiles, performance evidence and report drafts saved in this browser, then restore the demo defaults. Continue?');
      if (!confirmed) return;
      const fresh = EduDataStore.reset();
      if (typeof EduNavigation !== 'undefined') {
        EduNavigation.workspaceState = fresh;
        EduNavigation.ensureWorkspaceCollections();
      }
      if (yearSelect) yearSelect.value = fresh.activePeriod.year;
      if (termSelect) termSelect.value = fresh.activePeriod.term;
      if (streamFilterSelect) streamFilterSelect.value = 'all';
      refreshDashboard();
      showToast('Demo workspace reset');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    EduNavigation.init((activeRoute) => {
      if (activeRoute === 'overview') refreshDashboard();
    });
    bindDashboardControls();
    refreshDashboard();
  });
})();
