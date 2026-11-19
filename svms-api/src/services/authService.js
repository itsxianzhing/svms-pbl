import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import authRepository from '../repositories/authRepository.js';

const login = async (data) => {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {},
        process.env.JWT_SECRET,
        {
            subject: String(user.id),
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

export default {
    login
};