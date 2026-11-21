import prisma from '../config/db.js';

const venueSelect = {
    id: true,
    name: true,
    type: true,
    address: true,
    city: true,
    description: true,
    createdAt: true
};

const getDistinctTypes = async () => {
    return await prisma.venue.findMany({
        distinct: ['type'],
        select: { type: true },
        orderBy: { type: 'asc' }
    });
};

const getDistinctCities = async () => {
    return await prisma.venue.findMany({
        distinct: ['city'],
        select: { city: true },
        orderBy: { city: 'asc' }
    });
};

const formatVenue = (venue, includeCourts = false) => {
    const activePrices = venue.courts
        .filter(court => court.isActive)
        .map(court => Number(court.pricePerHour));

    const { courts, _count, ...venueData } = venue;

    return {
        ...venueData,
        courtCount: _count.courts,
        minPricePerHour: activePrices.length
            ? Math.min(...activePrices)
            : null,
        ...(includeCourts && { courts })
    };
};

const findAll = async (filters = {}) => {
    const { search, type, city } = filters;

    const venues = await prisma.venue.findMany({
        where: {
            ...(type && { type }),
            ...(city && { city }),
            ...(search && {
                OR: [
                    { name: { contains: search } },
                    { address: { contains: search } },
                    { city: { contains: search } }
                ]
            })
        },
        select: {
            ...venueSelect,
            _count: {
                select: {
                    courts: true
                }
            },
            courts: {
                select: {
                    pricePerHour: true,
                    isActive: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return venues.map(formatVenue);
};

const findById = async (venueId) => {
    const venue = await prisma.venue.findUnique({
        where: {
            id: Number(venueId)
        },
        select: {
            ...venueSelect,
            _count: {
                select: {
                    courts: true
                }
            },
            courts: {
                select: {
                    id: true,
                    venueId: true,
                    name: true,
                    pricePerHour: true,
                    isActive: true
                }
            }
        }
    });

    if (!venue) return null;

    return formatVenue(venue, true);
};

const hasBookings = async (venueId) => {
    const count = await prisma.booking.count({
        where: {
            court: {
                venueId: Number(venueId)
            }
        }
    });

    return count > 0;
};

const create = async (data) => {
    return await prisma.venue.create({
        data,
        select: venueSelect
    });
};

const update = async (venueId, data) => {
    return await prisma.venue.update({
        where: { id: Number(venueId) },
        data,
        select: venueSelect
    });
};

const remove = async (venueId) => {
    return await prisma.venue.delete({
        where: { id: Number(venueId) }
    });
};

export default {
    findAll,
    findById,
    getDistinctTypes,
    getDistinctCities,
    hasBookings,
    create,
    update,
    remove
};