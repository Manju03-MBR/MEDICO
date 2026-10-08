import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, Dna, Database, ShieldCheck, Filter } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  category: 'Pharmacogenomics' | 'Renal / Hepatic' | 'Drug Interaction' | 'Ontology (SNOMED/UMLS)';
  title: string;
  drugs: string[];
  geneOrBiomarker: string;
  evidenceLevel: 'Level 1A (High)' | 'Level 1B' | 'Level 2A' | 'Regulatory Label';
  guidelineSource: string;
  summary: string;
  clinicalAction: string;
}

const KNOWLEDGE_RECORDS: KnowledgeItem[] = [
  {
    id: 'KB-CYP2C19-GLIM',
    category: 'Pharmacogenomics',
    title: 'CYP2C19 Poor Metabolizers & Sulfonylureas (Glimepiride / Glipizide)',
    drugs: ['Glimepiride', 'Glipizide', 'Glyburide'],
    geneOrBiomarker: 'CYP2C19 (*2, *3 alleles)',
    evidenceLevel: 'Level 1A (High)',
    guidelineSource: 'PharmGKB PA166104998 & CPIC Guideline',
    summary: 'Loss-of-function variants reduce CYP2C19 catalytic clearance by >60%, producing prolonged plasma half-life and severe prolonged hypoglycemia.',
    clinicalAction: 'Reduce initial dosage by 30-50% or initiate therapy with alternative non-sulfonylurea agents.',
  },
  {
    id: 'KB-CYP2D6-BETA',
    category: 'Pharmacogenomics',
    title: 'CYP2D6 Poor Metabolizers & Metoprolol / Carvedilol',
    drugs: ['Metoprolol Succinate', 'Carvedilol', 'Propafenone'],
    geneOrBiomarker: 'CYP2D6 (*4/*4, *5 alleles)',
    evidenceLevel: 'Level 1A (High)',
    guidelineSource: 'CPIC Guideline for Beta-Adrenergic Antagonists',
    summary: 'CYP2D6 PM individuals exhibit 3- to 5-fold higher steady-state AUC of metoprolol compared to normal metabolizers, predisposing to profound bradycardia.',
    clinicalAction: 'Titrate at 50% standard dosage, monitor resting heart rate below 55 bpm, or substitute with bisoprolol/atenolol.',
  },
  {
    id: 'KB-SLCO1B1-STATIN',
    category: 'Pharmacogenomics',
    title: 'SLCO1B1 Transporter Deficiency & Simvastatin / Atorvastatin',
    drugs: ['Simvastatin', 'Atorvastatin', 'Pitavastatin'],
    geneOrBiomarker: 'SLCO1B1 (*5 allele, c.521T>C, rs4149056)',
    evidenceLevel: 'Level 1A (High)',
    guidelineSource: 'CPIC Guideline for Statin-Associated Myopathy',
    summary: 'Impaired hepatic OATP1B1 uptake transporter raises systemic simvastatin acid concentrations drastically, elevating rhabdomyolysis odds ratio to 16.9.',
    clinicalAction: 'Avoid 40mg+ simvastatin; restrict to ≤20mg daily or switch to rosuvastatin or pravastatin.',
  },
  {
    id: 'KB-GFR-DOSE-ADJ',
    category: 'Renal / Hepatic',
    title: 'Renal Clearance Titration Protocol in CKD Stages 3–5',
    drugs: ['Metformin', 'ACE Inhibitors', 'SGLT2i', 'Novel Oral Anticoagulants'],
    geneOrBiomarker: 'eGFR < 60 mL/min/1.73m²',
    evidenceLevel: 'Regulatory Label',
    guidelineSource: 'KDIGO 2024 Clinical Practice Guideline / FDA Guidance §3.2',
    summary: 'Decreased glomeruli filtration slows elimination of water-soluble drugs and metabolites, multiplying systemic exposure and nephrotoxicity risk.',
    clinicalAction: 'Apply stepwise dose reduction: -25% for eGFR 30–59; -50% for eGFR 15–29; contraindicate metformin if eGFR < 30.',
  },
  {
    id: 'KB-QT-DDI-RISK',
    category: 'Drug Interaction',
    title: 'Concomitant QT Prolongation & Torsades de Pointes Cascade',
    drugs: ['Amiodarone', 'Ondansetron', 'Citalopram', 'Azithromycin'],
    geneOrBiomarker: 'QTc Interval > 450 ms (Male) / > 460 ms (Female)',
    evidenceLevel: 'Regulatory Label',
    guidelineSource: 'CredibleMeds Known Risk of TdP Registry',
    summary: 'Synergistic block of cardiac hERG potassium channels triggers delayed ventricular repolarization and potentially fatal polymorphic ventricular tachycardia.',
    clinicalAction: 'Perform serial 12-lead ECGs; correct hypokalemia / hypomagnesemia; replace high-risk antiemetics or antibiotics.',
  },
  {
    id: 'KB-SNOMED-NER',
    category: 'Ontology (SNOMED/UMLS)',
    title: 'SNOMED-CT Concept 38341003 (Hypertensive Disorder) & RxNorm',
    drugs: ['Antihypertensive Agents'],
    geneOrBiomarker: 'UMLS C0020538 / SNOMED 38341003',
    evidenceLevel: 'Level 2A',
    guidelineSource: 'Unified Medical Language System (UMLS) Metathesaurus',
    summary: 'Natural language processing component φ(qu, f) extracts unstandardized clinical narrative notes and standardizes them into structured FHIR-compatible entities.',
    clinicalAction: 'Standardize patient electronic health records for seamless zero-leakage cross-system indexing.',
  },
];

export const EvidenceKnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = KNOWLEDGE_RECORDS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.drugs.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.geneOrBiomarker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
          <span>Section III-A: Treatment Data Retrieval Mechanism</span>
          <span aria-hidden="true">·</span>
          <span>BM25 + Dense Cosine Embedding D' = ψ(r, D)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Evidence Knowledge Base & Pharmacogenomic RAG Corpus
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Search the indexed provenance-linked evidence pool powering the Digital Twin. Correlates clinical guidelines, CPIC pharmacogenomic levels, FDA black-box alerts, and UMLS / SNOMED-CT ontologies.
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drugs (e.g. Glimepiride, Simvastatin), genes (CYP2D6, SLCO1B1), or guidelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs overflow-x-auto">
            {['All', 'Pharmacogenomics', 'Renal / Hepatic', 'Drug Interaction', 'Ontology (SNOMED/UMLS)'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-teal-400 font-mono text-[11px]">{item.id}</span>
                <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {item.evidenceLevel}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white leading-snug">{item.title}</h3>

              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mt-2">
                <span><strong>Target:</strong> {item.drugs.join(', ')}</span>
                <span>·</span>
                <span className="text-teal-300 font-mono"><strong>Marker:</strong> {item.geneOrBiomarker}</span>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <div className="text-xs text-amber-200">
                <strong>Clinician Action:</strong> {item.clinicalAction}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Source: {item.guidelineSource}</span>
                <span className="font-mono text-teal-400">RAG Token Indexed</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-8 text-center text-slate-500 text-xs">
          No pharmacogenomic evidence records match your search criteria.
        </div>
      )}
    </div>
  );
};
