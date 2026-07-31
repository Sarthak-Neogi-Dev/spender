import useId from "../stores/id.store";
import type {IuseId} from "../stores/id.store";

export default function Main(){
    const {id} = useId() as IuseId;

    return <>
        <h1>You have joined Session : {id}</h1>
    </>
}