import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ielts_mock';

async function main() {
    await mongoose.connect(mongoUri);
    await Question.deleteMany({});
    await Question.create([
        {
            text: 'What is the capital of England?',
            options: [
                { text: 'Manchester', isCorrect: false },
                { text: 'London', isCorrect: true },
                { text: 'Birmingham', isCorrect: false },
                { text: 'Liverpool', isCorrect: false },
            ],
        },
        {
            text: '2 + 2 = ? ',
            options: [
                { text: '3', isCorrect: false },
                { text: '4', isCorrect: true },
                { text: '5', isCorrect: false },
                { text: '22', isCorrect: false },
            ],
        },
    ]);
    console.log('Seeded');
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


