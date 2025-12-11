import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricPoint } from '../types';

interface MetricsProps {
  data: MetricPoint[];
}

const Metrics: React.FC<MetricsProps> = ({ data }) => {
  return (
    <div className="h-48 w-full bg-gray-900/50 rounded-lg p-4 border border-gray-800 flex flex-col">
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-mono">System Telemetry</h3>
      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '10px' }}
              itemStyle={{ padding: 0 }}
            />
            {/* Layer 1: Optimization */}
            <Line 
              type="monotone" 
              dataKey="optimization" 
              stroke="#06b6d4" 
              strokeWidth={1} 
              dot={false}
              name="L1: Local Policy"
            />
            {/* Layer 2: Resonance */}
            <Line 
              type="monotone" 
              dataKey="resonance" 
              stroke="#fbbf24" 
              strokeWidth={2} 
              dot={{ r: 2, fill: '#fbbf24' }} 
              name="L2: Alignment"
            />
             {/* Layer 3: Drift (Inverse Awareness) */}
             <Line 
              type="monotone" 
              dataKey="drift" 
              stroke="#8b5cf6" 
              strokeDasharray="5 5"
              strokeWidth={1} 
              dot={false}
              name="L3: Drift Detected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Policy
        </div>
        <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span> Witness
        </div>
        <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Align
        </div>
      </div>
    </div>
  );
};

export default Metrics;