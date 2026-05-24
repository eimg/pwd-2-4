import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { useState } from "react";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";

const api = "http://localhost:8800";

export default function Login() {
	const [error, setError] = useState();
	const { setAuth } = useApp();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const login = data => {
		fetch(`${api}/users/login`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async res => {
            if (res.ok) {
				const { user, token } = await res.json();
				setAuth(user);
				localStorage.setItem("token", token);
				navigate("/");
			} else {
				setError("Unable to login");
			}
        }).catch(() => {
            setError("Something went wrong");
        });
	};

	return (
		<Box>
			<Typography variant="h3">Login</Typography>

			{error && <Alert severity="warning">{error}</Alert>}

			<form onSubmit={handleSubmit(login)}>
				<OutlinedInput
					sx={{ mt: 2 }}
					placeholder="username"
					fullWidth
					error={errors.username}
					{...register("username", { required: true })}
				/>
				<OutlinedInput
					sx={{ mt: 2 }}
					type="password"
					placeholder="password"
					fullWidth
					error={errors.password}
					{...register("password", { required: true })}
				/>
				<Button
					variant="contained"
					type="submit"
					sx={{ mt: 2 }}
					fullWidth>
					Login
				</Button>
			</form>
		</Box>
	);
}
