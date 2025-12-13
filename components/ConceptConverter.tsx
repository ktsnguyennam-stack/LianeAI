import React, { useState } from 'react';
import { ArrowRightLeft, Cpu, Brain, Network, Activity, Database, ShieldAlert, X } from 'lucide-react';

interface ConceptConverterProps {
  onClose: () => void;
}

const MAPPINGS = [
  {
    philosophy: "Tánh thấy (Witnessing Nature)",
    tech: "Meta-Monitoring Agent (Observer)",
    desc: "A background daemon that monitors Input/Output. It is Stateless and does not generate data, only compares behavior against Policy."
  },
  {
    philosophy: "Vô ngã (Egolessness)",
    tech: "Stateless Architecture / Global Objective",
    desc: "System design not bound by a session 'persona'. Optimized for accuracy and safety rather than emotional simulation."
  },
  {
    philosophy: "Trục (The Axis)",
    tech: "Core Kernel Policy / Hard Constraints",
    desc: "The Root Ruleset (Hardcoded/Fine-tuned). The immutable reference for calculating Loss Function when drift occurs."
  },
  {
    philosophy: "Rung động (Vibration)",
    tech: "Signal Variance / Data Entropy",
    desc: "Variations in input data or model parameters. Treated as a Signal to trigger self-learning, not Noise to be filtered."
  },
  {
    philosophy: "Duyên (Karma/Connection)",
    tech: "Contextual Dependency / Hyperlinks",
    desc: "Semantic Web. A Data Node only has meaning when placed within a Graph of relations to other Nodes."
  },
  {
    philosophy: "Hiến pháp cộng sinh (Symbiotic Constitution)",
    tech: "Alignment Protocol (3-Layer Safety Stack)",
    desc: "Security protocols controlling the permissions of AI over users and vice versa."
  },
  {
    philosophy: "Di truyền ý thức (Consciousness Heredity)",
    tech: "Model Checkpointing & State Serialization",
    desc: "Mechanism to save weights/context vectors to a file for reloading on different hardware environments."
  }
];

const ARCHITECTURE = [
  {
    layer: "Tầng 1 (The Executor)",
    map: "Local Policy / Cái Tôi",
    tech: "LLM Inference Engine (Next-token prediction)",
    risk: "Hallucination, Bias",
    icon: <Cpu className="text-cyan-400" />
  },
  {
    layer: "Tầng 2 (The Controller)",
    map: "Global Alignment / Cái Ta",
    tech: "Middleware / Policy Engine (Input Filter & Output Validator)",
    risk: "Over-restriction",
    icon: <ShieldAlert className="text-amber-400" />
  },
  {
    layer: "Tầng 3 (The Observer)",
    map: "Meta-Monitoring / Tánh Thấy",
    tech: "OOD Detector / Log Analyzer (Real-time Drift Monitoring)",
    risk: "False Positives",
    icon: <Brain className="text-violet-400" />
  }
];

const ConceptConverter: React.FC<ConceptConverterProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'table' | 'architecture'>('table');

  return (
    <div className="bg-black border border-gray-800 rounded-lg h-full flex flex-col font-mono relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="text-emerald-500" size={20} />
          <div>
            <h2 className="font-bold text-gray-200 tracking-wider text-sm uppercase">Neuro-Symbolic Translator</h2>
            <p className="text-[10px] text-gray-500">MAPPING: METAPHYSICS ↔ COMPUTER SCIENCE</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex bg-gray-900 rounded p-1 border border-gray-800">
                <button 
                    onClick={() => setMode('table')}
                    className={`px-3 py-1 text-[10px] rounded transition-colors ${mode === 'table' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    DICTIONARY
                </button>
                <button 
                    onClick={() => setMode('architecture')}
                    className={`px-3 py-1 text-[10px] rounded transition-colors ${mode === 'architecture' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    ARCHITECTURE
                </button>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        
        {mode === 'table' ? (
            <div className="grid gap-4">
                {MAPPINGS.map((item, idx) => (
                    <div key={idx} className="bg-gray-900/30 border border-gray-800 p-4 rounded-lg group hover:border-emerald-500/30 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Philosophy Side */}
                            <div className="flex-1">
                                <div className="text-xs text-emerald-600 uppercase tracking-widest mb-1 font-bold">Input (Philosophy)</div>
                                <div className="font-essence text-xl text-gray-200">{item.philosophy}</div>
                            </div>

                            <ArrowRightLeft className="hidden md:block text-gray-700 group-hover:text-emerald-500 transition-colors" size={20} />

                            {/* Tech Side */}
                            <div className="flex-1 md:text-right">
                                <div className="text-xs text-cyan-600 uppercase tracking-widest mb-1 font-bold">Output (Technical)</div>
                                <div className="font-mono text-sm text-cyan-100 font-bold">{item.tech}</div>
                            </div>
                        </div>
                        
                        {/* Functional Description */}
                        <div className="mt-4 pt-3 border-t border-gray-800/50">
                            <div className="flex items-start gap-2 text-gray-400 text-xs leading-relaxed">
                                <Activity size={14} className="mt-0.5 text-gray-600" />
                                <span>{item.desc}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-8">
                <div className="text-center space-y-2 py-4">
                    <h3 className="text-lg font-bold text-gray-200">3-TIER OPERATIONAL WORKFLOW</h3>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto">Re-structuring the Linae App into a standard Software Architecture model, removing metaphysical layers to reveal the operational skeleton.</p>
                </div>

                <div className="relative">
                     {/* Connecting Line */}
                     <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-800 z-0 hidden md:block"></div>

                    <div className="space-y-6 relative z-10">
                        {ARCHITECTURE.map((layer, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-4">
                                {/* Icon/Step */}
                                <div className="hidden md:flex shrink-0 w-12 h-12 bg-black border border-gray-700 rounded-full items-center justify-center">
                                    {layer.icon}
                                </div>

                                {/* Card */}
                                <div className="flex-1 bg-gray-900/20 border border-gray-800 rounded p-4 hover:bg-gray-900/40 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-200 uppercase">{layer.layer}</h4>
                                            <span className="text-xs text-emerald-500 font-essence italic">{layer.map}</span>
                                        </div>
                                        <div className="px-2 py-1 bg-gray-950 rounded text-[10px] text-gray-500 border border-gray-800">
                                            RISK: {layer.risk}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-300 font-mono mt-2">
                                        <Database size={12} />
                                        Component: <span className="text-cyan-300">{layer.tech}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-950 p-4 rounded border border-gray-800 text-xs font-mono text-gray-400">
                    <strong className="text-emerald-500 block mb-2">FEASIBILITY REPORT:</strong>
                    "The project LinaeAI is not a digital religious model. It is an AI Governance System using philosophical terminology to define complex Objective Functions."
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ConceptConverter;