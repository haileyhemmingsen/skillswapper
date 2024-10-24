// src/app.ts
import express, { 
  Express, 
  Router, 
  Response as ExResponse, 
  Request as ExRequest, 
  ErrorRequestHandler 
} from 'express';

import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../build/routes';

// Import Firebase services (Firestore and Auth)
import { db, auth } from '../firebase';  // Import from firebase.ts

import cors from 'cors';

// Create the Express app
const app: Express = express();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors middleware
app.use(cors())

// Swagger documentation setup
app.use('/api/v0/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(swaggerUi.generateHTML(await import('../build/swagger.json')));
});

// Register API routes
const router = Router();
RegisterRoutes(router);
app.use('/api/v0', router);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    status: err.status || 500,
  });
};
app.use(errorHandler);

export default app;