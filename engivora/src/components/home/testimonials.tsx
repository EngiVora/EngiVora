export function Testimonials() {
  const items = [
    {
      quote: "Engivora helped me land my first internship and track exams easily.",
      name: "Aarav S.",
      role: "3rd year, CSE",
    },
    {
      quote: "The work hub is perfect for finding collaborators on projects.",
      name: "Sneha K.",
      role: "ECE Graduate",
    },
    {
      quote: "Discounts saved me a ton on tools I use every day.",
      name: "Vikram R.",
      role: "Mechanical, Final year",
    },
  ]
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-4xl font-extrabold tracking-tight mb-12">What students say</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="glass-panel p-8 h-full flex flex-col">
              <p className="text-slate-300">“{t.quote}”</p>
              <div className="mt-6 text-sm text-slate-400">{t.name} • {t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


