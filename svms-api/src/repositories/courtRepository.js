import prisma from '../config/db.js';

const courtSelect = {
    id: true,
    venueId: true,
    name: true,
    pricePerHour: true,
    isActive: true
};

const hasBookings = async (id) => {
    const count = await prisma.booking.count({
        where: {
            courtId: Number(id)
        }
    });

    return count > 0;
};

const findByVenueId = async (venueId) => {
    return await prisma.court.findMany({
        where: {
            venueId: Number(venueId)
        },
        select: courtSelect
    });
};

const findBookings = async (courtId, from, to) => {
    return await prisma.booking.findMany({
        where: {
            courtId: Number(courtId),
            startTime: {
                lt: to
            },
            endTime: {
                gt: from
            },
            status: {
                in: ['PENDING', 'CONFIRMED']
            }
        },
        select: {
            startTime: true,
            endTime: true
        },
        orderBy: {
            startTime: 'asc'
        }
    });
};

const findById = async (id) => {
    return await prisma.court.findUnique({
        where: {
            id: Number(id)
        },
        select: courtSelect
    });
};

const create = async (venueId, data) => {
    return await prisma.court.create({
        data: {
            ...data,
            venueId: Number(venueId)
        },
        select: courtSelect
    });
};

const update = async (id, data) => {
    return await prisma.court.update({
        where: {
            id: Number(id)
        },
        data,
        select: courtSelect
    });
};

const remove = async (id) => {
    return await prisma.court.delete({
        where: {
            id: Number(id)
        }
    });
};

export default {
    hasBookings,
    findByVenueId,
    findById,
    findBookings,
    create,
    update,
    remove
};