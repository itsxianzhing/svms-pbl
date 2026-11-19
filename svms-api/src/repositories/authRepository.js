import prisma from '../config/db.js';

const findByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

export default {
    findByEmail
};