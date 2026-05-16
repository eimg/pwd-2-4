import { Link } from "react-router";

export default function App() {
	return <div>
        <h1>Count</h1>
        <ul>
            <li><Link to={"/login"}>Login</Link></li>
            <li><Link to={"/profile"}>Profile</Link></li>
        </ul>
    </div>
}
