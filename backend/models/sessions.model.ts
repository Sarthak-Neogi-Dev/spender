import mongoose from "mongoose";

export interface ITransfer {
    sender_id : Number,
    reciever_id : Number,
    title : String,
    amount : Number
}

const transferSchema = new mongoose.Schema<ITransfer>({
    sender_id : Number,
    reciever_id : Number,
    title : String,
    amount : Number
});

export interface IExpense {
    payer_id : Number,
    title : String,
    amount : Number
} 

const expenseSchema = new mongoose.Schema<IExpense>({
    payer_id : Number,
    title : String,
    amount : Number
})

export interface ISession {
    members : String[],
    totals : Number[],
    expenses : IExpense[],
    transfers : ITransfer[],
    isOpen : boolean
}

const sessionSchema = new mongoose.Schema<ISession>({
    members : {
        type : [String],
        required : true
    },
    totals : {
        type : [Number],
        required : true
    },
    expenses : {
        type : [expenseSchema],
        required : true,
        default : []
    },
    transfers : {
        type : [transferSchema],
        required : true,
        default : []
    },
    isOpen : {
        type : Boolean,
        required : true,
        default : true
    }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;