import Movie from "@/components/movie";
import { MovieType } from "@/types/global";

async function fetchUpcoming(): Promise<MovieType[]> {
	const res = await fetch("https://api.themoviedb.org/3/movie/upcoming", {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	const data = await res.json();
	return data.results;
}

export default async function Home() {
	const upcoming = await fetchUpcoming();

	return (
		<div>
			<h2 className="text-2xl p-2 mb-4 border-b">Upcoming</h2>
			<div className="flex flex-wrap gap-2">
				{upcoming.map(movie => {
					return (
						<Movie key={movie.id} movie={movie} />
					);
				})}
			</div>
		</div>
	);
}
