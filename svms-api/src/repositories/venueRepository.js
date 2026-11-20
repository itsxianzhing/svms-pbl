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

const courts = {
    select: {
        id: true,
        name: true,
        pricePerHour: true,
        isActive: true
    }
};

const hasBookings = async (id) => {
    const count = await prisma.booking.count({
        where: {
            court: {
                venueId: Number(id)
            }
        }
    });

    return count > 0;
};

const getDistinctTypes = async () => {
    return await prisma.venue.findMany({
        distinct: ['type'],
        select: {
            type: true
        }
    });
};


const findAll = async () => {
    return await prisma.venue.findMany({
        select: venueSelect,
        orderBy: {
            createdAt: 'desc'
        }
    });
};

const findById = async (id) => {
    return await prisma.venue.findUnique({
        where: { id },
        select: {
            ...venueSelect,
            courts
        }
    });
};

const create = async (data) => {
    return await prisma.venue.create({
        data,
        select: venueSelect
    });
};

const update = async (id, data) => {
    return await prisma.venue.update({
        where: { id },
        data,
        select: venueSelect
    });
};

const remove = async (id) => {
    return await prisma.venue.delete({
        where: {
            id: Number(id)
        }
    });
};

export default {
    findAll,
    hasBookings,
    getDistinctTypes,
    findById,
    create,
    update,
    remove
};