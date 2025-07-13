export const CONFIG = {
  CAMERAS: [
    { id: 'cam-1', url: 'rtsp://camera1.prod', location: 'Assembly Line A' },
    { id: 'cam-2', url: 'rtsp://camera2.prod', location: 'Packaging Zone' },
  ],
  DRONES: [
    { id: 'drone-1', type: 'quadcopter', capabilities: ['video', 'thermal'] }
  ],
  AI_MODEL: 'gpt-4-vision',
  MAX_CONCURRENT_PROCESSES: 4,
  DATA_RETENTION_DAYS: 30
};