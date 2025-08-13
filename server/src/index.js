import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import questionsRouter from './routes/questions.js';
import testRouter from './routes/test.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ielts_mock';
const port = process.env.PORT || 4000;

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    })
    .catch((err) => {
        console.error('Mongo connection error', err);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.json({ ok: true, name: 'IELTS Mock API' });
});

app.use('/api/questions', questionsRouter);
app.use('/api/test', testRouter);


