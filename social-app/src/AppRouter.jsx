import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import View from "./pages/View";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/view/:id",
				element: <View />,
			},
			{
				path: "/profile/:id",
				element: <Profile />,
			},
		],
	},
]);

export default function AppRouter() {
    return <RouterProvider router={router} />
}
