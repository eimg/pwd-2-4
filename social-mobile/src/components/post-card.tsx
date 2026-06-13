import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatDistance } from "date-fns";
import type { PostType } from "@/types/global";

import { router } from "expo-router";

export default function PostCard({ post }: { post: PostType }) {
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
					<TouchableOpacity>
						<Ionicons
							name="heart-outline"
							color={"red"}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Text>{post.likes ? post.likes.length : 0}</Text>
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
