import mongoose from "mongoose";

interface ITransfer {
    sender_id : Number;
    reciever_id : Number;
    title : String;
    amount : Number;
}

interface IExpense {
    payer_id : Number;
    title : String;
    amount : Number;
} 

interface ISession {
    members : String[];
    totals : Number[];
    expenses : IExpense[];
    transfers : ITransfer[];
    isOpen : boolean;
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
        type : [Number],
        required : true,
        default : []
    },
    transfers : {
        type : [Number],
        required : true,
        default : []
    },
    isOpen : {
        type : Boolean,
        required : true,
        default : true
    }
})

const Session = mongoose.model("Session", sessionSchema);
export default Session;