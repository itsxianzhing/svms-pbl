const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[property]);

        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.flatten()
            });
        }

        req.validated = {
            ...req.validated,
            [property]: result.data
        };

        next();
    };
};

export default validate;