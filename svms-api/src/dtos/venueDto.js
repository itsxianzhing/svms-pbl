import { z } from 'zod';

export const createVenueDto = z.object({
    name: z.string().min(3).max(150),
    type: z.string().min(1).max(50),
    address: z.string()
        .min(10, 'Address must be at least 10 characters')
        .max(5000, 'Address is too long'),
    city: z.string().min(2).max(100),
    description: z.string().optional()
});

export const updateVenueDto = z.object({
    name: z.string().min(3).max(150).optional(),
    type: z.string().min(1).max(50).optional(),
    address: z.string().min(10).max(5000).optional(),
    city: z.string().min(2).max(100).optional(),
    description: z.string().nullable().optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field is required' }
);

export const venueIdDto = z.object({
    venueId: z.coerce.number().int().positive()
});

export const venueFilterDto = z.object({
    search: z.string().optional(),
    type: z.string().optional(),
    city: z.string().optional()
});