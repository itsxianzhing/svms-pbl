import courtService from '../services/courtService.js';

const getCourtById = async (req, res, next) => {
    try {
        const { id } = req.validated.params;

        const venue = await venueService.getVenueById(id);

        res.status(200).json({
            message: 'Venue retrieved successfully',
            data: venue
        });
    } catch (error) {
        next(error);
    }
};

const createCourt = async (req, res, next) => {
    try {
        const venue = await venueService.createVenue(
            req.validated.body
        );

        res.status(201).json({
            message: 'Venue created successfully',
            data: venue
        });
    } catch (error) {
        next(error);
    }
};

const updateCourt = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const data = req.validated.body;

        const venue = await venueService.updateVenue(id, data);

        res.status(200).json({
            message: 'Venue updated successfully',
            data: venue
        });
    } catch (error) {
        next(error);
    }
};

const deleteCourt = async (req, res, next) => {
    try {
        const { id } = req.validated.params;

        const venue = await venueService.deleteVenue(id);

        res.status(200).json({
            message: 'Venue deleted successfully',
            data: venue
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getCourtById,
    createCourt,
    updateCourt,
    deleteCourt
};