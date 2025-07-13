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
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Factory AI Optimize</title>
      <style>
        :root {
          --primary: #2c3e50;
          --secondary: #3498db;
          --accent: #e74c3c;
          --light: #ecf0f1;
          --dark: #34495e;
          --success: #27ae60;
          --warning: #f39c12;
          --danger: #e74c3c;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          background-color: #f5f7fa;
          color: #333;
          line-height: 1.6;
        }

        .dashboard {
          display: grid;
          grid-template-columns: 250px 1fr;
          min-height: 100vh;
        }

        .sidebar {
          background: var(--primary);
          color: white;
          padding: 20px 0;
          box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        }

        .logo {
          padding: 0 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 20px;
        }

        .logo h1 {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-item {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(255,255,255,0.1);
          border-left: 4px solid var(--secondary);
        }

        .main-content {
          padding: 20px;
          overflow-y: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        .stat-card .value {
          font-size: 2rem;
          font-weight: bold;
          margin: 10px 0;
          color: var(--secondary);
        }

        .stat-card .label {
          color: #777;
          font-size: 0.9rem;
        }

        .card {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-primary {
          background: var(--secondary);
          color: white;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .insights-list {
          list-style: none;
        }

        .insight-item {
          padding: 15px 0;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .insight-item:last-child {
          border-bottom: none;
        }

        .insight-icon {
          background: rgba(52, 152, 219, 0.1);
          color: var(--secondary);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .insight-content h4 {
          margin-bottom: 5px;
        }

        .insight-content p {
          color: #777;
          font-size: 0.9rem;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-success {
          background: rgba(39, 174, 96, 0.1);
          color: var(--success);
        }

        .status-warning {
          background: rgba(243, 156, 18, 0.1);
          color: var(--warning);
        }

        .drone-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .drone-card {
          border: 1px solid #eee;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s;
        }

        .drone-card:hover {
          transform: translateY(-5px);
        }

        .drone-header {
          background: var(--dark);
          color: white;
          padding: 15px;
          display: flex;
          justify-content: space-between;
        }

        .drone-body {
          padding: 15px;
          background: white;
        }

        .drone-property {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .drone-property:last-child {
          border-bottom: none;
        }

        .battery-indicator {
          height: 8px;
          background: #eee;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 5px;
        }

        .battery-level {
          height: 100%;
          background: var(--success);
          border-radius: 4px;
        }

        .camera-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .camera-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background: white;
        }

        .camera-preview {
          height: 120px;
          background: linear-gradient(45deg, #3498db, #2c3e50);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .camera-info {
          padding: 15px;
        }

        .camera-location {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .camera-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #777;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
        }

        .status-dot.warning {
          background: var(--warning);
        }

        .digital-twin-view {
          height: 400px;
          background: linear-gradient(45deg, #1a2a3a, #2c3e50);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="dashboard">
        <div class="sidebar">
          <div class="logo">
            <h1>🏭 Factory AI Optimize</h1>
          </div>
          <div class="nav-item active">
            <span>📊 Dashboard</span>
          </div>
          <div class="nav-item">
            <span>📷 Cameras</span>
          </div>
          <div class="nav-item">
            <span>🚁 Drones</span>
          </div>
          <div class="nav-item">
            <span>🔄 Digital Twin</span>
          </div>
          <div class="nav-item">
            <span>📈 Analytics</span>
          </div>
          <div class="nav-item">
            <span>⚙️ Settings</span>
          </div>
        </div>

        <div class="main-content">
          <div class="header">
            <h2>Factory Optimization Dashboard</h2>
            <div>
              <button class="btn btn-primary" id="analyze-btn">Run Factory Analysis</button>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="label">Efficiency Score</div>
              <div class="value">87.4%</div>
              <div class="progress">
                <div style="height: 6px; background: #eee; border-radius: 3px; margin-top: 10px;">
                  <div style="width: 87.4%; height: 100%; background: var(--success); border-radius: 3px;"></div>
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="label">Active Cameras</div>
              <div class="value">${config.CAMERAS.length}/4</div>
              <div class="status-badge status-success">All Operational</div>
            </div>
            <div class="stat-card">
              <div class="label">Downtime Today</div>
              <div class="value">18 min</div>
              <div class="status-badge status-warning">-2% from target</div>
            </div>
            <div class="stat-card">
              <div class="label">Production Rate</div>
              <div class="value">124 u/h</div>
              <div class="status-badge status-success">+7% improvement</div>
            </div>
          </div>

          <div class="grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
            <div>
              <div class="card">
                <div class="card-header">
                  <div class="card-title">AI Optimization Insights</div>
                </div>
                <ul class="insights-list" id="insights-container">
                  <li class="insight-item">
                    <div class="insight-icon">💡</div>
                    <div class="insight-content">
                      <h4>Optimize conveyor speed</h4>
                      <p>Assembly line A is running at 87% capacity. Increasing speed by 15% could boost throughput.</p>
                    </div>
                  </li>
                  <li class="insight-item">
                    <div class="insight-icon">🔧</div>
                    <div class="insight-content">
                      <h4>Schedule maintenance for Machine #7</h4>
                      <p>Vibration patterns indicate potential bearing wear. Estimated downtime: 2 hours.</p>
                    </div>
                  </li>
                  <li class="insight-item">
                    <div class="insight-icon">🔄</div>
                    <div class="insight-content">
                      <h4>Reorganize inventory layout</h4>
                      <p>Current layout causes 23% extra walking time. Proposed layout saves 17 min/worker/day.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="card">
                <div class="card-header">
                  <div class="card-title">Camera Feeds</div>
                </div>
                <div class="camera-grid">
                  ${config.CAMERAS.map(camera => `
                    <div class="camera-card">
                      <div class="camera-preview">${camera.location}</div>
                      <div class="camera-info">
                        <div class="camera-location">${camera.location}</div>
                        <div class="camera-status">
                          <div class="status-dot"></div>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <div>
              <div class="card">
                <div class="card-header">
                  <div class="card-title">Drone Fleet</div>
                </div>
                <div class="drone-grid">
                  ${config.DRONES.map(drone => `
                    <div class="drone-card">
                      <div class="drone-header">
                        <div>${drone.id}</div>
                        <div>${drone.type}</div>
                      </div>
                      <div class="drone-body">
                        <div class="drone-property">
                          <span>Status</span>
                          <span>Idle</span>
                        </div>
                        <div class="drone-property">
                          <span>Battery</span>
                          <span>${drone.battery}%</span>
                        </div>
                        <div class="battery-indicator">
                          <div class="battery-level" style="width: ${drone.battery}%"></div>
                        </div>
                        <div class="drone-property">
                          <span>Capabilities</span>
                          <span>${drone.capabilities.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <div class="card-title">Digital Twin</div>
                </div>
                <div class="digital-twin-view">
                  3D Factory Visualization
                  <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                    Powered by NVIDIA Omniverse
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        document.getElementById('analyze-btn').addEventListener('click', async () => {
          const btn = document.getElementById('analyze-btn');
          btn.textContent = 'Analyzing...';
          btn.disabled = true;

          try {
            const response = await fetch('/analyze', { method: 'POST' });
            const result = await response.json();

            if (result.status === 'success') {
              // In a real implementation, we'd update the insights list
              alert('Factory analysis completed successfully!');
            } else {
              alert('Analysis failed: ' + (result.error || 'Unknown error'));
            }
          } catch (error) {
            alert('Request failed: ' + error.message);
          } finally {
            btn.textContent = 'Run Factory Analysis';
            btn.disabled = false;
          }
        });
      </script>
    </body>
    </html>
    `;
    res.send(html);
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
