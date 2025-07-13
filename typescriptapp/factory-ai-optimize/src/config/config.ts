export const CONFIG = {
  CAMERAS: [
    { id: 'cam-1', url: 'rtsp://camera1.prod', location: 'Assembly Line A', fov: 120 },
    { id: 'cam-2', url: 'rtsp://camera2.prod', location: 'Packaging Zone', fov: 90 },
    { id: 'cam-3', url: 'rtsp://camera3.prod', location: 'Quality Control', fov: 110 },
    { id: 'cam-4', url: 'rtsp://camera4.prod', location: 'Shipping Dock', fov: 100 },
  ],
  DRONES: [
    { id: 'drone-1', type: 'quadcopter', capabilities: ['video', 'thermal'], battery: 100 },
    { id: 'drone-2', type: 'wheeled', capabilities: ['lidar', 'video'], battery: 85 }
  ],
  AI_MODEL: 'gpt-4-turbo',
  MAX_CONCURRENT_PROCESSES: 4,
  DATA_RETENTION_DAYS: 30,
  FACTORY_LAYOUT: {
    width: 200,
    height: 150,
    areas: [
      { name: 'Assembly', x: 10, y: 10, width: 60, height: 60 },
      { name: 'Packaging', x: 80, y: 10, width: 50, height: 50 },
      { name: 'Storage', x: 140, y: 10, width: 50, height: 40 },
      { name: 'Shipping', x: 10, y: 80, width: 180, height: 60 }
    ]
  }
};