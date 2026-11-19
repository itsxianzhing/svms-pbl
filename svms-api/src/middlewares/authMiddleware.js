import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const userId = Number(decoded.sub);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
};

export default authMiddleware;