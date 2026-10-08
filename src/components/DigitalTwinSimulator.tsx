import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Dna,
  FileCheck,
  Heart,
  HelpCircle,
  Layers,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Sliders,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';
import { PatientProfile, SimulationOutput } from '../types/clinical';
import { BENCHMARK_CASE_STUDIES } from '../data/paperData';
import { runDigitalTwinSimulation } from '../utils/simulationEngine';

interface SimulatorProps {
  onOpenAudit: (patient: PatientProfile, result: SimulationOutput) => void;
}

export const DigitalTwinSimulator: React.FC<SimulatorProps> = ({ onOpenAudit }) => {
  // Selected Patient State
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-1-htn-dm');
  const [patient, setPatient] = useState<PatientProfile>(BENCHMARK_CASE_STUDIES[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(4); // 0-4
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

  // Compute simulation result
  const simulationResult = useMemo<SimulationOutput>(() => {
    return runDigitalTwinSimulation(patient);
  }, [patient]);

  // Handle case selection
  const handleSelectCase = (caseId: string) => {
    const found = BENCHMARK_CASE_STUDIES.find((c) => c.id === caseId);
    if (found) {
      setSelectedCaseId(caseId);
      setPatient({ ...found });
      setFeedbackRating(null);
      setFeedbackSubmitted(false);
      setOrderConfirmed(false);
      triggerSimulationRun();
    }
  };

  const triggerSimulationRun = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    const t1 = setTimeout(() => setSimulationStep(2), 250);
    const t2 = setTimeout(() => setSimulationStep(3), 500);
    const t3 = setTimeout(() => {
      setSimulationStep(4);
      setIsSimulating(false);
    }, 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // Updaters for interactive sliders
  const handleGfrChange = (newGfr: number) => {
    setPatient((prev) => ({
      ...prev,
      labs: { ...prev.labs, gfr: newGfr },
    }));
    setOrderConfirmed(false);
  };

  const handleAgeChange = (newAge: number) => {
    setPatient((prev) => ({
      ...prev,
      age: newAge,
    }));
    setOrderConfirmed(false);
  };

  const handleQtChange = (newQt: number) => {
    setPatient((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, qtInterval: newQt },
    }));
    setOrderConfirmed(false);
  };

  const handleCyp2c19Change = (val: any) => {
    setPatient((prev) => ({
      ...prev,
      genomics: { ...prev.genomics, cyp2c19: val },
    }));
    setOrderConfirmed(false);
  };

  const handleCyp2d6Change = (val: any) => {
    setPatient((prev) => ({
      ...prev,
      genomics: { ...prev.genomics, cyp2d6: val },
    }));
    setOrderConfirmed(false);
  };

  const handleSlco1b1Change = (val: any) => {
    setPatient((prev) => ({
      ...prev,
      genomics: { ...prev.genomics, slco1b1: val },
    }));
    setOrderConfirmed(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Digital Twin Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
              <span>IEEE Access Section III & IV</span>
              <span aria-hidden="true">·</span>
              <span>Patient-Specific Virtual Simulator</span>
              <span aria-hidden="true">·</span>
              <span>Transformer RL Policy π(a|E_enhanced)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Interactive Digital Twin Precision Dosing Workbench
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Simulates individual pharmacokinetics, enzymatic polymorphisms (CYP2D6, CYP2C19, SLCO1B1), renal filtration (eGFR), and drug interactions. Every recommendation is gated by SHAP feature attributions and auditable surrogate decision trees.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={triggerSimulationRun}
              disabled={isSimulating}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating Twin...' : 'Rerun Simulation'}</span>
            </button>
          </div>
        </div>

        {/* Preset Case Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Select Clinically Adjudicated Case Study from Paper:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {BENCHMARK_CASE_STUDIES.map((c) => {
              const isActive = selectedCaseId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCase(c.id)}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-teal-950/40 border-teal-500/50 text-white ring-1 ring-teal-500/30'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-teal-300">{c.cohort}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{c.age}y / {c.gender}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate">{c.name.split(':')[1] || c.name}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">Drug: {c.targetDrug}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls (Patient Twin Configuration) vs Right Results (AI & XAI Analysis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Virtual Patient Digital Twin (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-teal-400" />
                <h2 className="text-base font-semibold text-white">Virtual Patient Profile</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">ID: {patient.id}</span>
            </div>

            {/* Patient Clinical Summary */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-1 mb-4 leading-relaxed">
              <p><strong className="text-white">Primary Diagnosis:</strong> {patient.primaryDiagnosis}</p>
              <p><strong className="text-white">Target Medication:</strong> <span className="text-teal-300 font-medium">{patient.targetDrug}</span> (Guideline Default: {patient.standardGuidelineDose} {patient.doseUnit})</p>
              <p><strong className="text-white">Concomitant Rx ({patient.currentMedications.length}):</strong> {patient.currentMedications.join(', ')}</p>
            </div>

            {/* Interactive Physiology Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Renal Clearance: eGFR</span>
                  <span className={`font-mono font-semibold ${patient.labs.gfr < 30 ? 'text-rose-400' : patient.labs.gfr < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {patient.labs.gfr} mL/min/1.73m²
                    {patient.labs.gfr < 30 ? ' (Severe CKD 4)' : patient.labs.gfr < 60 ? ' (Moderate CKD 3)' : ' (Normal/Mild)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={patient.labs.gfr}
                  onChange={(e) => handleGfrChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>15 (ESRD)</span>
                  <span>60 (CKD cut-off)</span>
                  <span>120 (Optimal)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Cardiac Repolarization: QTc Interval</span>
                  <span className={`font-mono font-semibold ${patient.vitals.qtInterval > 460 ? 'text-rose-400' : patient.vitals.qtInterval > 440 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {patient.vitals.qtInterval} ms
                    {patient.vitals.qtInterval > 460 ? ' (Prolonged - High Arrhythmia Risk)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="380"
                  max="520"
                  value={patient.vitals.qtInterval}
                  onChange={(e) => handleQtChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>380 ms (Normal)</span>
                  <span>450 ms (Threshold)</span>
                  <span>520 ms (Torsades risk)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Patient Age & Frailty</span>
                  <span className="font-mono text-slate-300 font-semibold">{patient.age} years</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="90"
                  value={patient.age}
                  onChange={(e) => handleAgeChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Pharmacogenomics Selectors */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Pharmacogenomic Variants (PharmGKB Grounded)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">CYP2C19 Phenotype</label>
                    <select
                      value={patient.genomics.cyp2c19}
                      onChange={(e) => handleCyp2c19Change(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    >
                      <option value="Normal Metabolizer (*1/*1)">Normal (*1/*1)</option>
                      <option value="Intermediate Metabolizer (*1/*2)">Intermediate (*1/*2)</option>
                      <option value="Poor Metabolizer (*2/*2)">Poor Metabolizer (*2/*2)</option>
                      <option value="Rapid Metabolizer (*17/*17)">Rapid (*17/*17)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">CYP2D6 Phenotype</label>
                    <select
                      value={patient.genomics.cyp2d6}
                      onChange={(e) => handleCyp2d6Change(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    >
                      <option value="Normal Metabolizer (*1/*1)">Normal (*1/*1)</option>
                      <option value="Intermediate Metabolizer (*1/*4)">Intermediate (*1/*4)</option>
                      <option value="Poor Metabolizer (*4/*4)">Poor Metabolizer (*4/*4)</option>
                      <option value="Ultrarapid Metabolizer (*1/*1xN)">Ultrarapid (*1xN)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">SLCO1B1 (Hepatic Transporter)</label>
                  <select
                    value={patient.genomics.slco1b1}
                    onChange={(e) => handleSlco1b1Change(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    <option value="Normal Function (*1a/*1a)">Normal Function (*1a/*1a)</option>
                    <option value="Intermediate Function (*1a/*5)">Intermediate Function (*1a/*5)</option>
                    <option value="Poor Function (*5/*5)">Poor Function (*5/*5) - High Statin Myopathy Risk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Presets / What-If Scenarios */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-2">Simulate What-If Clinical Perturbations:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleGfrChange(28)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  ⚡ Induce Acute Kidney Injury (eGFR 28)
                </button>
                <button
                  onClick={() => handleQtChange(490)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  ⚡ Elevate QTc to 490 ms
                </button>
                <button
                  onClick={() => {
                    handleGfrChange(95);
                    handleQtChange(410);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  ↺ Reset Organ Vitals
                </button>
              </div>
            </div>
          </div>

          {/* Model Internal Pipeline Visualizer (Fig 2 & 3 in paper) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm text-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" />
                Pipeline Execution Flow (Figure 3)
              </span>
              <span className="text-[11px] font-mono text-teal-400">
                {isSimulating ? 'Processing...' : 'Converged in ' + simulationResult.convergenceSteps + ' steps'}
              </span>
            </div>

            <div className="space-y-2">
              <div className={`p-2 rounded border transition-colors ${simulationStep >= 1 ? 'bg-teal-950/40 border-teal-600/40 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">1. RAG Vector Knowledge Retrieval φ(qu, f)</span>
                  {simulationStep >= 1 && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">BM25 + Dense cosine embedding query over EHR, PharmGKB & guideline databases</p>
              </div>

              <div className={`p-2 rounded border transition-colors ${simulationStep >= 2 ? 'bg-teal-950/40 border-teal-600/40 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">2. GAN Adversarial Latent Augmentation (X_synthetic)</span>
                  {simulationStep >= 2 && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Overcomes data sparsity by synthesizing counterfactual patient states; passes KS-test & MMD²</p>
              </div>

              <div className={`p-2 rounded border transition-colors ${simulationStep >= 3 ? 'bg-teal-950/40 border-teal-600/40 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">3. Transformer RL Policy π(at | E_enhanced)</span>
                  {simulationStep >= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Deep value estimator V(E_enhanced) optimizing efficacy vs ADR toxicity penalty</p>
              </div>

              <div className={`p-2 rounded border transition-colors ${simulationStep >= 4 ? 'bg-teal-950/40 border-teal-600/40 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">4. Post-Hoc SHAP Explainer & Decision-Tree Gating</span>
                  {simulationStep >= 4 && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Local force decomposition + safety escalation rules (ECE = {simulationResult.expectedCalibrationError})</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Dosage Recommendation & Explainability (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Recommendation Metric Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400" />
                <h2 className="text-base font-semibold text-white">
                  Precision Dosage Recommendation (AI Framework)
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Confidence: <strong className="text-teal-300 font-mono">{(simulationResult.confidenceScore * 100).toFixed(1)}%</strong>
              </span>
            </div>

            {/* Dosage Comparison Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Proposed AI Dose
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-teal-300 font-mono">
                    {simulationResult.recommendedDose}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{patient.doseUnit}</span>
                </div>
                <div className="mt-1 text-[11px] text-teal-400/90 font-medium">
                  Range: {simulationResult.doseRange[0]}–{simulationResult.doseRange[1]} {patient.doseUnit}
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Guideline Baseline Dose
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-slate-300 font-mono">
                    {simulationResult.standardDose}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{patient.doseUnit}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  Fixed population protocol
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Personalization Adjustment
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-bold font-mono ${simulationResult.doseDeltaPercent < 0 ? 'text-amber-400' : simulationResult.doseDeltaPercent > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {simulationResult.doseDeltaPercent > 0 ? `+${simulationResult.doseDeltaPercent}` : simulationResult.doseDeltaPercent}%
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  {simulationResult.doseDeltaPercent < 0 ? 'Safeguard dose reduction' : 'Baseline matching'}
                </div>
              </div>
            </div>

            {/* ADR Risk Indicator & Relative Risk Index (From IEEE Access Abstract & Section IV) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-teal-400" />
                    Simulated Adverse Drug Reaction (ADR) Risk Profile
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Evaluated against multi-cohort ADR-20K benchmark (AUC-ROC: 0.89 vs 0.78 guideline)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">AI Risk: </span>
                    <strong className="text-teal-300 font-mono">{(simulationResult.adrRiskScore * 100).toFixed(1)}%</strong>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div>
                    <span className="text-slate-400">Guideline Risk: </span>
                    <strong className="text-rose-400 font-mono">{(simulationResult.guidelineAdrRisk * 100).toFixed(1)}%</strong>
                  </div>
                </div>
              </div>

              {/* Progress bar comparison */}
              <div className="space-y-1.5 pt-1">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${simulationResult.adrRiskScore * 250}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-teal-400 font-mono font-medium">
                    Relative Risk Index (RRI): {simulationResult.relativeRiskIndex}
                    <span className="text-slate-400 font-sans ml-1">(Paper 95% CI: 0.72–0.85)</span>
                  </span>
                  <span className="text-emerald-400 font-medium">
                    ↓ {Math.round((1 - simulationResult.relativeRiskIndex) * 100)}% Lower ADR Hazard
                  </span>
                </div>
              </div>
            </div>

            {/* SHAP Force Decomposition (Equation 1 & 2 in paper) */}
            <div className="border border-slate-800/90 rounded-lg p-4 bg-slate-950/60 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  SHAP Additive Feature Attributions (φ_i Decomposition)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  f(x) = E[f(x)] + ∑ φ_i
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Local marginal contributions showing how each patient biomarker drove the final recommendation deviation:
              </p>

              {/* SHAP Waterfall Bars */}
              <div className="space-y-2.5">
                {simulationResult.shapValues.map((shap, idx) => {
                  const isNegative = shap.phi < 0;
                  const magnitude = Math.min(100, Math.abs(shap.phi) * 180);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-200">{shap.feature}</span>
                          <span className="text-slate-400 text-[11px] font-mono">[{shap.featureValue}]</span>
                        </div>
                        <span
                          className={`font-mono text-xs font-semibold ${
                            isNegative ? 'text-amber-400' : 'text-teal-400'
                          }`}
                        >
                          {isNegative ? '' : '+'}
                          {shap.phi.toFixed(2)}
                        </span>
                      </div>

                      {/* Bar indicator */}
                      <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
                        {isNegative ? (
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${magnitude}%` }}
                            title={`Negative contribution: ${shap.phi}`}
                          />
                        ) : (
                          <div
                            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${magnitude}%` }}
                            title={`Positive contribution: ${shap.phi}`}
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {shap.description}
                        {shap.guidelineReference && (
                          <span className="text-slate-400 ml-1">({shap.guidelineReference})</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Auditable Decision Tree Rules (Surrogate Explanation) */}
            <div className="border border-slate-800/90 rounded-lg p-4 bg-slate-950/60 mb-5">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                <FileCheck className="w-4 h-4 text-teal-400" />
                Interpretable Surrogate Decision Tree Rules
              </span>
              <p className="text-[11px] text-slate-400 mb-3">
                Extracted rule-path allowing clinicians to audit against clinical guidelines (e.g. KDIGO, CPIC, Beers criteria):
              </p>

              <div className="space-y-2">
                {simulationResult.triggeredRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs ${
                      rule.met
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-slate-900 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={rule.met ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                        {rule.met ? '▶ RULE FIRED:' : '▷ RULE DORMANT:'}
                      </span>
                      <span>{rule.condition}</span>
                    </div>
                    <div className="mt-1 font-sans text-xs text-slate-200">
                      <strong>Action:</strong> {rule.action}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Guideline Anchor: {rule.standardGuidelineRef}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Safety Alerts */}
            {simulationResult.safetyAlerts.length > 0 && (
              <div className="space-y-2.5 mb-5">
                {simulationResult.safetyAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs ${
                      alert.level === 'Contraindication'
                        ? 'bg-rose-950/30 border-rose-600/50 text-rose-200'
                        : alert.level === 'High Risk'
                        ? 'bg-orange-950/30 border-orange-500/50 text-orange-200'
                        : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>[{alert.level}] {alert.title}</span>
                    </div>
                    <p className="mt-1 text-slate-300 text-xs">{alert.message}</p>
                    <div className="mt-2 pt-2 border-t border-current/20 text-[11px]">
                      <strong>Recommended Clinical Action:</strong> {alert.recommendedMitigation}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Clinician Decision Support Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrderConfirmed(true)}
                  disabled={orderConfirmed}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    orderConfirmed
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{orderConfirmed ? 'Order Signed & Synchronized' : 'Approve Recommended Dosage'}</span>
                </button>

                <button
                  onClick={() => onOpenAudit(patient, simulationResult)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Export Consultation Audit</span>
                </button>
              </div>

              {/* Clinician Trust Feedback (Likert Scale - directly mirroring Figure 7 in paper) */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Clinician Trust:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setFeedbackRating(lvl);
                        setFeedbackSubmitted(true);
                      }}
                      className={`w-6 h-6 rounded text-[11px] font-mono font-medium transition-colors ${
                        feedbackRating === lvl
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title={`Rate trust ${lvl}/5`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                {feedbackSubmitted && (
                  <span className="text-emerald-400 text-[11px]">Logged!</span>
                )}
              </div>
            </div>

            {orderConfirmed && (
              <div className="mt-3 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Medication order for <strong>{patient.targetDrug} ({simulationResult.recommendedDose} {patient.doseUnit})</strong> verified with safety gating. Simulated EHR API updated.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
