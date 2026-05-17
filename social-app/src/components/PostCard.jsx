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

export default function PostCard() {
    const navigate = useNavigate();

    return (
		<Card sx={{ p: 2, mb: 2 }}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar sx={{ width: 52, height: 52, background: green[500], }} />
				</Box>
				<Box>
					<Typography>Alice</Typography>
					<Typography sx={{ color: green[500], mb: 1 }}>
						a few seconds agao
					</Typography>
					<Typography onClick={() => navigate("/view")}>
						Lorem ipsum dolor sit, amet consectetur adipisicing
						elit. Necessitatibus, enim vel dicta commodi odit et
						voluptas in mollitia, numquam quas optio quod vero
						doloremque eum maxime a assumenda dignissimos iure.
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
						5
					</Button>
				</ButtonGroup>
			</Box>
		</Card>
	);
}