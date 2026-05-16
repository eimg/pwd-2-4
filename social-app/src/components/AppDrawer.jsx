import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";

import {
	Home as HomeIcon,
	PersonAdd as RegisterIcon,
	Logout as LogoutIcon,
	Person as ProfileIcon,
    Login as LoginIcon,
} from "@mui/icons-material";

import { grey } from "@mui/material/colors";
import { useApp } from "../AppProvider";

import { useNavigate } from "react-router";

export default function AppDrawer() {
	const { openDrawer, setOpenDrawer } = useApp();

    const navigate = useNavigate();

	return (
		<Drawer
			open={openDrawer}
			onClick={() => setOpenDrawer(false)}
			onClose={() => setOpenDrawer(false)}>
			<Box sx={{ width: 250, height: 200, background: grey[500] }}></Box>

			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/")}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>
			</List>

			<Divider />

			<List>
				<ListItemButton>
					<ListItemIcon>
						<ProfileIcon />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</ListItemButton>
				<ListItemButton>
					<ListItemIcon>
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItemButton>
			</List>

			<List>
				<ListItemButton onClick={() => navigate("/register")}>
					<ListItemIcon>
						<RegisterIcon />
					</ListItemIcon>
					<ListItemText primary="Register" />
				</ListItemButton>
				<ListItemButton onClick={() => navigate("/login")}>
					<ListItemIcon>
						<LoginIcon />
					</ListItemIcon>
					<ListItemText primary="Login" />
				</ListItemButton>
			</List>
		</Drawer>
	);
}
