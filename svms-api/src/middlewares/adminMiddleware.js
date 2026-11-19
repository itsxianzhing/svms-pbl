const adminMiddleware = (req, res, next) => {
    console.log('Authenticated user:', req.user);

    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
            message: 'Forbidden: Admin access required'
        });
    }

    next();
};

export default adminMiddleware;