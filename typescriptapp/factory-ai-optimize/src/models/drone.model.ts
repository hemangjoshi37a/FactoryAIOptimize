export interface DroneInspectionRequest {
  area: string;
  droneId?: string;
  priority: 'high' | 'medium' | 'low';
  inspectionType: 'visual' | 'thermal' | 'lidar';
}

export interface DroneInspectionResult {
  area: string;
  droneId: string;
  status: 'completed' | 'failed' | 'in-progress';
  path: { x: number; y: number }[];
  findings: string[];
  modelUpdates: string[];
  batteryRemaining: number;
}