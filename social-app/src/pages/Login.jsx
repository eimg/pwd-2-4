import { Box, Button, OutlinedInput, Typography } from "@mui/material";

import { useForm } from "react-hook-form";

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const login = data => {
		console.log(data);
	};

	return (
		<Box>
			<Typography variant="h3">Login</Typography>
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
				<Button variant="contained" type="submit" sx={{ mt: 2 }} fullWidth>
					Login
				</Button>
			</form>
		</Box>
	);
}
