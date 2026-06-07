import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createContext, Dispatch, SetStateAction, useContext, useState, } from "react";

import { UserType } from "@/types/global";

export const queryClient = new QueryClient();

type AppContextType = {
	auth: undefined | UserType;
	setAuth: Dispatch<SetStateAction<undefined | UserType>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function RootLayout() {
	const [auth, setAuth] = useState<undefined | UserType>();

	return (
		<AppContext.Provider value={{ auth, setAuth }}>
			<QueryClientProvider client={queryClient}>
				<Stack>
					<Stack.Screen
						name="(home)"
						options={{ headerShown: false, title: "Home" }}
					/>
					<Stack.Screen
						name="view/[id]"
						options={{ title: "View" }}
					/>
				</Stack>
			</QueryClientProvider>
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
