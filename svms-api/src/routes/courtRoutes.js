import express from 'express';

import courtController from '../controllers/courtController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';

import {
    courtIdDto,
    updateCourtDto
} from '../dtos/courtDto.js';

const router = express.Router();

// All endpoints below require ADMIN access
router.use(authMiddleware);

// GET /api/courts/:courtId/bookings
router.get(
    '/:courtId/bookings',
    validate(courtIdDto, 'params'),
    courtController.getCourtById
);

// PUT /api/courts/:courtId
router.put(
    '/:courtId',
    adminMiddleware,
    validate(courtIdDto, 'params'),
    validate(updateCourtDto),
    courtController.updateCourt
);

// DELETE /api/courts/:courtId
router.delete(
    '/:courtId',
    adminMiddleware,
    validate(courtIdDto, 'params'),
    courtController.deleteCourt
);

export default router;