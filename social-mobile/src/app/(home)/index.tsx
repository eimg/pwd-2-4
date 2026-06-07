import PostCard from "@/components/post-card";
import { Text, View, ScrollView } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/global";

async function fetchPosts(): Promise<PostType[]> {
	const res = await fetch("http://localhost:8800/posts");
	return res.json();
}

export default function Home() {
	const { data: posts, error, isLoading, } = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 16, opacity: 0.5 }}>Loading...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
				<Text style={{ fontSize: 16, opacity: 0.5 }}>{error.message}</Text>
			</View>
		);
	}

	return (
		<ScrollView>
			{posts?.map(post => {
				return (
					<PostCard
						key={post.id}
						post={post}
					/>
				);
			})}
		</ScrollView>
	);
}
