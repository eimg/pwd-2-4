import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import App from "./App";

import { useState, createContext } from "react";

export const AppContext = createContext();

export default function AppProvider() {
    const [mode, setMode] = useState("dark");

    const theme = createTheme({
		palette: { mode },
	});

    return (
		<AppContext.Provider value={{ mode, setMode }}>
			<ThemeProvider theme={theme}>
				<App />
				<CssBaseline />
			</ThemeProvider>
		</AppContext.Provider>
	);
}
