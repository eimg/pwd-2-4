import { createContext, useContext } from "react";

const AppContext = createContext();

function Title() {
    const count = useContext(AppContext);

    return <h1>App Title ({ count })</h1>
}

function Header() {
    return <div style={{ padding: 20, background: "cyan" }}>
        <Title />
    </div>
}

export default function App() {
    return (
		<AppContext.Provider value={10}>
			<div>
				<Header />
				<ul>
					<li>Item One</li>
					<li>Item Two</li>
					<li>Item Three</li>
				</ul>
			</div>
		</AppContext.Provider>
	);
}