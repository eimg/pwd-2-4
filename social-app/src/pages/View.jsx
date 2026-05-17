import { Avatar, Typography, Box, IconButton, OutlinedInput } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

import PostCard from "../components/PostCard";
import { grey } from "@mui/material/colors";

export default function View() {
	return (
		<Box>
			<PostCard />
			<form>
				<OutlinedInput fullWidth placeholder="Your reply"
					endAdornment={<IconButton><SendIcon /></IconButton>}
				/>
			</form>

			<Box sx={{ p: 2, my: 2, border: "1px solid #99999950" }}>
				<Box sx={{ display: "flex", gap: 2 }}>
					<Box>
						<Avatar sx={{ width: 52, height: 52, background: grey[500], }} />
					</Box>
					<Box>
						<Typography>Alice</Typography>
						<Typography sx={{ color: grey[500], mb: 1 }}>
							a few seconds agao
						</Typography>
						<Typography>
							Lorem ipsum dolor sit, amet consectetur adipisicing
							elit. Necessitatibus, enim vel dicta commodi odit et
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
