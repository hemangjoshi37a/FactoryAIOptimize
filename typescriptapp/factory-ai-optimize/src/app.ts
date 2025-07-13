import express from 'express';
import { FactoryOptimizeController } from './controllers/factoryOptimize.controller';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const controller = new FactoryOptimizeController();

app.get('/', (req, res) => {
  res.send('🚀 FactoryAIOptimize System is Running!');
});

app.post('/analyze', controller.analyzeFactory.bind(controller));
app.get('/digital-twin', controller.getDigitalTwin.bind(controller));
app.post('/drone-inspect', controller.initiateDroneInspection.bind(controller));

app.listen(port, () => {
  logger.info(`⚡️ Server running at http://localhost:${port}`); // Changed to logger.info
});
