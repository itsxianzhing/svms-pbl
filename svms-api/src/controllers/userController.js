import userService from '../services/userService.js';

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.validated.params;

        const user = await userService.getUserById(id);

        res.status(200).json({
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(
            req.validated.body
        );

        res.status(201).json({
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const data = req.validated.body;

        const user = await userService.updateUser(id, data);

        res.status(200).json({
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.validated.params;

        const user = await userService.deleteUser(id);

        res.status(200).json({
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};