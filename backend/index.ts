import express from "express";
import connectDB from './lib/mongoose.ts';
import router from './routes/session.ts';
import cors from 'cors';

const app = express();
const port = 8080;

connectDB();

app.use(cors());

app.use(express.json());

app.use('/session', router);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Listenning at Port : ${port}`);
});