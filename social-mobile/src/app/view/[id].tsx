import { router, useLocalSearchParams } from "expo-router";
import {
	Alert,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostCard from "@/components/post-card";
import { useState } from "react";
import { PostType } from "@/types/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient, useApp } from "../_layout";

async function fetchPost(id: string): Promise<PostType> {
	const token = await AsyncStorage.getItem("token");
	const res = await fetch(`http://localhost:8800/posts/${id}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
	});
	return res.json();
}

export default function Detail() {
	const { id } = useLocalSearchParams();
	const postId = Array.isArray(id) ? id[0] : id;

	const [comment, setComment] = useState("");
	const { auth } = useApp()!;

	const {
		data: post,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["posts", postId],
		queryFn: () => fetchPost(postId),
	});

	const addComment = async () => {
		const body = comment.trim();

		if (!auth) {
			Alert.alert("Login required", "You need to login before commenting.");
			return;
		}

		if (!body) {
			return;
		}

		const token = await AsyncStorage.getItem("token");
		const res = await fetch(`http://localhost:8800/posts/${postId}/comments`, {
			method: "POST",
			body: JSON.stringify({ body }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			setComment("");
			await queryClient.invalidateQueries({ queryKey: ["posts", postId] });
			await queryClient.invalidateQueries({ queryKey: ["posts"] });
		} else {
			Alert.alert("Unable to add comment");
		}
	};

	const deleteComment = (commentId: number) => {
		Alert.alert("Delete comment?", "This cannot be undone.", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					const token = await AsyncStorage.getItem("token");
					const res = await fetch(`http://localhost:8800/comments/${commentId}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (res.ok) {
						await queryClient.invalidateQueries({ queryKey: ["posts", postId] });
						await queryClient.invalidateQueries({ queryKey: ["posts"] });
					} else {
						Alert.alert("Unable to delete comment");
					}
				},
			},
		]);
	};

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Text style={{ fontSize: 16, opacity: 0.5 }}>Loading...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Text style={{ fontSize: 16, opacity: 0.5 }}>
					{error.message}
				</Text>
			</View>
		);
	}

	if (!post) {
		return (
			<View>
				<Text>404</Text>
			</View>
		);
	}

	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic">
			<PostCard
				post={post}
				onDeleted={() => router.back()}
			/>
			<View style={{ alignItems: "stretch", padding: 16, gap: 10 }}>
				<TextInput
					value={comment}
					onChangeText={setComment}
					style={{
						width: "100%",
						flexGrow: 1,
						padding: 15,
						borderWidth: 1,
						borderColor: "#66666680",
						borderRadius: 20,
					}}
					placeholder="Your reply..."
				/>

				<TouchableOpacity
					onPress={addComment}
					style={{
						width: "100%",
						padding: 15,
						borderRadius: 20,
						backgroundColor: "teal",
						alignItems: "center",
					}}>
					<Text style={{ fontWeight: "bold", color: "white" }}>
						Comment
					</Text>
				</TouchableOpacity>

				{post.comments.map(comment => {
					const canDeleteComment =
						auth?.id === comment.user.id || auth?.id === post.user.id;

					return (
						<View
							key={comment.id}
							style={{
								width: "100%",
								borderRadius: 10,
								borderColor: "#66666666",
								borderWidth: 1,
								padding: 16,
							}}>
							<View style={{ flexDirection: "row", gap: 10 }}>
								<Text style={{ flexShrink: 1, fontWeight: "bold" }}>
									{comment.user.name}
								</Text>
								{canDeleteComment && (
									<TouchableOpacity
										onPress={() => deleteComment(comment.id)}
										style={{ marginLeft: "auto", padding: 4 }}>
										<Ionicons
											name="trash-outline"
											color="red"
											size={20}
										/>
									</TouchableOpacity>
								)}
							</View>
							<View>
								<Text style={{ fontSize: 16, flexShrink: 1 }}>
									{comment.body}
								</Text>
							</View>
						</View>
					);
				})}
			</View>
		</ScrollView>
	);
}
