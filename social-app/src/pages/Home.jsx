import { Box, Typography } from "@mui/material";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

const api = "http://localhost:8800";

async function fetchPosts() {
	const res = await fetch(`${api}/posts`);
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

    if(isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if(error) {
        return <Typography>{error.message}</Typography>;
    }

	return (
		<Box>
			{posts.map(post => {
				return (
					<PostCard
						key={post.id}
						post={post}
					/>
				);
			})}
		</Box>
	);
}
