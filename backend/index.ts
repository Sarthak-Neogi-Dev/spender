import express from "express";
import router from './routes/session.js';
import cors from 'cors';
import "dotenv/config";
import connectDB from './lib/mongoose.js';

const app = express();
const port = 10000;

app.use(cors());
app.use(express.json());
app.use('/session', router);

app.get("/", (req, res) => {
    res.send("Welcome to Spender Backend!");
});

connectDB()
    .then(() => {
        app.listen(port, '0.0.0.0', () => {
            console.log(`⚡[server]: Server is running at ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB. Server not started.", err);
        process.exit(1);
    });