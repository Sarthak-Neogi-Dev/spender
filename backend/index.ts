import express from "express";
import connectDB from './lib/mongoose.ts';

const app = express();
const port = 8080;

connectDB();

app.get("/", (req, res)=>{
    res.send("Hello World");
})

app.listen(port, ()=>{
    console.log(`Listenning at Port : ${port}`);
})