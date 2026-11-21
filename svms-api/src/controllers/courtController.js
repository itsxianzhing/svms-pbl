
import courtService from '../services/courtService.js';

const getCourtById = async (req, res, next) => {
    try {
        const { courtId } = req.validated.params;

        const court = await courtService.getCourtById(courtId);

        res.status(200).json({
            message: 'Court retrieved successfully',
            data: court
        });
    } catch (error) {
        next(error);
    }
};

const getCourtsByVenueId = async (req, res, next) => {
    try {
        const { venueId } = req.validated.params;

        const courts = await courtService.getCourtsByVenueId(venueId);

        res.status(200).json({
            message: 'Courts retrieved successfully',
            data: courts
        });
    } catch (error) {
        next(error);
    }
};

const getCourtBookings = async (req, res, next) => {
    try {
        const { courtId } = req.validated.params;
        const { from, to } = req.validated.query;

        const bookings = await courtService.getCourtBookings(
            courtId,
            from,
            to
        );

        res.status(200).json({
            message: 'Court bookings retrieved successfully',
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

const createCourt = async (req, res, next) => {
    try {
        const { venueId } = req.validated.params;
        const data = req.validated.body;

        const court = await courtService.createCourt(venueId, data);

        res.status(201).json({
            message: 'Court created successfully',
            data: court
        });
    } catch (error) {
        next(error);
    }
};

const updateCourt = async (req, res, next) => {
    try {
        const { courtId } = req.validated.params;
        const data = req.validated.body;

        const court = await courtService.updateCourt(courtId, data);

        res.status(200).json({
            message: 'Court updated successfully',
            data: court
        });
    } catch (error) {
        next(error);
    }
};

const deleteCourt = async (req, res, next) => {
    try {
        const { courtId } = req.validated.params;

        await courtService.deleteCourt(courtId);

        res.status(200).json({
            message: 'Court deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getCourtById,
    getCourtsByVenueId,
    getCourtBookings,
    createCourt,
    updateCourt,
    deleteCourt
};
