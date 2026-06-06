export const API = "http://localhost:8800";

export function authHeaders() {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function authFetch(path, options = {}) {
	return fetch(`${API}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...authHeaders(),
			...options.headers,
		},
	});
}
