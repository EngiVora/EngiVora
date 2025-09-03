import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Engivora - Sign Up",
  description: "Create your Engivora account to explore opportunities and resources.",
}

export default function SignupPage() {
  return (
    <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Create your account</h1>
            <p className="mt-2 text-gray-600">Join Engivora to access student resources and opportunities</p>
          </div>

          <form className="space-y-5" aria-label="Signup form">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="Khushi Sinha"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? {" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}


