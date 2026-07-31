import {Link} from "react-router";

export default function Home() {
  return <>
    <div>
      <div><Link to="/create">Create Session</Link></div>
      <div><Link to="/join">Join Session</Link></div>
    </div>
  </>;
}
