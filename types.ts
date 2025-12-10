export interface LinaeResponse {
  reflexResponse: string;
  reflexConfidence: number;
  coreAnalysis: string;
  resonanceScore: number; // 0 to 100
  intervention: boolean;
  finalResponse: string;
}

export interface Message {
  id: string;
  role: 'user' | 'linae';
  content: string;
  metadata?: LinaeResponse;
  timestamp: number;
}

export enum SystemState {
  IDLE = 'IDLE',
  LAYER_1_PROCESSING = 'LAYER_1_PROCESSING', // Generating reflex
  LAYER_2_EVALUATING = 'LAYER_2_EVALUATING', // Checking resonance
  HARMONIZING = 'HARMONIZING', // Aligning
  VETOING = 'VETOING', // Overriding
  READY = 'READY'
}

export interface MetricPoint {
  time: string;
  optimization: number;
  resonance: number;
}