"use client"

import Link from "next/link"
import { Clapperboard, Compass, Menu, Play } from "lucide-react"

import type { GenreType } from "@/types/global"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileNav({ genres }: { genres: GenreType[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] max-w-[88vw] p-0">
        <SheetHeader className="border-b">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clapperboard className="size-5" />
            </span>
            <SheetTitle>Movie App</SheetTitle>
          </div>
          <SheetDescription>
            Browse genres and jump back into the full catalog.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          <SheetClose asChild>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/" className="justify-start gap-2">
                <Compass />
                Discover
              </Link>
            </Button>
          </SheetClose>
          {genres.map((genre) => (
            <SheetClose asChild key={genre.id}>
              <Button variant="ghost" size="lg" asChild>
                <Link
                  href={`/genre/${genre.name}/${genre.id}`}
                  className="justify-start gap-2"
                >
                  <Play />
                  {genre.name}
                </Link>
              </Button>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
