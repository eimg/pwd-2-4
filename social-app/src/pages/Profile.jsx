import { Avatar, Box, Typography } from "@mui/material";
import { blue, green, orange, pink, purple } from "@mui/material/colors";

import PostCard from "../components/PostCard";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import { API, authFetch, authHeaders } from "../lib/api";
import { useLikeMutation } from "../hooks/useLikeMutation";

const bannerColors = [green[500], blue[500], purple[500], orange[500], pink[500]];

async function fetchUser(id) {
	const res = await fetch(`${API}/users/${id}`, { headers: authHeaders() });
	if (!res.ok) {
		throw new Error(res.status === 404 ? "User not found" : "Failed to load profile");
	}
	return res.json();
}

export default function Profile() {
	const { id } = useParams();
	const { auth } = useApp();
	const queryClient = useQueryClient();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user", id],
		queryFn: () => fetchUser(id),
	});

	const likeMutation = useLikeMutation([["user", id], ["posts"]]);

	const deletePost = useMutation({
		mutationFn: async postId => {
			const res = await authFetch(`/posts/${postId}`, { method: "DELETE" });
			if (!res.ok) {
				throw new Error("Failed to delete post");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", id] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleDelete = postId => {
		if (window.confirm("Delete this post?")) {
			deletePost.mutate(postId);
		}
	};

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	if (error) {
		return <Typography>{error.message}</Typography>;
	}

	const bannerColor = bannerColors[user.id % bannerColors.length];

	return (
		<Box>
			<Box sx={{ position: "relative", mb: 7 }}>
				<Box
					sx={{
						height: 140,
						borderRadius: 2,
						background: `linear-gradient(135deg, ${bannerColor} 0%, ${bannerColor}99 100%)`,
					}}
				/>
				<Avatar
					sx={{
						width: 96,
						height: 96,
						position: "absolute",
						left: "50%",
						bottom: -48,
						transform: "translateX(-50%)",
						border: 4,
						borderColor: "background.paper",
						background: bannerColor,
						fontSize: 40,
					}}>
					{user.name.charAt(0)}
				</Avatar>
			</Box>

			<Box sx={{ textAlign: "center", mb: 3 }}>
				<Typography variant="h5">{user.name}</Typography>
				<Typography sx={{ color: "text.secondary" }}>@{user.username}</Typography>
				{user.bio && (
					<Typography sx={{ mt: 1, color: "text.secondary" }}>{user.bio}</Typography>
				)}
			</Box>

			{user.posts.length === 0 ? (
				<Typography sx={{ color: "text.secondary", textAlign: "center" }}>
					No posts yet
				</Typography>
			) : (
				user.posts.map(post => (
					<PostCard
						key={post.id}
						post={post}
						showDelete={auth?.id === post.userId}
						onDelete={() => handleDelete(post.id)}
						canLike={!!auth}
						onLikeToggle={likeMutation.mutate}
					/>
				))
			)}
		</Box>
	);
}
