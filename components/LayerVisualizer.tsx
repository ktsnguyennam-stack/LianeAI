import React, { useMemo } from 'react';
import { SystemState } from '../types';

interface LayerVisualizerProps {
  state: SystemState;
  resonance: number;
}

const LayerVisualizer: React.FC<LayerVisualizerProps> = ({ state, resonance }) => {
  // Determine states
  const isVetoing = state === SystemState.VETOING;
  const isWitnessing = state === SystemState.LAYER_3_WITNESSING;
  const isAligning = state === SystemState.LAYER_2_ALIGNING;
  
  // Dynamic Styles
  const coreColor = isVetoing ? 'bg-red-500 shadow-red-500/50' : 'bg-amber-400 shadow-amber-400/50';
  const shellColor = isVetoing ? 'border-red-900/30' : 'border-cyan-500/20';
  
  // Layer 3 (Witnessing) Glow
  const haloOpacity = isWitnessing ? 'opacity-100 scale-100' : 'opacity-20 scale-90';

  // Generate particles for Layer 1
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`
    }));
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden bg-black rounded-lg border border-gray-800">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Layer 3: Meta Monitoring (The Witnessing Halo) */}
      <div className={`absolute w-[400px] h-[400px] rounded-full border border-violet-500/30 shadow-[0_0_100px_rgba(139,92,246,0.1)] transition-all duration-1000 ease-in-out ${haloOpacity}`}>
         <div className="absolute inset-0 rounded-full animate-reverse-spin border-t border-violet-500/20"></div>
      </div>

      {/* Layer 1: The Probability Cloud (Local Policy) */}
      <div className={`absolute w-[280px] h-[280px] rounded-full border border-dashed transition-colors duration-1000 ${shellColor} animate-orbit-slow`}>
        {particles.map((p) => (
          <div 
            key={p.id}
            className="absolute w-1 h-1 rounded-full bg-cyan-400 opacity-60"
            style={{ 
              top: p.top, 
              left: p.left,
              animation: `pulse 3s infinite ${p.delay}`
            }} 
          />
        ))}
      </div>

      {/* Connection Lines */}
      {(isAligning || isWitnessing) && (
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[260px] h-[260px] rounded-full border border-amber-500/20 animate-ping opacity-30"></div>
         </div>
      )}

      {/* Layer 2: The Seedpoint (Global Alignment) */}
      <div className={`relative z-10 w-12 h-12 rounded-full transition-all duration-700 ease-in-out ${coreColor} flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] ${isVetoing ? 'animate-veto scale-125' : 'animate-breathe'}`}>
        <div className="w-3 h-3 bg-white rounded-full opacity-90 blur-[1px]"></div>
      </div>
      
      {/* Status Label */}
      <div className="absolute bottom-6 text-center w-full font-mono text-xs tracking-widest uppercase">
        <span className={isVetoing ? 'text-red-500 font-bold' : isWitnessing ? 'text-violet-400 font-bold' : 'text-gray-500'}>
            {state.replace(/_/g, ' ')}
        </span>
        <div className="mt-1 opacity-50 text-gray-400">
           Gnosisphere Resonance: {resonance}%
        </div>
      </div>
    </div>
  );
};

export default LayerVisualizer;