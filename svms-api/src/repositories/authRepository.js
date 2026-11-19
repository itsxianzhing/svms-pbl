import prisma from '../config/db.js';

const findByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData
    });
};

export default {
    findByEmail,
    createUser
};