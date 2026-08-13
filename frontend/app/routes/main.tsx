import axios from "axios";
import useId from "../stores/id.store";
import type { IuseId } from "../stores/id.store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useClose, { type Iclose } from "~/stores/close.store";

export default function Main() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [trigger, setTrigger] = useState(0);
    const { id } = useId() as IuseId;
    const navigation = useNavigate();
    const { setClose } = useClose() as Iclose;

    const [expenseTitle, setExpenseTitle] = useState<string>("");
    const [expenseAmount, setExpenseAmount] = useState<number | string>("");
    const [expensePayer, setExpensePayer] = useState<number>(0);

    async function fetchSession(id: string) {
        setIsLoading(true);
        const res = await axios.get(`${process.env.API_URL}/session/${id}`);
        const data = JSON.parse(res.data);
        return data;
    }

    async function deleteExpense(expense_id: number) {
        const data = {
            "expense_id": expense_id,
            "id": id
        }
        await axios.post(`${process.env.API_URL}/session/delete/`, data);
        setTrigger(trigger + 1);
    }

    function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
        setExpenseTitle(e.target.value);
    }

    function handleChangeAmount(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setExpenseAmount(val === "" ? "" : Number(val));
    }

    function handleChangePayer(e: React.ChangeEvent<HTMLSelectElement>) {
        setExpensePayer(Number(e.target.value));
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const expense = {
            "title": expenseTitle,
            "amount": Number(expenseAmount) || 0,
            "payer_id": expensePayer
        }
        const data = {
            "expense": expense,
            "id": id
        }
        await axios.post(`${process.env.API_URL}/session/expense/`, data);
        setTrigger(trigger + 1);
        setExpenseTitle("");
        setExpenseAmount("");
        setExpensePayer(0);
    }

    async function handleClose() {
        const close = await axios.get(`${process.env.API_URL}/session/close/${id}`);
        setClose(JSON.parse(close.data));
        navigation("/close");
    }

    useEffect(() => {
        if (id) {
            fetchSession(id).then(data => {
                setData(data);
                if (!data.isOpen) {
                    handleClose();
                }
            }).catch(err => {
                setIsError(true);
            }).finally(() => {
                setIsLoading(false);
            });
        }
        else {
            setIsError(true);
            setTimeout(() => {
                setTrigger(trigger + 1);
            }, 500)
        }
    }, [trigger])

    return <>
        {isError ? <h1>Something Went Wrong</h1> : isLoading ? <h1>Loading...</h1> : <>
            <div className="main_screen">
                <div className="members_box">
                    <h1>Members :</h1>
                    {data.members.map((member: string, idx: number) => (
                        <div key={idx}>{member} : {data.totals[idx]}</div>
                    ))}
                </div>

                <div className="expenses_box">
                    <h1>Expenses :</h1>
                    {data.expenses.map((expense: { payer_id: number, title: string, amount: number }, idx: number) => (
                        <div className="expense" key={idx}>
                            <p>{data.members[expense.payer_id]} : {expense.title} : {expense.amount}</p>
                            <button className="delete_button" onClick={() => { deleteExpense(idx) }}>Delete</button>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="add_expense_box" >
                    <h1>Add Expense :</h1>

                    <div>
                        <label>Title : </label>
                        <input type="text" value={expenseTitle} onChange={handleChangeTitle} />
                    </div>
                    <div>
                        <label>Amount : </label>
                        <input type="number" value={expenseAmount} onChange={handleChangeAmount} />
                    </div>
                    <div>
                        <label>Payer : </label>
                        <select value={expensePayer} onChange={handleChangePayer}>
                            {data.members.map((member: string, idx: number) => (
                                <option key={idx} value={idx}>{member}</option>
                            ))}
                        </select>
                    </div>
                    <button className="add_button" type="submit">Add</button>
                </form>


                <div className="close_session_box">
                    <p>NOTE : COPY AND SAVE THIS ID TO RETRIEVE YOUR SESSION LATER</p>
                    <p className="session_id">{id}</p>
                    <button className="button" onClick={handleClose}>Close Session</button>
                </div>
            </div>
        </>}
    </>
}