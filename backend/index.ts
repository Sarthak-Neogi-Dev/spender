import express from "express";
import connectDB from './lib/mongoose.ts';
import Session from './models/sessions.model.ts';
import type {ISession, IExpense, ITransfer} from './models/sessions.model.ts';

const app = express();
const port = 8080;

connectDB();

app.get("/", (req, res)=>{
    res.send("Hello World");
});

app.get("/create",async (req, res)=>{
    const S1 = new Session<ISession>({
        members : ["a","b","c"],
        totals : [0,0,0],
        expenses : [],
        transfers : [],
        isOpen : true
    });
    await S1.save();
    res.send(`Session Created : ${S1._id}`);
})

app.listen(port, ()=>{
    console.log(`Listenning at Port : ${port}`);
});