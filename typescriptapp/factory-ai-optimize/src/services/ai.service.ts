import { AppConfig } from '../config/configLoader';
import { logInfo, logError, logWarn } from '../utils/logger';
import { CameraData } from '../models/camera.model';
import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI | null = null;
  private costBenefitCache: Record<string, any> = {};

  constructor(private config: AppConfig) {
    if (config.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
    } else {
      logWarn('OpenAI API key not set. Using mock AI service');
    }
  }

  async generateInsights(cameraData: CameraData[]): Promise<string[]> {
    logInfo('Generating AI insights');

    if (!this.openai) {
      return this.generateMockInsights(cameraData);
    }

    try {
      const context = this.createAnalysisContext(cameraData);
      const prompt = `As a factory optimization AI, analyze this factory data and provide 5 specific optimization suggestions with estimated impact:

Factory Status:
${context}

Suggestions should be in the format:
[Area] [Suggestion] - [Impact Estimate]`;

      const response = await this.openai.chat.completions.create({
        model: this.config.AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      });

      const content = response.choices[0].message.content || '';
      const insights = content.split('\n')
        .filter((line: string) => line.trim().length > 0);

      // Cache insights for cost-benefit analysis
      insights.forEach((insight: string, index: number) => {
        this.costBenefitCache[`insight-${index}`] = insight;
      });

      return insights.slice(0, 5);
    } catch (error: any) {
      logError('AI service failed: ' + error.message);
      return this.generateMockInsights(cameraData);
    }
  }

  private createAnalysisContext(cameraData: CameraData[]): string {
    return cameraData.map(data =>
      `Camera: ${data.cameraId} - ${data.location}
Status: ${data.analysis.objectCount} objects detected
Activity Level: ${data.analysis.activityLevel.toFixed(2)}
Anomalies: ${data.analysis.anomalies.join(', ') || 'None'}
People: ${data.analysis.peopleCount}
Machine Status: ${data.analysis.machineStatus}`
    ).join('\n');
  }

  private generateMockInsights(cameraData: CameraData[]): string[] {
    const locations = [...new Set(cameraData.map(c => c.location))];
    return [
      `${locations[0]}: Optimize conveyor speed - potential 15% efficiency gain`,
      `${locations[1]}: Reorganize inventory layout - estimated 20min/day time savings`,
      `${locations[2]}: Schedule maintenance for Machine #7 - vibration patterns indicate wear`,
      `General: Implement cross-training for staff - could reduce downtime by 30%`,
      `General: Install additional lighting in packaging area - expected to reduce errors by 12%`
    ];
  }

  async costBenefitAnalysis(suggestion: string): Promise<{ cost: number, roi: number, paybackPeriod: number }> {
    // Simple heuristic-based estimation
    const cost = suggestion.includes('Optimize') ? 5000 :
                 suggestion.includes('Reorganize') ? 3000 :
                 suggestion.includes('Schedule') ? 2000 :
                 suggestion.includes('Implement') ? 10000 : 8000;

    const roi = 1.5 + Math.random();
    const paybackPeriod = cost < 5000 ? 3 : cost < 8000 ? 6 : 12;

    return { cost, roi, paybackPeriod };
  }

  async getCostBenefit(suggestionId: string) {
    const insight = this.costBenefitCache[suggestionId];
    if (!insight) throw new Error('Suggestion not found');

    return {
      suggestion: insight,
      analysis: await this.costBenefitAnalysis(insight)
    };
  }
}
