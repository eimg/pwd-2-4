import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState, } from "react";

import { UserType } from "@/types/global";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const queryClient = new QueryClient();

type AppContextType = {
	auth: undefined | UserType;
	setAuth: Dispatch<SetStateAction<undefined | UserType>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function RootLayout() {
	const [auth, setAuth] = useState<undefined | UserType>();

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("token");
            if(token) {
                const res = await fetch("http://localhost:8800/users/verify", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

                if(res.ok) {
                    setAuth(await res.json());
                } else {
                    await AsyncStorage.removeItem("token");
                }
            }
        })();
    }, []);

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
					<Stack.Screen
						name="form"
						options={{ title: "Form", presentation: "modal" }}
					/>
				</Stack>
			</QueryClientProvider>
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
