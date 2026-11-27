/**
 * EduLongView — Academic Demo Dataset & LocalStorage Persistence Layer
 * Contextualized for secondary schools in Kakuma & Kalobeyei, Turkana County, Kenya.
 */

const EDULONGVIEW_STORAGE_KEY = 'edulongview_state_v1';

const DEFAULT_DEMO_DATA = {
  school: {
    name: 'Kalobeyei Settlement Secondary School',
    location: 'Kakuma, Turkana County, Kenya',
    passThreshold: 50,
    targetBenchmark: 60,
    dropAlertThreshold: 12
  },
  activePeriod: {
    year: '2026',
    term: 'Term 3'
  },
  periods: {
    '2026': {
      'Term 1': {
        kpis: {
          totalLearners: 492,
          learnersMeta: '12 active streams · 93.4% attendance',
          avgPerformance: 60.4,
          avgDelta: '+1.2% baseline entry',
          totalAssessments: 36,
          assessmentsMeta: 'Opener, Mid-Term & End-Term 1',
          flaggedLearners: 38,
          flaggedMeta: 'Below 50% mean or >12% term drop'
        },
        trendLabels: ['Entry Baseline', 'CAT 1 (Feb)', 'Mid-Term 1 (Mar)', 'CAT 2 (Mar)', 'End-Term 1 (Apr)'],
        trends: {
          'all': [56.8, 58.5, 59.9, 60.1, 60.4],
          'Form 1': [54.2, 56.0, 57.5, 58.1, 58.6],
          'Form 2': [56.5, 58.1, 59.4, 59.8, 60.2],
          'Form 3': [57.9, 59.4, 60.8, 61.0, 61.2],
          'Form 4': [58.6, 60.5, 61.9, 61.5, 61.6]
        },
        subjects: [
          { name: 'English', mean: 64.2 },
          { name: 'Kiswahili', mean: 62.8 },
          { name: 'Mathematics', mean: 53.4 },
          { name: 'Biology', mean: 59.1 },
          { name: 'Chemistry', mean: 54.8 },
          { name: 'Physics', mean: 56.2 },
          { name: 'History & Gov', mean: 66.5 },
          { name: 'Geography', mean: 63.9 }
        ],
        recentAssessments: [
          { title: 'End-Term 1 Exam', subject: 'Mathematics', classStream: 'Form 2 East', date: '10 Apr 2026', mean: '54.2%', status: 'Verified' },
          { title: 'End-Term 1 Exam', subject: 'English', classStream: 'Form 3 North', date: '09 Apr 2026', mean: '65.8%', status: 'Verified' },
          { title: 'CAT 2 Practical', subject: 'Biology', classStream: 'Form 4 West', date: '04 Apr 2026', mean: '61.0%', status: 'Verified' },
          { title: 'Mid-Term 1 Paper', subject: 'Chemistry', classStream: 'Form 1 South', date: '21 Mar 2026', mean: '52.9%', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Amina Hassan Noor',
            admissionNo: 'KSS-2418',
            stream: 'Form 2 East',
            riskLevel: 'High',
            reason: 'Mean dropped by 16.4% between CAT 1 and End-Term 1; weak scores in Mathematics (38%) and Chemistry (41%).',
            currentMean: '44.2%',
            attendance: '81%'
          },
          {
            learnerName: 'Deng Kuol Majok',
            admissionNo: 'KSS-2109',
            stream: 'Form 3 North',
            riskLevel: 'High',
            reason: 'Below 50% benchmark across 4 core subjects following 6 days of illness absence in March.',
            currentMean: '46.5%',
            attendance: '84%'
          },
          {
            learnerName: 'Grace Akinyi Omondi',
            admissionNo: 'KSS-2504',
            stream: 'Form 1 South',
            riskLevel: 'Moderate',
            reason: 'Steep downward trajectory in Physics (-14.0%) and Mathematics (-11.5%) since entry baseline.',
            currentMean: '49.8%',
            attendance: '92%'
          }
        ]
      },
      'Term 2': {
        kpis: {
          totalLearners: 489,
          learnersMeta: '12 active streams · 93.9% attendance',
          avgPerformance: 61.7,
          avgDelta: '+1.3% vs Term 1',
          totalAssessments: 36,
          assessmentsMeta: 'CAT 1, Mid-Term 2 & End-Term 2',
          flaggedLearners: 33,
          flaggedMeta: 'Below 50% mean or >12% term drop'
        },
        trendLabels: ['Term 1 Carryover', 'CAT 1 (May)', 'Mid-Term 2 (Jun)', 'CAT 2 (Jul)', 'End-Term 2 (Aug)'],
        trends: {
          'all': [60.4, 60.9, 61.2, 61.5, 61.7],
          'Form 1': [58.6, 59.1, 59.5, 60.0, 60.3],
          'Form 2': [60.2, 60.5, 60.8, 61.0, 61.1],
          'Form 3': [61.2, 61.8, 62.0, 62.4, 62.7],
          'Form 4': [61.6, 62.2, 62.5, 62.6, 62.9]
        },
        subjects: [
          { name: 'English', mean: 65.4 },
          { name: 'Kiswahili', mean: 64.1 },
          { name: 'Mathematics', mean: 55.2 },
          { name: 'Biology', mean: 60.8 },
          { name: 'Chemistry', mean: 56.4 },
          { name: 'Physics', mean: 57.5 },
          { name: 'History & Gov', mean: 67.9 },
          { name: 'Geography', mean: 66.0 }
        ],
        recentAssessments: [
          { title: 'End-Term 2 Mock', subject: 'Chemistry', classStream: 'Form 4 West', date: '07 Aug 2026', mean: '57.8%', status: 'Verified' },
          { title: 'End-Term 2 Exam', subject: 'Mathematics', classStream: 'Form 3 East', date: '06 Aug 2026', mean: '56.1%', status: 'Verified' },
          { title: 'CAT 2 Assessment', subject: 'Geography', classStream: 'Form 2 North', date: '24 Jul 2026', mean: '66.4%', status: 'Verified' },
          { title: 'Mid-Term 2 Exam', subject: 'Kiswahili', classStream: 'Form 1 East', date: '19 Jun 2026', mean: '63.5%', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Samuel Lokwang Ekeno',
            admissionNo: 'KSS-2287',
            stream: 'Form 3 East',
            riskLevel: 'High',
            reason: 'Consecutive declines across CAT 1 (55%) and End-Term 2 (42%) in Mathematics and Physics.',
            currentMean: '45.1%',
            attendance: '86%'
          },
          {
            learnerName: 'Nyamal Gatluak Riek',
            admissionNo: 'KSS-2341',
            stream: 'Form 2 West',
            riskLevel: 'Moderate',
            reason: 'Science cluster average fell 13.2% below Term 1 performance despite steady humanities marks.',
            currentMean: '49.4%',
            attendance: '91%'
          },
          {
            learnerName: 'Peter Lokuwam Lopeyok',
            admissionNo: 'KSS-2095',
            stream: 'Form 4 West',
            riskLevel: 'High',
            reason: 'Candidate mock aggregate dropped 14.0% in Chemistry (36%) and Biology (42%).',
            currentMean: '46.8%',
            attendance: '88%'
          }
        ]
      },
      'Term 3': {
        kpis: {
          totalLearners: 486,
          learnersMeta: '12 active streams · 94.2% attendance',
          avgPerformance: 64.8,
          avgDelta: '+3.1% vs Term 2',
          totalAssessments: 36,
          assessmentsMeta: 'CAT 1, Mid-Term & CAT 2 completed',
          flaggedLearners: 29,
          flaggedMeta: 'Below 50% mean or >12% term drop'
        },
        trendLabels: ['Term 2 Carryover', 'CAT 1 (Sep)', 'Mid-Term 3 (Oct)', 'CAT 2 (Nov)', 'Projected Final'],
        trends: {
          'all': [61.7, 62.9, 63.8, 64.8, 65.6],
          'Form 1': [60.3, 61.5, 62.4, 63.4, 64.2],
          'Form 2': [61.1, 62.0, 62.9, 63.9, 64.8],
          'Form 3': [62.7, 63.8, 64.6, 65.5, 66.3],
          'Form 4': [62.9, 64.3, 65.4, 66.5, 67.2]
        },
        subjects: [
          { name: 'English', mean: 68.4 },
          { name: 'Kiswahili', mean: 66.9 },
          { name: 'Mathematics', mean: 58.6 },
          { name: 'Biology', mean: 63.5 },
          { name: 'Chemistry', mean: 59.2 },
          { name: 'Physics', mean: 60.8 },
          { name: 'History & Gov', mean: 71.2 },
          { name: 'Geography', mean: 69.5 }
        ],
        recentAssessments: [
          { title: 'CAT 2 Continuous', subject: 'Mathematics', classStream: 'Form 3 North', date: '24 Nov 2026', mean: '59.4%', status: 'Verified' },
          { title: 'CAT 2 Continuous', subject: 'English Paper 2', classStream: 'Form 4 East', date: '22 Nov 2026', mean: '69.1%', status: 'Verified' },
          { title: 'CAT 2 Practical', subject: 'Chemistry', classStream: 'Form 2 South', date: '19 Nov 2026', mean: '58.7%', status: 'Pending Review' },
          { title: 'Mid-Term 3 Exam', subject: 'History & Gov', classStream: 'Form 1 West', date: '06 Nov 2026', mean: '72.0%', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Achol Mabior Garang',
            admissionNo: 'KSS-2314',
            stream: 'Form 2 North',
            riskLevel: 'High',
            reason: 'Overall mean declined 15.2% from Mid-Term 3 (58%) to CAT 2 (42.8%); flagged in Mathematics & Physics.',
            currentMean: '44.6%',
            attendance: '83%'
          },
          {
            learnerName: 'Hassan Abdi Mohamed',
            admissionNo: 'KSS-2452',
            stream: 'Form 1 East',
            riskLevel: 'High',
            reason: 'Scored below 45% in three consecutive STEM assessments (Mathematics 39%, Chemistry 41%, Biology 44%).',
            currentMean: '46.1%',
            attendance: '87%'
          },
          {
            learnerName: 'Esther Nakiru Ebei',
            admissionNo: 'KSS-2190',
            stream: 'Form 3 South',
            riskLevel: 'Moderate',
            reason: '12.6% drop in English and Kiswahili composition scores compared to Term 2 average.',
            currentMean: '49.5%',
            attendance: '94%'
          }
        ]
      }
    },
    '2025': {
      'Term 1': {
        kpis: {
          totalLearners: 464,
          learnersMeta: '12 active streams · 91.8% attendance',
          avgPerformance: 57.9,
          avgDelta: '2025 Term 1 archive',
          totalAssessments: 36,
          assessmentsMeta: 'Archived term records',
          flaggedLearners: 44,
          flaggedMeta: 'Below 50% mean or >12% term drop'
        },
        trendLabels: ['Entry Baseline', 'CAT 1', 'Mid-Term 1', 'CAT 2', 'End-Term 1'],
        trends: {
          'all': [55.0, 56.1, 56.9, 57.4, 57.9],
          'Form 1': [52.4, 53.8, 54.5, 55.1, 55.8],
          'Form 2': [54.9, 55.8, 56.4, 57.0, 57.4],
          'Form 3': [56.1, 57.0, 57.9, 58.3, 58.9],
          'Form 4': [56.6, 57.8, 58.8, 59.2, 59.6]
        },
        subjects: [
          { name: 'English', mean: 61.5 },
          { name: 'Kiswahili', mean: 60.2 },
          { name: 'Mathematics', mean: 50.8 },
          { name: 'Biology', mean: 56.4 },
          { name: 'Chemistry', mean: 52.1 },
          { name: 'Physics', mean: 53.7 },
          { name: 'History & Gov', mean: 64.8 },
          { name: 'Geography', mean: 62.1 }
        ],
        recentAssessments: [
          { title: 'End-Term 1 Archive', subject: 'Mathematics', classStream: 'All Streams', date: '11 Apr 2025', mean: '50.8%', status: 'Verified' },
          { title: 'End-Term 1 Archive', subject: 'English', classStream: 'All Streams', date: '10 Apr 2025', mean: '61.5%', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Archived Cohort Summary',
            admissionNo: '2025-T1',
            stream: 'Form 1 – Form 4',
            riskLevel: 'Moderate',
            reason: '44 learners received remedial peer-tutoring support in Mathematics and Chemistry during Term 2 2025.',
            currentMean: '47.2%',
            attendance: '89%'
          }
        ]
      },
      'Term 2': {
        kpis: {
          totalLearners: 468,
          learnersMeta: '12 active streams · 92.4% attendance',
          avgPerformance: 59.1,
          avgDelta: '+1.2% vs Term 1 2025',
          totalAssessments: 36,
          assessmentsMeta: 'Archived term records',
          flaggedLearners: 40,
          flaggedMeta: 'Below 50% mean or >12% term drop'
        },
        trendLabels: ['Term 1 Carryover', 'CAT 1', 'Mid-Term 2', 'CAT 2', 'End-Term 2'],
        trends: {
          'all': [57.9, 58.2, 58.6, 58.9, 59.1],
          'Form 1': [55.8, 56.1, 56.5, 56.8, 57.0],
          'Form 2': [57.4, 57.7, 58.1, 58.4, 58.6],
          'Form 3': [58.9, 59.2, 59.6, 59.9, 60.1],
          'Form 4': [59.6, 59.9, 60.2, 60.5, 60.7]
        },
        subjects: [
          { name: 'English', mean: 62.7 },
          { name: 'Kiswahili', mean: 61.4 },
          { name: 'Mathematics', mean: 52.0 },
          { name: 'Biology', mean: 57.8 },
          { name: 'Chemistry', mean: 53.5 },
          { name: 'Physics', mean: 54.9 },
          { name: 'History & Gov', mean: 65.9 },
          { name: 'Geography', mean: 63.4 }
        ],
        recentAssessments: [
          { title: 'End-Term 2 Archive', subject: 'Chemistry', classStream: 'All Streams', date: '08 Aug 2025', mean: '53.5%', status: 'Verified' },
          { title: 'End-Term 2 Archive', subject: 'Biology', classStream: 'All Streams', date: '07 Aug 2025', mean: '57.8%', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Archived Cohort Summary',
            admissionNo: '2025-T2',
            stream: 'Form 1 – Form 4',
            riskLevel: 'Moderate',
            reason: '40 learners flagged in 2025 Term 2 archive; 78% improved above 50% by End-Term 3.',
            currentMean: '48.0%',
            attendance: '90%'
          }
        ]
      },
      'Term 3': {
        kpis: {
          totalLearners: 470,
          learnersMeta: '12 active streams · 93.1% attendance',
          avgPerformance: 61.2,
          avgDelta: '+2.1% vs Term 2 2025',
          totalAssessments: 36,
          assessmentsMeta: 'Archived annual close',
          flaggedLearners: 34,
          flaggedMeta: 'Below 50% mean or >12% term drop'
        },
        trendLabels: ['Term 2 Carryover', 'CAT 1', 'Mid-Term 3', 'CAT 2', 'End-Term 3'],
        trends: {
          'all': [59.1, 59.8, 60.3, 60.8, 61.2],
          'Form 1': [57.0, 57.6, 58.2, 58.7, 59.1],
          'Form 2': [58.6, 59.2, 59.8, 60.2, 60.6],
          'Form 3': [60.1, 60.8, 61.3, 61.8, 62.2],
          'Form 4': [60.7, 61.6, 62.0, 62.5, 62.9]
        },
        subjects: [
          { name: 'English', mean: 64.5 },
          { name: 'Kiswahili', mean: 63.0 },
          { name: 'Mathematics', mean: 54.1 },
          { name: 'Biology', mean: 59.6 },
          { name: 'Chemistry', mean: 55.2 },
          { name: 'Physics', mean: 56.8 },
          { name: 'History & Gov', mean: 67.4 },
          { name: 'Geography', mean: 65.1 }
        ],
        recentAssessments: [
          { title: 'End-Term 3 Annual Exam', subject: 'All Core Subjects', classStream: 'Form 1 – Form 3', date: '21 Nov 2025', mean: '61.2%', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Archived Cohort Summary',
            admissionNo: '2025-T3',
            stream: 'Form 1 – Form 3',
            riskLevel: 'Moderate',
            reason: '34 learners carried forward into 2026 Term 1 academic mentorship watchlist.',
            currentMean: '48.4%',
            attendance: '91%'
          }
        ]
      }
    }
  }
};

const EduDataStore = {
  load() {
    try {
      const raw = localStorage.getItem(EDULONGVIEW_STORAGE_KEY);
      if (!raw) {
        this.save(DEFAULT_DEMO_DATA);
        return structuredClone(DEFAULT_DEMO_DATA);
      }
      return JSON.parse(raw);
    } catch (err) {
      console.warn('LocalStorage unavailable, using in-memory demo data:', err);
      return structuredClone(DEFAULT_DEMO_DATA);
    }
  },

  save(state) {
    try {
      localStorage.setItem(EDULONGVIEW_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Unable to persist state to LocalStorage:', err);
    }
  },

  reset() {
    const fresh = structuredClone(DEFAULT_DEMO_DATA);
    this.save(fresh);
    return fresh;
  }
};
