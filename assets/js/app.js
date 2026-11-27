/**
 * EduLongView — Main Dashboard Controller & Chart Visualization Engine
 */

(function () {
  let appState = EduDataStore.load();
  let trendChartInstance = null;
  let subjectChartInstance = null;

  // DOM References
  const yearSelect = document.getElementById('yearSelect');
  const termSelect = document.getElementById('termSelect');
  const streamFilterSelect = document.getElementById('streamFilterSelect');
  const resetDemoBtn = document.getElementById('resetDemoBtn');

  function showToast(message) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function getActivePeriodData() {
    const { year, term } = appState.activePeriod;
    return appState.periods[year]?.[term] || appState.periods['2026']['Term 3'];
  }

  function updateKPIs(periodData) {
    const { year, term } = appState.activePeriod;
    const { kpis } = periodData;

    document.getElementById('activePeriodHeading').textContent = `${year} · ${term}`;
    document.getElementById('kpiTotalLearners').textContent = kpis.totalLearners.toLocaleString();
    document.getElementById('kpiLearnersMeta').textContent = kpis.learnersMeta;
    document.getElementById('kpiAvgPerformance').textContent = `${kpis.avgPerformance.toFixed(1)} index points`;

    const deltaEl = document.getElementById('kpiAvgDelta');
    deltaEl.innerHTML = `<i data-lucide="arrow-up-right"></i> ${kpis.avgDelta}`;

    document.getElementById('kpiTotalAssessments').textContent = kpis.totalAssessments;
    document.getElementById('kpiAssessmentsMeta').textContent = kpis.assessmentsMeta;
    document.getElementById('kpiFlaggedLearners').textContent = kpis.flaggedLearners;
    document.getElementById('kpiFlaggedMeta').textContent = kpis.flaggedMeta;

    const sidebarBadge = document.getElementById('sidebarWarningBadge');
    if (sidebarBadge) {
      sidebarBadge.textContent = kpis.flaggedLearners;
    }
  }

  function renderRecentAssessments(periodData) {
    const tbody = document.getElementById('recentAssessmentsBody');
    if (!tbody) return;

    tbody.innerHTML = periodData.recentAssessments
      .map((item) => {
        const isVerified = item.status === 'Verified';
        const pillClass = isVerified ? 'verified' : 'pending';
        return `
          <tr>
            <td>
              <span class="cell-primary">${item.subject}</span>
              <span class="cell-sub">${item.title}</span>
            </td>
            <td>${item.classStream}</td>
            <td class="cell-sub">${item.date}</td>
            <td><strong>${item.mean}</strong></td>
            <td><span class="status-pill ${pillClass}">${item.status}</span></td>
          </tr>
        `;
      })
      .join('');
  }

  function renderEarlyWarnings(periodData) {
    const container = document.getElementById('earlyWarningSummaryList');
    if (!container) return;

    container.innerHTML = periodData.earlyWarnings
      .map((w) => {
        const isHigh = w.riskLevel === 'High';
        return `
          <div class="warning-item ${isHigh ? 'critical' : ''}">
            <div class="warning-item-top">
              <div>
                <span class="learner-ident">${w.learnerName}</span>
                <span class="learner-stream">${w.stream} · ${w.admissionNo}</span>
              </div>
              <span class="risk-tag ${isHigh ? 'high' : 'moderate'}">${w.riskLevel} Priority</span>
            </div>
            <p class="warning-reason">${w.reason}</p>
            <div class="warning-metrics">
              <span>Progress status: <strong>${w.currentMean}</strong></span>
              <span>Attendance: <strong>${w.attendance}</strong></span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function renderTrendChart(periodData) {
    const canvas = document.getElementById('performanceTrendChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const selectedStream = streamFilterSelect ? streamFilterSelect.value : 'all';
    const series = periodData.trends[selectedStream] || periodData.trends['all'];
    const benchmark = periodData.trendLabels.map(() => appState.school.targetBenchmark);

    if (trendChartInstance) {
      trendChartInstance.destroy();
    }

    trendChartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: periodData.trendLabels,
        datasets: [
          {
            label: selectedStream === 'all' ? 'School Progress Index' : `${selectedStream} Progress Index`,
            data: series,
            borderColor: '#0F766E',
            backgroundColor: 'rgba(15, 118, 110, 0.09)',
            borderWidth: 2.5,
            pointBackgroundColor: '#0F213A',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 6,
            tension: 0.28,
            fill: true
          },
          {
            label: 'Illustrative reference (60 points)',
            data: benchmark,
            borderColor: '#D97706',
            borderWidth: 1.75,
            borderDash: [5, 5],
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: { family: 'Inter', size: 12, weight: '500' },
              color: '#475569'
            }
          },
          tooltip: {
            backgroundColor: '#0F213A',
            titleFont: { family: 'Manrope', size: 12.5 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} points`
            }
          }
        },
        scales: {
          y: {
            min: 40,
            max: 80,
            grid: { color: '#F1F5F9' },
            ticks: {
              callback: (val) => `${val}`,
              color: '#64748B',
              font: { family: 'Inter', size: 11.5 }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748B',
              font: { family: 'Inter', size: 11.5 }
            }
          }
        }
      }
    });
  }

  function renderSubjectChart(periodData) {
    const canvas = document.getElementById('subjectOverviewChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = periodData.subjects.map((s) => s.name);
    const scores = periodData.subjects.map((s) => s.mean);
    const barColors = scores.map((score) =>
      score < 56 ? '#D97706' : score >= 65 ? '#0F766E' : '#1E406B'
    );

    if (subjectChartInstance) {
      subjectChartInstance.destroy();
    }

    subjectChartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Illustrative Progress Index',
            data: scores,
            backgroundColor: barColors,
            borderRadius: 5,
            barThickness: 16
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F213A',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `Index points: ${ctx.parsed.x}`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { color: '#F1F5F9' },
            ticks: {
              callback: (val) => `${val}`,
              color: '#64748B',
              font: { family: 'Inter', size: 11 }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#0F172A',
              font: { family: 'Inter', size: 11.5, weight: '500' }
            }
          }
        }
      }
    });
  }

  function refreshDashboard() {
    const periodData = getActivePeriodData();
    updateKPIs(periodData);
    renderRecentAssessments(periodData);
    renderEarlyWarnings(periodData);
    renderTrendChart(periodData);
    renderSubjectChart(periodData);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function bindDashboardControls() {
    // Sync selectors with saved state
    yearSelect.value = appState.activePeriod.year;
    termSelect.value = appState.activePeriod.term;

    yearSelect.addEventListener('change', () => {
      appState.activePeriod.year = yearSelect.value;
      EduDataStore.save(appState);
      refreshDashboard();
      showToast(`Loaded ${appState.activePeriod.year} · ${appState.activePeriod.term}`);
    });

    termSelect.addEventListener('change', () => {
      appState.activePeriod.term = termSelect.value;
      EduDataStore.save(appState);
      refreshDashboard();
      showToast(`Switched to ${appState.activePeriod.year} · ${appState.activePeriod.term}`);
    });

    if (streamFilterSelect) {
      streamFilterSelect.addEventListener('change', () => {
        renderTrendChart(getActivePeriodData());
      });
    }

    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        appState = EduDataStore.reset();
        yearSelect.value = appState.activePeriod.year;
        termSelect.value = appState.activePeriod.term;
        if (streamFilterSelect) streamFilterSelect.value = 'all';
        refreshDashboard();
        showToast('Demo dataset restored');
      });
    }
  }

  // Initialize Application
  document.addEventListener('DOMContentLoaded', () => {
    EduNavigation.init((activeRoute) => {
      if (activeRoute === 'overview') {
        refreshDashboard();
      }
    });
    bindDashboardControls();
    refreshDashboard();
  });
})();
