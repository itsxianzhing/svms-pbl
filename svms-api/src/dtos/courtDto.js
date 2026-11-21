import { z } from 'zod';

export const createCourtDto = z.object({
    name: z.string().min(3).max(150),
    pricePerHour: z.coerce.number().positive(),
    isActive: z.boolean().optional().default(true)
});

export const updateCourtDto = z.object({
    name: z.string().min(3).max(150).optional(),
    pricePerHour: z.coerce.number().positive().optional(),
    isActive: z.boolean().optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field is required' }
);

export const courtBookingsDto = z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
}).refine(
    data => data.from < data.to,
    {
        message: '`from` must be earlier than `to`',
        path: ['to']
    }
);

export const courtIdDto = z.object({
    courtId: z.coerce.number().int().positive()
});

export const venueIdDto = z.object({
    venueId: z.coerce.number().int().positive()
});