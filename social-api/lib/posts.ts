export function postInclude(userId?: number) {
	return {
		user: true,
		comments: true,
		_count: { select: { likes: true } },
		...(userId && {
			likes: {
				where: { userId },
				select: { id: true },
				take: 1,
			},
		}),
	};
}

export function postDetailInclude(userId?: number) {
	return {
		user: true,
		comments: {
			include: { user: true },
		},
		_count: { select: { likes: true } },
		...(userId && {
			likes: {
				where: { userId },
				select: { id: true },
				take: 1,
			},
		}),
	};
}

export function formatPost<T extends Record<string, unknown>>(post: T) {
	const { _count, likes, ...rest } = post as T & {
		_count?: { likes: number };
		likes?: { id: number }[];
	};

	return {
		...rest,
		likeCount: _count?.likes ?? 0,
		liked: likes !== undefined ? likes.length > 0 : undefined,
	};
}

export function formatPosts<T extends Record<string, unknown>>(posts: T[]) {
	return posts.map(formatPost);
}
