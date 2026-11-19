import express from 'express';

import userController from '../controllers/userController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';

import {
    createUserDto,
    updateUserDto,
    userIdDto
} from '../dtos/userDto.js';

const router = express.Router();

// All endpoints below require ADMIN access
router.use(authMiddleware, adminMiddleware);

// GET /api/users
router.get(
    '/',
    userController.getAllUsers
);

// GET /api/users/:id
router.get(
    '/:id',
    validate(userIdDto, 'params'),
    userController.getUserById
);

// POST /api/users
router.post(
    '/',
    validate(createUserDto),
    userController.createUser
);

// PUT /api/users/:id
router.put(
    '/:id',
    validate(userIdDto, 'params'),
    validate(updateUserDto),
    userController.updateUser
);

// DELETE /api/users/:id
router.delete(
    '/:id',
    validate(userIdDto, 'params'),
    userController.deleteUser
);

export default router;