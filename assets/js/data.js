/**
 * EduLongView — Academic Demo Dataset & LocalStorage Persistence Layer
 * Aligned to the Kenya CBC/CBE structure for Grades 1–9; demo records are illustrative.
 */

const EDULONGVIEW_STORAGE_KEY = 'edulongview_state_v2';

const DEFAULT_DEMO_DATA = {
  school: {
    name: 'Kalobeyei Settlement School',
    location: 'Kakuma, Turkana County, Kenya',
    attentionIndexThreshold: 50,
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
          'Grade 1': [54.2, 56.0, 57.5, 58.1, 58.6],
          'Grade 4': [56.5, 58.1, 59.4, 59.8, 60.2],
          'Grade 7': [57.9, 59.4, 60.8, 61.0, 61.2],
          'Grade 9': [58.6, 60.5, 61.9, 61.5, 61.6]
        },
        subjects: [
          { name: 'English', mean: 64.2 },
          { name: 'Kiswahili', mean: 62.8 },
          { name: 'Mathematics', mean: 53.4 },
          { name: 'Integrated Science', mean: 59.1 },
          { name: 'Agriculture', mean: 54.8 },
          { name: 'Pre-Technical Studies', mean: 56.2 },
          { name: 'Social Studies', mean: 66.5 },
          { name: 'Creative Arts and Sports', mean: 63.9 }
        ],
        recentAssessments: [
          { title: 'End-Term 1 Exam', subject: 'Mathematics', classStream: 'Grade 4 East', date: '10 Apr 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'End-Term 1 Exam', subject: 'English', classStream: 'Grade 7 North', date: '09 Apr 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'CAT 2 Practical', subject: 'Integrated Science', classStream: 'Grade 9 West', date: '04 Apr 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'Mid-Term 1 Paper', subject: 'Agriculture', classStream: 'Grade 1 South', date: '21 Mar 2026', mean: 'Evidence recorded', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Amina Hassan Noor',
            admissionNo: 'KSS-2418',
            stream: 'Grade 4 East',
            riskLevel: 'High',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
            attendance: '81%'
          },
          {
            learnerName: 'Deng Kuol Majok',
            admissionNo: 'KSS-2109',
            stream: 'Grade 7 North',
            riskLevel: 'High',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
            attendance: '84%'
          },
          {
            learnerName: 'Grace Akinyi Omondi',
            admissionNo: 'KSS-2504',
            stream: 'Grade 1 South',
            riskLevel: 'Moderate',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
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
          'Grade 1': [58.6, 59.1, 59.5, 60.0, 60.3],
          'Grade 4': [60.2, 60.5, 60.8, 61.0, 61.1],
          'Grade 7': [61.2, 61.8, 62.0, 62.4, 62.7],
          'Grade 9': [61.6, 62.2, 62.5, 62.6, 62.9]
        },
        subjects: [
          { name: 'English', mean: 65.4 },
          { name: 'Kiswahili', mean: 64.1 },
          { name: 'Mathematics', mean: 55.2 },
          { name: 'Integrated Science', mean: 60.8 },
          { name: 'Agriculture', mean: 56.4 },
          { name: 'Pre-Technical Studies', mean: 57.5 },
          { name: 'Social Studies', mean: 67.9 },
          { name: 'Creative Arts and Sports', mean: 66.0 }
        ],
        recentAssessments: [
          { title: 'End-Term 2 Mock', subject: 'Agriculture', classStream: 'Grade 9 West', date: '07 Aug 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'End-Term 2 Exam', subject: 'Mathematics', classStream: 'Grade 7 East', date: '06 Aug 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'CAT 2 Assessment', subject: 'Creative Arts and Sports', classStream: 'Grade 4 North', date: '24 Jul 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'Mid-Term 2 Exam', subject: 'Kiswahili', classStream: 'Grade 1 East', date: '19 Jun 2026', mean: 'Evidence recorded', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Samuel Lokwang Ekeno',
            admissionNo: 'KSS-2287',
            stream: 'Grade 7 East',
            riskLevel: 'High',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
            attendance: '86%'
          },
          {
            learnerName: 'Nyamal Gatluak Riek',
            admissionNo: 'KSS-2341',
            stream: 'Grade 4 West',
            riskLevel: 'Moderate',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
            attendance: '91%'
          },
          {
            learnerName: 'Peter Lokuwam Lopeyok',
            admissionNo: 'KSS-2095',
            stream: 'Grade 9 West',
            riskLevel: 'High',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
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
          'Grade 1': [60.3, 61.5, 62.4, 63.4, 64.2],
          'Grade 4': [61.1, 62.0, 62.9, 63.9, 64.8],
          'Grade 7': [62.7, 63.8, 64.6, 65.5, 66.3],
          'Grade 9': [62.9, 64.3, 65.4, 66.5, 67.2]
        },
        subjects: [
          { name: 'English', mean: 68.4 },
          { name: 'Kiswahili', mean: 66.9 },
          { name: 'Mathematics', mean: 58.6 },
          { name: 'Integrated Science', mean: 63.5 },
          { name: 'Agriculture', mean: 59.2 },
          { name: 'Pre-Technical Studies', mean: 60.8 },
          { name: 'Social Studies', mean: 71.2 },
          { name: 'Creative Arts and Sports', mean: 69.5 }
        ],
        recentAssessments: [
          { title: 'CAT 2 Continuous', subject: 'Mathematics', classStream: 'Grade 7 North', date: '24 Nov 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'CAT 2 Continuous', subject: 'English Paper 2', classStream: 'Grade 9 East', date: '22 Nov 2026', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'CAT 2 Practical', subject: 'Agriculture', classStream: 'Grade 4 South', date: '19 Nov 2026', mean: 'Evidence recorded', status: 'Pending Review' },
          { title: 'Mid-Term 3 Exam', subject: 'Social Studies', classStream: 'Grade 1 West', date: '06 Nov 2026', mean: 'Evidence recorded', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Achol Mabior Garang',
            admissionNo: 'KSS-2314',
            stream: 'Grade 4 North',
            riskLevel: 'High',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
            attendance: '83%'
          },
          {
            learnerName: 'Hassan Abdi Mohamed',
            admissionNo: 'KSS-2452',
            stream: 'Grade 1 East',
            riskLevel: 'High',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
            attendance: '87%'
          },
          {
            learnerName: 'Esther Nakiru Ebei',
            admissionNo: 'KSS-2190',
            stream: 'Grade 7 South',
            riskLevel: 'Moderate',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
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
          'Grade 1': [52.4, 53.8, 54.5, 55.1, 55.8],
          'Grade 4': [54.9, 55.8, 56.4, 57.0, 57.4],
          'Grade 7': [56.1, 57.0, 57.9, 58.3, 58.9],
          'Grade 9': [56.6, 57.8, 58.8, 59.2, 59.6]
        },
        subjects: [
          { name: 'English', mean: 61.5 },
          { name: 'Kiswahili', mean: 60.2 },
          { name: 'Mathematics', mean: 50.8 },
          { name: 'Integrated Science', mean: 56.4 },
          { name: 'Agriculture', mean: 52.1 },
          { name: 'Pre-Technical Studies', mean: 53.7 },
          { name: 'Social Studies', mean: 64.8 },
          { name: 'Creative Arts and Sports', mean: 62.1 }
        ],
        recentAssessments: [
          { title: 'End-Term 1 Archive', subject: 'Mathematics', classStream: 'All Streams', date: '11 Apr 2025', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'End-Term 1 Archive', subject: 'English', classStream: 'All Streams', date: '10 Apr 2025', mean: 'Evidence recorded', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Archived Cohort Summary',
            admissionNo: '2025-T1',
            stream: 'Grade 1 – Grade 9',
            riskLevel: 'Moderate',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
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
          'Grade 1': [55.8, 56.1, 56.5, 56.8, 57.0],
          'Grade 4': [57.4, 57.7, 58.1, 58.4, 58.6],
          'Grade 7': [58.9, 59.2, 59.6, 59.9, 60.1],
          'Grade 9': [59.6, 59.9, 60.2, 60.5, 60.7]
        },
        subjects: [
          { name: 'English', mean: 62.7 },
          { name: 'Kiswahili', mean: 61.4 },
          { name: 'Mathematics', mean: 52.0 },
          { name: 'Integrated Science', mean: 57.8 },
          { name: 'Agriculture', mean: 53.5 },
          { name: 'Pre-Technical Studies', mean: 54.9 },
          { name: 'Social Studies', mean: 65.9 },
          { name: 'Creative Arts and Sports', mean: 63.4 }
        ],
        recentAssessments: [
          { title: 'End-Term 2 Archive', subject: 'Agriculture', classStream: 'All Streams', date: '08 Aug 2025', mean: 'Evidence recorded', status: 'Verified' },
          { title: 'End-Term 2 Archive', subject: 'Integrated Science', classStream: 'All Streams', date: '07 Aug 2025', mean: 'Evidence recorded', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Archived Cohort Summary',
            admissionNo: '2025-T2',
            stream: 'Grade 1 – Grade 9',
            riskLevel: 'Moderate',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
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
          'Grade 1': [57.0, 57.6, 58.2, 58.7, 59.1],
          'Grade 4': [58.6, 59.2, 59.8, 60.2, 60.6],
          'Grade 7': [60.1, 60.8, 61.3, 61.8, 62.2],
          'Grade 9': [60.7, 61.6, 62.0, 62.5, 62.9]
        },
        subjects: [
          { name: 'English', mean: 64.5 },
          { name: 'Kiswahili', mean: 63.0 },
          { name: 'Mathematics', mean: 54.1 },
          { name: 'Integrated Science', mean: 59.6 },
          { name: 'Agriculture', mean: 55.2 },
          { name: 'Pre-Technical Studies', mean: 56.8 },
          { name: 'Social Studies', mean: 67.4 },
          { name: 'Creative Arts and Sports', mean: 65.1 }
        ],
        recentAssessments: [
          { title: 'End-Term 3 Annual Exam', subject: 'All Core Subjects', classStream: 'Grade 1 – Grade 7', date: '21 Nov 2025', mean: 'Evidence recorded', status: 'Verified' }
        ],
        earlyWarnings: [
          {
            learnerName: 'Archived Cohort Summary',
            admissionNo: '2025-T3',
            stream: 'Grade 1 – Grade 7',
            riskLevel: 'Moderate',
            reason: 'Teacher review is recommended based on the available demo learning evidence and learner-support context.',
            currentMean: 'Needs teacher review',
            attendance: '91%'
          }
        ]
      }
    }
  }
};


// Kenya CBC/CBE curriculum reference structure. Learning areas are grouped by grade band;
// schools can configure optional language and religious-education choices.
const KENYA_CBC_CURRICULUM = {
  country: 'Kenya',
  framework: 'CBC/CBE',
  grades: Array.from({ length: 9 }, (_, index) => index + 1),
  stages: [
    { name: 'Lower Primary', grades: [1, 2, 3] },
    { name: 'Upper Primary', grades: [4, 5, 6] },
    { name: 'Junior School', grades: [7, 8, 9] }
  ],
  coreCompetencies: [
    'Communication and Collaboration',
    'Critical Thinking and Problem Solving',
    'Creativity and Imagination',
    'Citizenship',
    'Digital Literacy',
    'Learning to Learn',
    'Self-efficacy'
  ],
  learningAreasByStage: {
    'Lower Primary': [
      'English', 'Kiswahili', 'Mathematics', 'Environmental Activities',
      'Creative Activities', 'Religious Education', 'Indigenous Language'
    ],
    'Upper Primary': [
      'English', 'Kiswahili', 'Mathematics', 'Science and Technology',
      'Agriculture', 'Social Studies', 'Creative Arts', 'Religious Education',
      'Indigenous Language', 'Foreign Languages'
    ],
    'Junior School': [
      'English', 'Kiswahili', 'Mathematics', 'Integrated Science',
      'Social Studies', 'Agriculture', 'Pre-Technical Studies',
      'Creative Arts and Sports', 'Religious Education',
      'Indigenous Language', 'Foreign Languages'
    ]
  },
  assessmentDimensions: [
    'Knowledge and Understanding',
    'Skills and Competencies',
    'Values and Attitudes',
    'Application of Learning'
  ],
  demoNotice: 'Sample dashboard indicators are illustrative and are not official CBC achievement levels or national assessment grades.'
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
