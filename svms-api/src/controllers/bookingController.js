import bookingService from '../services/bookingService.js';

const createBooking = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = req.validated.body;

        const booking = await bookingService.createBooking(userId, data);

        res.status(201).json({
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const filters = req.validated.query;

        const bookings = await bookingService.getMyBookings(userId, filters);

        res.status(200).json({
            message: 'My bookings retrieved successfully',
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

const getAllBookings = async (req, res, next) => {
    try {
        const filters = req.validated.query;

        const bookings = await bookingService.getAllBookings(filters);

        res.status(200).json({
            message: 'Bookings retrieved successfully',
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

const getBookingById = async (req, res, next) => {
    try {
        const { bookingId } = req.validated.params;
        const { id: userId, role } = req.user;

        const booking = await bookingService.getBookingById(
            bookingId,
            userId,
            role
        );

        res.status(200).json({
            message: 'Booking retrieved successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

const payBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.validated.params;
        const { id: userId } = req.user;
        const { method } = req.validated.body;

        const booking = await bookingService.payBooking(
            bookingId,
            userId,
            method
        );

        res.status(200).json({
            message: 'Booking payment successful',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

const cancelBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.validated.params;
        const { id: userId, role } = req.user;

        const booking = await bookingService.cancelBooking(
            bookingId,
            userId,
            role
        );

        res.status(200).json({
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingById,
    payBooking,
    cancelBooking
};
