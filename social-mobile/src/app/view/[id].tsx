import { useLocalSearchParams } from "expo-router";
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/post-card";
import { useState } from "react";
import { PostType } from "@/types/global";

async function fetchPost(id: string): Promise<PostType> {
	const res = await fetch(`http://localhost:8800/posts/${id}`);
	return res.json();
}

export default function Detail() {
	const { id } = useLocalSearchParams();

	const [comment, setComment] = useState("");

	const {
		data: post,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["posts", id],
		queryFn: () => fetchPost(id as string),
	});

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
		<ScrollView>
			<PostCard post={post} />
			<View style={{ alignItems: "center", padding: 16 }}>
				<TextInput
					value={comment}
					onChangeText={setComment}
					style={{
						width: "100%",
						flexGrow: 1,
						padding: 15,
						borderWidth: 1,
						borderColor: "#66666680",
						marginBottom: 10,
						borderRadius: 20,
					}}
					placeholder="Your reply..."
				/>

				<TouchableOpacity
					onPress={() => {}}
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
					return (
						<View
							key={comment.id}
							style={{
								marginVertical: 6,
								borderRadius: 10,
								borderColor: "#66666666",
								borderWidth: 1,
								padding: 16,
							}}>
							<View>
								<Text style={{ fontWeight: "bold" }}>
									{comment.user.name}
								</Text>
							</View>
							<View>
								<Text style={{ fontSize: 16 }}>
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
