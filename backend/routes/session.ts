import express from 'express';
import mongoose from 'mongoose';
import Session from '../models/sessions.model.ts';
import type { ISession, IExpense, ITransfer } from '../models/sessions.model.ts';

const router = express.Router();

//To Get A Session
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const session: ISession | null = await Session.findById(id);
    if (!session) {
        return res.status(404).send("Session not found");
    }
    return res.status(200).json(JSON.stringify(session));
});

//To Create A New Session
router.post('/', async (req, res) => {
    const session: ISession = await req.body.session;
    if (!session) {
        return res.status(400).send("No Session");
    }
    if (session.members.length != session.totals.length) {
        return res.status(400).send("Illegal Session");
    }
    for (const i of session.totals) {
        if (i.valueOf() != 0) {
            return res.status(400).send("Illegal Session");
        }
    }
    const session_model = new Session(session);
    await session_model.save();
    const id = session_model._id;
    return res.status(200).send(id);
});

//To Close A Session
router.get('/close/:id', async (req, res) => {
    const id = req.params.id;
    const session: ISession | null = await Session.findById(id);
    if (!session) {
        return res.status(404).send("Session not found");
    }
    await Session.findByIdAndUpdate(id, { isOpen: false });
    const n = session.members.length;
    var Senders = [];
    var Recievers = [];
    for (var i = 1; i < n; i++) {
        if (session.totals[i].valueOf() > 0) {
            Recievers.push(i);
        }
        else if (session.totals[i].valueOf() < 0) {
            Senders.push(i);
        }
    }
    const termination = [];
    for (const i of Senders) {
        termination.push(`${session.members[i]} will send ${session.totals[i].valueOf() * -1} to ${session.members[0]}`);
    }
    for (const i of Recievers) {
        termination.push(`${session.members[0]} will send ${session.totals[i].valueOf()} to ${session.members[i]}`);
    }
    return res.status(200).json(JSON.stringify(termination));
});

//To Create A New Expense
router.post('/expense/', async (req, res) => {
    const expense: IExpense = await req.body.expense;
    if (!expense || !expense.amount || !expense.title) {
        return res.status(400).send("Invalid Expense");
    }
    const id = await req.body.id;
    if (!id) {
        return res.status(400).send("ID required");
    }
    const session: ISession | null = await Session.findById(id);
    if (!session) {
        return res.status(404).send("Session Not Found");
    }
    session.totals[expense.payer_id.valueOf()] = session.totals[expense.payer_id.valueOf()].valueOf() + expense.amount.valueOf();
    var share = Math.floor(expense.amount.valueOf() / session.members.length);
    for (var i = 0; i < session.members.length; i++) {
        session.totals[i] = session.totals[i].valueOf() - share;
    }
    session.expenses.push(expense);
    await Session.findByIdAndUpdate(id, { totals: session.totals, expenses: session.expenses });
    return res.status(200).send("Expense Added");
});

//To Delete A Expense
router.post('/delete/', async (req, res) => {
    const expense_id = await req.body.expense_id;
    const id = await req.body.id;
    const session: ISession | null = await Session.findById(id);
    if (!session) {
        return res.status(404).send("Session Not Found");
    }
    const expense: IExpense | null = session.expenses[expense_id];
    if (!expense) {
        return res.status(404).send("Session Not Found");
    }

    session.totals[expense.payer_id.valueOf()] = session.totals[expense.payer_id.valueOf()].valueOf() - expense.amount.valueOf();
    var share = Math.floor(expense.amount.valueOf() / session.members.length);
    for (var i = 0; i < session.members.length; i++) {
        session.totals[i] = session.totals[i].valueOf() + share;
    }
    session.expenses.splice(expense_id, 1);
    await Session.findByIdAndUpdate(id, { totals: session.totals, expenses: session.expenses });
    return res.status(200).send("Expense Removed");
});

export default router;