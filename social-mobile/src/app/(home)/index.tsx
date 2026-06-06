import PostCard from "@/components/post-card";
import { Text, View, ScrollView } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/globla";

async function fetchPosts(): Promise<PostType[]> {
	const res = await fetch("http://localhost:8800/posts");
	return res.json();
}

export default function Home() {
	const {
		data: posts,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	if (isLoading) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View>
				<Text>{error.message}</Text>
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
