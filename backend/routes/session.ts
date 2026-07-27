import express from 'express';
import mongoose from 'mongoose';
import Session from '../models/sessions.model.ts';
import type {ISession} from '../models/sessions.model.ts';

const router = express.Router();

router.get('/:id', async (req,res)=>{
    const id = req.params.id;
    const session : ISession | null = await Session.findById(id);
    if(!session){
        return res.status(404).send("Session not found");
    }
    return res.status(200).json(JSON.stringify(session));
});

router.post('/', async (req,res)=>{
    const session : ISession = await req.body.session;
    if(!session){
        return res.status(500).send("No Session");
    }
    if(session.members.length != session.totals.length){
        return res.status(500).send("Illegal Session");
    }
    for(const i of session.totals){
        if(i.valueOf() != 0){
            return res.status(500).send("Illegal Session");
        }
    }
    const session_model = new Session(session);
    await session_model.save();
    const id = session_model._id;
    return res.status(200).send(`ID : ${id}`);
});

router.get('/close/:id', async (req, res)=>{
    const id = req.params.id;
    const session : ISession | null = await Session.findById(id);
    if(!session){
        return res.status(404).send("Session not found");
    }
    await Session.findByIdAndUpdate(id, {isOpen : false});
    const n = session.members.length;
    var Senders = [];
    var Recievers = [];
    for(var i = 1; i < n; i++){
        if(session.totals[i].valueOf() > 0){
            Recievers.push(i);
        }
        else if(session.totals[i].valueOf() <  0){
            Senders.push(i);
        }
    }
    const termination = [];
    for(const i of Senders){
        termination.push(`${session.members[i]} will send ${session.totals[i].valueOf()*-1} to ${session.members[0]}`);
    }
    for(const i of Recievers){
        termination.push(`${session.members[0]} will send ${session.totals[i].valueOf()} to ${session.members[i]}`);
    }
    return res.status(200).json(JSON.stringify(termination));
});

export default router;