import { router, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useApp } from "../_layout";

export default function TabsLayout() {
	const { auth } = useApp()!;

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => {
						return (
							<Ionicons
								name="home"
								color={color}
								size={24}
							/>
						);
					},
					headerRight: () => {
						if (auth) {
							return (
								<TouchableOpacity
									style={{ marginRight: 16 }}
									onPress={() => router.push("/form")}>
									<Ionicons
										name="add"
										size={24}
									/>
								</TouchableOpacity>
							);
						} else {
							return <></>;
						}
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => {
						return (
							<Ionicons
								name="person-circle"
								color={color}
								size={24}
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => {
						return (
							<Ionicons
								name="settings"
								color={color}
								size={24}
							/>
						);
					},
				}}
			/>
		</Tabs>
	);
}
