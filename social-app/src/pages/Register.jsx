import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { useState } from "react";
import { useNavigate } from "react-router";
import { API } from "../lib/api";

export default function Register() {
	const navigate = useNavigate();

	const [error, setError] = useState();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const create = data => {
		fetch(`${API}/users`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(res => {
            if (res.ok) {
				navigate("/login");
			} else {
				setError("Something went wrong");
			}
        }).catch(() => {
            setError("Something went wrong");
        });
	};

	return (
		<Box>
			<Typography variant="h3">Register</Typography>
			<form onSubmit={handleSubmit(create)}>
				{error && <Alert severity="warning">{error}</Alert>}

				<OutlinedInput
					sx={{ mt: 2 }}
					placeholder="name"
					fullWidth
					error={errors.name}
					{...register("name", { required: true })}
				/>
				<OutlinedInput
					sx={{ mt: 2 }}
					placeholder="username"
					fullWidth
					error={errors.username}
					{...register("username", { required: true })}
				/>
				<OutlinedInput
					sx={{ mt: 2 }}
					placeholder="bio"
					fullWidth
					{...register("bio")}
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
					Register
				</Button>
			</form>
		</Box>
	);
}
