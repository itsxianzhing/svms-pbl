import express from 'express';

import bookingController from '../controllers/bookingController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';

import {
    createBookingDto,
    bookingIdDto,
    bookingFilterDto,
    payBookingDto
} from '../dtos/bookingDto.js';

const router = express.Router();

// All booking endpoints require authentication
router.use(authMiddleware);

// POST /api/bookings
router.post(
    '/',
    validate(createBookingDto),
    bookingController.createBooking
);

// GET /api/bookings/my
// Must be declared before /:bookingId
router.get(
    '/my',
    validate(bookingFilterDto, 'query'),
    bookingController.getMyBookings
);

// GET /api/bookings (ADMIN)
router.get(
    '/',
    adminMiddleware,
    validate(bookingFilterDto, 'query'),
    bookingController.getAllBookings
);

// GET /api/bookings/:bookingId
router.get(
    '/:bookingId',
    validate(bookingIdDto, 'params'),
    bookingController.getBookingById
);

// POST /api/bookings/:bookingId/pay
router.post(
    '/:bookingId/pay',
    validate(bookingIdDto, 'params'),
    validate(payBookingDto),
    bookingController.payBooking
);

// POST /api/bookings/:bookingId/cancel
router.post(
    '/:bookingId/cancel',
    validate(bookingIdDto, 'params'),
    bookingController.cancelBooking
);

export default router;
