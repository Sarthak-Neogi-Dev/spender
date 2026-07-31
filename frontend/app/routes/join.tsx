import React from "react";
import {useNavigate} from "react-router";
import useId from "../stores/id.store";
import type {IuseId} from "../stores/id.store";

export default function Join(){
    const {id, setId} = useId() as IuseId;
    const navigate = useNavigate();

    function handleChange(e : React.ChangeEvent<HTMLInputElement>){
        setId(e.target.value);
    }
    function handleSubmit(e : React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        navigate(`/main`);
    }

    return <>
        <form onSubmit={handleSubmit}>
            <div>
                <h1 className="title">Enter Session ID:</h1>
                <input type="text" name="session_id" value={id} onChange={handleChange}/>
                <input type="submit"/>
            </div>
        </form>
    </>
}