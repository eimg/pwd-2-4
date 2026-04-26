import { ListItem, ListItemText, IconButton } from "@mui/material";

import { Delete as DeleteIcon } from "@mui/icons-material";

export default function Item({ item, remove }) {
	return (
		<ListItem>
			<ListItemText primary={item.name} />
			<IconButton onClick={() => remove(item.id)}>
				<DeleteIcon color="error" />
			</IconButton>
		</ListItem>
	);
}
