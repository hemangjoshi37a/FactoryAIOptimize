export interface CameraData {
  cameraId: string;
  timestamp: Date;
  location: string;
  analysis: CameraFeedAnalysis;
}

export interface CameraFeedAnalysis {
  objectCount: number;
  activityLevel: number;
  anomalies: string[];
  peopleCount: number;
  machineStatus: 'operational' | 'needs_maintenance' | 'down';
}