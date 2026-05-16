import { Box, Button, OutlinedInput, Typography } from "@mui/material";

import { useForm } from "react-hook-form";

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const create = data => {
        console.log(data);
    };

    return (
		<Box>
			<Typography variant="h3">Register</Typography>
			<form onSubmit={handleSubmit(create)}>
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
