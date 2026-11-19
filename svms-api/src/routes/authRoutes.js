import express from 'express';

import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';

import { loginDto } from '../dtos/authDto.js';

const router = express.Router();

// POST /api/auth/login
router.post(
    '/login',
    validate(loginDto),
    authController.login
);

// GET /api/auth/me
router.get(
    '/me',
    authMiddleware,
    (req, res) => {
        res.status(200).json({
            message: 'Authenticated user',
            data: req.user
        });
    }
);

export default router;