import axios from "axios";
import useId from "../stores/id.store";
import type { IuseId } from "../stores/id.store";
import { useEffect, useState } from "react";

export default function Main() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const { id } = useId() as IuseId;

    async function fetchSession(id: string) {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:8080/session/${id}`);
        return res.data;
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
    }, [])

    return <>
        {isError ? <h1>Something Went Wrong</h1> : isLoading ? <h1>Loading...</h1> : <>{data}</>}
    </>
}