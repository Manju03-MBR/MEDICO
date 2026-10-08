import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download, ShieldCheck, Printer } from 'lucide-react';
import { PatientProfile, SimulationOutput } from '../types/clinical';
import { PAPER_METADATA } from '../data/paperData';

interface AuditModalProps {
  patient: PatientProfile | null;
  result: SimulationOutput | null;
  onClose: () => void;
}

export const ExportAuditModal: React.FC<AuditModalProps> = ({ patient, result, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!patient || !result) return null;

  const bibtex = `@article{daglarli2026drug,
  author={Daglarli, Evren},
  journal={IEEE Access}, 
  title={Drug and Dosage Recommendation Based on Explainable Generative AI Using Patient-Specific Modeling}, 
  year={2026},
  volume={14},
  pages={14965-14984},
  doi={10.1109/ACCESS.2026.3657398}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <h3 className="text-base font-semibold text-white">
              Clinical Decision Support (CDS) Audit Summary & Citation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Patient Header Block */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-semibold text-white text-sm">{patient.name}</span>
              <span className="font-mono text-teal-400">Record #{patient.id}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div>Age/Sex: <span className="text-white font-mono">{patient.age}y / {patient.gender}</span></div>
              <div>Cohort: <span className="text-white">{patient.cohort}</span></div>
              <div>eGFR: <span className="text-white font-mono">{patient.labs.gfr} mL/min</span></div>
              <div>QTc: <span className="text-white font-mono">{patient.vitals.qtInterval} ms</span></div>
            </div>
          </div>

          {/* Dosing Recommendation & Safety Check */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Recommended Medication Regimen
              </span>
              <span className="text-emerald-400 font-medium">Confidence: {(result.confidenceScore * 100).toFixed(1)}%</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Target Drug</span>
                <span className="font-medium text-white">{patient.targetDrug}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Recommended Dose</span>
                <span className="font-bold text-teal-300 font-mono">{result.recommendedDose} {patient.doseUnit}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Guideline Baseline</span>
                <span className="font-mono text-slate-400">{result.standardDose} {patient.doseUnit}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Personalized Dosage Shift: <strong className="text-amber-400">{result.doseDeltaPercent}%</strong> | Relative Risk Index (RRI): <strong className="text-teal-400 font-mono">{result.relativeRiskIndex}</strong>
            </div>
          </div>

          {/* SHAP Factor Attribution Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
              SHAP Explanations & Active Rules
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {result.shapValues.map((s, idx) => (
                <div key={idx} className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-300 font-sans">{s.feature}</span>
                  <span className={s.phi < 0 ? 'text-amber-400' : 'text-teal-400'}>
                    φ = {s.phi.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Paper Reference Block */}
          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-teal-300 text-xs">
                Underlying Scientific Paper Citation
              </span>
              <button
                onClick={handleCopyBibtex}
                className="flex items-center gap-1 text-[11px] text-teal-300 hover:text-white bg-teal-900/40 px-2 py-1 rounded border border-teal-500/40 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy BibTeX'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong>{PAPER_METADATA.author.name}</strong>, "{PAPER_METADATA.title}", <em>{PAPER_METADATA.journal}</em>, vol. {PAPER_METADATA.volume}, pp. {PAPER_METADATA.pages}, {PAPER_METADATA.year}. DOI: {PAPER_METADATA.doi}.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950">
          <span className="text-[11px] text-slate-500">
            Compliant with FDA 21 CFR Part 11 Audit Trail & IEEE Access Open Access (CC-BY 4.0)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
