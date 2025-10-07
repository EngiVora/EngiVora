export function MetricsStrip() {
  const metrics = [
    { label: "Students", value: "50k+" },
    { label: "Jobs Listed", value: "3.2k+" },
    { label: "Blogs", value: "1.1k+" },
    { label: "Events", value: "280+" },
  ]
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="glass-panel p-6 text-center">
              <div className="text-3xl font-extrabold text-slate-100">{m.value}</div>
              <div className="mt-1 text-sm text-slate-400">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


