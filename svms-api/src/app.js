import express from 'express';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courtRoutes from './routes/courtRoutes.js';

import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'API is running'
    });
});

// Public authentication routes
app.use('/api/auth', authRoutes);

// Admin-only user routes
app.use('/api/users', userRoutes);

// Venue routes
app.use('/api/venues', venueRoutes);

// Court routes
app.use('/api/courts', courtRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

app.use(errorMiddleware);

export default app;