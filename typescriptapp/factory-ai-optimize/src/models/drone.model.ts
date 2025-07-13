export interface DroneInspectionRequest {
  area: string;
  priority: 'high' | 'medium' | 'low';
  inspectionType: 'visual' | 'thermal' | 'lidar';
}

export interface DroneInspectionResult {
  area: string;
  status: 'completed' | 'failed' | 'in-progress';
  findings: string[];
  modelUpdates: string[];
}