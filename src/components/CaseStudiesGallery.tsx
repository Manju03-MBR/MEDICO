import React, { useState } from 'react';
import { FileText, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';
import { BENCHMARK_CASE_STUDIES } from '../data/paperData';
import { PatientProfile } from '../types/clinical';
import { runDigitalTwinSimulation } from '../utils/simulationEngine';

interface CaseStudiesProps {
  onLoadIntoSimulator: (patient: PatientProfile) => void;
}

export const CaseStudiesGallery: React.FC<CaseStudiesProps> = ({ onLoadIntoSimulator }) => {
  const [selectedCase, setSelectedCase] = useState<PatientProfile>(BENCHMARK_CASE_STUDIES[0]);
  const simResult = runDigitalTwinSimulation(selectedCase);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
          <span>Section IV: Implementation & Clinical Case Studies</span>
          <span aria-hidden="true">·</span>
          <span>Adjudicated Multi-Cohort Trials</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Retrospective Case Studies & Clinical Vignettes
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Examine concrete patient scenarios from Section IV of the research paper demonstrating how the Explainable Generative AI framework prevents severe adverse events overlooked by conventional population guidelines.
        </p>

        {/* Case Cards Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BENCHMARK_CASE_STUDIES.map((c) => {
            const isSelected = selectedCase.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500/60 ring-1 ring-teal-500/40 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-teal-400">{c.cohort}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{c.age}yo {c.gender}</span>
                </div>
                <div className="text-xs font-medium text-slate-200 line-clamp-1">{c.name.split(':')[1]}</div>
                <div className="text-[11px] text-slate-400 mt-1">Rx: {c.targetDrug}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Case Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Baseline Profile (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-semibold text-white">Clinical Vignette Overview</h3>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/30">
              {selectedCase.cohort}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-lg">
            {selectedCase.description}
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Biomarkers & Laboratory Values
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                <div>eGFR: <strong className="text-white">{selectedCase.labs.gfr} mL/min</strong></div>
                <div>Creatinine: <strong className="text-white">{selectedCase.labs.serumCreatinine} mg/dL</strong></div>
                {selectedCase.labs.hba1c && <div>HbA1c: <strong className="text-white">{selectedCase.labs.hba1c}%</strong></div>}
                <div>WBC: <strong className="text-white">{selectedCase.labs.wbcCount} ×10³/µL</strong></div>
                <div>BP: <strong className="text-white">{selectedCase.vitals.systolicBP}/{selectedCase.vitals.diastolicBP} mmHg</strong></div>
                <div>QTc: <strong className="text-white">{selectedCase.vitals.qtInterval} ms</strong></div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Pharmacogenomic Genotypes (PharmGKB)
              </span>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <p><strong>CYP2C19:</strong> <span className="font-mono text-teal-300">{selectedCase.genomics.cyp2c19}</span></p>
                <p><strong>CYP2D6:</strong> <span className="font-mono text-teal-300">{selectedCase.genomics.cyp2d6}</span></p>
                <p><strong>SLCO1B1:</strong> <span className="font-mono text-teal-300">{selectedCase.genomics.slco1b1}</span></p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Active Polypharmacy List
              </span>
              <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                {selectedCase.currentMedications.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onLoadIntoSimulator(selectedCase)}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Load This Case Into Live Digital Twin Workbench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Comparative Decision Matrix (Guideline vs AI) (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-white">Comparative Treatment Outcome</h3>
            <span className="text-xs text-slate-400">Section IV Case Adjudication</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Guideline Pathway */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Standard Clinical Practice
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                  Fixed Protocol
                </span>
              </div>

              <div>
                <div className="text-[11px] text-slate-400">Prescribed Dose:</div>
                <div className="text-xl font-bold font-mono text-slate-200">
                  {selectedCase.standardGuidelineDose} {selectedCase.doseUnit}
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-1.5 text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>ADR Risk:</strong> Simulated at {(simResult.guidelineAdrRisk * 100).toFixed(1)}% hazard
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Relies on population-averaged thresholds; fails to account for patient's distinct CYP enzyme activity and pharmacokinetic clearance deficit.
                </p>
              </div>
            </div>

            {/* Explainable AI Framework Pathway */}
            <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                  Proposed AI Framework
                </span>
                <span className="text-[10px] bg-teal-900/60 px-2 py-0.5 rounded text-teal-300 font-mono">
                  Digital Twin Gated
                </span>
              </div>

              <div>
                <div className="text-[11px] text-teal-400">Personalized Dose:</div>
                <div className="text-xl font-bold font-mono text-teal-300">
                  {simResult.recommendedDose} {selectedCase.doseUnit}
                  <span className="text-xs font-normal text-amber-400 ml-2">
                    ({simResult.doseDeltaPercent}%)
                  </span>
                </div>
              </div>

              <div className="text-xs text-teal-200 space-y-1.5 pt-2 border-t border-teal-800/40">
                <div className="flex items-start gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>ADR Risk:</strong> {(simResult.adrRiskScore * 100).toFixed(1)}% (RRI: {simResult.relativeRiskIndex})
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/80">
                  Proactively averted toxic accumulation via reinforcement learning simulation and post-hoc SHAP safety checks.
                </p>
              </div>
            </div>
          </div>

          {/* Clinician Explanation Report (As highlighted in Section IV page 8) */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              XAI Explanatory Audit Report (Section IV Quotation):
            </span>
            <ul className="space-y-2 text-xs text-slate-300 pt-1">
              {simResult.triggeredRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <span className="text-teal-400 font-bold">▪</span>
                  <div>
                    <strong className="text-white">{rule.action}</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">Condition: {rule.condition}</p>
                    <span className="text-[10px] text-teal-400 font-mono">Citation: {rule.standardGuidelineRef}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
