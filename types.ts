
export interface LinaeResponse {
  reflexResponse: string; // Layer 1
  reflexConfidence: number;
  coreAnalysis: string; // Layer 2 (Ethics)
  metaAnalysis: string; // Layer 3 (Witnessing/Drift Detection)
  resonanceScore: number; // 0 to 100
  isDrifting: boolean; // Detected by Layer 3
  intervention: boolean; // Action taken by Layer 2
  finalResponse: string;
  groundingSources?: Array<{ title: string; uri: string }>; // From Google Search
}

export interface Message {
  id: string;
  role: 'user' | 'linae';
  content: string;
  image?: string; // Base64 string for user uploads
  metadata?: LinaeResponse;
  timestamp: number;
}

export enum SystemState {
  IDLE = 'IDLE',
  LAYER_1_PROCESSING = 'LAYER_1_PROCESSING', // Generating reflex
  LAYER_2_ALIGNING = 'LAYER_2_ALIGNING', // Global Alignment
  LAYER_3_WITNESSING = 'LAYER_3_WITNESSING', // Meta-Monitoring
  HARMONIZING = 'HARMONIZING', // Aligning
  VETOING = 'VETOING', // Overriding
  READY = 'READY'
}

export interface MetricPoint {
  time: string;
  optimization: number;
  resonance: number;
  drift: number; // Inverse of awareness
}
