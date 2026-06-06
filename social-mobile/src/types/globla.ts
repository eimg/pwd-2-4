export type PostType = {
    id: number;
    body: string;
    user: UserType;
    comments: CommentType[];
}

export type UserType = {
    id: number;
    name: string;
    username: string;
    bio?: string;
}

export type CommentType = {
    id: number;
    body: string;
    user: UserType;
    postId: number;
}