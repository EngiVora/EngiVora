export function CtaBanner() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-sky-700 to-teal-600 p-10 text-white flex flex-col md:flex-row items-center justify-between neon-ring">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Ready to supercharge your journey?</h3>
            <p className="mt-2 text-sky-100">Join thousands of students leveling up with Engivora.</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-3">
            <a href="/blogs" className="inline-flex items-center justify-center rounded-full bg-sky-900/40 ring-1 ring-white/30 text-white font-semibold px-6 py-3">Explore resources</a>
          </div>
        </div>
      </div>
    </section>
  )
}
