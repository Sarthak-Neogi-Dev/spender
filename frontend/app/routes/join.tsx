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
            <div className="join_form">
                <h1 className="join_title">Enter Session ID:</h1>
                <input className="join_text" type="text" name="session_id" value={id} onChange={handleChange}/>
                <input className="join_button" type="submit" value="Join Session"/>
            </div>
        </form>
    </>
}