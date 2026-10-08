import React, { useState, useEffect } from 'react';
import {
  FolderPlus,
  Trash2,
  Calendar,
  User,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../firebase/useAuth';
import {
  saveConsultationRecord,
  getConsultationRecords,
  deleteConsultationRecord,
  SavedConsultation,
  logAuditRecord,
} from '../firebase/firestoreService';
import { PatientProfile, SimulationOutput } from '../types/clinical';

interface SavedConsultationsProps {
  currentPatient: PatientProfile;
  currentResult: SimulationOutput;
  onLoadPatientIntoTwin: (saved: SavedConsultation) => void;
}

export const SavedConsultationsManager: React.FC<SavedConsultationsProps> = ({
  currentPatient,
  currentResult,
  onLoadPatientIntoTwin,
}) => {
  const { user, loading: authLoading, loginWithGoogle, logout, authError } = useAuth();
  const [consultations, setConsultations] = useState<SavedConsultation[]>([]);
  const [loadingConsults, setLoadingConsults] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchRecords = async () => {
    if (!user) return;
    setLoadingConsults(true);
    try {
      const records = await getConsultationRecords(user.uid);
      setConsultations(records);
    } catch (err) {
      console.error('Failed to fetch consultations:', err);
    } finally {
      setLoadingConsults(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecords();
    } else {
      setConsultations([]);
    }
  }, [user]);

  const handleSaveCurrent = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveConsultationRecord(user.uid, {
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        cohort: currentPatient.cohort,
        targetDrug: currentPatient.targetDrug,
        recommendedDose: currentResult.recommendedDose,
        standardDose: currentResult.standardDose,
        doseUnit: currentPatient.doseUnit,
        doseDeltaPercent: currentResult.doseDeltaPercent,
        adrRiskScore: currentResult.adrRiskScore,
        relativeRiskIndex: currentResult.relativeRiskIndex,
        clinicalNotes: notes || 'Verified with SHAP safety gating.',
      });

      await logAuditRecord(user.uid, 'SAVE_CONSULTATION', `Saved dosing plan for ${currentPatient.name}`);
      setSaveSuccess(true);
      setNotes('');
      fetchRecords();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving consultation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteConsultationRecord(user.uid, id);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
      await logAuditRecord(user.uid, 'DELETE_CONSULTATION', `Removed record ID ${id}`);
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Auth Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
              <span>Firebase Auth & Cloud Firestore Integration</span>
              <span aria-hidden="true">·</span>
              <span>Zero-Trust ABAC Security</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Clinical Records & Consultation Persistence
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Authenticate via Google Sign-In to securely store patient digital-twin dosing runs, audit trails, and personalized clinical notes in your private Cloud Firestore instance.
            </p>
          </div>

          {/* User Profile / Login State */}
          <div className="shrink-0">
            {authLoading ? (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Checking credentials...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-teal-500/40" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-900/50 flex items-center justify-center text-teal-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-white">{user.displayName || 'Authorized Clinician'}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-2"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Save Current Consultation (Left) vs Saved Records History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Save Current Workbench Run */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-semibold text-white">Save Current Consultation</h3>
            </div>
            <span className="text-xs font-mono text-teal-400">Record to Cloud</span>
          </div>

          {/* Current Simulation Snapshot */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold text-white">{currentPatient.name}</span>
              <span className="text-[11px] font-mono text-teal-400">{currentPatient.cohort}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
              <div>Drug: <span className="text-white">{currentPatient.targetDrug}</span></div>
              <div>AI Dose: <span className="text-teal-300 font-bold">{currentResult.recommendedDose} {currentPatient.doseUnit}</span></div>
              <div>Standard: <span className="text-slate-300">{currentResult.standardDose} {currentPatient.doseUnit}</span></div>
              <div>ADR RRI: <span className="text-emerald-400">{currentResult.relativeRiskIndex}</span></div>
            </div>
          </div>

          {/* Clinician Notes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Physician Consultation Notes & Audit Rationale:
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Approved 50% metoprolol reduction due to CYP2D6 PM genotype and borderline resting heart rate (58 bpm). Scheduled repeat ECG in 14 days."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
            />
          </div>

          <button
            onClick={handleSaveCurrent}
            disabled={!user || saving}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving to Firestore...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{user ? 'Save Consultation to Cloud' : 'Sign In Required to Save'}</span>
              </>
            )}
          </button>

          {saveSuccess && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Consultation permanently stored in your private Firestore collection!</span>
            </div>
          )}
        </div>

        {/* Right: Saved Consultations List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-semibold text-white">Your Saved Consultations</h3>
            </div>
            {user && (
              <button
                onClick={fetchRecords}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                title="Refresh from Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingConsults ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            )}
          </div>

          {!user ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-slate-400 font-medium">Please sign in with Google to access your persistent consultations.</p>
              <p className="text-[11px]">All data is isolated under Zero-Trust ABAC security rules in Cloud Firestore.</p>
            </div>
          ) : loadingConsults ? (
            <div className="p-12 text-center text-teal-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading records from Cloud Firestore...</span>
            </div>
          ) : consultations.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No saved consultations found in your account yet. Save your first patient run from the left panel!
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {consultations.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-white text-sm">{item.patientName}</span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-teal-400">{item.cohort}</span>
                        <span>·</span>
                        <span>Rx: <strong className="text-slate-200">{item.targetDrug}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onLoadPatientIntoTwin(item)}
                        className="text-[11px] text-teal-400 hover:text-teal-300 bg-teal-950/40 border border-teal-500/30 px-2 py-1 rounded transition-colors"
                      >
                        Load Twin
                      </button>
                      {item.id && (
                        <button
                          onClick={() => handleDelete(item.id!)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Delete from Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dosing Stats */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2 rounded-lg font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">AI Dose</span>
                      <span className="text-teal-300 font-bold">{item.recommendedDose} {item.doseUnit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Guideline</span>
                      <span className="text-slate-400">{item.standardDose} {item.doseUnit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ADR Index</span>
                      <span className="text-emerald-400">RRI {item.relativeRiskIndex}</span>
                    </div>
                  </div>

                  {item.clinicalNotes && (
                    <div className="text-[11px] text-slate-300 bg-slate-900/30 p-2 rounded border border-slate-800/60">
                      <strong>Notes:</strong> {item.clinicalNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
