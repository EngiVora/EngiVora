import { motion } from "framer-motion"

export function MetricsStrip() {
  const metrics = [
    { label: "Students", value: "50k+" },
    { label: "Jobs Listed", value: "3.2k+" },
    { label: "Blogs", value: "1.1k+" },
    { label: "Events", value: "280+" },
  ]
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, index) => (
            <motion.div 
              key={m.label} 
              className="glass-panel p-6 text-center rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-extrabold text-slate-100 mb-2">{m.value}</div>
              <div className="text-sm text-slate-400">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}