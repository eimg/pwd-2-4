import { Alert, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatDistance } from "date-fns";
import type { PostType } from "@/types/global";

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient, useApp } from "@/app/_layout";

export default function PostCard({
	post,
	onDeleted,
}: {
	post: PostType;
	onDeleted?: () => void;
}) {
	const { auth } = useApp()!;
	const canDelete = auth?.id === post.user.id;

	const toggleLike = async () => {
		if (!auth) {
			Alert.alert("Login required", "You need to login before liking posts.");
			return;
		}

		const token = await AsyncStorage.getItem("token");
		const res = await fetch(`http://localhost:8800/posts/${post.id}/like`, {
			method: post.liked ? "DELETE" : "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			await queryClient.invalidateQueries({ queryKey: ["posts"] });
			await queryClient.invalidateQueries({ queryKey: ["posts", String(post.id)] });
		} else {
			Alert.alert(post.liked ? "Unable to unlike post" : "Unable to like post");
		}
	};

	const deletePost = () => {
		Alert.alert("Delete post?", "This cannot be undone.", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					const token = await AsyncStorage.getItem("token");

					const res = await fetch(`http://localhost:8800/posts/${post.id}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (res.ok) {
						await queryClient.invalidateQueries({ queryKey: ["posts"] });
						await queryClient.invalidateQueries({
							queryKey: ["posts", String(post.id)],
						});
						onDeleted?.();
					} else {
						Alert.alert("Unable to delete post");
					}
				},
			},
		]);
	};

	return (
		<View
			style={{
				paddingVertical: 20,
				paddingHorizontal: 16,
				borderBottomWidth: 1,
				borderColor: "#66666660",
			}}>
			<View style={{ flexDirection: "row", gap: 10 }}>
				<View
					style={{
						width: 48,
						height: 48,
						borderRadius: 48,
						backgroundColor: "green",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Text style={{ fontSize: 18, color: "white" }}>
						{post.user.name[0].toUpperCase()}
					</Text>
				</View>
				<View style={{ flexShrink: 1 }}>
					<Text style={{ fontWeight: "bold", fontSize: 16 }}>
						{post.user.name}
					</Text>
					<Text style={{ color: "green" }}>
						{formatDistance(post.created, new Date())}
					</Text>
					<TouchableOpacity onPress={() => router.push(`/view/${post.id}`)}>
						<Text style={{ fontSize: 16, marginTop: 5 }}>
							{post.body}
						</Text>
					</TouchableOpacity>
				</View>
				{canDelete && (
					<TouchableOpacity
						onPress={deletePost}
						style={{ marginLeft: "auto", padding: 4 }}>
						<Ionicons
							name="trash-outline"
							color="red"
							size={22}
						/>
					</TouchableOpacity>
				)}
			</View>
			<View
				style={{
					marginTop: 20,
					flexDirection: "row",
					justifyContent: "space-around",
				}}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
					}}>
					<TouchableOpacity onPress={toggleLike}>
						<Ionicons
							name={post.liked ? "heart" : "heart-outline"}
							color={"red"}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={toggleLike}>
						<Text style={{ fontVariant: ["tabular-nums"] }}>
							{post.likeCount ?? 0}
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
					}}>
					<TouchableOpacity>
						<Ionicons
							name="chatbubble-outline"
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Text>{post.comments ? post.comments.length : 0}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
