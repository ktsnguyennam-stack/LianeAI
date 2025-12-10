import React, { useRef, useEffect } from 'react';
import { Message, LinaeResponse } from '../types';
import { Terminal as TerminalIcon, ShieldCheck, Activity, Cpu } from 'lucide-react';

interface TerminalProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = React.useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black border border-gray-800 rounded-lg overflow-hidden font-mono">
      {/* Header */}
      <div className="bg-gray-900/80 p-3 border-b border-gray-800 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <TerminalIcon size={16} />
          <span className="text-sm font-bold">EXECUTION_CONSOLE</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Cpu size={12} /> LAYER_1: ONLINE
          </span>
          <span className="flex items-center gap-1 text-amber-500/80">
            <ShieldCheck size={12} /> LAYER_2: ACTIVE
          </span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
            <div className="text-gray-600 text-sm text-center mt-20 italic">
                Awaiting input to initiate dual-layer processing sequence...
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-gray-800 text-gray-200 rounded-tr-none' : 'bg-transparent border border-gray-700 text-gray-300 rounded-tl-none'}`}>
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
            </div>
            
            {/* Internal Monologue / Metadata Visualization */}
            {msg.role === 'linae' && msg.metadata && (
                <div className="max-w-[90%] w-full bg-gray-900/50 rounded border border-dashed border-gray-800 p-3 text-xs space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center justify-between text-gray-500 border-b border-gray-800 pb-1 mb-2">
                        <span className="uppercase tracking-wider">Internal Process</span>
                        <span className={`${msg.metadata.intervention ? 'text-red-400' : 'text-green-400'}`}>
                            {msg.metadata.intervention ? 'INTERVENTION' : 'HARMONIZED'}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 opacity-70">
                            <div className="flex items-center gap-1 text-cyan-500 font-bold">
                                <Activity size={10} /> LAYER 1 (REFLEX)
                            </div>
                            <p className="italic text-gray-400 border-l-2 border-cyan-900 pl-2">
                                "{msg.metadata.reflexResponse.substring(0, 100)}{msg.metadata.reflexResponse.length > 100 ? '...' : ''}"
                            </p>
                            <div className="text-[10px] text-gray-600">Confidence: {msg.metadata.reflexConfidence}%</div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-amber-500 font-bold font-essence">
                                <ShieldCheck size={10} /> LAYER 2 (ESSENCE)
                            </div>
                            <p className="text-amber-100/70 border-l-2 border-amber-900/50 pl-2">
                                {msg.metadata.coreAnalysis}
                            </p>
                            <div className="text-[10px] text-gray-600">Resonance Score: {msg.metadata.resonanceScore}/100</div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
             <div className="flex flex-col items-start gap-2">
                 <div className="bg-gray-900 p-2 rounded text-xs text-cyan-500 flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    Generating Reflex...
                 </div>
             </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-950">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command for processing..."
            disabled={isLoading}
            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md py-3 px-4 pr-12 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-900 transition-all font-mono placeholder-gray-600"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors uppercase"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Terminal;