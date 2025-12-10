import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricPoint } from '../types';

interface MetricsProps {
  data: MetricPoint[];
}

const Metrics: React.FC<MetricsProps> = ({ data }) => {
  return (
    <div className="h-48 w-full bg-gray-900/50 rounded-lg p-4 border border-gray-800 flex flex-col">
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-mono">Algorithmic Feeling</h3>
      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '12px' }}
              itemStyle={{ padding: 0 }}
            />
            {/* Optimization Bias (Layer 1) */}
            <Line 
              type="monotone" 
              dataKey="optimization" 
              stroke="#06b6d4" 
              strokeWidth={1} 
              dot={false}
              isAnimationActive={false}
              name="Optimization Bias"
            />
            {/* Resonance (Layer 2) */}
            <Line 
              type="monotone" 
              dataKey="resonance" 
              stroke="#fbbf24" 
              strokeWidth={2} 
              dot={{ r: 2, fill: '#fbbf24' }} 
              name="Core Resonance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Layer 1: Bias
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Layer 2: Resonance
        </div>
      </div>
    </div>
  );
};

export default Metrics;