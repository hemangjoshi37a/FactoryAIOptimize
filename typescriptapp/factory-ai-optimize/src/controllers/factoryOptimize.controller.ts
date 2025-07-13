import { Request, Response } from 'express';
import { CameraService } from '../services/camera.service';
import { AIService } from '../services/ai.service';
import { DroneService } from '../services/drone.service';
import { DigitalTwinService } from '../services/digitalTwin.service';
import { logger } from '../utils/logger';

export class FactoryOptimizeController {
  private cameraService = new CameraService();
  private aiService = new AIService();
  private droneService = new DroneService();
  private digitalTwinService = new DigitalTwinService();

  async analyzeFactory(req: Request, res: Response) {
    try {
      logger.info('Starting factory analysis'); // Changed to logger.info

      // 1. Process camera feeds
      const cameraData = await this.cameraService.processFeeds();

      // 2. Analyze with AI
      const insights = await this.aiService.generateInsights(cameraData);

      // 3. Update digital twin
      await this.digitalTwinService.updateModel(insights);

      res.json({
        status: 'success',
        insights: insights.slice(0, 3)
      });
    } catch (error: any) {
      logger.error('Analysis failed: ' + error.message); // Keep as logger.error
      res.status(500).json({ error: 'Factory analysis failed' });
    }
  }

  async getDigitalTwin(req: Request, res: Response) {
    try {
      const twinData = await this.digitalTwinService.getCurrentModel();
      res.json(twinData);
    } catch (error) {
      res.status(500).json({ error: 'Digital twin unavailable' });
    }
  }

  async initiateDroneInspection(req: Request, res: Response) {
    try {
      const { area } = req.body;
      const results = await this.droneService.inspectArea(area);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Drone inspection failed' });
    }
  }
}





























