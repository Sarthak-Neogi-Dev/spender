import useClose from "../stores/close.store";
import type { Iclose } from "../stores/close.store";

export default function Close() {
    const { close } = useClose() as Iclose;
    return <>
        <div className="closing_screen">
            <h1>This Session is Closed.</h1>
            {close.map((item: string, idx: number) => (<p key={idx}>{item}</p>))}
        </div>
    </>
}