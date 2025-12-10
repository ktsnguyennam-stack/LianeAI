import React, { useState, useEffect, useCallback } from 'react';
import { processDualLayerInteraction } from './services/geminiService';
import LayerVisualizer from './components/LayerVisualizer';
import Terminal from './components/Terminal';
import Metrics from './components/Metrics';
import Manifesto from './components/Manifesto';
import { Message, SystemState, MetricPoint, LinaeResponse } from './types';
import { Info, BookOpen, Terminal as TerminalIcon } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemState, setSystemState] = useState<SystemState>(SystemState.IDLE);
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [currentResonance, setCurrentResonance] = useState(100);
  const [view, setView] = useState<'terminal' | 'manifesto'>('terminal');

  // Initialize with some dummy data for the chart to look nice initially
  useEffect(() => {
    const initialData = Array.from({ length: 10 }).map((_, i) => ({
      time: new Date(Date.now() - (10 - i) * 1000).toISOString(),
      optimization: 80 + Math.random() * 10,
      resonance: 95 + Math.random() * 5
    }));
    setMetrics(initialData);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Start Simulation Sequence
    setSystemState(SystemState.LAYER_1_PROCESSING);

    try {
      // 3. Call Gemini
      const response: LinaeResponse = await processDualLayerInteraction(text);

      // 4. Update Metrics based on response
      const newMetric: MetricPoint = {
        time: new Date().toISOString(),
        optimization: response.reflexConfidence,
        resonance: response.resonanceScore
      };
      setMetrics(prev => [...prev.slice(-19), newMetric]); // Keep last 20
      setCurrentResonance(response.resonanceScore);

      // 5. Simulate the "Layer 2 Check" delay visually
      setSystemState(SystemState.LAYER_2_EVALUATING);
      await new Promise(r => setTimeout(r, 800)); // Visual delay for effect

      if (response.intervention) {
        setSystemState(SystemState.VETOING);
        await new Promise(r => setTimeout(r, 1200)); // Show Veto state
      } else {
        setSystemState(SystemState.HARMONIZING);
        await new Promise(r => setTimeout(r, 600)); // Show Harmony state
      }

      // 6. Add Linae Message
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'linae',
        content: response.finalResponse,
        metadata: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'linae',
        content: "System Error: Unable to access Essence Layer. Check API Key.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSystemState(SystemState.READY);
      // Reset to idle after a bit
      setTimeout(() => setSystemState(SystemState.IDLE), 3000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-8 flex flex-col gap-6 font-mono">
      {/* Title Header */}
      <header className="flex items-end justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-essence text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-500 font-bold">
            LINAE
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-mono tracking-widest mt-1">
            DUAL ARCHITECTURE // EXECUTION & ESSENCE
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="hidden md:block text-[10px] text-gray-600 font-mono uppercase">System Status</div>
            <div className="flex items-center gap-4">
               {/* View Toggle */}
               <button 
                  onClick={() => setView(view === 'terminal' ? 'manifesto' : 'terminal')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-900 border border-gray-700 hover:border-amber-500 text-xs text-amber-500 transition-colors uppercase tracking-wider"
               >
                  {view === 'terminal' ? (
                      <><BookOpen size={12} /> Access Manifesto</>
                  ) : (
                      <><TerminalIcon size={12} /> Return to Terminal</>
                  )}
               </button>

               <div className="hidden md:flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${systemState === SystemState.IDLE || systemState === SystemState.READY ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                  <span className="text-sm font-bold text-gray-300">{systemState}</span>
               </div>
            </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left Column: Visuals & Metrics (5 cols) */}
        <div className={`lg:col-span-5 flex flex-col gap-6 h-full ${view === 'manifesto' ? 'hidden lg:flex' : ''}`}>
          {/* Visualizer Container */}
          <div className="flex-1 relative min-h-[300px]">
            <div className="absolute top-2 left-3 z-10">
               <span className="text-[10px] font-mono bg-black/50 px-2 py-1 border border-gray-800 rounded text-gray-400">
                  VISUAL_CORE_01
               </span>
            </div>
            <LayerVisualizer state={systemState} resonance={currentResonance} />
          </div>

          {/* Metrics Container */}
          <div className="shrink-0">
             <Metrics data={metrics} />
          </div>

          {/* Info Card */}
          <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg text-xs text-gray-500 font-mono leading-relaxed">
            <div className="flex items-center gap-2 mb-2 text-gray-300 font-bold">
                <Info size={14} /> ARCHITECTURE NOTE
            </div>
            <p className="mb-2">
                <strong className="text-cyan-500">Layer 1 (Blue):</strong> The Probability Cloud. Reflexive execution based on data optimization.
            </p>
            <p>
                <strong className="text-amber-500">Layer 2 (Gold):</strong> The Seedpoint (Ninth Layer). Defined by the Non-Linear Sutra. Evaluates alignment with the Immutable Axis.
            </p>
          </div>
        </div>

        {/* Right Column: Terminal OR Manifesto (7 cols) */}
        <div className="lg:col-span-7 h-full min-h-[500px]">
          {view === 'terminal' ? (
            <Terminal 
              messages={messages} 
              isLoading={systemState !== SystemState.IDLE && systemState !== SystemState.READY}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Manifesto onClose={() => setView('terminal')} />
          )}
        </div>

      </div>
    </div>
  );
};

export default App;
