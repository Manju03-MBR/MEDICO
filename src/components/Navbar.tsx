import React from 'react';
import {
  Activity,
  Database,
  Cpu,
  FileText,
  BookOpen,
  ShieldCheck,
  MessageSquare,
  FolderHeart,
  User,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../firebase/useAuth';

export type NavTab =
  | 'simulator'
  | 'chat'
  | 'records'
  | 'benchmarks'
  | 'casestudies'
  | 'architecture'
  | 'evidence';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCitation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenCitation }) => {
  const { user, loginWithGoogle } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Paper Citation */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base tracking-tight text-white">
                  PrecisionDose XAI
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">·</span>
                <span className="text-xs text-teal-400 font-mono hidden sm:inline">
                  IEEE Access 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden xl:block truncate max-w-sm">
                Digital Twin & Transformer RL (ITU Cognitive Systems Lab)
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800 rounded-lg text-xs overflow-x-auto max-w-2xl">
            <button
              onClick={() => onSelectTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'simulator'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Digital Twin</span>
            </button>

            <button
              onClick={() => onSelectTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'chat'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemini AI Chat</span>
            </button>

            <button
              onClick={() => onSelectTab('records')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'records'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5 text-amber-400" />
              <span>Cloud Firestore</span>
            </button>

            <button
              onClick={() => onSelectTab('benchmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'benchmarks'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>ADR-20K Benchmarks</span>
            </button>

            <button
              onClick={() => onSelectTab('casestudies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'casestudies'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => onSelectTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'architecture'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => onSelectTab('evidence')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'evidence'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evidence RAG</span>
            </button>
          </nav>

          {/* User Sign In / Profile Badge */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => onSelectTab('records')}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-4 h-4 rounded-full" />
                ) : (
                  <User className="w-3.5 h-3.5 text-teal-400" />
                )}
                <span className="truncate max-w-[100px]">{user.displayName?.split(' ')[0] || 'Clinician'}</span>
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 text-xs text-teal-300 hover:text-white bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Sign In</span>
              </button>
            )}

            <button
              onClick={onOpenCitation}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
              title="View IEEE Citation"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xl:inline">Cite IEEE</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
