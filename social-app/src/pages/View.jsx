import {
	Avatar,
	Typography,
	Box,
	IconButton,
	OutlinedInput,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

import PostCard from "../components/PostCard";
import { grey } from "@mui/material/colors";

import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

const api = "http://localhost:8800";

async function fetchPost(id) {
	const res = await fetch(`${api}/posts/${id}`);
	return res.json();
}

export default function View() {
	const { id } = useParams();

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: () => fetchPost(id),
	});

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	if (error) {
		return <Typography>{error.message}</Typography>;
	}

	return (
		<Box>
			<PostCard post={post} />
			<form>
				<OutlinedInput
					fullWidth
					placeholder="Your reply"
					endAdornment={
						<IconButton>
							<SendIcon />
						</IconButton>
					}
				/>
			</form>

			{post.comments.map(comment => {
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
							<Box>
								<Typography>{comment.user.name}</Typography>
								<Typography sx={{ color: grey[500], mb: 1 }}>
									{comment.created}
								</Typography>
								<Typography>{comment.body}</Typography>
							</Box>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
}
