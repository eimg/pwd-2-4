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
	FavoriteBorderOutlined as LikeIcon,
	ChatBubbleOutlineOutlined as CommentIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

export default function PostCard({ post }) {
    const navigate = useNavigate();

    return (
		<Card sx={{ p: 2, mb: 2 }}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar sx={{ width: 52, height: 52, background: green[500], }} />
				</Box>
				<Box>
					<Typography>{post.user.name}</Typography>
					<Typography sx={{ color: green[500], mb: 1 }}>
						{post.created}
					</Typography>
					<Typography onClick={() => navigate(`/view/${post.id}`)}>
						{post.body}
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
				<ButtonGroup>
					<IconButton size="sm">
						<LikeIcon color="error" />
					</IconButton>
					<Button size="sm" variant="text">
						10
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