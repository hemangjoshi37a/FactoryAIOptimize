import { Request, Response } from 'express';
import { CameraService } from '../services/camera.service';
import { AIService } from '../services/ai.service';
import { DroneService } from '../services/drone.service';
import { DigitalTwinService } from '../services/digitalTwin.service';
import { logInfo, logError } from '../utils/logger';
import { AppConfig } from '../config/configLoader';
import { ProductionSimulator } from '../simulations/productionSimulator';

export class FactoryOptimizeController {
  constructor(
    private cameraService: CameraService,
    private aiService: AIService,
    private droneService: DroneService,
    private digitalTwinService: DigitalTwinService
  ) {}

  async analyzeFactory(req: Request, res: Response) {
    try {
      logInfo('Starting factory analysis');

      // 1. Process camera feeds
      const cameraData = await this.cameraService.processFeeds();

      // 2. Analyze with AI
      const insights = await this.aiService.generateInsights(cameraData);

      // 3. Update digital twin
      await this.digitalTwinService.updateModel(insights);

      // 4. Perform cost-benefit analysis
      const analyzedInsights = await Promise.all(
        insights.map(async insight => ({
          insight,
          costBenefit: await this.aiService.costBenefitAnalysis(insight)
        }))
      );

      res.json({
        status: 'success',
        insights: analyzedInsights.slice(0, 5)
      });
    } catch (error: any) {
      logError('Analysis failed: ' + error.message);
      res.status(500).json({ error: 'Factory analysis failed' });
    }
  }

  async getDigitalTwin(req: Request, res: Response) {
    try {
      const twinData = await this.digitalTwinService.getCurrentModel();
      res.json(twinData);
    } catch (error: any) {
      res.status(500).json({ error: 'Digital twin unavailable' });
    }
  }

  async initiateDroneInspection(req: Request, res: Response) {
    try {
      const { area, droneId } = req.body;
      const results = await this.droneService.inspectArea(area, droneId);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: 'Drone inspection failed: ' + error.message });
    }
  }

  async simulateProduction(req: Request, res: Response) {
    try {
      const { hours = 8, speed = 1.0 } = req.body;
      const simulator = new ProductionSimulator();
      const report = simulator.runSimulation(hours, speed);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: 'Simulation failed: ' + error.message });
    }
  }

  async getCostBenefit(req: Request, res: Response) {
    try {
      const { suggestionId } = req.params;
      const analysis = await this.aiService.getCostBenefit(suggestionId);
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ error: 'Cost analysis failed: ' + error.message });
    }
  }
}
















