import {Link} from "react-router";

export default function Home() {
  return <>
    <div className="button_box">
      <div className="button"><Link to="/create">Create Session</Link></div>
      <div className="button"><Link to="/join">Join Session</Link></div>
    </div>
  </>;
}
