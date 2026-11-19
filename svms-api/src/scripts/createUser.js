import 'dotenv/config';

import bcrypt from 'bcrypt';
import prisma from '../config/db.js';

const createUser = async () => {
    try {
        const name = 'Agus Santoso';
        const email = 'agus@example.com';
        const password = 'agus123456';

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                name,
                email,
                password: hashedPassword,
                role: 'CUSTOMER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        console.log('User account created:');
        console.log(admin);

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
};

createUser();