export type Program = {
  slug: string
  title: string
  category: string // profession slug
  categoryLabel: string
  level: 'Certificate' | 'Diploma' | 'Postgraduate Diploma' | 'CPD Course'
  programme?: string
  mode: 'Online' | 'Hybrid' | 'In-Person'
  duration: string
  feesKsh: number
  summary: string
  outcomes: string[]
  featured?: boolean
  image?: string
}

export const PROGRAMS: Program[] = [
  {
    slug: 'mtm-pharmacists',
    title: 'Medication Therapy Management for Pharmacists',
    category: 'pharmacists',
    categoryLabel: 'Pharmacists',
    level: 'Certificate',
    programme: 'MTM courses',
    mode: 'Online',
    duration: '6 months',
    feesKsh: 45000,
    summary: 'MTM-focused coursework tailored for practising pharmacists.',
    outcomes: ['Comprehensive medication reviews', 'Patient-centred care plans', 'MTM documentation'],
    featured: false,
  },
  {
    slug: 'mtm-pharmaceutical-technologists',
    title: 'Medication Therapy Management for Pharmaceutical Technologists',
    category: 'pharmaceutical-technologists',
    categoryLabel: 'Pharmaceutical Technologists',
    level: 'Certificate',
    programme: 'MTM courses',
    mode: 'Online',
    duration: '6 months',
    feesKsh: 42000,
    summary: 'MTM adaptations for technologists working across formulation and quality assurance.',
    outcomes: ['Medicines optimisation', 'Quality-focused MTM', 'Interprofessional collaboration'],
    featured: false,
  },
  {
    slug: 'mtm-technicians',
    title: 'Medication Therapy Management for Pharmaceutical Technicians',
    category: 'pharmaceutical-technicians',
    categoryLabel: 'Pharmaceutical Technicians',
    level: 'Certificate',
    programme: 'MTM courses',
    mode: 'Online',
    duration: '4 months',
    feesKsh: 30000,
    summary: 'Practical MTM skills for dispensing technicians and frontline pharmacy staff.',
    outcomes: ['Safe dispensing practices', 'Basic MTM interventions', 'Patient counselling'],
    featured: false,
  },
  {
    slug: 'mtm-clinicians',
    title: 'Medication Therapy Management for Clinicians',
    category: 'clinicians',
    categoryLabel: 'Clinicians',
    level: 'CPD Course',
    programme: 'Professional Development Courses',
    mode: 'Online',
    duration: '4 weeks',
    feesKsh: 18000,
    summary: 'Short, practical CPD for clinicians on medication safety and optimisation.',
    outcomes: ['Recognise high-risk prescribing', 'Apply stewardship principles', 'Improve prescribing safety'],
    featured: false,
  },
  {
    slug: 'mtm-physicians',
    title: 'Medication Therapy Management for Physicians',
    category: 'physicians',
    categoryLabel: 'Physicians',
    level: 'CPD Course',
    programme: 'Professional Development Courses',
    mode: 'Online',
    duration: '5 weeks',
    feesKsh: 24000,
    summary: 'Focused MTM practice for prescribing physicians to support therapeutic optimisation.',
    outcomes: ['Therapeutic optimisation', 'Interprofessional collaboration', 'Complex case management'],
    featured: false,
  },
  {
    slug: 'mtm-nurses',
    title: 'Medication Therapy Management for Nurses',
    category: 'nurses',
    categoryLabel: 'Nurses',
    level: 'Certificate',
    programme: 'MTM courses',
    mode: 'Online',
    duration: '6 weeks',
    feesKsh: 22000,
    summary: 'Practical MTM and adherence counselling skills for nursing practice.',
    outcomes: ['Adherence counselling', 'Medication safety checks', 'Patient education'],
    featured: false,
  },
  {
    slug: 'mtm-foundations-certificate',
    title: 'MTM Foundations Certificate',
    category: 'pharmacists',
    categoryLabel: 'Pharmacists',
    level: 'Certificate',
    programme: 'MTM courses',
    mode: 'Online',
    duration: '8 weeks',
    feesKsh: 28000,
    summary:
      'Build a solid grounding in medication therapy management principles, patient assessment, and care planning.',
    outcomes: [
      'Conduct comprehensive medication reviews',
      'Develop patient-centred care plans',
      'Document MTM interventions effectively',
    ],
    featured: true,
    image: '/images/MTM_for_Pharmacists.png',
  },
  {
    slug: 'clinical-pharmacy-diploma',
    title: 'Clinical Pharmacy Diploma',
    category: 'pharmacists',
    categoryLabel: 'Pharmacists',
    level: 'Diploma',
    programme: 'Diploma courses',
    mode: 'Hybrid',
    duration: '12 months',
    feesKsh: 145000,
    summary:
      'An in-depth clinical programme preparing pharmacists for advanced ward-based and ambulatory care roles.',
    outcomes: [
      'Lead therapeutic drug monitoring',
      'Optimise complex medication regimens',
      'Collaborate within multidisciplinary teams',
    ],
    featured: true,
    image: '/images/clinical_pharmacy.png',
  },
  {
    slug: 'postgraduate-diploma-mtm',
    title: 'Postgraduate Diploma in MTM',
    category: 'pharmacists',
    categoryLabel: 'Pharmacists',
    level: 'Postgraduate Diploma',
    programme: 'Diploma courses',
    mode: 'Hybrid',
    duration: '18 months',
    feesKsh: 320000,
    summary:
      'Our flagship postgraduate pathway for clinical leaders driving medication safety at a systems level.',
    outcomes: [
      'Design medication safety programmes',
      'Lead clinical governance initiatives',
      'Conduct practice-based research',
    ],
    featured: true,
    image: '/images/Pharmaceutical_care.png',
  },
  {
    slug: 'medication-safety-clinicians',
    title: 'Medication Safety for Clinicians',
    category: 'clinicians',
    categoryLabel: 'Clinicians',
    level: 'CPD Course',
    programme: 'Professional Development Courses',
    mode: 'Online',
    duration: '4 weeks',
    feesKsh: 18000,
    summary:
      'A focused CPD course equipping clinicians with practical medication safety and prescribing tools.',
    outcomes: [
      'Identify high-risk prescribing patterns',
      'Apply safe prescribing frameworks',
      'Reduce preventable medication harm',
    ],
    featured: true,
    image: '/images/MTM_for_Clinicians.png',
  },
  {
    slug: 'adherence-nursing-certificate',
    title: 'Medication Adherence for Nurses',
    category: 'nurses',
    categoryLabel: 'Nurses',
    level: 'Certificate',
    programme: 'Certificate courses',
    mode: 'Online',
    duration: '6 weeks',
    feesKsh: 22000,
    summary:
      'Practical adherence counselling and medication management skills tailored for nursing practice.',
    outcomes: [
      'Deliver effective adherence counselling',
      'Support safe medication administration',
      'Educate patients on therapy plans',
    ],
    image: '/images/MTM_for_Nurses.png',
  },
  {
    slug: 'dispensing-technicians-certificate',
    title: 'Advanced Dispensing Certificate',
    category: 'pharmaceutical-technicians',
    categoryLabel: 'Pharmaceutical Technicians',
    level: 'Certificate',
    programme: 'Certificate courses',
    mode: 'In-Person',
    duration: '10 weeks',
    feesKsh: 26000,
    summary:
      'Strengthen dispensing accuracy, inventory practice, and patient interaction for technicians.',
    outcomes: [
      'Apply accurate dispensing protocols',
      'Manage pharmaceutical inventory',
      'Support pharmaceutical care delivery',
    ],
    image: '/images/MTM_for_Pharmaceutical Technicians.jpg',
  },
  {
    slug: 'pharmaceutical-technology-diploma',
    title: 'Pharmaceutical Technology Diploma',
    category: 'pharmaceutical-technologists',
    categoryLabel: 'Pharmaceutical Technologists',
    level: 'Diploma',
    programme: 'Diploma courses',
    mode: 'Hybrid',
    duration: '12 months',
    feesKsh: 138000,
    summary:
      'Technical mastery across formulation, quality, and the medicines management chain.',
    outcomes: [
      'Apply quality assurance standards',
      'Support formulation and compounding',
      'Manage the medicines supply chain',
    ],
    image: '/images/MTM_for_Pharmaceutical Technologists.png',
  },
  {
    slug: 'collaborative-prescribing-physicians',
    title: 'Collaborative Prescribing for Physicians',
    category: 'physicians',
    categoryLabel: 'Physicians',
    level: 'CPD Course',
    programme: 'Professional Development Courses',
    mode: 'Online',
    duration: '5 weeks',
    feesKsh: 24000,
    summary:
      'Therapeutic optimisation and collaborative MTM practice for prescribing physicians.',
    outcomes: [
      'Integrate MTM into clinical workflows',
      'Optimise therapy in complex patients',
      'Collaborate with pharmacy teams',
    ],
    image: '/images/MTM_for_Physicians.png',
  },
]

export function formatKsh(amount: number) {
  return `KSH ${amount.toLocaleString('en-KE')}`
}
