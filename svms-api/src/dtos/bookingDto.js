import { z } from 'zod';

const paymentMethods = [
    'QRIS',
    'VIRTUAL_ACCOUNT',
    'E_WALLET'
];

const bookingStatuses = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
];

export const createBookingDto = z.object({
    courtId: z.coerce.number().int().positive(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date()
}).refine(
    data => data.startTime < data.endTime,
    {
        message: 'End time must be after start time',
        path: ['endTime']
    }
);

export const bookingIdDto = z.object({
    bookingId: z.coerce.number().int().positive()
});

export const bookingFilterDto = z.object({
    status: z.enum(bookingStatuses).optional(),
    search: z.string().trim().optional()
});

export const payBookingDto = z.object({
    method: z.enum(paymentMethods)
});
