
import bookingRepository from '../repositories/bookingRepository.js';

const PAYMENT_WINDOW_MINUTES = 15;

// Get booking by ID and check ownership
const getBookingById = async (bookingId, userId, role) => {
    await bookingRepository.expirePendingBookings();

    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
        const error = new Error('Booking not found');
        error.statusCode = 404;
        throw error;
    }

    if (role !== 'ADMIN' && booking.userId !== Number(userId)) {
        const error = new Error('You are not allowed to access this booking');
        error.statusCode = 403;
        throw error;
    }

    return booking;
};

// Create booking
const createBooking = async (userId, data) => {
    const { courtId, startTime, endTime } = data;

    if (startTime <= new Date()) {
        const error = new Error('Booking time must be in the future');
        error.statusCode = 400;
        throw error;
    }

    const court = await bookingRepository.findCourtForBooking(courtId);

    if (!court) {
        const error = new Error('Court not found');
        error.statusCode = 404;
        throw error;
    }

    if (!court.isActive) {
        const error = new Error('Court is currently inactive');
        error.statusCode = 409;
        throw error;
    }

    const durationInHours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (durationInHours <= 0) {
        const error = new Error('Invalid booking duration');
        error.statusCode = 400;
        throw error;
    }

    const totalPrice = Number(court.pricePerHour) * durationInHours;

    const expiresAt = new Date(
        Date.now() + PAYMENT_WINDOW_MINUTES * 60 * 1000
    );

    return await bookingRepository.create({
        userId,
        courtId,
        startTime,
        endTime,
        totalPrice,
        expiresAt
    });
};

// Get current customer's bookings
const getMyBookings = async (userId, filters) => {
    await bookingRepository.expirePendingBookings();

    return await bookingRepository.findMyBookings(userId, filters);
};

// Get all bookings (ADMIN)
const getAllBookings = async (filters) => {
    await bookingRepository.expirePendingBookings();

    return await bookingRepository.findAll(filters);
};

// Pay booking
const payBooking = async (bookingId, userId, method) => {
    const booking = await getBookingById(bookingId, userId, 'CUSTOMER');

    if (booking.status !== 'PENDING') {
        const error = new Error('Only pending bookings can be paid');
        error.statusCode = 409;
        throw error;
    }

    if (!booking.expiresAt || booking.expiresAt <= new Date()) {
        const error = new Error('Booking payment period has expired');
        error.statusCode = 409;
        throw error;
    }

    return await bookingRepository.pay(bookingId, method);
};

// Cancel booking
const cancelBooking = async (bookingId, userId, role) => {
    const booking = await getBookingById(bookingId, userId, role);

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
        const error = new Error('This booking cannot be cancelled');
        error.statusCode = 409;
        throw error;
    }

    return await bookingRepository.cancel(bookingId);
};

export default {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingById,
    payBooking,
    cancelBooking
};
