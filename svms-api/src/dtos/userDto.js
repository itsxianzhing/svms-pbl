import { z } from 'zod';

export const createUserDto = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'USER']).default('USER')
});

export const updateUserDto = z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    phone: z.string().nullable().optional(),
    role: z.enum(['ADMIN', 'USER']).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field is required' }
);

export const userIdDto = z.object({
    id: z.coerce.number().int().positive()
});