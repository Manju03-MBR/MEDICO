import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User as UserIcon,
  Globe,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle,
  HelpCircle,
  Dna,
  Zap,
} from 'lucide-react';
import { PatientProfile } from '../types/clinical';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
  timestamp: string;
  modelUsed?: string;
}

interface ChatProps {
  currentPatient?: PatientProfile;
}

export const GeminiClinicalChat: React.FC<ChatProps> = ({ currentPatient }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'model',
      text: `Hello! I am your **PrecisionDose Clinical AI Assistant**, grounded in the IEEE Access 2026 research paper (*Daglarli, 2026*), PharmGKB, and clinical guidelines.

I can help you:
- Interpret patient pharmacogenomic variants (e.g. CYP2D6, CYP2C19, SLCO1B1)
- Verify renal filtration (eGFR) and QTc interval dosage reductions
- Query the latest FDA labels and clinical trial findings via **Google Search Grounding**
- Formulate clinical rationales for electronic health records

How can I assist your clinical decision-making today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [attachPatientContext, setAttachPatientContext] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setErrorMessage(null);
    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Build conversation history (excluding the first greeting to save tokens if desired)
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: historyPayload,
          model: selectedModel,
          enableSearch,
          patientContext: attachPatientContext && currentPatient ? {
            name: currentPatient.name,
            age: currentPatient.age,
            gfr: currentPatient.labs.gfr,
            targetDrug: currentPatient.targetDrug,
            guidelineDose: currentPatient.standardGuidelineDose,
            genomics: currentPatient.genomics,
            vitals: currentPatient.vitals,
            concomitantMeds: currentPatient.currentMedications,
          } : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to reach Gemini service`);
      }

      const data = await res.json();
      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text,
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat request error:', err);
      setErrorMessage(err.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[740px]">
      {/* Chat Header & Model Controls */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">PrecisionDose Gemini Clinical Consultant</h3>
              <span className="text-[11px] text-teal-400 font-mono hidden sm:inline">Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-turn pharmacology reasoning grounded in research & Google Search
            </p>
          </div>
        </div>

        {/* Controls: Model Switcher & Search Grounding Toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-teal-300 rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-teal-500 text-[11px] font-medium"
          >
            <option value="gemini-3.5-flash">gemini-3.5-flash (General + Search)</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Reasoning)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Lookup)</option>
          </select>

          {/* Search Grounding Checkbox Button */}
          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors text-[11px] ${
              enableSearch
                ? 'bg-blue-950/40 border-blue-500/50 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Enable Google Search Grounding to fetch live web data & recent medical literature"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Search Grounding: {enableSearch ? 'ON' : 'OFF'}</span>
          </button>

          {/* Patient Context Toggle */}
          {currentPatient && (
            <button
              onClick={() => setAttachPatientContext(!attachPatientContext)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors text-[11px] ${
                attachPatientContext
                  ? 'bg-teal-950/40 border-teal-500/50 text-teal-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Pass active patient digital twin vitals to prompt"
            >
              <Dna className="w-3.5 h-3.5 text-teal-400" />
              <span>Patient Context: {attachPatientContext ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scrollable Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`rounded-xl p-3.5 space-y-2 ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {/* Header line for message */}
                <div className="flex items-center justify-between text-[10px] text-current/70 border-b border-current/10 pb-1">
                  <span>{isUser ? 'You' : `PrecisionDose AI (${m.modelUsed || selectedModel})`}</span>
                  <span>{m.timestamp}</span>
                </div>

                {/* Message body with Markdown line breaks */}
                <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                  {m.text}
                </div>

                {/* Search Grounding Sources */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[10px] space-y-1">
                    <span className="text-blue-300 font-semibold flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-400" />
                      Google Search Grounding Sources:
                    </span>
                    <ul className="space-y-0.5">
                      {m.sources.map((src, idx) => (
                        <li key={idx} className="truncate">
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>{src.title || src.uri}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto items-center text-xs text-teal-400 p-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Consulting clinical literature & executing model inference...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-lg text-xs">
            {errorMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex gap-2 text-[11px]">
        <button
          onClick={() => handleSendMessage('How does CYP2C19 poor metabolizer status change sulfonylurea clearance?')}
          className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          💡 CYP2C19 & Glimepiride
        </button>
        <button
          onClick={() => handleSendMessage('What are the latest CPIC guidelines for SLCO1B1 and Simvastatin myopathy?')}
          className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          💡 SLCO1B1 Statin Guidelines
        </button>
        <button
          onClick={() => handleSendMessage('Explain why the paper found 22.4% fewer adverse drug reactions compared to fixed guidelines.')}
          className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          💡 Paper ADR Reduction Rationale
        </button>
        <button
          onClick={() => handleSendMessage('What does Cockcroft-Gault dosing recommend when eGFR is below 45 mL/min?')}
          className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          💡 Renal Clearance Titration
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={
              currentPatient
                ? `Ask about ${currentPatient.name}'s dosing, genetics (${currentPatient.genomics.cyp2c19}), or search literature...`
                : 'Ask a precision dosing or pharmacogenomic question...'
            }
            className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-teal-600 hover:bg-teal-500 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
