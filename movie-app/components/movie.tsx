import { MovieType } from "@/types/global";

const poster = "http://image.tmdb.org/t/p/w185";

export default function Movie({ movie }: { movie: MovieType }) {
	return (
		<div className="w-42 text-center mb-3">
			<img
				src={poster + movie.poster_path}
				alt=""
			/>
			<b>{movie.title}</b>
			<div>{movie.release_date}</div>
		</div>
	);
}
