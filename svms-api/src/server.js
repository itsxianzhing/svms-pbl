import 'dotenv/config';
import express from 'express';
import db from './config/database.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/siswa', async (req, res) => {
    const { name, email, password, phone } = req.body;
    const query = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';

    try {
        const [result] = await db.execute(query, [name, email, password, phone]);

        res.status(201).json({
            message: 'Users berhasil didaftarkan',
            usersId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/api/siswa', async (res) => {
    const query = 'SELECT * FROM users';

    try {
        const [users] = await db.execute(query);

        res.status(200).json({
            status: 'Success',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/api/siswa/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM users WHERE id = ?';

    try {
        const [user] = await db.execute(query, [id]);

        if (user.length === 0) {
            return res.status(404).json({
                message: 'User tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.put('/api/siswa/:id', async (req, res) => {
    const id = req.params.id;
    const { name, email, password, phone } = req.body;
    const query = 'UPDATE users set name = ?, email = ?, password = ?, phone = ? WHERE id = ?';

    try {
        const [users] = await db.execute(query, [name, email, password, phone, id]);

        res.status(200).json({
            status: 'Success',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.delete('/api/siswa/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';

    try {
        const [result] = await db.execute(query, [id]);
        res.status(204).json({
            status: 'Success',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});