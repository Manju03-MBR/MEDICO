import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DigitalTwinSimulator } from './components/DigitalTwinSimulator';
import { GeminiClinicalChat } from './components/GeminiClinicalChat';
import { SavedConsultationsManager } from './components/SavedConsultationsManager';
import { BenchmarkExplorer } from './components/BenchmarkExplorer';
import { CaseStudiesGallery } from './components/CaseStudiesGallery';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { EvidenceKnowledgeBase } from './components/EvidenceKnowledgeBase';
import { ExportAuditModal } from './components/ExportAuditModal';
import { PatientProfile, SimulationOutput } from './types/clinical';
import { BENCHMARK_CASE_STUDIES, PAPER_METADATA } from './data/paperData';
import { runDigitalTwinSimulation } from './utils/simulationEngine';
import { HeartPulse, MessageSquare, Database, Sparkles } from 'lucide-react';
import { SavedConsultation } from './firebase/firestoreService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('simulator');
  const [activePatient, setActivePatient] = useState<PatientProfile>(BENCHMARK_CASE_STUDIES[0]);

  const [auditModalData, setAuditModalData] = useState<{
    patient: PatientProfile | null;
    result: SimulationOutput | null;
  }>({
    patient: null,
    result: null,
  });

  const activeSimulationResult = runDigitalTwinSimulation(activePatient);

  const handleOpenAudit = (patient: PatientProfile, result: SimulationOutput) => {
    setAuditModalData({ patient, result });
  };

  const handleOpenCitation = () => {
    setAuditModalData({
      patient: activePatient,
      result: activeSimulationResult,
    });
  };

  const handleLoadCaseIntoSimulator = (patient: PatientProfile) => {
    setActivePatient(patient);
    setCurrentTab('simulator');
  };

  const handleLoadSavedConsultation = (saved: SavedConsultation) => {
    const matched = BENCHMARK_CASE_STUDIES.find((c) => c.id === saved.patientId);
    if (matched) {
      setActivePatient({ ...matched, targetDrug: saved.targetDrug });
    }
    setCurrentTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCitation={handleOpenCitation}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'simulator' && (
          <div className="space-y-4">
            <DigitalTwinSimulator onOpenAudit={handleOpenAudit} />
            {/* Quick Banner to Launch Gemini Chat for this patient */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-950/60 rounded-lg text-blue-400 border border-blue-500/30">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Need Clinical Pharmacological Consultation?</span>
                  <p className="text-slate-400 text-[11px]">
                    Consult Gemini 3.5 Flash / Gemini 3.1 Pro with real-time Google Search grounding.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('chat')}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Gemini Clinical Chat</span>
              </button>
            </div>
          </div>
        )}

        {currentTab === 'chat' && (
          <div className="space-y-4">
            <GeminiClinicalChat currentPatient={activePatient} />
          </div>
        )}

        {currentTab === 'records' && (
          <SavedConsultationsManager
            currentPatient={activePatient}
            currentResult={activeSimulationResult}
            onLoadPatientIntoTwin={handleLoadSavedConsultation}
          />
        )}

        {currentTab === 'benchmarks' && <BenchmarkExplorer />}

        {currentTab === 'casestudies' && (
          <CaseStudiesGallery onLoadIntoSimulator={handleLoadCaseIntoSimulator} />
        )}

        {currentTab === 'architecture' && <ArchitectureViewer />}

        {currentTab === 'evidence' && <EvidenceKnowledgeBase />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-400" />
            <span>
              <strong>PrecisionDose XAI Platform</strong> · Istanbul Technical University (ITU) Cognitive Systems Laboratory
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>IEEE Access Vol. 14, 2026</span>
            <span aria-hidden="true">·</span>
            <span>DOI: {PAPER_METADATA.doi}</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleOpenCitation}
              className="text-teal-400 hover:text-teal-300 underline underline-offset-4"
            >
              Cite Article
            </button>
          </div>
        </div>
      </footer>

      {/* Audit & Citation Modal */}
      {auditModalData.patient && auditModalData.result && (
        <ExportAuditModal
          patient={auditModalData.patient}
          result={auditModalData.result}
          onClose={() => setAuditModalData({ patient: null, result: null })}
        />
      )}
    </div>
  );
}
