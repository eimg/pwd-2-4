import { 
    AppBar,
    Toolbar,
    Typography,
} from "@mui/material";

export default function Header({ count }) {
    return <AppBar position="static">
        <Toolbar>
            <Typography>Todo</Typography>
        </Toolbar>
    </AppBar>;
}
