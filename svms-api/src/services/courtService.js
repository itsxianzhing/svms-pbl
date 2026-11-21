import courtRepository from '../repositories/courtRepository.js';
import venueRepository from '../repositories/venueRepository.js';

const getCourtById = async (id) => {
    const court = await courtRepository.findById(id);

    if (!court) {
        const error = new Error('Court not found');
        error.statusCode = 404;
        throw error;
    }

    return court;
};

const getCourtsByVenueId = async (venueId) => {
    const venue = await venueRepository.findById(venueId);

    if (!venue) {
        const error = new Error('Venue not found');
        error.statusCode = 404;
        throw error;
    }

    return await courtRepository.findByVenueId(venueId);
};

const getCourtBookings = async (courtId, from, to) => {
    await getCourtById(courtId);

    return await courtRepository.findBookings(courtId, from, to);
};

const createCourt = async (venueId, data) => {
    const venue = await venueRepository.findById(venueId);

    if (!venue) {
        const error = new Error('Venue not found');
        error.statusCode = 404;
        throw error;
    }

    return await courtRepository.create(venueId, data);
};

const updateCourt = async (id, data) => {
    await getCourtById(id);

    return await courtRepository.update(id, data);
};

const deleteCourt = async (id) => {
    await getCourtById(id);

    const hasBookings = await courtRepository.hasBookings(id);

    if (hasBookings) {
        const error = new Error(
            'Court cannot be deleted because it still has bookings'
        );
        error.statusCode = 409;
        throw error;
    }

    return await courtRepository.remove(id);
};

export default {
    getCourtById,
    getCourtsByVenueId,
    getCourtBookings,
    createCourt,
    updateCourt,
    deleteCourt
};