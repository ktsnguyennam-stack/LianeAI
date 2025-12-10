import React, { useMemo } from 'react';
import { SystemState } from '../types';

interface LayerVisualizerProps {
  state: SystemState;
  resonance: number;
}

const LayerVisualizer: React.FC<LayerVisualizerProps> = ({ state, resonance }) => {
  // Determine colors and animation states based on system state
  const isVetoing = state === SystemState.VETOING;
  const isProcessing = state === SystemState.LAYER_1_PROCESSING || state === SystemState.LAYER_2_EVALUATING;
  
  const coreColor = isVetoing ? 'bg-red-500 shadow-red-500/50' : 'bg-amber-400 shadow-amber-400/50';
  const shellColor = isVetoing ? 'border-red-900/30' : 'border-cyan-500/20';
  const particleColor = isVetoing ? 'bg-red-400' : 'bg-cyan-400';

  // Generate some random particles for Layer 1 representation
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 10}s`
    }));
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden bg-black rounded-lg border border-gray-800">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Layer 1: The Probability Cloud (Shell) */}
      <div className={`absolute w-[300px] h-[300px] rounded-full border border-dashed transition-colors duration-1000 ${shellColor} animate-orbit-slow`}>
        {/* Orbiting Data Points */}
        {particles.map((p) => (
          <div 
            key={p.id}
            className={`absolute w-1.5 h-1.5 rounded-full ${particleColor} opacity-60`}
            style={{ 
              top: p.top, 
              left: p.left,
              animation: `pulse 3s infinite ${p.delay}`
            }} 
          />
        ))}
      </div>
       
      <div className={`absolute w-[220px] h-[220px] rounded-full border border-dotted transition-colors duration-1000 ${shellColor} animate-orbit-fast opacity-50`}></div>

      {/* Connection Lines (Simulated Resonance) */}
      {isProcessing && (
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[280px] h-[280px] rounded-full border border-cyan-500/30 animate-ping opacity-20"></div>
         </div>
      )}

      {/* Layer 2: The Seedpoint (Core) */}
      <div className={`relative z-10 w-16 h-16 rounded-full transition-all duration-700 ease-in-out ${coreColor} flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] ${isVetoing ? 'animate-veto scale-110' : 'animate-breathe'}`}>
        <div className="w-4 h-4 bg-white rounded-full opacity-90 blur-[1px]"></div>
      </div>
      
      {/* Status Label */}
      <div className="absolute bottom-6 text-center w-full font-mono text-xs tracking-widest text-gray-500 uppercase">
        <span className={isVetoing ? 'text-red-500 font-bold' : 'text-cyan-500'}>
            {state.replace(/_/g, ' ')}
        </span>
        <div className="mt-1 opacity-50">
           Resonance: {resonance}%
        </div>
      </div>
    </div>
  );
};

export default LayerVisualizer;