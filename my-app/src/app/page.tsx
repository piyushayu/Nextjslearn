import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link
        href="/sign-up"
        className="rounded-full bg-foreground text-background px-6 py-3 font-medium hover:opacity-80 transition-opacity"
      >
        Go to Sign Up
      </Link>
    </div>
  )
}
