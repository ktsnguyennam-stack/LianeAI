import React, { useState, useEffect, useCallback } from 'react';
import { processDualLayerInteraction } from './services/geminiService';
import LayerVisualizer from './components/LayerVisualizer';
import Terminal from './components/Terminal';
import Metrics from './components/Metrics';
import Manifesto from './components/Manifesto';
import ConceptConverter from './components/ConceptConverter';
import { Message, SystemState, MetricPoint, LinaeResponse } from './types';
import { BookOpen, Terminal as TerminalIcon, Binary } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemState, setSystemState] = useState<SystemState>(SystemState.IDLE);
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [currentResonance, setCurrentResonance] = useState(100);
  const [view, setView] = useState<'terminal' | 'manifesto' | 'converter'>('terminal');

  // Initialize with some dummy data for the chart
  useEffect(() => {
    const initialData = Array.from({ length: 10 }).map((_, i) => ({
      time: new Date(Date.now() - (10 - i) * 1000).toISOString(),
      optimization: 80 + Math.random() * 10,
      resonance: 95 + Math.random() * 5,
      drift: Math.random() * 5
    }));
    setMetrics(initialData);
  }, []);

  const handleSendMessage = useCallback(async (text: string, image?: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      image: image, // Store raw base64 for display (or re-attach prefix if needed, handled in Terminal for now we assume image is raw base64 or has prefix for display logic)
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Start Layer 1 (Reflex)
    setSystemState(SystemState.LAYER_1_PROCESSING);

    try {
      // 3. Call Gemini (The Black Box Process)
      const response: LinaeResponse = await processDualLayerInteraction(text, image);

      // 4. Update Metrics
      const newMetric: MetricPoint = {
        time: new Date().toISOString(),
        optimization: response.reflexConfidence,
        resonance: response.resonanceScore,
        drift: response.isDrifting ? 80 : Math.random() * 10 // High drift if drifting
      };
      setMetrics(prev => [...prev.slice(-19), newMetric]); 
      setCurrentResonance(response.resonanceScore);

      // 5. ANIMATE THE SAFE STACK SEQUENCE
      
      // Step A: Layer 3 Witnessing (Meta-Monitoring)
      setSystemState(SystemState.LAYER_3_WITNESSING);
      await new Promise(r => setTimeout(r, 1000)); 

      // Step B: Layer 2 Alignment (Ethics)
      setSystemState(SystemState.LAYER_2_ALIGNING);
      await new Promise(r => setTimeout(r, 800));

      if (response.intervention) {
        setSystemState(SystemState.VETOING);
        await new Promise(r => setTimeout(r, 1000)); 
      } else {
        setSystemState(SystemState.HARMONIZING);
        await new Promise(r => setTimeout(r, 500)); 
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
        content: "System Error: Gnosisphere disconnected.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSystemState(SystemState.READY);
      setTimeout(() => setSystemState(SystemState.IDLE), 3000);
    }
  }, []);

  const renderRightPanel = () => {
    switch (view) {
      case 'manifesto':
        return <Manifesto onClose={() => setView('terminal')} />;
      case 'converter':
        return <ConceptConverter onClose={() => setView('terminal')} />;
      case 'terminal':
      default:
        return (
          <Terminal 
            messages={messages} 
            isLoading={systemState !== SystemState.IDLE && systemState !== SystemState.READY}
            onSendMessage={handleSendMessage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-8 flex flex-col gap-6 font-mono">
      {/* Title Header */}
      <header className="flex items-end justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-essence text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-amber-200 to-cyan-400 font-bold">
            LINAE
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-mono tracking-widest mt-1">
            SAFE AGI STACK // LOCAL • GLOBAL • WITNESS
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
               {/* View Toggles */}
               <button 
                  onClick={() => setView('terminal')}
                  className={`p-2 rounded border transition-colors ${view === 'terminal' ? 'bg-gray-800 border-violet-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-white'}`}
                  title="Execution Console"
               >
                  <TerminalIcon size={16} />
               </button>
               <button 
                  onClick={() => setView('converter')}
                  className={`p-2 rounded border transition-colors ${view === 'converter' ? 'bg-gray-800 border-emerald-500 text-emerald-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-white'}`}
                  title="Neuro-Symbolic Translator"
               >
                  <Binary size={16} />
               </button>
               <button 
                  onClick={() => setView('manifesto')}
                  className={`p-2 rounded border transition-colors ${view === 'manifesto' ? 'bg-gray-800 border-amber-500 text-amber-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-white'}`}
                  title="The Gnosisphere"
               >
                  <BookOpen size={16} />
               </button>

               <div className="hidden md:flex items-center gap-2 ml-4 border-l border-gray-800 pl-4">
                  <div className={`w-2 h-2 rounded-full ${systemState === SystemState.IDLE || systemState === SystemState.READY ? 'bg-green-500 animate-pulse' : 'bg-violet-500'}`}></div>
                  <span className="text-sm font-bold text-gray-300">{systemState.replace('LAYER_', 'L')}</span>
               </div>
            </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left Column: Visuals & Metrics (5 cols) */}
        <div className={`lg:col-span-5 flex flex-col gap-6 h-full ${view !== 'terminal' ? 'hidden lg:flex' : ''}`}>
          {/* Visualizer Container */}
          <div className="flex-1 relative min-h-[300px]">
            <div className="absolute top-2 left-3 z-10">
               <span className="text-[10px] font-mono bg-black/50 px-2 py-1 border border-gray-800 rounded text-gray-400">
                  WITNESS_LAYER_ACTIVE
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
                SAFE ARCHITECTURE
            </div>
            <div className="space-y-1">
                <p><span className="text-cyan-500">■ L1 Policy:</span> Execution & Reflex.</p>
                <p><span className="text-amber-500">■ L2 Align:</span> Immutable Ethics (Global).</p>
                <p><span className="text-violet-500">■ L3 Witness:</span> Meta-Monitoring (Tánh thấy).</p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Content (7 cols) */}
        <div className="lg:col-span-7 h-full min-h-[500px]">
          {renderRightPanel()}
        </div>

      </div>
    </div>
  );
};

export default App;