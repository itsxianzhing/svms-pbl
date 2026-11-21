import express from 'express';

import venueController from '../controllers/venueController.js';
import courtController from '../controllers/courtController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';

import {
    venueIdDto,
    createVenueDto,
    updateVenueDto,
    venueFilterDto
} from '../dtos/venueDto.js';

import {
    createCourtDto
} from '../dtos/courtDto.js';

const router = express.Router();

// All endpoints below require ADMIN access
router.use(authMiddleware);

// GET /api/venues
router.get(
    '/',
    validate(venueFilterDto, 'query'),
    venueController.getAllVenues
);

// GET /api/venues/filters
router.get(
    '/filters',
    venueController.getVenueFilters
);

// GET /api/venues/:venueId
router.get(
    '/:venueId',
    validate(venueIdDto, 'params'),
    venueController.getVenueById
);

// POST /api/venues
router.post(
    '/',
    adminMiddleware,
    validate(createVenueDto),
    venueController.createVenue
);

// PUT /api/venues/:venueId
router.put(
    '/:venueId',
    adminMiddleware,
    validate(venueIdDto, 'params'),
    validate(updateVenueDto),
    venueController.updateVenue
);

// DELETE /api/venues/:venueId
router.delete(
    '/:venueId',
    adminMiddleware,
    validate(venueIdDto, 'params'),
    venueController.deleteVenue
);

// POST /api/venues/:venueId/courts
router.post(
    '/:venueId/courts',
    adminMiddleware,
    validate(venueIdDto, 'params'),
    validate(createCourtDto),
    courtController.createCourt
);

export default router;