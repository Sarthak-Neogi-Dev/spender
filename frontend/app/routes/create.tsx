import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useId from "~/stores/id.store";
import type { IuseId } from "~/stores/id.store";

export default function Create() {
    const [no_user, set_no_user] = useState<number>(2);
    const [users, set_users] = useState<string[]>([]);
    const navigate = useNavigate();
    const { setId } = useId() as IuseId;

    function handleChangeA(e: React.ChangeEvent<HTMLInputElement>) {
        if (Number(e.target.value) >= 2) {
            set_no_user(Number(e.target.value));
        }
        else {
            alert("Number of users must be at least 2.");
        }
    }

    function handleChangeB(e: React.ChangeEvent<HTMLInputElement>, i: number) {
        set_users(users => {
            const new_users = [...users];
            new_users[i] = e.target.value;
            return new_users;
        });
    }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const session = {
            title: "Session 1",
            members: users,
            totals: new Array(no_user).fill(0),
            expenses: [],
            transfers: [],
            isOpen: true
        };
        axios.post("http://localhost:8080/session", { session }).then((res) => {
            alert("Session Created : ID : " + res.data)
            setId(res.data);
        });
        navigate("/main");
    }

    return <>
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Create New Session</h1>
                <label id="no_users">No. of Users: </label>
                <input type="number" name="no_users" id="no_users" value={no_user} onChange={handleChangeA} />
                {(() => {
                    const divs: React.JSX.Element[] = [];
                    for (let i = 0; i < no_user; i++) {
                        divs.push(
                            <div key={i}>
                                <label>User {i + 1}: </label>
                                <input type="text" name="name" id="name" onChange={(e) => handleChangeB(e, i)} />
                            </div>
                        )
                    }
                    return divs;
                })()}
                <button type="submit">Create Session</button>
            </div>
        </form>
    </>
}