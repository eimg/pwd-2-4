import { Outlet } from "react-router";

export default function Layout() {
    return (
		<div>
			<div style={{ padding: 20, background: "cyan" }}>Header</div>
            <Outlet />
		</div>
	);
}