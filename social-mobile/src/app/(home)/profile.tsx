import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApp } from "../_layout";

export default function Profile() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { auth, setAuth } = useApp()!;

	const login = async () => {
		const res = await fetch("http://localhost:8800/users/login", {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const { user, token } = await res.json();
            await AsyncStorage.setItem("token", token);
			setAuth(user);
		} else {
            alert("Unable to login");
        }
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 20 }}>Profile</Text>

			{auth && (
				<>
					<Text style={{ fontSize: 16, fontWeight: "bold" }}>{auth.name}</Text>
					<Text>{auth.username}</Text>
					<TouchableOpacity
						onPress={() => { setAuth(undefined) }}
						style={{
							paddingVertical: 15,
                            paddingHorizontal: 30,
							borderRadius: 20,
							backgroundColor: "red",
							alignItems: "center",
                            marginTop: 20,
						}}>
						<Text style={{ fontWeight: "bold", color: "white" }}>
							Logout
						</Text>
					</TouchableOpacity>
				</>
			)}

			{!auth && (
				<>
					<TextInput
						value={username} onChangeText={setUsername} autoCapitalize="none"
						style={{ width: "80%", padding: 15, borderWidth: 1, borderColor: "#66666680", marginBottom: 10, borderRadius: 20, }}
						placeholder="username"
					/>

					<TextInput
						value={password} onChangeText={setPassword} secureTextEntry
						style={{ width: "80%", padding: 15, borderWidth: 1, borderColor: "#66666680", marginBottom: 10, borderRadius: 20, }}
						placeholder="password"
					/>

					<TouchableOpacity
						onPress={login}
						style={{ width: "80%", padding: 15, borderRadius: 20, backgroundColor: "teal", alignItems: "center", }}>
						<Text style={{ fontWeight: "bold", color: "white" }}>
							Login
						</Text>
					</TouchableOpacity>
				</>
			)}
		</View>
	);
}
