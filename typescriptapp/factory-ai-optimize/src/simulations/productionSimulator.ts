import { logInfo } from '../utils/logger';

export class ProductionSimulator {
  runSimulation(hours: number, speed: number = 1.0) {
    logInfo(`Running production simulation for ${hours} hours at ${speed}x speed`);

    const baseOutput = 100;
    const efficiency = 0.85 * speed;
    const qualityRate = 0.95 - (0.05 * (speed - 1));

    const output = Math.floor(baseOutput * hours * efficiency);
    const defects = Math.floor(output * (1 - qualityRate));

    return {
      hours,
      speedFactor: speed,
      unitsProduced: output,
      defects,
      qualityRate: qualityRate * 100,
      efficiency: efficiency * 100,
      downtime: Math.floor(Math.random() * 20) + (speed > 1 ? 10 : 0),
      bottlenecks: this.identifyBottlenecks(speed)
    };
  }

  private identifyBottlenecks(speed: number): string[] {
    const bottlenecks = [];

    if (speed > 1.2) bottlenecks.push('Assembly line cannot keep up with demand');
    if (speed > 1.5) bottlenecks.push('Packaging station causing backlog');
    if (Math.random() > 0.7) bottlenecks.push('Quality control is understaffed');
    if (Math.random() > 0.8) bottlenecks.push('Material supply inconsistent');

    return bottlenecks.length ? bottlenecks : ['No significant bottlenecks detected'];
  }
}
