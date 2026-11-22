import 'dotenv/config';

import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

// These are disposable demo credentials for the learning project. They match
// the hardcoded frontend demo buttons and are not production credentials.
const adminPassword = 'admin123';
const customerPassword = 'customer123';

const seedUsers = [
    {
        name: 'Rina Pratama',
        email: 'admin@svms.test',
        phone: '081234567890',
        role: 'ADMIN'
    },
    {
        name: 'Budi Santoso',
        email: 'budi.customer@svms.test',
        phone: '081234567891',
        role: 'CUSTOMER'
    },
    {
        name: 'Siti Rahmawati',
        email: 'siti.customer@svms.test',
        phone: '081234567892',
        role: 'CUSTOMER'
    },
    {
        name: 'Andi Wijaya',
        email: 'andi.customer@svms.test',
        phone: '081234567893',
        role: 'CUSTOMER'
    }
];

const seedVenues = [
    {
        name: 'Gelanggang Badminton Senayan',
        type: 'Badminton',
        address: 'Jl. Pintu Satu Senayan No. 12, Gelora, Tanah Abang',
        city: 'Jakarta Pusat',
        description: 'Gelanggang badminton dengan lapangan indoor ber-AC dan parkir luas.',
        courts: [
            { name: 'Lapangan A', pricePerHour: 90000 },
            { name: 'Lapangan B', pricePerHour: 90000 },
            { name: 'Lapangan C', pricePerHour: 110000 }
        ]
    },
    {
        name: 'Lapangan Futsal Cempaka',
        type: 'Futsal',
        address: 'Jl. Cempaka Putih Tengah No. 8, Cempaka Putih',
        city: 'Jakarta Pusat',
        description: 'Lapangan futsal sintetis untuk latihan rutin dan pertandingan komunitas.',
        courts: [
            { name: 'Lapangan Utama', pricePerHour: 180000 },
            { name: 'Lapangan Komunitas', pricePerHour: 150000 }
        ]
    },
    {
        name: 'Padel Kemang Social Club',
        type: 'Padel',
        address: 'Jl. Kemang Selatan VIII No. 21, Bangka, Mampang Prapatan',
        city: 'Jakarta Selatan',
        description: 'Klub padel outdoor dengan area lounge dan fasilitas penyewaan raket.',
        courts: [
            { name: 'Court 1', pricePerHour: 200000 },
            { name: 'Court 2', pricePerHour: 200000 }
        ]
    }
];

// The schema has no natural unique key for venues, courts, or bookings. These
// helpers find the stable seed identity and leave existing records untouched.
const findOrCreateVenue = async (venueData) => {
    const existingVenue = await prisma.venue.findFirst({
        where: {
            name: venueData.name,
            city: venueData.city,
            type: venueData.type
        }
    });

    if (existingVenue) {
        return existingVenue;
    }

    return prisma.venue.create({
        data: {
            name: venueData.name,
            type: venueData.type,
            address: venueData.address,
            city: venueData.city,
            description: venueData.description
        }
    });
};

const findOrCreateCourt = async (venueId, courtData) => {
    const existingCourt = await prisma.court.findFirst({
        where: {
            venueId,
            name: courtData.name
        }
    });

    if (existingCourt) {
        return existingCourt;
    }

    return prisma.court.create({
        data: {
            venueId,
            name: courtData.name,
            pricePerHour: courtData.pricePerHour,
            isActive: true
        }
    });
};

const findOrCreateBooking = async ({ userId, courtId, startTime, data }) => {
    const existingBooking = await prisma.booking.findFirst({
        where: {
            userId,
            courtId,
            startTime
        }
    });

    if (existingBooking) {
        return existingBooking;
    }

    return prisma.booking.create({
        data: {
            userId,
            courtId,
            startTime,
            ...data
        }
    });
};

const main = async () => {
    // Hash each configured password once; no plain-text password is persisted.
    const hashedPasswords = {
        ADMIN: await bcrypt.hash(adminPassword, 10),
        CUSTOMER: await bcrypt.hash(customerPassword, 10)
    };

    const users = {};
    for (const userData of seedUsers) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            // Keep the demo accounts usable when the seed is run again. These
            // stable demo emails are intentionally the only users updated.
            update: { password: hashedPasswords[userData.role] },
            create: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                password: hashedPasswords[userData.role]
            }
        });

        users[userData.email] = user;
    }

    const courts = {};
    for (const venueData of seedVenues) {
        const venue = await findOrCreateVenue(venueData);

        for (const courtData of venueData.courts) {
            const court = await findOrCreateCourt(venue.id, courtData);
            courts[`${venueData.name}:${courtData.name}`] = court;
        }
    }

    // These future bookings provide useful initial data for the customer and
    // admin flows while remaining deterministic and safe to run repeatedly.
    const senayanCourt = courts['Gelanggang Badminton Senayan:Lapangan A'];
    const futsalCourt = courts['Lapangan Futsal Cempaka:Lapangan Utama'];
    const padelCourt = courts['Padel Kemang Social Club:Court 1'];

    await findOrCreateBooking({
        userId: users['budi.customer@svms.test'].id,
        courtId: senayanCourt.id,
        startTime: new Date('2027-01-15T09:00:00.000Z'),
        data: {
            endTime: new Date('2027-01-15T11:00:00.000Z'),
            totalPrice: 180000,
            status: 'CONFIRMED',
            paymentMethod: 'QRIS',
            expiresAt: null
        }
    });

    await findOrCreateBooking({
        userId: users['siti.customer@svms.test'].id,
        courtId: futsalCourt.id,
        startTime: new Date('2027-01-17T08:00:00.000Z'),
        data: {
            endTime: new Date('2027-01-17T09:00:00.000Z'),
            totalPrice: 180000,
            status: 'CONFIRMED',
            paymentMethod: 'VIRTUAL_ACCOUNT',
            expiresAt: null
        }
    });

    await findOrCreateBooking({
        userId: users['andi.customer@svms.test'].id,
        courtId: padelCourt.id,
        startTime: new Date('2027-01-20T10:00:00.000Z'),
        data: {
            endTime: new Date('2027-01-20T11:00:00.000Z'),
            totalPrice: 200000,
            status: 'PENDING',
            paymentMethod: null,
            expiresAt: new Date('2027-01-20T09:30:00.000Z')
        }
    });

    console.log('Seed completed: 1 admin, 3 customers, 3 venues, 7 courts, and 3 bookings checked.');
};

try {
    await main();
} catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
