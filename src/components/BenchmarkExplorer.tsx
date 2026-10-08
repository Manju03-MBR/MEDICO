import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Table as TableIcon,
  Layers,
  Award,
  Users,
  Info,
} from 'lucide-react';
import {
  COHORT_SAMPLES,
  DATASET_COMPOSITION,
  TABLE_3_MAE,
  TABLE_4_AUC,
  TABLE_5_MODELS,
  TABLE_6_CLINICAL_OUTCOMES,
  FIGURE_7_TRUST_SURVEY,
  CohortType,
} from '../data/paperData';

export const BenchmarkExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'mae' | 'roc' | 'ablation' | 'outcomes' | 'trust'>('mae');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState<string>('All');
  const [rocThreshold, setRocThreshold] = useState<number>(0.45);
  const [selectedRocCohort, setSelectedRocCohort] = useState<string>('Hypertension');

  // Filtered ablation rows
  const filteredTable5 = selectedCohortFilter === 'All'
    ? TABLE_5_MODELS
    : TABLE_5_MODELS.filter((row) => row.cohort.toLowerCase().includes(selectedCohortFilter.toLowerCase()));

  // Calculate simulated sensitivity / specificity based on ROC threshold for selected cohort
  const rocMetric = TABLE_4_AUC.find((c) => c.cohort.toLowerCase().includes(selectedRocCohort.toLowerCase())) || TABLE_4_AUC[0];
  const aiSensitivity = Math.min(0.98, Math.max(0.40, rocMetric.proposedAUC * (1.15 - rocThreshold * 0.4)));
  const aiSpecificity = Math.min(0.96, Math.max(0.35, 0.4 + rocThreshold * 0.62));
  const stdSensitivity = Math.min(0.92, Math.max(0.30, rocMetric.standardAUC * (1.1 - rocThreshold * 0.5)));
  const stdSpecificity = Math.min(0.90, Math.max(0.30, 0.35 + rocThreshold * 0.55));

  return (
    <div className="space-y-6">
      {/* Top Banner: Dataset ADR-20K Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
              <span>Section IV-A & Tables 1–6</span>
              <span aria-hidden="true">·</span>
              <span>ADR-20K Multi-Cohort Multi-Modal Dataset</span>
              <span aria-hidden="true">·</span>
              <span>N = 20,030 Patients</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Empirical Benchmarks & Experimental Validation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              De-identified longitudinal EHR records across 4 cohorts, evaluated with patient-level splits and temporal blocking. 75% real EHR data (n = 15,023) and 25% GAN-augmented synthetic samples (n = 5,007) with test metrics computed strictly on real-only splits.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Total Records</span>
              <span className="font-mono font-bold text-white text-base">20,030</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Average MAE Delta</span>
              <span className="font-mono font-bold text-teal-400 text-base">-18.3%</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Mean ADR AUC</span>
              <span className="font-mono font-bold text-teal-400 text-base">0.89 vs 0.78</span>
            </div>
          </div>
        </div>

        {/* Cohort Distribution Chips */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {Object.entries(COHORT_SAMPLES).filter(([k]) => k !== 'Polypharmacy').map(([name, data]) => (
            <div key={name} className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-2.5">
              <div className="flex justify-between items-center text-slate-400 mb-0.5">
                <span className="font-medium text-slate-300">{name}</span>
                <span className="font-mono text-[11px] text-teal-400">{data.percentage}%</span>
              </div>
              <div className="text-base font-bold text-white font-mono">{data.count.toLocaleString()}</div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{data.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Tabs: Navigation between Figures and Tables */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('mae')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'mae'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Figure 4 & Table 3: Dosage MAE (mg/day)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roc')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'roc'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Figure 5 & Table 4: ROC Curves & ADR AUC</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ablation')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'ablation'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Table 5: Deep Model Ablations</span>
        </button>

        <button
          onClick={() => setActiveSubTab('outcomes')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'outcomes'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Figure 6 & Table 6: Clinical Outcomes</span>
        </button>

        <button
          onClick={() => setActiveSubTab('trust')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'trust'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Figure 7: Clinician Trust (Pre vs Post-XAI)</span>
        </button>
      </div>

      {/* SUB-VIEW 1: Figure 4 & Table 3 MAE */}
      {activeSubTab === 'mae' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Dosage Recommendation Accuracy by Cohort (Figure 4)
                </h3>
                <p className="text-xs text-slate-400">
                  Mean Absolute Error (MAE, mg/day) — Lower values indicate higher dosage precision.
                </p>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-4 pt-2">
              {TABLE_3_MAE.map((item, idx) => {
                const maxVal = 8.0;
                const stdWidth = (item.standardMAE / maxVal) * 100;
                const propWidth = (item.proposedMAE / maxVal) * 100;
                const isAverage = item.cohort === 'Average';

                return (
                  <div key={idx} className={`p-3 rounded-lg border ${isAverage ? 'bg-teal-950/20 border-teal-500/40' : 'bg-slate-950/40 border-slate-800'}`}>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className={`font-semibold ${isAverage ? 'text-teal-300' : 'text-slate-200'}`}>
                        {item.cohort}
                      </span>
                      <span className="font-mono text-xs font-bold text-teal-400">
                        {item.improvement}% Improvement (Δ {item.delta} mg/day)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {/* Standard Baseline Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                          <span>Standard Clinical Guidelines</span>
                          <span className="font-mono">{item.standardMAE} mg/day</span>
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stdWidth}%` }}
                          />
                        </div>
                      </div>

                      {/* AI Framework Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] text-teal-300 mb-0.5">
                          <span className="font-medium">Proposed Explainable AI Framework</span>
                          <span className="font-mono font-bold">{item.proposedMAE} mg/day</span>
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${propWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Paper Insight:</strong> The Oncology cohort had the highest baseline MAE (6.2 mg/day) due to narrow therapeutic indices; the AI model reduced this to 5.1 mg/day (-17.7%). In Hypertension, the model achieved a 23.2% error drop (from 5.6 down to 4.3 mg/day).
              </span>
            </div>
          </div>

          {/* Table 3 Data Table */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-white">
              Table 3: Exact Benchmark Values
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Cohort</th>
                    <th className="pb-2 text-right">Guideline MAE</th>
                    <th className="pb-2 text-right">AI MAE</th>
                    <th className="pb-2 text-right">Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {TABLE_3_MAE.map((r, i) => (
                    <tr key={i} className={r.cohort === 'Average' ? 'bg-teal-950/20 font-semibold text-teal-300' : 'text-slate-300'}>
                      <td className="py-2.5 font-sans">{r.cohort}</td>
                      <td className="py-2.5 text-right">{r.standardMAE.toFixed(1)}</td>
                      <td className="py-2.5 text-right text-teal-400">{r.proposedMAE.toFixed(1)}</td>
                      <td className="py-2.5 text-right text-emerald-400">+{r.improvement}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-800 pt-4 text-xs text-slate-400 space-y-2">
              <p>
                <strong>Bootstrap Validation:</strong> 10,000 Bias-Corrected and Accelerated (BCa) bootstrap replicates stratified by cohort and temporally blocked within patients.
              </p>
              <p>
                <strong>Relative Risk Index (RRI):</strong> 0.78 (95% CI 0.72–0.85) indicating systematically lower simulated adverse drug reaction events relative to standard guidelines.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Figure 5 & Table 4 ROC Curves */}
      {activeSubTab === 'roc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Receiver Operating Characteristic (ROC) for ADR Detection (Figure 5)
                </h3>
                <p className="text-xs text-slate-400">
                  Discriminative capacity to differentiate patients at high risk of adverse reactions.
                </p>
              </div>

              {/* Cohort Selector */}
              <select
                value={selectedRocCohort}
                onChange={(e) => setSelectedRocCohort(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-teal-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-teal-500 outline-none"
              >
                {TABLE_4_AUC.filter((c) => c.cohort !== 'Average').map((c) => (
                  <option key={c.cohort} value={c.cohort}>{c.cohort}</option>
                ))}
              </select>
            </div>

            {/* Interactive SVG ROC Chart */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox="0 0 400 320" className="w-full h-64 sm:h-72">
                {/* Grid lines */}
                <line x1="50" y1="20" x2="50" y2="270" stroke="#334155" strokeWidth="1" />
                <line x1="50" y1="270" x2="380" y2="270" stroke="#334155" strokeWidth="1" />
                <line x1="50" y1="145" x2="380" y2="145" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="215" y1="20" x2="215" y2="270" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Diagonal random guess line */}
                <line x1="50" y1="270" x2="380" y2="20" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />

                {/* Standard Guideline ROC Curve (dashed orange/slate) */}
                <path
                  d="M 50 270 Q 110 130 190 90 T 380 20"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />

                {/* Proposed AI Framework ROC Curve (solid teal) */}
                <path
                  d="M 50 270 Q 75 55 160 40 T 380 20"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3.5"
                />

                {/* Current Operating Point for AI based on threshold */}
                <circle
                  cx={50 + (1 - aiSpecificity) * 330}
                  cy={270 - aiSensitivity * 250}
                  r="6"
                  fill="#0d9488"
                  stroke="#fff"
                  strokeWidth="2"
                />

                {/* Operating Point for Standard */}
                <circle
                  cx={50 + (1 - stdSpecificity) * 330}
                  cy={270 - stdSensitivity * 250}
                  r="5"
                  fill="#94a3b8"
                  stroke="#fff"
                  strokeWidth="1.5"
                />

                {/* Axes labels */}
                <text x="215" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  False Positive Rate (1 - Specificity)
                </text>
                <text x="20" y="145" textAnchor="middle" fill="#94a3b8" fontSize="11" transform="rotate(-90 20 145)">
                  True Positive Rate (Sensitivity)
                </text>

                {/* Legend in chart */}
                <g transform="translate(190, 190)">
                  <rect width="180" height="70" rx="4" fill="#0f172a" fillOpacity="0.8" stroke="#334155" />
                  <line x1="10" y1="20" x2="35" y2="20" stroke="#14b8a6" strokeWidth="3" />
                  <text x="42" y="24" fill="#f8fafc" fontSize="11" fontWeight="bold">AI Framework (AUC {rocMetric.proposedAUC})</text>
                  <line x1="10" y1="45" x2="35" y2="45" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="42" y="49" fill="#94a3b8" fontSize="11">Standard Guideline (AUC {rocMetric.standardAUC})</text>
                </g>
              </svg>

              {/* Threshold Slider */}
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Interactive Decision Threshold (τ):</span>
                  <span className="font-mono text-teal-400 font-bold">{rocThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.85"
                  step="0.01"
                  value={rocThreshold}
                  onChange={(e) => setRocThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2 rounded bg-teal-950/30 border border-teal-500/30">
                    <span className="text-[10px] text-teal-400 uppercase block font-semibold">AI Operating Point</span>
                    <div className="font-mono text-slate-200 mt-0.5">
                      Sensitivity: <strong className="text-teal-300">{(aiSensitivity * 100).toFixed(1)}%</strong>
                      <br />
                      Specificity: <strong className="text-teal-300">{(aiSpecificity * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Guideline Operating Point</span>
                    <div className="font-mono text-slate-300 mt-0.5">
                      Sensitivity: <strong>{(stdSensitivity * 100).toFixed(1)}%</strong>
                      <br />
                      Specificity: <strong>{(stdSpecificity * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table 4 Summary Table */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-white">
              Table 4: Adverse Drug Reaction (AUC-ROC)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Cohort</th>
                    <th className="pb-2 text-right">Guideline AUC</th>
                    <th className="pb-2 text-right">AI AUC</th>
                    <th className="pb-2 text-right">Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {TABLE_4_AUC.map((r, i) => (
                    <tr
                      key={i}
                      className={
                        r.cohort === 'Average'
                          ? 'bg-teal-950/20 font-semibold text-teal-300'
                          : r.cohort.includes(selectedRocCohort)
                          ? 'bg-slate-800/70 font-semibold text-white'
                          : 'text-slate-300'
                      }
                    >
                      <td className="py-2.5 font-sans">{r.cohort}</td>
                      <td className="py-2.5 text-right">{r.standardAUC.toFixed(2)}</td>
                      <td className="py-2.5 text-right text-teal-400 font-bold">{r.proposedAUC.toFixed(2)}</td>
                      <td className="py-2.5 text-right text-emerald-400">+{r.gain.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-2">
              <p>
                <strong>Clinical Significance:</strong> In Oncology, AUC rose from 0.77 to 0.90 (+0.13), demonstrating the model's capacity to detect occult chemotherapy toxicities.
              </p>
              <p>
                <strong>Reduced False Alarms:</strong> Operating with lower false-positive rates prevents alert fatigue in busy inpatient hospital wards while maintaining ultra-high sensitivity for fatal adverse events.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Table 5 Factorial Ablation Matrix */}
      {activeSubTab === 'ablation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">
                Table 5: Performance of AI-Driven and Rule-Based Architectures
              </h3>
              <p className="text-xs text-slate-400">
                Comparing Rule-Based, DNN, LLM-Only, Transformer w/o GAN, and the Proposed Full XAI Model across 6 clinical KPIs.
              </p>
            </div>

            {/* Filter by Cohort */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              {['All', 'Diabetes', 'Hypertension', 'Oncology', 'Renal Impairment'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCohortFilter(c)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedCohortFilter === c
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Cohort</th>
                  <th className="py-2.5 px-3">Model Architecture</th>
                  <th className="py-2.5 px-3 text-right">MAE (mg/day)</th>
                  <th className="py-2.5 px-3 text-right">ADR Rate</th>
                  <th className="py-2.5 px-3 text-right">Conv. Steps</th>
                  <th className="py-2.5 px-3 text-right">Calib. ECE</th>
                  <th className="py-2.5 px-3 text-right">Clinician Trust</th>
                  <th className="py-2.5 px-3 text-right">SHAP-AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredTable5.map((row, idx) => {
                  const isFull = row.model === 'Proposed Full XAI Model';
                  return (
                    <tr
                      key={idx}
                      className={
                        isFull
                          ? 'bg-teal-950/30 text-teal-200 font-medium'
                          : 'text-slate-300 hover:bg-slate-800/40'
                      }
                    >
                      <td className="py-2.5 px-3 font-sans text-slate-300">{row.cohort}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-white flex items-center gap-1.5">
                        {isFull && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                        <span>{row.model}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-teal-300 font-bold">{row.mae.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right">{row.adrRate.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right">{row.convSteps}</td>
                      <td className="py-2.5 px-3 text-right">{row.ece.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-amber-300">{row.clinicianTrust.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-teal-400">{row.shapAuc.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Key Takeaways from Section IV-C */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="font-semibold text-slate-200 block mb-1">LLM-Only Vulnerability:</span>
              <p className="text-slate-400">
                While LLM-Only achieved high clinician surface trust (4.19), it suffered catastrophic dosage errors (MAE 11.8 mg/day) and ADR rates of 16.6%, demonstrating that text-only prompt advisories without a neural dosing regressor fail in high-stakes clinical pharmacotherapy.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="font-semibold text-slate-200 block mb-1">Impact of GAN Augmentation:</span>
              <p className="text-slate-400">
                Disabling the GAN generator (Transformer w/o GAN) inflated MAE by +5.73 mg/day (from 3.93 up to 9.66 mg/day in Diabetes) and degraded calibration ECE, showing the necessity of synthetic counterfactual augmentation for rare phenotypes.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="font-semibold text-slate-200 block mb-1">Full XAI Dominance:</span>
              <p className="text-slate-400">
                The Full XAI Model reduced MAE by 55.8% vs LLM-Only and 53.2% vs Transformer-w/o-GAN, lowered ADRs by 56.3%, required 50% fewer convergence steps, and delivered the highest clinician trust (4.76/5.0).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Figure 6 & Table 6 Clinical Outcomes */}
      {activeSubTab === 'outcomes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white">
              Clinical Outcomes & Patient-Reported Metrics (Figure 6 & Table 6)
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated across blood pressure reduction, glycemic control (HbA1c), ADR incidence, and patient satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TABLE_6_CLINICAL_OUTCOMES.map((item, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-2">{item.metric}</span>
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Standard</span>
                      <span className="font-mono text-lg text-slate-400 font-semibold">{item.standardPractice}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-teal-400 block uppercase font-semibold">AI Framework</span>
                      <span className="font-mono text-2xl text-teal-300 font-bold">{item.proposedFramework}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Clinical Shift:</span>
                    <span className="font-mono font-bold text-emerald-400">{item.improvementPct}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{item.clinicalMeaning}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Outcomes Deep Dive Paragraph */}
          <div className="p-4 bg-teal-950/20 border border-teal-500/30 rounded-lg text-xs text-slate-300 leading-relaxed">
            <h4 className="text-teal-300 font-semibold mb-1">
              Physiological Efficacy & Patient Quality of Life Impact:
            </h4>
            <p>
              In the hypertension cohort, systolic BP dropped by 10.2 mmHg with AI vs 8.5 mmHg under standard guidelines (+20% gain). For diabetic cohorts, HbA1c decreased by 0.8% vs 0.7% (+14.3% improvement) — in endocrinology, each 0.1% decline in HbA1c prevents microvascular retinopathies and renal microalbuminuria. Crucially, adverse drug reactions decreased from 12.5% down to 9.7% (-22.4% reduction), boosting overall patient satisfaction from 7.2 to 8.3 / 10.
            </p>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: Figure 7 Clinician Trust Shift */}
      {activeSubTab === 'trust' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white">
              Clinician Confidence in AI Recommendations (Pre- vs Post-XAI, Figure 7)
            </h3>
            <p className="text-xs text-slate-400">
              Survey of 40 clinicians on a 5-point Likert scale before and after the introduction of SHAP value decompositions and surrogate decision trees.
            </p>
          </div>

          {/* Stacked comparison chart */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {FIGURE_7_TRUST_SURVEY.map((survey) => (
              <div key={survey.level} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-white mb-2">Likert {survey.label}</div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Pre-XAI:</span>
                        <span className="font-mono">{survey.preXAI} / 40</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-500 h-full rounded-full"
                          style={{ width: `${(survey.preXAI / 20) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-teal-300 mb-1">
                        <span className="font-medium">Post-XAI:</span>
                        <span className="font-mono font-bold">{survey.postXAI} / 40</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full"
                          style={{ width: `${(survey.postXAI / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                  <span className={`font-mono text-xs font-bold ${survey.delta.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {survey.delta} Shift
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-2">
            <p>
              <strong>150% Surge in Highest Trust (Level 5):</strong> Prior to the XAI module, only 4 out of 40 clinicians rated their confidence at Level 5 (very high). Following the addition of SHAP waterfall plots and clinical decision trees, 10 clinicians gave Level 5 ratings (+150%), while Level 4 rose from 9 to 16 clinicians (+77.8%).
            </p>
            <p>
              <strong>Elimination of Skepticism:</strong> Low confidence levels (1 and 2) dropped from 12 total clinicians down to just 5. This shift demonstrates that transparent, auditable feature attributions bridge the clinical adoption gap.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
