import venueRepository from '../repositories/venueRepository.js';

const getAllVenues = async () => {
    return await venueRepository.findAll();
};

const getVenueFilters = async () => {
    const [types, cities] = await Promise.all([
        venueRepository.getDistinctTypes(),
    ]);

    return {
        types: types.map((item) => item.type)
    };
};

const getVenueById = async (id) => {
    const venue = await venueRepository.findById(id);

    if (!venue) {
        const error = new Error('Venue not found');
        error.statusCode = 404;
        throw error;
    }

    return venue;
};

const createVenue = async (data) => {
    const venueData = {
        ...data
    };

    return await venueRepository.create(venueData);
};

const updateVenue = async (id, data) => {
    await getVenueById(id);

    const venueData = { ...data };

    if (venueData.password) {
        venueData.password = await bcrypt.hash(
            venueData.password,
            10
        );
    }

    return await venueRepository.update(id, venueData);
};

const deleteVenue = async (id) => {
    const venue = await venueRepository.findById(id);

    if (!venue) {
        throw new Error('Venue not found');
    }

    const hasBookings = await venueRepository.hasBookings(id);

    if (hasBookings) {
        const error = new Error(
            'Venue cannot be deleted because it still has bookings'
        );
        error.statusCode = 409;
        throw error;
    }

    return await venueRepository.remove(id);
};

export default {
    getAllVenues,
    getVenueFilters,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
};