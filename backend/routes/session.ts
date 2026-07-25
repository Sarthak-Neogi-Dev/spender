import express from 'express';
import mongoose from 'mongoose';
import Session from '../models/sessions.model.ts';
import type {ISession} from '../models/sessions.model.ts';

const router = express.Router();

router.get('/:id', async (req,res)=>{
    const id = await req.params.id;
    const session : ISession | null = await Session.findById(id);
    return res.status(200).json(JSON.stringify(session));
});

router.post('/', async (req,res)=>{
    const session : ISession = await req.body.session;
    if(!session){
        return res.status(500).send("No Session");
    }
    const session_model = new Session(session);
    await session_model.save();
    const id = session_model._id;
    return res.status(200).send(`ID : ${id}`);
});

export default router;