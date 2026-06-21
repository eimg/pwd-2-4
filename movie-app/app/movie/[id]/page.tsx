import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Play, Star, Users } from "lucide-react";

import CastMemberCard from "@/components/cast-member-card";
import { Button } from "@/components/ui/button";
import { GenreType, MovieType, PersonType, VideoType } from "@/types/global";

async function fetchMovie(id: string): Promise<MovieType> {
	const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	return await res.json();
}

async function fetchCasts(id: string): Promise<PersonType[]> {
	const res = await fetch(
		`https://api.themoviedb.org/3/movie/${id}/credits`,
		{
			headers: {
				Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
			},
		},
	);

	return (await res.json()).cast;
}

async function fetchVideos(id: string): Promise<VideoType[]> {
	const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	return (await res.json()).results;
}

const backdropUrl = "https://image.tmdb.org/t/p/w1280";
const posterUrl = "https://image.tmdb.org/t/p/w342";

function formatDate(date: string) {
	if (!date) {
		return "TBA";
	}

	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(`${date}T00:00:00`));
}

function formatRuntime(minutes?: number) {
	if (!minutes) {
		return "Runtime TBA";
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

function getTrailer(videos: VideoType[]) {
	return (
		videos.find(
			video =>
				video.site === "YouTube" &&
				video.type === "Trailer" &&
				video.official,
		) ??
		videos.find(
			video => video.site === "YouTube" && video.type === "Trailer",
		) ??
		videos.find(video => video.site === "YouTube")
	);
}

function Rating({ value }: { value?: number }) {
	const rating = value ?? 0;
	const filledStars = Math.round(rating / 2);

	return (
		<div className="flex items-center gap-1">
			{Array.from({ length: 5 }).map((_, index) => (
				<Star
					key={index}
					className={`size-4 ${
						index < filledStars
							? "fill-primary text-primary"
							: "text-muted-foreground/40"
					}`}
				/>
			))}
		</div>
	);
}

function GenreChip({ genre }: { genre: GenreType }) {
	return (
		<Button
			asChild
			variant="secondary"
			size="sm">
			<Link href={`/genre/${genre.name}/${genre.id}`}>{genre.name}</Link>
		</Button>
	);
}

export default async function MovieDetail({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [movie, casts, videos] = await Promise.all([
		fetchMovie(id),
		fetchCasts(id),
		fetchVideos(id),
	]);
	const trailer = getTrailer(videos);
	const year = movie.release_date?.split("-")[0] ?? "TBA";
	const rating =
		typeof movie.vote_average === "number"
			? movie.vote_average.toFixed(1)
			: "NR";
	const displayCasts = casts.slice(0, 12);

	return (
		<div className="space-y-10">
			<section className="relative isolate overflow-hidden rounded-lg border bg-card shadow-sm">
				{movie.backdrop_path ? (
					<Image
						src={backdropUrl + movie.backdrop_path}
						alt=""
						fill
						preload
						sizes="(max-width: 768px) 100vw, 1024px"
						className="absolute inset-0 -z-10 object-cover"
					/>
				) : null}
				<div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/45" />
				<div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[220px_1fr] lg:p-10">
					<div className="relative mx-auto aspect-[2/3] w-44 overflow-hidden rounded-lg border bg-muted shadow-xl sm:w-52 lg:mx-0">
						{movie.poster_path ? (
							<Image
								src={posterUrl + movie.poster_path}
								alt={movie.title}
								fill
								preload
								sizes="220px"
								className="object-cover"
							/>
						) : (
							<div className="flex h-full items-center justify-center px-4 text-center text-muted-foreground">
								No poster
							</div>
						)}
					</div>

					<div className="flex min-w-0 flex-col justify-center">
						<div className="mb-3 flex flex-wrap gap-2">
							{movie.genres?.map(genre => (
								<GenreChip
									key={genre.id}
									genre={genre}
								/>
							))}
						</div>
						<h1 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl">
							{movie.title}
						</h1>
						{movie.tagline ? (
							<p className="mt-2 text-lg italic text-muted-foreground">
								{movie.tagline}
							</p>
						) : null}

						<div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
							<span className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 font-medium backdrop-blur">
								<CalendarDays className="size-4 text-primary" />
								{formatDate(movie.release_date)} · {year}
							</span>
							<span className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 font-medium backdrop-blur">
								<Clock className="size-4 text-primary" />
								{formatRuntime(movie.runtime)}
							</span>
							<span className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 font-medium backdrop-blur">
								<Star className="size-4 fill-primary text-primary" />
								{rating}/10
							</span>
							<span className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 font-medium backdrop-blur">
								<Users className="size-4 text-primary" />
								{movie.vote_count?.toLocaleString() ?? 0} votes
							</span>
						</div>

						<div className="mt-4 flex items-center gap-3">
							<Rating value={movie.vote_average} />
							<span className="text-sm text-muted-foreground">
								TMDB audience score
							</span>
						</div>

						<p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
							{movie.overview || "No overview is available for this movie."}
						</p>

						{trailer ? (
							<Button
								asChild
								size="lg"
								className="mt-6 w-fit">
								<a href="#trailer">
									<Play className="fill-current" />
									Watch trailer
								</a>
							</Button>
						) : null}
					</div>
				</div>
			</section>

			{trailer ? (
				<section
					id="trailer"
					className="space-y-4">
					<div className="border-b pb-3">
						<h2 className="flex items-center gap-2 text-2xl font-bold tracking-normal">
							<Play className="size-6 fill-primary text-primary" />
							Trailer
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							{trailer.name}
						</p>
					</div>
					<div className="overflow-hidden rounded-lg border bg-card shadow-sm">
						<iframe
							src={`https://www.youtube.com/embed/${trailer.key}`}
							title={trailer.name}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
							className="aspect-video w-full"
						/>
					</div>
				</section>
			) : null}

			<section className="space-y-4">
				<div className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-2xl font-bold tracking-normal">Top cast</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Principal cast members listed by TMDB billing order.
						</p>
					</div>
					<span className="text-sm font-medium text-muted-foreground">
						{casts.length} credited
					</span>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
					{displayCasts.map(cast => {
						return <CastMemberCard key={`${cast.id}-${cast.character}`} cast={cast} />;
					})}
				</div>
			</section>
		</div>
	);
}
