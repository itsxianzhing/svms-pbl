const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err.code === 'P2002') {
        return res.status(409).json({
            message: 'Email already exists'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            message: 'Resource not found'
        });
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.statusCode
            ? err.message
            : 'Internal server error'
    });
};

export default errorMiddleware;