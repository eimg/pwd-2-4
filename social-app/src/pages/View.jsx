import {
	Alert,
	Avatar,
	Typography,
	Box,
	IconButton,
	OutlinedInput,
	Link,
} from "@mui/material";
import { Send as SendIcon, DeleteOutlineOutlined as DeleteIcon } from "@mui/icons-material";

import PostCard from "../components/PostCard";
import { grey } from "@mui/material/colors";

import { useParams, useNavigate, Link as RouterLink } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useApp } from "../AppProvider";
import { API, authFetch, authHeaders } from "../lib/api";
import { useLikeMutation } from "../hooks/useLikeMutation";

async function fetchPost(id) {
	const res = await fetch(`${API}/posts/${id}`, { headers: authHeaders() });
	return res.json();
}

export default function View() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { auth } = useApp();
	const queryClient = useQueryClient();
	const [body, setBody] = useState("");
	const [error, setError] = useState();

	const {
		data: post,
		isLoading,
		error: queryError,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: () => fetchPost(id),
	});

	const likeMutation = useLikeMutation([["post", id], ["posts"]]);

	const deletePost = useMutation({
		mutationFn: async postId => {
			const res = await authFetch(`/posts/${postId}`, { method: "DELETE" });
			if (!res.ok) {
				throw new Error("Failed to delete post");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			navigate("/");
		},
	});

	const createComment = useMutation({
		mutationFn: async text => {
			const res = await authFetch(`/posts/${id}/comments`, {
				method: "POST",
				body: JSON.stringify({ body: text }),
			});
			if (!res.ok) {
				throw new Error(res.status === 401 ? "Please log in" : "Failed to add comment");
			}
			return res.json();
		},
		onSuccess: () => {
			setBody("");
			setError(undefined);
			queryClient.invalidateQueries({ queryKey: ["post", id] });
		},
		onError: err => setError(err.message),
	});

	const deleteComment = useMutation({
		mutationFn: async commentId => {
			const res = await authFetch(`/comments/${commentId}`, { method: "DELETE" });
			if (!res.ok) {
				throw new Error("Failed to delete comment");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["post", id] });
		},
	});

	const handleDeletePost = () => {
		if (window.confirm("Delete this post?")) {
			deletePost.mutate(post.id);
		}
	};

	const handleCreateComment = e => {
		e.preventDefault();
		if (!body.trim()) return;
		createComment.mutate(body.trim());
	};

	const handleDeleteComment = commentId => {
		if (window.confirm("Delete this comment?")) {
			deleteComment.mutate(commentId);
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
			<PostCard
				post={post}
				showDelete={auth?.id === post.userId}
				onDelete={handleDeletePost}
				canLike={!!auth}
				onLikeToggle={likeMutation.mutate}
			/>

			{error && (
				<Alert severity="warning" sx={{ mb: 1 }}>
					{error}
				</Alert>
			)}

			{auth ? (
				<form onSubmit={handleCreateComment}>
					<OutlinedInput
						fullWidth
						placeholder="Your reply"
						value={body}
						onChange={e => setBody(e.target.value)}
						endAdornment={
							<IconButton type="submit" disabled={createComment.isPending || !body.trim()}>
								<SendIcon />
							</IconButton>
						}
					/>
				</form>
			) : (
				<Typography sx={{ my: 2 }}>
					<Link component={RouterLink} to="/login">
						Login
					</Link>{" "}
					to reply
				</Typography>
			)}

			{post.comments.map(comment => {
				const canDelete =
					auth && (auth.id === comment.userId || auth.id === post.userId);

				return (
					<Box
						key={comment.id}
						sx={{ p: 2, my: 2, border: "1px solid #99999950" }}>
						<Box sx={{ display: "flex", gap: 2 }}>
							<Box>
								<Avatar
									sx={{
										width: 52,
										height: 52,
										background: grey[500],
									}}
								/>
							</Box>
							<Box sx={{ flex: 1 }}>
								<Box sx={{ display: "flex", justifyContent: "space-between" }}>
									<Box>
										<Typography>{comment.user.name}</Typography>
										<Typography sx={{ color: grey[500], mb: 1 }}>
											{comment.created}
										</Typography>
									</Box>
									{canDelete && (
										<IconButton
											size="small"
											color="error"
											onClick={() => handleDeleteComment(comment.id)}>
											<DeleteIcon />
										</IconButton>
									)}
								</Box>
								<Typography>{comment.body}</Typography>
							</Box>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
}
