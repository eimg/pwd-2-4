export type GenreType = {
    id: number;
    name: string;
}

export type MovieType = {
	id: number;
	title: string;
	backdrop_path: string;
	poster_path: string;
	release_date: string;
	overview: string;
	genres?: GenreType[];
	runtime?: number;
	tagline?: string;
	vote_average?: number;
	vote_count?: number;
}

export type PersonType = {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}

export type PersonDetailsType = {
	id: number;
	name: string;
	biography?: string;
	birthday?: string | null;
	deathday?: string | null;
	homepage?: string | null;
	known_for_department?: string;
	place_of_birth?: string | null;
	popularity?: number;
	profile_path?: string | null;
}

export type VideoType = {
	id: string;
	key: string;
	name: string;
	official: boolean;
	site: string;
	type: string;
}
