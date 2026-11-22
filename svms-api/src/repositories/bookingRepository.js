import prisma from '../config/db.js';

const bookingSelect = {
    id: true,
    courtId: true,
    userId: true,
    status: true,
    startTime: true,
    endTime: true,
    totalPrice: true,
    createdAt: true,
    expiresAt: true,

    court: {
        select: {
            id: true,
            name: true,
            pricePerHour: true,
            venue: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                    city: true
                }
            }
        }
    },

    user: {
        select: {
            id: true,
            name: true,
            email: true
        }
    }
};

const formatBooking = (booking) => {
    if (!booking) return null;

    const { venue, ...court } = booking.court;

    return {
        ...booking,
        court,
        venue
    };
};

const findCourtForBooking = async (courtId) => {
    return await prisma.court.findUnique({
        where: {
            id: Number(courtId)
        },
        select: {
            id: true,
            name: true,
            pricePerHour: true,
            isActive: true,
            venue: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                    city: true
                }
            }
        }
    });
};

// Expire pending bookings whose payment window has passed
const expirePendingBookings = async () => {
    return await prisma.booking.updateMany({
        where: {
            status: 'PENDING',
            expiresAt: {
                lte: new Date()
            }
        },
        data: {
            status: 'CANCELLED'
        }
    });
};

// Create booking with availability check
const create = async (data) => {
    try {
        return await prisma.$transaction(
            async (tx) => {
                const court = await tx.court.findUnique({
                    where: {
                        id: Number(data.courtId)
                    }
                });

                if (!court || !court.isActive) {
                    const error = new Error('Court is unavailable');
                    error.statusCode = 404;
                    throw error;
                }

                await tx.booking.updateMany({
                    where: {
                        status: 'PENDING',
                        expiresAt: {
                            lte: new Date()
                        }
                    },
                    data: {
                        status: 'CANCELLED'
                    }
                });

                // Check overlapping bookings
                const overlapping = await tx.booking.findFirst({
                    where: {
                        courtId: Number(data.courtId),
                        status: {
                            in: ['PENDING', 'CONFIRMED']
                        },
                        startTime: {
                            lt: data.endTime
                        },
                        endTime: {
                            gt: data.startTime
                        }
                    }
                });

                if (overlapping) {
                    const error = new Error(
                        'This court is already booked for the selected time'
                    );
                    error.statusCode = 409;
                    throw error;
                }

                const booking = await tx.booking.create({
                    data: {
                        userId: Number(data.userId),
                        courtId: Number(data.courtId),
                        startTime: data.startTime,
                        endTime: data.endTime,
                        totalPrice: data.totalPrice,
                        expiresAt: data.expiresAt
                    },
                    select: bookingSelect
                });

                return formatBooking(booking);
            },
            {
                isolationLevel: 'Serializable'
            }
        );
    } catch (error) {
        if (error.code === 'P2034') {
            const conflict = new Error(
                'This court is already booked for the selected time'
            );
            conflict.statusCode = 409;
            throw conflict;
        }

        throw error;
    }
};

// Get bookings belonging to a customer
const findMyBookings = async (userId, filters = {}) => {
    const bookings = await prisma.booking.findMany({
        where: {
            userId: Number(userId),
            ...(filters.status && {
                status: filters.status
            })
        },
        select: bookingSelect,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return bookings.map(formatBooking);
};

// Get all bookings (ADMIN)
const findAll = async (filters = {}) => {
    const { status, search } = filters;

    const bookings = await prisma.booking.findMany({
        where: {
            ...(status && { status }),

            ...(search && {
                OR: [
                    {
                        user: {
                            name: {
                                contains: search
                            }
                        }
                    },
                    {
                        user: {
                            email: {
                                contains: search
                            }
                        }
                    },
                    {
                        court: {
                            name: {
                                contains: search
                            }
                        }
                    },
                    {
                        court: {
                            venue: {
                                name: {
                                    contains: search
                                }
                            }
                        }
                    }
                ]
            })
        },
        select: bookingSelect,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return bookings.map(formatBooking);
};

// Get booking by ID
const findById = async (bookingId) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: Number(bookingId)
        },
        select: bookingSelect
    });

    return formatBooking(booking);
};

// Update booking payment
const pay = async (bookingId, method) => {
    const booking = await prisma.booking.update({
        where: {
            id: Number(bookingId)
        },
        data: {
            status: 'CONFIRMED',
            paymentMethod: method
        },
        select: bookingSelect
    });

    return formatBooking(booking);
};

// Cancel booking
const cancel = async (bookingId) => {
    const booking = await prisma.booking.update({
        where: {
            id: Number(bookingId)
        },
        data: {
            status: 'CANCELLED'
        },
        select: bookingSelect
    });

    return formatBooking(booking);
};

export default {
    findCourtForBooking,
    expirePendingBookings,
    create,
    findMyBookings,
    findAll,
    findById,
    pay,
    cancel
};
