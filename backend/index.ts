import express from "express";
import connectDB from './lib/mongoose.js';
import router from './routes/session.js';
import cors from 'cors';

const app = express();
const port = 8080;

connectDB();

app.use(cors());

app.use(express.json());

app.use('/session', router);

export default app;