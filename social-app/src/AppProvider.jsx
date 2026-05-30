import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { useState, createContext, useMemo, useContext, useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRouter from "./AppRouter";

const AppContext = createContext();
const queryClient = new QueryClient();

export default function AppProvider() {
	const [mode, setMode] = useState("dark");
	const [openDrawer, setOpenDrawer] = useState(false);
	const [auth, setAuth] = useState();

    useEffect(() => {
        const api = "http://localhost:8800";
        const token = localStorage.getItem("token");
        
        if(token) {
            fetch(`${api}/users/verify`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(async res => {
                if(res.ok) {
                    setAuth(await res.json());
                } else {
                    localStorage.removeItem("token");
                }
            })
        }
    }, []);

	const theme = useMemo(() => {
		return createTheme({
			palette: { mode },
		});
	}, [mode]);

	return (
		<AppContext.Provider
			value={{ mode, setMode, openDrawer, setOpenDrawer, auth, setAuth }}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<AppRouter />
					<CssBaseline />
				</ThemeProvider>
			</QueryClientProvider>
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
