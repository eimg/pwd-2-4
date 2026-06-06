import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import type { PostType } from "@/types/globla";

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
					<Text style={{ color: "green" }}>A few seconds ago</Text>
					<Text style={{ fontSize: 16, marginTop: 5 }}>
						{post.body}
					</Text>
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
						<Text>10</Text>
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
						<Text>5</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
