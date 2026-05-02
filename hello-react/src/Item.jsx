import { ListItem, ListItemText, IconButton } from "@mui/material";

import {
	Delete as DeleteIcon,
	Check as DoneIcon,
	SquareOutlined as CheckIcon,
} from "@mui/icons-material";

export default function Item({ item, remove, toggle }) {
	return (
		<ListItem>
			<IconButton
				sx={{ mr: 2 }}
				onClick={() => toggle(item.id)}>
				{item.done ? <DoneIcon color="success" /> : <CheckIcon />}
			</IconButton>
			<ListItemText primary={item.name} />
			<IconButton onClick={() => remove(item.id)}>
				<DeleteIcon color="error" />
			</IconButton>
		</ListItem>
	);
}
