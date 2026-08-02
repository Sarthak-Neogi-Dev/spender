import axios from "axios";
import useId from "../stores/id.store";
import type { IuseId } from "../stores/id.store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Main() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [trigger, setTrigger] = useState(0);
    const { id } = useId() as IuseId;
    const navigation = useNavigate();

    const [expenseTitle, setExpenseTitle] = useState<string>("");
    const [expenseAmount, setExpenseAmount] = useState<number>(0);
    const [expensePayer, setExpensePayer] = useState<number>(0);

    async function fetchSession(id: string) {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:8080/session/${id}`);
        const data = JSON.parse(res.data);
        return data;
    }

    async function deleteExpense(expense_id: number) {
        const data = {
            "expense_id": expense_id,
            "id": id
        }
        await axios.post(`http://localhost:8080/session/delete/`, data);
        setTrigger(trigger + 1);
    }

    function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
        setExpenseTitle(e.target.value);
    }

    function handleChangeAmount(e: React.ChangeEvent<HTMLInputElement>) {
        setExpenseAmount(Number(e.target.value));
    }

    function handleChangePayer(e: React.ChangeEvent<HTMLSelectElement>) {
        setExpensePayer(Number(e.target.value));
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const expense = {
            "title": expenseTitle,
            "amount": expenseAmount,
            "payer_id": expensePayer
        }
        const data = {
            "expense": expense,
            "id": id
        }
        await axios.post(`http://localhost:8080/session/expense/`, data);
        setTrigger(trigger + 1);
        setExpenseTitle("");
        setExpenseAmount(0);
        setExpensePayer(0);
    }

    async function handleClose() {
        await axios.get(`http://localhost:8080/session/close/${id}`);
        navigation("/close");
    }

    useEffect(() => {
        if (id) {
            fetchSession(id).then(data => {
                setData(data);
                if (!data.isOpen) {
                    navigation("/close");
                }
            }).catch(err => {
                setIsError(true);
            }).finally(() => {
                setIsLoading(false);
            });
        }
        else {
            setIsError(true);
        }
    }, [trigger, id])

    return <>
        {isError ? <h1>Something Went Wrong</h1> : isLoading ? <h1>Loading...</h1> : <>

            <div>
                <h1>Members :</h1>
                {data.members.map((member: string, idx: number) => (
                    <div key={idx}>{member} : {data.totals[idx]}</div>
                ))}
            </div>

            <div>
                <h1>Expenses :</h1>
                {data.expenses.map((expense: { payer_id: number, title: string, amount: number }, idx: number) => (
                    <div key={idx}>
                        <p>{data.members[expense.payer_id]} : {expense.title} : {expense.amount}</p>
                        <button onClick={() => { deleteExpense(idx) }}>Delete</button>
                    </div>
                ))}
            </div>

            <div>
                <h1>Add Expense :</h1>
                <form onSubmit={handleSubmit} >
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
                    <button type="submit">Add</button>
                </form>
            </div>

            <div>
                <button onClick={handleClose}>Close Session</button>
            </div>

        </>}
    </>
}