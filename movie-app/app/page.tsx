import { CalendarDays, Flame, Sparkles, Star } from "lucide-react";
import Image from "next/image";

import Movie from "@/components/movie";
import { Button } from "@/components/ui/button";
import { MovieType } from "@/types/global";
import Link from "next/link";

const backdrop = "https://image.tmdb.org/t/p/w1280";

async function fetchUpcoming(): Promise<MovieType[]> {
	const res = await fetch("https://api.themoviedb.org/3/movie/upcoming", {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	const data = await res.json();
	return data.results;
}

async function fetchPopular(): Promise<MovieType[]> {
	const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	const data = await res.json();
	return data.results;
}

function formatDate(date: string) {
	if (!date) {
		return "Coming soon";
	}

	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(`${date}T00:00:00`));
}

function MovieSection({
	title,
	description,
	icon,
	movies,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	movies: MovieType[];
}) {
	return (
		<section className="space-y-4">
			<div className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="flex items-center gap-2 text-2xl font-bold tracking-normal">
						<span className="text-primary">{icon}</span>
						{title}
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						{description}
					</p>
				</div>
				<span className="text-sm font-medium text-muted-foreground">
					{movies.length} titles
				</span>
			</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{movies.map((movie, index) => {
					return (
						<Movie
							key={movie.id}
							movie={movie}
							priority={index < 5}
						/>
					);
				})}
			</div>
		</section>
	);
}

export default async function Home() {
	const [upcoming, popular] = await Promise.all([
		fetchUpcoming(),
		fetchPopular(),
	]);
	const featured = popular[0];
	const featuredRating =
		typeof featured?.vote_average === "number"
			? featured.vote_average.toFixed(1)
			: null;

	return (
		<div className="space-y-10">
			{featured ? (
				<section className="relative isolate overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
					{featured.backdrop_path ? (
						<Image
							src={backdrop + featured.backdrop_path}
							alt=""
							fill
							preload
							sizes="(max-width: 768px) 100vw, 1024px"
							className="absolute inset-0 -z-10 h-full w-full object-cover"
						/>
					) : null}
					<div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/30" />
					<div className="max-w-2xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
						<div className="mb-4 inline-flex items-center gap-2 rounded-lg border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm backdrop-blur">
							<Sparkles className="size-4 text-primary" />
							Featured now
						</div>
						<h1 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl">
							{featured.title}
						</h1>
						<p className="mt-4 line-clamp-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
							{featured.overview}
						</p>
						<div className="mt-5 flex flex-wrap gap-2 text-sm">
							<span className="inline-flex items-center gap-1 rounded-lg bg-background/80 px-3 py-1.5 font-medium backdrop-blur">
								<CalendarDays className="size-4 text-primary" />
								{formatDate(featured.release_date)}
							</span>
							{featuredRating ? (
								<span className="inline-flex items-center gap-1 rounded-lg bg-background/80 px-3 py-1.5 font-medium backdrop-blur">
									<Star className="size-4 fill-primary text-primary" />
									{featuredRating}
								</span>
							) : null}
						</div>
						<Button
							asChild
							size="lg"
							className="mt-6">
							<Link href={`/movie/${featured.id}`}>
								View details
							</Link>
						</Button>
					</div>
				</section>
			) : null}

			<MovieSection
				title="Popular"
				description="High-traffic picks people are watching right now."
				icon={<Flame className="size-6" />}
				movies={popular}
			/>

			<MovieSection
				title="Upcoming"
				description="Release-window movies queued up for theaters and streaming."
				icon={<CalendarDays className="size-6" />}
				movies={upcoming}
			/>
		</div>
	);
}
