export type CohortType = 'Hypertension' | 'Diabetes Mellitus' | 'Oncology' | 'Renal Impairment' | 'Polypharmacy';

export type CYP2D6Phenotype = 'Poor Metabolizer (*4/*4)' | 'Intermediate Metabolizer (*1/*4)' | 'Normal Metabolizer (*1/*1)' | 'Ultrarapid Metabolizer (*1/*1xN)';
export type CYP2C19Phenotype = 'Poor Metabolizer (*2/*2)' | 'Intermediate Metabolizer (*1/*2)' | 'Normal Metabolizer (*1/*1)' | 'Rapid Metabolizer (*17/*17)';
export type SLCO1B1Genotype = 'Normal Function (*1a/*1a)' | 'Intermediate Function (*1a/*5)' | 'Poor Function (*5/*5)';
export type HLABGenotype = 'Negative' | 'Positive (*57:01 Risk)' | 'Positive (*58:01 Risk)';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  bmi: number;
  cohort: CohortType;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  currentMedications: string[];
  targetDrug: string;
  standardGuidelineDose: number; // mg/day
  doseUnit: string;
  vitals: {
    systolicBP: number; // mmHg
    diastolicBP: number; // mmHg
    heartRate: number; // bpm
    qtInterval: number; // ms
  };
  labs: {
    gfr: number; // mL/min/1.73m2
    serumCreatinine: number; // mg/dL
    hba1c?: number; // %
    altAst: number; // U/L
    wbcCount: number; // 10^3/uL
  };
  genomics: {
    cyp2d6: CYP2D6Phenotype;
    cyp2c19: CYP2C19Phenotype;
    slco1b1: SLCO1B1Genotype;
    hlab: HLABGenotype;
  };
  lifestyle: {
    smoking: 'Never' | 'Former' | 'Active';
    adherenceScore: number; // 0 - 100%
  };
  description: string;
}

export interface SHAPContribution {
  feature: string;
  featureValue: string | number;
  phi: number; // positive = pushes dose higher / risk higher; negative = pushes dose lower
  description: string;
  clinicalSignificance: 'Critical' | 'Moderate' | 'Low';
  guidelineReference?: string;
}

export interface DecisionRuleNode {
  condition: string;
  met: boolean;
  action: string;
  standardGuidelineRef: string;
}

export interface SimulationOutput {
  recommendedDose: number; // mg/day
  doseDeltaPercent: number; // % change vs standard guideline
  standardDose: number;
  doseRange: [number, number];
  adrRiskScore: number; // 0 to 1
  guidelineAdrRisk: number;
  relativeRiskIndex: number; // RRI < 1 means safer
  confidenceScore: number; // 0 to 1
  expectedCalibrationError: number; // ECE
  convergenceSteps: number;
  shapValues: SHAPContribution[];
  triggeredRules: DecisionRuleNode[];
  safetyAlerts: {
    level: 'Safe' | 'Warning' | 'High Risk' | 'Contraindication';
    title: string;
    message: string;
    recommendedMitigation: string;
  }[];
  ragCitations: {
    source: string;
    id: string;
    title: string;
    summary: string;
  }[];
}
