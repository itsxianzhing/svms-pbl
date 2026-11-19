import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import authRepository from '../repositories/authRepository.js';

const login = async ({ email, password }) => {
    const user = await authRepository.findByEmail(email);

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
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

const register = async ({ name, email, password }) => {
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
        throw new Error('Email sudah terdaftar', 409);
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authRepository.createUser({
        name,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        {},
        process.env.JWT_SECRET,
        {
            subject: String(newUser.id),
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );

    return {
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    };
};

export default {
    login,
    register
};