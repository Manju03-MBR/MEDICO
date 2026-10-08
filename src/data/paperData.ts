import { CohortType, PatientProfile } from '../types/clinical';
export type { CohortType };

export interface PaperMeta {
  title: string;
  journal: string;
  volume: number;
  year: number;
  pages: string;
  doi: string;
  dates: {
    received: string;
    accepted: string;
    published: string;
    currentVersion: string;
  };
  author: {
    name: string;
    membership: string;
    affiliation: string;
    email: string;
    laboratory: string;
  };
}

export const PAPER_METADATA: PaperMeta = {
  title: 'Drug and Dosage Recommendation Based on Explainable Generative AI Using Patient-Specific Modeling',
  journal: 'IEEE Access',
  volume: 14,
  year: 2026,
  pages: '14965-14984',
  doi: '10.1109/ACCESS.2026.3657398',
  dates: {
    received: '5 November 2025',
    accepted: '20 January 2026',
    published: '23 January 2026',
    currentVersion: '30 January 2026',
  },
  author: {
    name: 'Evren Daglarli',
    membership: 'Senior Member, IEEE',
    affiliation: 'Faculty of Computer and Informatics Engineering, Istanbul Technical University, Maslak, 34469 Istanbul, Türkiye',
    email: 'evren.daglarli@itu.edu.tr',
    laboratory: 'Cognitive Systems Laboratory & ITUAI (Artificial Intelligence and Data Science Research Center)',
  },
};

// Table 1: The number of samples by cohort (ADR-20K)
export const COHORT_SAMPLES: Record<CohortType, { count: number; percentage: number; description: string }> = {
  Hypertension: {
    count: 5011,
    percentage: 25.02,
    description: 'Patients managed with antihypertensives (ACE inhibitors, ARBs, beta-blockers, CCBs, diuretics)',
  },
  'Diabetes Mellitus': {
    count: 5038,
    percentage: 25.15,
    description: 'Type 2 and Type 1 diabetic patients on metformin, sulfonylureas, SGLT2 inhibitors, GLP-1 RAs, insulin',
  },
  Oncology: {
    count: 4987,
    percentage: 24.90,
    description: 'Chemotherapy and targeted oncology regimens with narrow therapeutic indices and organ toxicity risks',
  },
  'Renal Impairment': {
    count: 4994,
    percentage: 24.93,
    description: 'Chronic kidney disease stages 2–5 with compromised drug clearance and polypharmacy vulnerability',
  },
  Polypharmacy: {
    count: 3820,
    percentage: 19.07,
    description: 'Cross-cohort multi-morbid patients consuming 5+ concomitant medications with elevated drug interaction risks',
  },
};

export const DATASET_COMPOSITION = {
  totalPatients: 20030,
  realEhrCount: 15023,
  realEhrPercentage: 75.0,
  syntheticCount: 5007,
  syntheticPercentage: 25.0,
  splitStrategy: 'Patient-level splits with temporal blocking (6–24 months) to eliminate leakage',
  fidelityMetrics: 'Two-sided KS tests (p ≥ 0.05), Chi-squared, and MMD² ≤ τ_null on latent encoder space (2,000 permutations)',
};

// Table 3: Dosage recommendation accuracy (Mean Absolute Error, mg/day)
export const TABLE_3_MAE = [
  { cohort: 'Hypertension', standardMAE: 5.6, proposedMAE: 4.3, delta: -1.3, improvement: 23.2 },
  { cohort: 'Diabetes Mellitus', standardMAE: 4.9, proposedMAE: 4.0, delta: -0.9, improvement: 18.4 },
  { cohort: 'Oncology', standardMAE: 6.2, proposedMAE: 5.1, delta: -1.1, improvement: 17.7 },
  { cohort: 'Renal Impairment Cases', standardMAE: 7.4, proposedMAE: 6.1, delta: -1.3, improvement: 17.6 },
  { cohort: 'Average', standardMAE: 6.0, proposedMAE: 4.9, delta: -1.1, improvement: 18.3 },
];

// Table 4: Adverse drug reaction (ADR) detection (AUC-ROC)
export const TABLE_4_AUC = [
  { cohort: 'Hypertension', standardAUC: 0.78, proposedAUC: 0.88, gain: 0.10 },
  { cohort: 'Diabetes Mellitus', standardAUC: 0.79, proposedAUC: 0.89, gain: 0.10 },
  { cohort: 'Oncology', standardAUC: 0.77, proposedAUC: 0.90, gain: 0.13 },
  { cohort: 'Renal Impairment Cases', standardAUC: 0.76, proposedAUC: 0.87, gain: 0.11 },
  { cohort: 'Average', standardAUC: 0.78, proposedAUC: 0.89, gain: 0.11 },
];

// Table 5: Comprehensive performance of AI-driven and rule-based models
export interface ModelComparisonRow {
  cohort: string;
  model: string;
  mae: number;
  adrRate: number;
  convSteps: number;
  ece: number;
  clinicianTrust: number;
  shapAuc: number;
}

export const TABLE_5_MODELS: ModelComparisonRow[] = [
  // Diabetes
  { cohort: 'Diabetes', model: 'Rule-Based', mae: 8.2472, adrRate: 0.1760, convSteps: 6, ece: 0.0867, clinicianTrust: 3.7162, shapAuc: 0.7445 },
  { cohort: 'Diabetes', model: 'DNN', mae: 6.5998, adrRate: 0.1367, convSteps: 4, ece: 0.0760, clinicianTrust: 3.8496, shapAuc: 0.7020 },
  { cohort: 'Diabetes', model: 'LLM-Only', mae: 11.8194, adrRate: 0.1665, convSteps: 5, ece: 0.0403, clinicianTrust: 4.1904, shapAuc: 0.7617 },
  { cohort: 'Diabetes', model: 'Transformer w/o GAN', mae: 9.6699, adrRate: 0.1005, convSteps: 4, ece: 0.0574, clinicianTrust: 3.7342, shapAuc: 0.7139 },
  { cohort: 'Diabetes', model: 'Proposed Full XAI Model', mae: 3.9382, adrRate: 0.0609, convSteps: 3, ece: 0.0218, clinicianTrust: 4.6473, shapAuc: 0.8767 },

  // Hypertension
  { cohort: 'Hypertension', model: 'Rule-Based', mae: 11.8993, adrRate: 0.1373, convSteps: 4, ece: 0.0764, clinicianTrust: 3.2046, shapAuc: 0.7065 },
  { cohort: 'Hypertension', model: 'DNN', mae: 11.6933, adrRate: 0.1772, convSteps: 5, ece: 0.0631, clinicianTrust: 3.0191, shapAuc: 0.7230 },
  { cohort: 'Hypertension', model: 'LLM-Only', mae: 7.4461, adrRate: 0.1546, convSteps: 7, ece: 0.0697, clinicianTrust: 3.0412, shapAuc: 0.7909 },
  { cohort: 'Hypertension', model: 'Transformer w/o GAN', mae: 7.5526, adrRate: 0.1530, convSteps: 5, ece: 0.0655, clinicianTrust: 3.2495, shapAuc: 0.7567 },
  { cohort: 'Hypertension', model: 'Proposed Full XAI Model', mae: 3.5469, adrRate: 0.0752, convSteps: 3, ece: 0.0387, clinicianTrust: 4.7579, shapAuc: 0.8919 },

  // Oncology
  { cohort: 'Oncology', model: 'Rule-Based', mae: 11.5312, adrRate: 0.1070, convSteps: 6, ece: 0.0712, clinicianTrust: 4.1534, shapAuc: 0.7844 },
  { cohort: 'Oncology', model: 'DNN', mae: 10.4839, adrRate: 0.1431, convSteps: 7, ece: 0.0614, clinicianTrust: 3.3371, shapAuc: 0.7542 },
  { cohort: 'Oncology', model: 'LLM-Only', mae: 6.8455, adrRate: 0.1641, convSteps: 4, ece: 0.0409, clinicianTrust: 3.5083, shapAuc: 0.7394 },
  { cohort: 'Oncology', model: 'Transformer w/o GAN', mae: 7.7609, adrRate: 0.1011, convSteps: 6, ece: 0.0824, clinicianTrust: 3.8748, shapAuc: 0.7771 },
  { cohort: 'Oncology', model: 'Proposed Full XAI Model', mae: 3.6110, adrRate: 0.0607, convSteps: 2, ece: 0.0382, clinicianTrust: 4.7405, shapAuc: 0.8816 },

  // Renal Impairment
  { cohort: 'Renal Impairment', model: 'Rule-Based', mae: 6.5724, adrRate: 0.1296, convSteps: 5, ece: 0.0595, clinicianTrust: 3.8755, shapAuc: 0.7637 },
  { cohort: 'Renal Impairment', model: 'DNN', mae: 11.3232, adrRate: 0.1377, convSteps: 4, ece: 0.0983, clinicianTrust: 4.0186, shapAuc: 0.7721 },
  { cohort: 'Renal Impairment', model: 'LLM-Only', mae: 7.4159, adrRate: 0.1204, convSteps: 6, ece: 0.0713, clinicianTrust: 3.5130, shapAuc: 0.7025 },
  { cohort: 'Renal Impairment', model: 'Transformer w/o GAN', mae: 6.6473, adrRate: 0.1025, convSteps: 6, ece: 0.0685, clinicianTrust: 3.6759, shapAuc: 0.7695 },
  { cohort: 'Renal Impairment', model: 'Proposed Full XAI Model', mae: 3.7089, adrRate: 0.0681, convSteps: 2, ece: 0.0351, clinicianTrust: 4.4915, shapAuc: 0.8553 },
];

// Table 6: Clinical outcomes and patient-reported metrics
export const TABLE_6_CLINICAL_OUTCOMES = [
  {
    metric: 'Reduction in Systolic BP (mmHg)',
    standardPractice: 8.5,
    proposedFramework: 10.2,
    improvementPct: '+20.0%',
    clinicalMeaning: 'Statistically significant drop lowering risk of stroke and major adverse cardiovascular events (MACE).',
  },
  {
    metric: 'HbA1c Reduction (%)',
    standardPractice: 0.7,
    proposedFramework: 0.8,
    improvementPct: '+14.3%',
    clinicalMeaning: 'Each 0.1% decrease correlates with marked reduction in diabetic microvascular complications (nephropathy/retinopathy).',
  },
  {
    metric: 'ADR Incidence Rate (%)',
    standardPractice: 12.5,
    proposedFramework: 9.7,
    improvementPct: '-22.4%',
    clinicalMeaning: 'Substantial decrease in harmful drug-drug interactions, hypoglycemia episodes, and drug toxicity events.',
  },
  {
    metric: 'Patient Satisfaction Score (1-10)',
    standardPractice: 7.2,
    proposedFramework: 8.3,
    improvementPct: '+15.3%',
    clinicalMeaning: 'Higher patient adherence, reduced side effects, and transparent personalized instructions.',
  },
];

// Figure 7: Clinician confidence in AI recommendations (Pre- vs Post-XAI on 40 clinicians)
export const FIGURE_7_TRUST_SURVEY = [
  { level: 1, label: '1 (Very Low)', preXAI: 4, postXAI: 2, delta: '-50%' },
  { level: 2, label: '2 (Low)', preXAI: 8, postXAI: 3, delta: '-62.5%' },
  { level: 3, label: '3 (Neutral / Unsure)', preXAI: 15, postXAI: 9, delta: '-40%' },
  { level: 4, label: '4 (High)', preXAI: 9, postXAI: 16, delta: '+77.8%' },
  { level: 5, label: '5 (Very High)', preXAI: 4, postXAI: 10, delta: '+150%' },
];

// Pre-defined Case Studies directly drawn from Section IV
export const BENCHMARK_CASE_STUDIES: PatientProfile[] = [
  {
    id: 'case-1-htn-dm',
    name: 'Case Study 1: Male 55y (HTN + Type 2 DM)',
    age: 55,
    gender: 'Male',
    bmi: 28.4,
    cohort: 'Hypertension',
    primaryDiagnosis: 'Stage 2 Essential Hypertension',
    secondaryDiagnoses: ['Type 2 Diabetes Mellitus', 'Early Diabetic Nephropathy'],
    currentMedications: ['Lisinopril 20mg/day', 'Metformin 1000mg/day', 'Glimepiride 4mg/day'],
    targetDrug: 'Glimepiride (Sulfonylurea)',
    standardGuidelineDose: 4.0,
    doseUnit: 'mg/day',
    vitals: {
      systolicBP: 148,
      diastolicBP: 92,
      heartRate: 74,
      qtInterval: 420,
    },
    labs: {
      gfr: 48, // Moderate renal impairment
      serumCreatinine: 1.52,
      hba1c: 8.4,
      altAst: 28,
      wbcCount: 6.8,
    },
    genomics: {
      cyp2d6: 'Normal Metabolizer (*1/*1)',
      cyp2c19: 'Poor Metabolizer (*2/*2)', // key feature from paper!
      slco1b1: 'Normal Function (*1a/*1a)',
      hlab: 'Negative',
    },
    lifestyle: {
      smoking: 'Former',
      adherenceScore: 82,
    },
    description: 'A 55-year-old male with chronic hypertension and diabetes mellitus. Digital twin simulation and SHAP decomposition reveal that CYP2C19 poor metabolizer status and reduced GFR (48 mL/min) cause sulfonylurea drug accumulation and severe hypoglycemia risk.',
  },
  {
    id: 'case-2-oncology',
    name: 'Case Study 2: Female 40y (Oncology Regimen)',
    age: 40,
    gender: 'Female',
    bmi: 22.1,
    cohort: 'Oncology',
    primaryDiagnosis: 'Breast Carcinoma (HER2+)',
    secondaryDiagnoses: ['Mild Treatment-Related Leukopenia'],
    currentMedications: ['Cyclophosphamide 600mg/m²', 'Doxorubicin 60mg/m²', 'Ondansetron 8mg PRN'],
    targetDrug: 'Doxorubicin (Anthracycline)',
    standardGuidelineDose: 60.0,
    doseUnit: 'mg/m²',
    vitals: {
      systolicBP: 118,
      diastolicBP: 74,
      heartRate: 86,
      qtInterval: 442,
    },
    labs: {
      gfr: 88,
      serumCreatinine: 0.82,
      hba1c: 5.4,
      altAst: 42,
      wbcCount: 3.1, // borderline low WBC
    },
    genomics: {
      cyp2d6: 'Poor Metabolizer (*4/*4)',
      cyp2c19: 'Normal Metabolizer (*1/*1)',
      slco1b1: 'Intermediate Function (*1a/*5)',
      hlab: 'Negative',
    },
    lifestyle: {
      smoking: 'Never',
      adherenceScore: 96,
    },
    description: 'A 40-year-old female receiving chemotherapy. Demonstrates how digital twin simulates narrow therapeutic index, borderline WBC counts, and CYP2D6 poor metabolism to proactively scale dosage and prevent severe cardiotoxicity and myelosuppression.',
  },
  {
    id: 'case-3-renal-poly',
    name: 'Case Study 3: Male 72y (Renal Impairment & Polypharmacy)',
    age: 72,
    gender: 'Male',
    bmi: 26.2,
    cohort: 'Renal Impairment',
    primaryDiagnosis: 'Chronic Kidney Disease Stage 3b',
    secondaryDiagnoses: ['Atrial Fibrillation', 'Heart Failure (HFpEF)', 'Coronary Artery Disease'],
    currentMedications: ['Amiodarone 200mg/day', 'Apixaban 2.5mg BID', 'Furosemide 40mg/day', 'Metoprolol Succinate 50mg/day', 'Atorvastatin 40mg/day'],
    targetDrug: 'Metoprolol Succinate (Beta-Blocker)',
    standardGuidelineDose: 50.0,
    doseUnit: 'mg/day',
    vitals: {
      systolicBP: 132,
      diastolicBP: 80,
      heartRate: 58,
      qtInterval: 472, // elevated QT!
    },
    labs: {
      gfr: 34, // severely reduced
      serumCreatinine: 2.14,
      hba1c: 6.1,
      altAst: 34,
      wbcCount: 6.4,
    },
    genomics: {
      cyp2d6: 'Poor Metabolizer (*4/*4)', // key metabolic pathway for metoprolol
      cyp2c19: 'Normal Metabolizer (*1/*1)',
      slco1b1: 'Poor Function (*5/*5)', // statin myopathy vulnerability
      hlab: 'Negative',
    },
    lifestyle: {
      smoking: 'Never',
      adherenceScore: 90,
    },
    description: 'Elderly patient with stage 3b CKD on 5+ concomitant drugs with baseline bradycardia and QT interval of 472 ms. Amiodarone-metoprolol interaction combined with CYP2D6 PM causes dramatic 4-5x increase in metoprolol systemic exposure.',
  },
  {
    id: 'case-4-cardio-statin',
    name: 'Case Study 4: Female 63y (Hyperlipidemia & Statin Intolerance Risk)',
    age: 63,
    gender: 'Female',
    bmi: 31.0,
    cohort: 'Diabetes Mellitus',
    primaryDiagnosis: 'Type 2 Diabetes Mellitus with Dyslipidemia',
    secondaryDiagnoses: ['Peripheral Neuropathy', 'Hypertension'],
    currentMedications: ['Metformin 1000mg BID', 'Amlodipine 5mg/day', 'Simvastatin 40mg/day'],
    targetDrug: 'Simvastatin (HMG-CoA Reductase Inhibitor)',
    standardGuidelineDose: 40.0,
    doseUnit: 'mg/day',
    vitals: {
      systolicBP: 138,
      diastolicBP: 85,
      heartRate: 72,
      qtInterval: 410,
    },
    labs: {
      gfr: 62,
      serumCreatinine: 1.15,
      hba1c: 7.9,
      altAst: 38,
      wbcCount: 7.1,
    },
    genomics: {
      cyp2d6: 'Normal Metabolizer (*1/*1)',
      cyp2c19: 'Intermediate Metabolizer (*1/*2)',
      slco1b1: 'Poor Function (*5/*5)', // severe myopathy risk with simvastatin
      hlab: 'Negative',
    },
    lifestyle: {
      smoking: 'Former',
      adherenceScore: 78,
    },
    description: 'High-risk patient possessing homozygous SLCO1B1*5 variant which impairs hepatic OATP1B1 uptake of simvastatin, elevating plasma AUC by 221% and drastically raising rhabdomyolysis and severe myopathy probability.',
  },
];
