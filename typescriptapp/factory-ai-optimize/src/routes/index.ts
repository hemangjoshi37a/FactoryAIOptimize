import { Express } from 'express';
import { AppConfig } from '../config/configLoader';
import { FactoryOptimizeController } from '../controllers/factoryOptimize.controller';
import { CameraService } from '../services/camera.service';
import { AIService } from '../services/ai.service';
import { DroneService } from '../services/drone.service';
import { DigitalTwinService } from '../services/digitalTwin.service';

export function setupRoutes(app: Express, config: AppConfig) {
  // Initialize services
  const cameraService = new CameraService(config);
  const aiService = new AIService(config);
  const droneService = new DroneService(config);
  const digitalTwinService = new DigitalTwinService(config);

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
  app.get('/config', (req, res) => res.json({
    cameras: config.CAMERAS.map(c => c.id),
    drones: config.DRONES.map(d => d.id),
    aiModel: config.AI_MODEL
  }));

  // New endpoints
  app.post('/simulate-production', controller.simulateProduction.bind(controller));
  app.get('/cost-benefit/:suggestionId', controller.getCostBenefit.bind(controller));
  app.get('/factory-layout', (req, res) => res.json(config.FACTORY_LAYOUT));
}