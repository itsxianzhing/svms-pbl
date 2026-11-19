import 'dotenv/config';

import bcrypt from 'bcrypt';
import prisma from '../config/db.js';

const createAdmin = async () => {
    try {
        const name = 'Super Admin';
        const email = 'admin@example.com';
        const password = 'admin123456';

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        console.log('Admin account created:');
        console.log(admin);

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
};

createAdmin();