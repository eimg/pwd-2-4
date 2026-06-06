import {
	Alert,
	Box,
	Button,
	OutlinedInput,
	Typography,
} from "@mui/material";
import PostCard from "../components/PostCard";
import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import { API, authFetch, authHeaders } from "../lib/api";
import { useLikeMutation } from "../hooks/useLikeMutation";

async function fetchPosts() {
	const res = await fetch(`${API}/posts`, { headers: authHeaders() });
	return res.json();
}

export default function Home() {
	const { auth } = useApp();
	const queryClient = useQueryClient();
	const [body, setBody] = useState("");
	const [error, setError] = useState();

	const {
		data: posts,
		error: queryError,
		isLoading,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	const createPost = useMutation({
		mutationFn: async text => {
			const res = await authFetch("/posts", {
				method: "POST",
				body: JSON.stringify({ body: text }),
			});
			if (!res.ok) {
				throw new Error(res.status === 401 ? "Please log in" : "Failed to create post");
			}
			return res.json();
		},
		onSuccess: () => {
			setBody("");
			setError(undefined);
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: err => setError(err.message),
	});

	const likeMutation = useLikeMutation([["posts"]]);

	const deletePost = useMutation({
		mutationFn: async id => {
			const res = await authFetch(`/posts/${id}`, { method: "DELETE" });
			if (!res.ok) {
				throw new Error("Failed to delete post");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleCreate = e => {
		e.preventDefault();
		if (!body.trim()) return;
		createPost.mutate(body.trim());
	};

	const handleDelete = id => {
		if (window.confirm("Delete this post?")) {
			deletePost.mutate(id);
		}
	};

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	if (queryError) {
		return <Typography>{queryError.message}</Typography>;
	}

	return (
		<Box>
			{auth && (
				<Box sx={{ mb: 2 }}>
					{error && (
						<Alert severity="warning" sx={{ mb: 1 }}>
							{error}
						</Alert>
					)}
					<form onSubmit={handleCreate}>
						<OutlinedInput
							fullWidth
							placeholder="What's on your mind?"
							value={body}
							onChange={e => setBody(e.target.value)}
							multiline
							minRows={2}
						/>
						<Button
							variant="contained"
							type="submit"
							sx={{ mt: 1 }}
							disabled={createPost.isPending || !body.trim()}>
							Post
						</Button>
					</form>
				</Box>
			)}

			{posts.map(post => (
				<PostCard
					key={post.id}
					post={post}
					showDelete={auth?.id === post.userId}
					onDelete={() => handleDelete(post.id)}
					canLike={!!auth}
					onLikeToggle={likeMutation.mutate}
				/>
			))}
		</Box>
	);
}
