import express from 'express';

import dashboardController from '../controllers/dashboardController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// All dashboard endpoints require authentication
router.use(authMiddleware);

// GET /api/dashboard/summary (ADMIN)
router.get(
    '/summary',
    adminMiddleware,
    dashboardController.getSummary
);

export default router;