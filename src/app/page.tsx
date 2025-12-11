import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            VibeBio
          </h1>
          <p className="text-xl text-slate-600">
            One link for all your vibes.
            <br />
            Share your music, videos, and social profiles in one beautiful place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-slate-200 text-slate-700 rounded-full font-medium hover:border-slate-300 hover:bg-white transition-all"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="pt-12 text-sm text-slate-400">
          Try visiting a profile: <Link href="/linhhehe" className="underline hover:text-slate-600">/linhhehe</Link> (or your username)
        </div>
      </div>
    </div>
  )
}
