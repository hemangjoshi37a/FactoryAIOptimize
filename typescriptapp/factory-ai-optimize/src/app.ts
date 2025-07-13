import express from 'express';
import { FactoryOptimizeController } from './controllers/factoryOptimize.controller';
import { logInfo, logError } from './utils/logger';
import { loadConfig } from './config/configLoader';
import { CameraService } from './services/camera.service';
import { AIService } from './services/ai.service';
import { DroneService } from './services/drone.service';
import { DigitalTwinService } from './services/digitalTwin.service';
import { errorHandler } from './middlewares/errorHandler';
import readline from 'readline';
import chalk from 'chalk';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Load enhanced configuration with environment variables
const config = loadConfig();

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

// Create CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.blue('🏭 Factory AI > ')
});

// Display dashboard
function showDashboard() {
  console.clear();
  console.log(chalk.bold.cyan('┌──────────────────────────────────────────────────────────┐'));
  console.log(chalk.bold.cyan('│                   FACTORY AI OPTIMIZE                   │'));
  console.log(chalk.bold.cyan('├──────────────────────────────────────────────────────────┤'));
  console.log(chalk.bold.cyan('│                     SYSTEM DASHBOARD                    │'));
  console.log(chalk.bold.cyan('└──────────────────────────────────────────────────────────┘\n'));

  // Factory metrics
  console.log(chalk.bold('📊 FACTORY METRICS'));
  console.log(chalk.green(`  Efficiency: ${chalk.bold('87.4%')} ${chalk.dim('(+2.1% from last analysis)')}`));
  console.log(chalk.yellow(`  Downtime:   ${chalk.bold('18 min')} ${chalk.dim('(-2% from target)')}`));
  console.log(chalk.blue(`  Production: ${chalk.bold('124 u/h')} ${chalk.dim('(+7% improvement)')}\n`));

  // Camera status
  console.log(chalk.bold('📷 CAMERA STATUS'));
  config.CAMERAS.forEach((camera, index) => {
    console.log(`  ${index + 1}. ${chalk.bold(camera.location.padEnd(20))} ${chalk.green('Active')} ${chalk.dim(`(${camera.id})`)}`);
  });
  console.log('');

  // Drone status
  console.log(chalk.bold('🚁 DRONE FLEET'));
  config.DRONES.forEach((drone, index) => {
    const batteryColor = drone.battery > 70 ? chalk.green : drone.battery > 30 ? chalk.yellow : chalk.red;
    console.log(`  ${index + 1}. ${chalk.bold(drone.id.padEnd(10))} ${drone.type.padEnd(12)} Battery: ${batteryColor(`${drone.battery}%`)}`);
  });
  console.log('');

  // Insights
  console.log(chalk.bold('💡 AI OPTIMIZATION INSIGHTS'));
  console.log(chalk.green('  1. Optimize conveyor speed in Assembly Line A'));
  console.log(chalk.dim('     - Potential 15% efficiency gain'));
  console.log(chalk.yellow('  2. Schedule maintenance for Machine #7'));
  console.log(chalk.dim('     - Vibration patterns indicate wear'));
  console.log(chalk.blue('  3. Reorganize inventory layout'));
  console.log(chalk.dim('     - Could save 17 min/worker/day\n'));

  // Menu options
  console.log(chalk.bold('🔧 COMMANDS'));
  console.log('  1. Run factory analysis');
  console.log('  2. Initiate drone inspection');
  console.log('  3. View digital twin');
  console.log('  4. Simulate production');
  console.log('  5. Exit\n');
}

// Handle user input
function processCommand(input: string) {
  switch(input.trim()) {
    case '1':
      runFactoryAnalysis();
      break;
    case '2':
      initiateDroneInspection();
      break;
    case '3':
      viewDigitalTwin();
      break;
    case '4':
      simulateProduction();
      break;
    case '5':
      rl.close();
      process.exit(0);
    default:
      console.log(chalk.red('Invalid command. Please select 1-5.'));
      rl.prompt();
  }
}

async function runFactoryAnalysis() {
  try {
    console.log(chalk.yellow('\nStarting factory analysis...'));

    // Simulate analysis process
    const progressInterval = setInterval(() => {
      process.stdout.write(chalk.blue('.'));
    }, 300);

    // Call services directly
    const cameraData = await cameraService.processFeeds();
    const insights = await aiService.generateInsights(cameraData);
    await digitalTwinService.updateModel(insights);

    // Add cost-benefit analysis
    const analyzedInsights = await Promise.all(
      insights.map(async insight => ({
        insight,
        costBenefit: await aiService.costBenefitAnalysis(insight)
      }))
    );

    clearInterval(progressInterval);

    console.log(chalk.green('\n\nAnalysis completed successfully!'));

    // Display insights
    console.log(chalk.bold('\n🔍 OPTIMIZATION INSIGHTS:'));
    analyzedInsights.slice(0, 3).forEach((insightObj, i) => {
      const { insight, costBenefit } = insightObj;
      console.log(chalk.cyan(`  ${i + 1}. ${insight}`));
      console.log(chalk.dim(`     💰 Cost: $${costBenefit.cost} | 📈 ROI: ${costBenefit.roi.toFixed(1)}x | ⏱️ Payback: ${costBenefit.paybackPeriod} months`));
    });

    rl.prompt();
  } catch (error: any) {
    logError(`Analysis failed: ${error.message}`);
    console.log(chalk.red('\nAnalysis failed. See logs for details.'));
    rl.prompt();
  }
}

async function initiateDroneInspection() {
  console.log('\nSelect an area to inspect:');
  config.CAMERAS.forEach((camera, i) => {
    console.log(`  ${i + 1}. ${camera.location}`);
  });

  const areaRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  areaRl.question('\nEnter area number: ', async (areaNum) => {
    const areaIndex = parseInt(areaNum) - 1;

    if (areaIndex >= 0 && areaIndex < config.CAMERAS.length) {
      const area = config.CAMERAS[areaIndex].location;

      console.log(chalk.yellow(`\nInitiating drone inspection in ${area}...`));

      try {
        // Call service directly
        const inspectionResult = await droneService.inspectArea(area);

        console.log(chalk.green('\nInspection completed!'));
        console.log(chalk.bold('\n📝 FINDINGS:'));
        inspectionResult.findings.forEach((finding, i) => {
          console.log(`  ${i + 1}. ${finding}`);
        });
      } catch (error: any) {
        logError(`Drone inspection failed: ${error.message}`);
        console.log(chalk.red('\nInspection failed. See logs for details.'));
      }

      areaRl.close();
      rl.prompt();
    } else {
      console.log(chalk.red('Invalid area selection.'));
      areaRl.close();
      rl.prompt();
    }
  });
}

async function viewDigitalTwin() {
  try {
    console.log(chalk.yellow('\nLoading digital twin model...'));
    const twinData = await digitalTwinService.getCurrentModel();

    console.log(chalk.green('\nDIGITAL TWIN MODEL:'));
    console.log(chalk.cyan(`  Version: ${twinData.version}`));
    console.log(chalk.cyan(`  Last Updated: ${new Date(twinData.lastUpdated).toLocaleString()}`));

    console.log(chalk.bold('\n📊 STATISTICS:'));
    console.log(`  Efficiency: ${chalk.green((twinData.statistics.efficiency * 100).toFixed(1))}%`);
    console.log(`  Downtime: ${chalk.yellow((twinData.statistics.downtime * 100).toFixed(1))}%`);
    console.log(`  Throughput: ${chalk.blue(twinData.statistics.throughput)} units/hr\n`);

    rl.prompt();
  } catch (error: any) {
    logError(`Failed to load digital twin: ${error.message}`);
    console.log(chalk.red('\nFailed to load digital twin. See logs for details.'));
    rl.prompt();
  }
}

async function simulateProduction() {
  const simRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  simRl.question('\nEnter simulation hours (default 8): ', (hoursInput) => {
    const hours = parseInt(hoursInput) || 8;

    simRl.question('Enter speed factor (default 1.0): ', async (speedInput) => {
      const speed = parseFloat(speedInput) || 1.0;

      try {
        console.log(chalk.yellow(`\nRunning production simulation for ${hours} hours at ${speed}x speed...`));

        // Create simulator directly
        const simulator = new (require('../simulations/productionSimulator')).ProductionSimulator();
        const simulationResult = simulator.runSimulation(hours, speed);

        console.log(chalk.green('\nSimulation completed!'));
        console.log(chalk.bold('\n📊 RESULTS:'));
        console.log(`  Units Produced: ${chalk.cyan(simulationResult.unitsProduced)}`);
        console.log(`  Defects: ${chalk.yellow(simulationResult.defects)}`);
        console.log(`  Quality Rate: ${chalk.blue(simulationResult.qualityRate.toFixed(1))}%`);
        console.log(`  Downtime: ${chalk.red(simulationResult.downtime)} minutes`);

        console.log(chalk.bold('\n⚠️ BOTTLENECKS:'));
        simulationResult.bottlenecks.forEach((bottleneck: string, i: number) => {
          console.log(`  ${i + 1}. ${bottleneck}`);
        });
      } catch (error: any) {
        logError(`Simulation failed: ${error.message}`);
        console.log(chalk.red('\nSimulation failed. See logs for details.'));
      }

      simRl.close();
      rl.prompt();
    });
  });
}

// Start the server
app.listen(port, () => {
  logInfo(`⚡️ Server running at http://localhost:${port}`);
  logInfo(`📷 Monitoring ${config.CAMERAS.length} cameras`);
  logInfo(`🚁 ${config.DRONES.length} drones available`);

  // Start CLI interface
  showDashboard();
  rl.prompt();

  rl.on('line', (input) => {
    processCommand(input);
  }).on('close', () => {
    console.log(chalk.blue('\nFactory AI Optimize shutdown. Goodbye!'));
    process.exit(0);
  });
});

// API endpoints
app.post('/analyze', controller.analyzeFactory.bind(controller));
app.get('/digital-twin', controller.getDigitalTwin.bind(controller));
app.post('/drone-inspect', controller.initiateDroneInspection.bind(controller));
app.post('/simulate-production', controller.simulateProduction.bind(controller));
app.get('/cost-benefit/:suggestionId', controller.getCostBenefit.bind(controller));

// Error handling middleware
app.use(errorHandler);
