import authService from '../services/authService.js';

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login({
            email,
            password
        });

        res.status(200).json({
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const result = await authService.register({
            name,
            email,
            password
        });

        res.status(200).json({
            status: 'success',
            message: 'Register successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    login,
    register
};
