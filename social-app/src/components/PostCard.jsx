import {
	Avatar,
	Box,
	ButtonGroup,
	Card,
	IconButton,
	Typography,
	Button,
} from "@mui/material";
import { green } from "@mui/material/colors";

import {
	Favorite as LikedIcon,
	FavoriteBorderOutlined as LikeIcon,
	ChatBubbleOutlineOutlined as CommentIcon,
	DeleteOutlineOutlined as DeleteIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

export default function PostCard({
	post,
	showDelete,
	onDelete,
	canLike,
	onLikeToggle,
}) {
	const navigate = useNavigate();
	const likeCount = post.likeCount ?? 0;
	const liked = post.liked ?? false;

	return (
		<Card sx={{ p: 2, mb: 2 }}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar sx={{ width: 52, height: 52, background: green[500] }} />
				</Box>
				<Box sx={{ flex: 1 }}>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<Box>
							<Typography>{post.user.name}</Typography>
							<Typography sx={{ color: green[500], mb: 1 }}>
								{post.created}
							</Typography>
						</Box>
						{showDelete && (
							<IconButton size="small" onClick={onDelete} color="error">
								<DeleteIcon />
							</IconButton>
						)}
					</Box>
					<Typography onClick={() => navigate(`/view/${post.id}`)}>
						{post.body}
					</Typography>
				</Box>
			</Box>
			<Box sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
				<ButtonGroup>
					<IconButton
						size="sm"
						disabled={!canLike}
						onClick={() => onLikeToggle?.({ postId: post.id, liked })}>
						{liked ? (
							<LikedIcon color="error" />
						) : (
							<LikeIcon color="error" />
						)}
					</IconButton>
					<Button size="sm" variant="text">
						{likeCount}
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<IconButton size="sm">
						<CommentIcon />
					</IconButton>
					<Button size="sm" variant="text">
						{post.comments.length}
					</Button>
				</ButtonGroup>
			</Box>
		</Card>
	);
}
