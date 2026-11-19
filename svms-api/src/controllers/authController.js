import authService from '../services/authService.js';

const login = async (req, res, next) => {
    try {
        const result = await authService.login(
            req.validated.body
        );

        res.status(200).json({
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export default {
    login
};