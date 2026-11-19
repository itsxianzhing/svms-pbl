import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';

const getAllUsers = async () => {
    return await userRepository.findAll();
};

const getUserById = async (id) => {
    const user = await userRepository.findById(id);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const createUser = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
        ...data,
        password: hashedPassword
    };

    return await userRepository.create(userData);
};

const updateUser = async (id, data) => {
    await getUserById(id);

    const userData = { ...data };

    if (userData.password) {
        userData.password = await bcrypt.hash(
            userData.password,
            10
        );
    }

    return await userRepository.update(id, userData);
};

const deleteUser = async (id) => {
    await getUserById(id);

    return await userRepository.remove(id);
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};