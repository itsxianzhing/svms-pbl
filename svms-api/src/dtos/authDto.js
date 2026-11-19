import { z } from 'zod';

export const loginDto = z.object({
    email: z.string("Email wajib diisi").email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter")
});

export const registerDto = z.object({
    name: z.string().max(100, "Nama wajib diisi"),
    email: z.string("Email wajib diisi").email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter")
});