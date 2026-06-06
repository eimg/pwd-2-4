import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "../lib/api";

export function useLikeMutation(queryKeys) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ postId, liked }) => {
			const res = await authFetch(`/posts/${postId}/like`, {
				method: liked ? "DELETE" : "POST",
			});
			if (!res.ok) {
				throw new Error("Failed to update like");
			}
			return res.json();
		},
		onSuccess: () => {
			for (const queryKey of queryKeys) {
				queryClient.invalidateQueries({ queryKey });
			}
		},
	});
}
