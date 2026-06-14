import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { queryClient, useApp } from "../_layout";

export default function Profile() {
	const [mode, setMode] = useState<"login" | "register">("login");
	const [name, setName] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { auth, setAuth } = useApp()!;

	const login = async (nextUsername = username, nextPassword = password) => {
		const res = await fetch("http://localhost:8800/users/login", {
			method: "POST",
			body: JSON.stringify({
				username: nextUsername.trim(),
				password: nextPassword,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const { user, token } = await res.json();
			await AsyncStorage.setItem("token", token);
			setAuth(user);
			await queryClient.invalidateQueries({ queryKey: ["posts"] });
		} else {
			Alert.alert("Unable to login");
		}
	};

	const register = async () => {
		const nextName = name.trim();
		const nextUsername = username.trim();
		const nextBio = bio.trim();

		if (!nextName || !nextUsername || !password) {
			Alert.alert("Missing fields", "Name, username, and password are required.");
			return;
		}

		const res = await fetch("http://localhost:8800/users", {
			method: "POST",
			body: JSON.stringify({
				name: nextName,
				username: nextUsername,
				bio: nextBio || undefined,
				password,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			await login(nextUsername, password);
		} else {
			const data = await res.json().catch(() => undefined);
			Alert.alert(data?.msg ?? "Unable to register");
		}
	};

	const logout = async () => {
		await AsyncStorage.removeItem("token");
		setAuth(undefined);
		await queryClient.invalidateQueries({ queryKey: ["posts"] });
	};

	return (
		<ScrollView
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 16,
			}}>
			<Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 20 }}>
				Profile
			</Text>

			{auth && (
				<>
					<Text style={{ fontSize: 16, fontWeight: "bold" }}>{auth.name}</Text>
					<Text>{auth.username}</Text>
					<TouchableOpacity
						onPress={logout}
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
					<View
						style={{
							width: "80%",
							flexDirection: "row",
							gap: 8,
							marginBottom: 10,
						}}>
						<TouchableOpacity
							onPress={() => setMode("login")}
							style={{
								flex: 1,
								padding: 12,
								borderRadius: 20,
								backgroundColor: mode === "login" ? "teal" : "#66666620",
								alignItems: "center",
							}}>
							<Text
								style={{
									fontWeight: "bold",
									color: mode === "login" ? "white" : "black",
								}}>
								Login
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setMode("register")}
							style={{
								flex: 1,
								padding: 12,
								borderRadius: 20,
								backgroundColor: mode === "register" ? "teal" : "#66666620",
								alignItems: "center",
							}}>
							<Text
								style={{
									fontWeight: "bold",
									color: mode === "register" ? "white" : "black",
								}}>
								Register
							</Text>
						</TouchableOpacity>
					</View>

					{mode === "register" && (
						<>
							<TextInput
								value={name}
								onChangeText={setName}
								style={{ width: "80%", padding: 15, borderWidth: 1, borderColor: "#66666680", marginBottom: 10, borderRadius: 20, }}
								placeholder="name"
							/>

							<TextInput
								value={bio}
								onChangeText={setBio}
								style={{ width: "80%", padding: 15, borderWidth: 1, borderColor: "#66666680", marginBottom: 10, borderRadius: 20, }}
								placeholder="bio"
							/>
						</>
					)}

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
						onPress={mode === "login" ? () => login() : register}
						style={{ width: "80%", padding: 15, borderRadius: 20, backgroundColor: "teal", alignItems: "center", }}>
						<Text style={{ fontWeight: "bold", color: "white" }}>
							{mode === "login" ? "Login" : "Register"}
						</Text>
					</TouchableOpacity>
				</>
			)}
		</ScrollView>
	);
}
