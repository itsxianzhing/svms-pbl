import prisma from '../config/db.js';

// Get today's date range in Asia/Jakarta (UTC+7)
const getTodayRange = () => {
    const now = new Date();

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(now);

    const getPart = (type) =>
        Number(parts.find(part => part.type === type).value);

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');

    const start = new Date(
        Date.UTC(year, month - 1, day) - 7 * 60 * 60 * 1000
    );

    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    return { start, end };
};

const getSummary = async () => {
    const { start, end } = getTodayRange();

    const [
        totalBookings,
        todayBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        revenue,
        topCourtsData
    ] = await Promise.all([
        // Total bookings
        prisma.booking.count(),

        // Bookings created today
        prisma.booking.count({
            where: {
                createdAt: {
                    gte: start,
                    lt: end
                }
            }
        }),

        // Pending bookings
        prisma.booking.count({
            where: {
                status: 'PENDING'
            }
        }),

        // Confirmed bookings
        prisma.booking.count({
            where: {
                status: 'CONFIRMED'
            }
        }),

        // Cancelled bookings
        prisma.booking.count({
            where: {
                status: 'CANCELLED'
            }
        }),

        // Total revenue from confirmed bookings
        prisma.booking.aggregate({
            where: {
                status: 'CONFIRMED'
            },
            _sum: {
                totalPrice: true
            }
        }),

        // Top 5 courts by confirmed booking count
        prisma.booking.groupBy({
            by: ['courtId'],
            where: {
                status: 'CONFIRMED'
            },
            _count: {
                _all: true
            },
            _sum: {
                totalPrice: true
            },
            orderBy: {
                _count: {
                    courtId: 'desc'
                }
            },
            take: 5
        })
    ]);

    // Get court and venue details for top courts
    const courtIds = topCourtsData.map(item => item.courtId);

    const courts = await prisma.court.findMany({
        where: {
            id: {
                in: courtIds
            }
        },
        select: {
            id: true,
            name: true,
            venue: {
                select: {
                    name: true
                }
            }
        }
    });

    const courtMap = new Map(
        courts.map(court => [court.id, court])
    );

    const topCourts = topCourtsData.map(item => {
        const court = courtMap.get(item.courtId);

        return {
            courtId: item.courtId,
            courtName: court?.name ?? 'Unknown Court',
            venueName: court?.venue.name ?? 'Unknown Venue',
            totalBookings: item._count._all,
            totalRevenue: Number(item._sum.totalPrice ?? 0)
        };
    });

    return {
        totalRevenue: Number(revenue._sum.totalPrice ?? 0),
        totalBookings,
        todayBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        topCourts
    };
};

export default {
    getSummary
};