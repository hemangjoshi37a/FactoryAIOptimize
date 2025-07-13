import { AppConfig } from '../config/configLoader';
import { logInfo, logError } from '../utils/logger';

export class DigitalTwinService {
  private currentModel: any = {};
  private version = 1;

  constructor(private config: AppConfig) {
    this.initializeModel();
  }

  private initializeModel() {
    this.currentModel = {
      version: this.version,
      factoryLayout: this.config.FACTORY_LAYOUT,
      cameras: this.config.CAMERAS.map(cam => ({
        id: cam.id,
        location: cam.location,
        status: 'active'
      })),
      drones: this.config.DRONES.map(drone => ({
        id: drone.id,
        type: drone.type,
        battery: 100,
        status: 'idle'
      })),
      insights: [],
      lastUpdated: new Date(),
      statistics: {
        efficiency: 0.85,
        downtime: 0.05,
        throughput: 120
      }
    };
  }

  async updateModel(insights: string[]): Promise<void> {
    logInfo('Updating digital twin model');

    // Update model version
    this.version++;

    // Add new insights
    this.currentModel.insights = [
      ...this.currentModel.insights,
      ...insights.map(insight => ({
        id: `insight-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        text: insight,
        timestamp: new Date(),
        status: 'pending'
      }))
    ];

    // Update statistics based on insights
    insights.forEach(insight => {
      if (insight.includes('efficiency')) {
        this.currentModel.statistics.efficiency = Math.min(
          0.95,
          this.currentModel.statistics.efficiency + 0.02
        );
      }

      if (insight.includes('downtime')) {
        this.currentModel.statistics.downtime = Math.max(
          0.01,
          this.currentModel.statistics.downtime - 0.01
        );
      }
    });

    this.currentModel.lastUpdated = new Date();
  }

  async getCurrentModel(): Promise<any> {
    return this.currentModel;
  }

  async integratePhotogrammetry(data: any): Promise<void> {
    logInfo('Integrating photogrammetry data into digital twin');
    this.currentModel.photogrammetry = {
      ...data,
      integratedAt: new Date()
    };
  }
}