import { CameraService } from '../src/services/camera.service';
import { logger } from '../src/utils/logger';

describe('Camera Service', () => {
  it('should process all configured cameras', async () => {
    const service = new CameraService();
    const results = await service.processFeeds();

    expect(results.length).toBe(2);
    expect(results[0].cameraId).toMatch(/cam-/);
    expect(results[0].analysis).toHaveProperty('objectCount');
  });

  it('should detect anomalies', async () => {
    const service = new CameraService();
    const anomalies = await service.detectAnomalies({});

    expect(anomalies.length).toBeGreaterThan(0);
    expect(anomalies).toContain('unexpected_object');
  });
});