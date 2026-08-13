import express from "express";
import connectDB from './lib/mongoose.js';
import router from './routes/session.js';
import cors from 'cors';
import "dotenv/config";


const app = express();
const port = process.env.PORT || 10000;

connectDB();

app.use(cors());

app.use(express.json());

app.use('/session', router);

app.get("/", (req, res) => {
    res.send("Welcome to Spender Backend!");
})

app.listen(port, () => {
    console.log(`⚡[server]: Server is running at ${port}`);
});