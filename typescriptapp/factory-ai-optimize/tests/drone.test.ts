import { DroneService } from '../src/services/drone.service';
import { loadConfig } from '../src/config/configLoader';

describe('Drone Service', () => {
  const config = loadConfig();
  const service = new DroneService(config);

  it('should select an available drone', async () => {
    const drone = service['selectDrone']();
    expect(drone).toBeDefined();
    expect(drone?.id).toBeDefined();
  });

  it('should inspect an area', async () => {
    const result = await service.inspectArea('Assembly');
    expect(result.status).toBe('completed');
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it('should track drone battery', async () => {
    const initialBattery = service['droneStatus']['drone-1'].battery;
    await service.inspectArea('Packaging', 'drone-1');
    const newBattery = service['droneStatus']['drone-1'].battery;
    expect(newBattery).toBeLessThan(initialBattery);
  });
});