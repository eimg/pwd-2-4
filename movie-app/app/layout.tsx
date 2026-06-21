import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import { Clapperboard, Compass, Play, Search } from "lucide-react";

import MobileNav from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { GenreType } from "@/types/global";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Movie App",
	description: "Discover popular and upcoming movies.",
};

async function fetchGenres(): Promise<GenreType[]> {
	const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	const data = await res.json();
	return data.genres;
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const genres = await fetchGenres();

	return (
		<html
			lang="en"
			className={cn(
				"h-full antialiased",
				geistSans.variable,
				geistMono.variable,
				inter.variable,
			)}>
			<body className="min-h-full bg-background text-foreground">
				<header className="sticky top-0 z-40 border-b bg-background/90 px-4 py-3 backdrop-blur md:px-6">
					<div className="mx-auto flex max-w-7xl items-center gap-3">
						<MobileNav genres={genres} />
						<Link
							href="/"
							className="flex min-w-0 items-center gap-3 font-bold">
							<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
								<Clapperboard size={22} />
							</span>
							<span className="truncate text-xl md:text-2xl">
								Movie App
							</span>
						</Link>
						<form
							className="ml-auto flex w-full max-w-sm gap-2"
							action="/search">
							<div className="relative flex-1">
								<Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search movies"
									name="q"
									className="pl-8"
								/>
							</div>
							<Button
								type="submit"
								className="hidden sm:inline-flex">
								Search
							</Button>
						</form>
					</div>
				</header>

				<main className="mx-auto flex max-w-7xl">
					<aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-56 shrink-0 border-r p-4 md:block">
						<nav className="flex h-full flex-col gap-1 overflow-y-auto pr-1">
							<Button
								variant="secondary"
								size="lg"
								asChild>
								<Link
									href="/"
									className="justify-start gap-2">
									<Compass />
									Discover
								</Link>
							</Button>

							{genres.map(genre => {
								return (
									<Button
										asChild
										size="lg"
										variant="ghost"
										key={genre.id}>
										<Link
											href={`/genre/${genre.name}/${genre.id}`}
											className="justify-start gap-2">
											<Play />
											{genre.name}
										</Link>
									</Button>
								);
							})}
						</nav>
					</aside>
					<section className="min-w-0 flex-1 px-4 py-5 md:px-6 lg:px-8">
						{children}
					</section>
				</main>
			</body>
		</html>
	);
}
