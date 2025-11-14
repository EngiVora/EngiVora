import { motion } from "framer-motion"

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
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold gradient-text mb-4">
            What Students Say
          </h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Hear from engineering students who have transformed their journey with EngiVora
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, index) => (
            <motion.div 
              key={t.name} 
              className="glass-panel p-8 h-full flex flex-col rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-sky-900/30 flex items-center justify-center mr-4">
                  <span className="text-sky-400 font-bold">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-100">{t.name}</div>
                  <div className="text-sm text-slate-400">{t.role}</div>
                </div>
              </div>
              <p className="text-slate-300 italic flex-grow">&quot;{t.quote}&quot;</p>
              <div className="mt-6 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}