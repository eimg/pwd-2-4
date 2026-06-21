import Link from "next/link";
import Image from "next/image";
import { Calendar, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { MovieType } from "@/types/global";

const poster = "https://image.tmdb.org/t/p/w342";

export default function Movie({
	movie,
	priority = false,
	className,
}: {
	movie: MovieType;
	priority?: boolean;
	className?: string;
}) {
	const year = movie.release_date?.split("-")[0] ?? "TBA";
	const rating =
		typeof movie.vote_average === "number"
			? movie.vote_average.toFixed(1)
			: null;

	return (
		<article
			className={cn(
				"group min-w-0 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
				className,
			)}>
			<Link
				href={`/movie/${movie.id}`}
				className="block focus:outline-none focus:ring-3 focus:ring-ring/50">
				<div className="relative aspect-[2/3] overflow-hidden bg-muted">
					{movie.poster_path ? (
						<Image
							src={poster + movie.poster_path}
							alt={movie.title}
							fill
							preload={priority}
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 190px"
							className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
							No poster
						</div>
					)}
				</div>
			</Link>
			<div className="space-y-2 p-3">
				<Link
					href={`/movie/${movie.id}`}
					className="line-clamp-2 min-h-10 font-semibold leading-tight hover:text-primary">
					{movie.title}
				</Link>
				<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<Calendar className="size-3.5" />
						{year}
					</span>
					{rating ? (
						<span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
							<Star className="size-3.5 fill-current" />
							{rating}
						</span>
					) : null}
				</div>
			</div>
		</article>
	);
}
