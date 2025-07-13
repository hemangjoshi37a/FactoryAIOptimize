import express from 'express';
import { FactoryOptimizeController } from './controllers/factoryOptimize.controller';
import { logInfo } from './utils/logger';
import { loadConfig } from './config/configLoader'; // Add this import
import { CameraService } from './services/camera.service';
import { AIService } from './services/ai.service';
import { DroneService } from './services/drone.service';
import { DigitalTwinService } from './services/digitalTwin.service';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Load enhanced configuration with environment variables
const config = loadConfig(); // Use this instead of CONFIG

// Create service instances with dependencies
const cameraService = new CameraService(config);
const aiService = new AIService(config);
const droneService = new DroneService(config);
const digitalTwinService = new DigitalTwinService(config);

// Create controller with required services
const controller = new FactoryOptimizeController(
  cameraService,
  aiService,
  droneService,
  digitalTwinService
);

app.get('/', (req, res) => {
  res.send('🚀 FactoryAIOptimize System is Running!');
});

app.post('/analyze', controller.analyzeFactory.bind(controller));
app.get('/digital-twin', controller.getDigitalTwin.bind(controller));
app.post('/drone-inspect', controller.initiateDroneInspection.bind(controller));

app.listen(port, () => {
  logInfo(`⚡️ Server running at http://localhost:${port}`);
  logInfo(`📷 Monitoring ${config.CAMERAS.length} cameras`);
  logInfo(`🚁 ${config.DRONES.length} drones available`);
});
