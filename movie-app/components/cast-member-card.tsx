"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { CalendarDays, MapPin, Sparkles, UserRound } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { PersonDetailsType, PersonType } from "@/types/global"

const profileUrl = "https://image.tmdb.org/t/p/w185"
const profileLargeUrl = "https://image.tmdb.org/t/p/w342"

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

function formatDate(date?: string | null) {
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`))
}

function PersonImage({
  name,
  path,
  large = false,
}: {
  name: string
  path?: string | null
  large?: boolean
}) {
  if (!path) {
    return (
      <div className="flex h-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
        {initialsFor(name)}
      </div>
    )
  }

  return (
    <Image
      src={(large ? profileLargeUrl : profileUrl) + path}
      alt={name}
      fill
      sizes={large ? "(max-width: 640px) 38vw, 220px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 160px"}
      className="object-cover"
    />
  )
}

export default function CastMemberCard({ cast }: { cast: PersonType }) {
  const [open, setOpen] = useState(false)
  const [person, setPerson] = useState<PersonDetailsType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initials = useMemo(() => initialsFor(cast.name), [cast.name])

  useEffect(() => {
    if (!open || person || loading) {
      return
    }

    const controller = new AbortController()

    async function loadPerson() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/person/${cast.id}`, {
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error("Could not load cast info.")
        }

        setPerson(await res.json())
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Could not load cast info.")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPerson()

    return () => controller.abort()
  }, [cast.id, loading, open, person])

  const birthday = formatDate(person?.birthday)
  const deathday = formatDate(person?.deathday)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group overflow-hidden rounded-lg border bg-card text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-ring/50"
        >
          <div className="relative aspect-[2/3] bg-muted">
            {cast.profile_path ? (
              <PersonImage name={cast.name} path={cast.profile_path} />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl font-bold text-muted-foreground">
                {initials}
              </div>
            )}
          </div>
          <div className="space-y-1 p-3">
            <div className="line-clamp-2 font-semibold leading-tight group-hover:text-primary">
              {cast.name}
            </div>
            <p className="line-clamp-2 text-sm leading-tight text-muted-foreground">
              {cast.character || "Role not listed"}
            </p>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent>
        <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
          <div className="relative aspect-[2/3] bg-muted sm:min-h-full">
            <PersonImage
              name={person?.name ?? cast.name}
              path={person?.profile_path ?? cast.profile_path}
              large
            />
          </div>
          <div className="min-w-0 p-5 sm:p-6">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-2xl">
                {person?.name ?? cast.name}
              </DialogTitle>
              <DialogDescription>
                {cast.character ? `as ${cast.character}` : "Cast member"}
              </DialogDescription>
            </DialogHeader>

            {loading ? (
              <div className="mt-6 space-y-3">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            ) : null}

            {error ? (
              <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {person && !loading ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-2 text-sm">
                  {person.known_for_department ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="size-4 text-primary" />
                      <span>{person.known_for_department}</span>
                    </div>
                  ) : null}
                  {birthday ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="size-4 text-primary" />
                      <span>
                        {birthday}
                        {deathday ? ` - ${deathday}` : ""}
                      </span>
                    </div>
                  ) : null}
                  {person.place_of_birth ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 text-primary" />
                      <span>{person.place_of_birth}</span>
                    </div>
                  ) : null}
                  {typeof person.popularity === "number" ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserRound className="size-4 text-primary" />
                      <span>Popularity {person.popularity.toFixed(1)}</span>
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-semibold">Biography</h3>
                  <p className="mt-2 max-h-56 overflow-y-auto pr-2 text-sm leading-6 text-muted-foreground">
                    {person.biography || "No biography is available."}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
