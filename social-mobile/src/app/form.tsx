import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "./_layout";
import { router } from "expo-router";

export default function Form() {
	const [post, setPost] = useState("");

    const addPost = async () => {
        if(post) {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch("http://localhost:8800/posts", {
                method: "POST",
                body: JSON.stringify({ body: post }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(res.ok) {
                await queryClient.invalidateQueries({ queryKey: ["posts"] });
                router.dismiss();
            } else {
                alert("Unable to add post");
            }
        }
    }

	return (
		<View style={{ padding: 16 }}>
			<TextInput
				value={post}
				onChangeText={setPost}
				style={{
					width: "100%",
					flexGrow: 1,
					padding: 15,
					borderWidth: 1,
					borderColor: "#66666680",
					marginBottom: 10,
					borderRadius: 20,
				}}
				placeholder="Post content..."
			/>

			<TouchableOpacity
				onPress={addPost}
				style={{
					width: "100%",
					padding: 15,
					borderRadius: 20,
					backgroundColor: "teal",
					alignItems: "center",
				}}>
				<Text style={{ fontWeight: "bold", color: "white" }}>
					Add Post
				</Text>
			</TouchableOpacity>
		</View>
	);
}
