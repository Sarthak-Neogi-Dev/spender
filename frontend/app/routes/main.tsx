import axios from "axios";
import useId from "../stores/id.store";
import type { IuseId } from "../stores/id.store";
import { useEffect, useState } from "react";

export default function Main() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [trigger, setTrigger] = useState(0);
    const { id } = useId() as IuseId;

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

    useEffect(() => {
        if (id) {
            fetchSession(id).then(data => {
                setData(data);
            }).catch(err => {
                setIsError(true);
            }).finally(() => {
                setIsLoading(false);
            });
        }
        else {
            setIsError(true);
        }
    }, [trigger])

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

        </>}
    </>
}