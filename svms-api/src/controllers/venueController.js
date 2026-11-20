import venueService from '../services/venueService.js';

const getAllVenues = async (req, res, next) => {
    try {
        const venues = await venueService.getAllVenues();

        res.status(200).json({
            message: 'Venue retrieved successfully',
            data: venues
        });
    } catch (error) {
        next(error);
    }
};

const getVenueFilters = async (req, res, next) => {
    try {
        const filters = await venueService.getVenueFilters();

        res.status(200).json({
            message: 'Venue filters retrieved successfully',
            data: filters
        });
    } catch (error) {
        next(error);
    }
};

const getVenueById = async (req, res, next) => {
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

const createVenue = async (req, res, next) => {
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

const updateVenue = async (req, res, next) => {
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

const deleteVenue = async (req, res, next) => {
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
    getAllVenues,
    getVenueFilters,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
};