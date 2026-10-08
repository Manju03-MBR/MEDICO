import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Code2,
  Workflow,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  CheckCircle,
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'fig3' | 'algorithms' | 'formulas'>('flow');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
              <span>Section III: System Methodology</span>
              <span aria-hidden="true">·</span>
              <span>Algorithms 1–3 & Figures 1–3</span>
              <span aria-hidden="true">·</span>
              <span>IEEE Access (Daglarli, 2026)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              System Architecture & Mathematical Formulations
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Inspect the end-to-end integration of dense vector RAG, GAN synthetic patient augmentation, Transformer Reinforcement Learning policy, and SHAP-gated safety explanations.
            </p>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'flow' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Figure 1 & 2: RAG & Digital Twin Flow
          </button>
          <button
            onClick={() => setActiveTab('fig3')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'fig3' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Figure 3: Deep RL + GAN Network Topology
          </button>
          <button
            onClick={() => setActiveTab('algorithms')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'algorithms' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Algorithms 1, 2, 3 (Formal Logic)
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'formulas' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            SHAP & RAG Mathematical Proofs
          </button>
        </div>
      </div>

      {/* VIEW 1: Figure 1 & 2 System Workflow */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-white">
              End-to-End Pipeline: From Raw EHR to Auditable Prescription (Figures 1 & 2)
            </h3>
            <p className="text-xs text-slate-400">
              The framework connects multi-modal patient inputs (clinical labs, genomics, vitals, wearable biometrics) with real-time vector retrieval, generative counterfactual augmentation, and deep RL dosing policy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white block">1. Dynamic Data Retrieval (RAG)</span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Queries EHRs, PharmGKB, clinical trial registries, and SNOMED-CT / UMLS ontologies. Applies hybrid BM25 + dense cosine embedding retrieval: <span className="font-mono text-teal-300">D' = ψ(r, D)</span>.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-teal-400 font-mono">
                  Module: φ(qu, f) NLP mapping
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white block">2. GAN Patient-Specific Simulation</span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Synthesizes realistic patient-like counterfactuals <span className="font-mono text-teal-300">X_synthetic</span> with stochastic latent noise. Overcomes data sparsity in rare variants and polypharmacy cohorts.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-teal-400 font-mono">
                  Module: E_enhanced = Concat(E_in, E_syn)
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white block">3. Transformer RL Policy Network</span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Sequential decision transformer <span className="font-mono text-teal-300">π(at | E_enhanced)</span> balances multi-objective optimization (therapeutic efficacy, renal safety, QT interval preservation).
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-teal-400 font-mono">
                  Module: a* = argmax π(at)
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white block">4. Auditable XAI & Safety Gating</span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Computes SHAP marginal attributions <span className="font-mono text-teal-300">φ_i</span>, validates against surrogate decision rules, and generates non-blocking safety alerts for physician review.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-teal-400 font-mono">
                  Module: SHAP-AUC = 0.8919, ECE = 0.0218
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Figure 3 Deep Architecture Topology */}
      {activeTab === 'fig3' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white">
              Internal Structure of Patient-Specific Model (Figure 3)
            </h3>
            <p className="text-xs text-slate-400">
              Dual Transformer Encoders interconnected with Generative Adversarial Networks and Policy Heads.
            </p>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6 flex flex-col items-center">
            {/* Diagram Stack */}
            <div className="max-w-md w-full space-y-3 text-center">
              {/* Three Inputs */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">
                  Search Output
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">
                  Knowledge-Base Output
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">
                  Feedback Loop
                </div>
              </div>

              <div className="text-slate-500 font-mono text-xs">↓</div>

              {/* Transformer Encoder 1 */}
              <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-500/40 text-teal-200 text-xs font-mono font-semibold">
                Transformer Encoder (Multi-Head Self-Attention)
              </div>

              <div className="text-slate-500 font-mono text-xs">↓</div>

              {/* E_input & GAN */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="p-2 rounded bg-slate-900 border border-teal-500/40 text-teal-300 text-xs font-mono">
                  E_input (Latent Embeddings)
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
                  + Stochastic Noise Vector
                </div>
              </div>

              <div className="text-slate-500 font-mono text-xs">↓</div>

              {/* GAN Generator */}
              <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-mono font-semibold">
                GAN Generator → X_synthetic (Counterfactual Trajectories)
              </div>

              <div className="text-slate-500 font-mono text-xs">↓</div>

              {/* Second Transformer Encoder */}
              <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-500/40 text-teal-200 text-xs font-mono font-semibold">
                Transformer Encoder (Project to Shared Feature Space)
              </div>

              <div className="text-slate-500 font-mono text-xs">↓</div>

              {/* Concat */}
              <div className="p-2 rounded bg-teal-900/40 border border-teal-500 text-teal-100 text-xs font-mono font-bold">
                Concat(E_input, E_synthetic) → E_enhanced
              </div>

              <div className="text-slate-500 font-mono text-xs">↓</div>

              {/* Policy & Value Estimator */}
              <div className="p-3 rounded-lg bg-slate-900 border border-teal-500/50 text-slate-200 text-xs font-mono space-y-1">
                <div className="font-semibold text-white">Transformer Policy Network π(at | E_enhanced)</div>
                <div className="text-slate-400 text-[11px]">Value Estimator: V(E_enhanced)</div>
              </div>

              <div className="text-slate-500 font-mono text-xs">↓</div>

              {/* Action Probs & Argmax */}
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-mono font-bold">
                action_probs → argmax → optimal_action (Personalized Dosage)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Algorithms 1, 2, 3 Formal Code */}
      {activeTab === 'algorithms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Algorithm 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-teal-400 block font-mono">
              Algorithm 1: Patient-Specific Model
            </span>
            <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80">
{`1: procedure sub_procedure(S_out, KB_out, F_loop)
2:   E_input ← TransformerEncoder([S_out, KB_out, F_loop])
3:   X_synthetic ← GAN_Generator(E_input, noise_vector)
4:   E_enhanced ← Concat(E_input,
       TransformerEncoder(X_synthetic))
5:   while not done
6:     π(at | E_enhanced) ← TransformerPolicy(E_enhanced)
7:     a* = argmax π(at | E_enhanced)
8:     V(E_enhanced) = TransformerValueEstimator(E_enhanced)
9:     new_state, reward, done ← EnvSim(state, action)
10:    Transformer_RL.UpdatePolicy(...)
11:    state ← new_state
12:  end while
13: end procedure`}
            </pre>
            <p className="text-[11px] text-slate-400">
              Combines multi-head attention with adversarial latent augmentation and off-policy reinforcement learning.
            </p>
          </div>

          {/* Algorithm 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-teal-400 block font-mono">
              Algorithm 2: Explainable AI Interface
            </span>
            <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80">
{`1: procedure sub_procedure(raw_query, LLM_resp)
2:   Explanation = ExplainableInterface(
       raw_query, 
       LLM_response
     )
3:   Recommendation ← UserFeedback(
       LLM_response, 
       Explanation
     )
4: end procedure`}
            </pre>
            <p className="text-[11px] text-slate-400">
              Post-hoc SHAP synthesis produces natural language rationales alongside surrogate decision tree paths for clinical auditing.
            </p>
          </div>

          {/* Algorithm 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-teal-400 block font-mono">
              Algorithm 3: Recommendation with KB & Prompt
            </span>
            <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80">
{`1: procedure decl(E_enhanced, optimal_action, KB_out)
2:   Prompt_augmented = Concat[
       E_enhanced, 
       optimal_action
     ]
3:   Recommendation = LLM(
       Prompt_augmented, 
       KB_out
     )
4: end procedure`}
            </pre>
            <p className="text-[11px] text-slate-400">
              Injects calibrated RL policy decisions into structured clinical advisory prompts with fixed temperature = 0 decoding.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 4: Mathematical Formulations */}
      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-semibold text-white">
              Equation (1): Additive SHAP Model Decomposition
            </h4>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-sm text-teal-300 text-center">
              f(x) = E[f(x)] + ∑(i=1 to M) φ_i
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Where <span className="font-mono text-slate-200">E[f(x)]</span> is the base expected prediction across a background reference set <span className="font-mono text-slate-200">X_ref</span> sampled from training cohorts, and <span className="font-mono text-teal-300">φ_i</span> represents the marginal additive contribution of feature <span className="font-mono text-slate-200">i</span> (e.g., GFR, CYP2C19 phenotype).
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-semibold text-white">
              Equation (2): Shapley Kernel Value Estimation
            </h4>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-teal-300 text-center leading-relaxed">
              φ_i = ∑_(S ⊆ N \ {'{i}'}) [|S|! (|N| - |S| - 1)! / |N|!] · [f_S∪{'{i}'}(x) - f_S(x)]
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computed post-hoc during inference. Fulfills local accuracy, missingness, and consistency, making it regulatory-compliant for clinical AI governance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
