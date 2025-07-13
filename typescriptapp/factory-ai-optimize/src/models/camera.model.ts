export interface CameraData {
  cameraId: string;
  timestamp: Date;
  analysis: {
    objectCount: number;
    activityLevel: number;
    anomalies: string[];
  };
}