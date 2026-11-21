import venueRepository from '../repositories/venueRepository.js';

const getAllVenues = async (filters) => {
    return await venueRepository.findAll(filters);
};

const getVenueFilters = async () => {
    const [types, cities] = await Promise.all([
        venueRepository.getDistinctTypes(),
        venueRepository.getDistinctCities()
    ]);

    return {
        types: types.map(item => item.type),
        cities: cities.map(item => item.city)
    };
};

const getVenueById = async (venueId) => {
    const venue = await venueRepository.findById(venueId);

    if (!venue) {
        const error = new Error('Venue not found');
        error.statusCode = 404;
        throw error;
    }

    return venue;
};

const createVenue = async (data) => {
    return await venueRepository.create(data);
};

const updateVenue = async (venueId, data) => {
    await getVenueById(venueId);

    return await venueRepository.update(venueId, data);
};

const deleteVenue = async (venueId) => {
    await getVenueById(venueId);

    const hasBookings = await venueRepository.hasBookings(venueId);

    if (hasBookings) {
        const error = new Error(
            'Venue cannot be deleted because it still has bookings'
        );
        error.statusCode = 409;
        throw error;
    }

    return await venueRepository.remove(venueId);
};

export default {
    getAllVenues,
    getVenueFilters,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
};