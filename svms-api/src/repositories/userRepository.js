import prisma from '../config/db.js';

const userSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    createdAt: true
};

const findAll = async () => {
    return await prisma.user.findMany({
        select: userSelect,
        orderBy: {
            createdAt: 'desc'
        }
    });
};

const findById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        select: userSelect
    });
};

const create = async (data) => {
    return await prisma.user.create({
        data,
        select: userSelect
    });
};

const update = async (id, data) => {
    return await prisma.user.update({
        where: { id },
        data,
        select: userSelect
    });
};

const remove = async (id) => {
    return await prisma.user.delete({
        where: { id },
        select: userSelect
    });
};

export default {
    findAll,
    findById,
    create,
    update,
    remove
};