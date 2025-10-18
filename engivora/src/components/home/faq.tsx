"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

const questions = [
  { q: "Is Engivora free to use?", a: "Yes, core features are free for students. We offer premium features for advanced tools and personalized recommendations." },
  { q: "How do I get job alerts?", a: "Follow the Jobs page and enable notifications. You can also set up custom alerts based on your preferences and location." },
  { q: "Can I submit my project?", a: "Yes, use the Work Hub to create or submit a project. Our community can view, comment, and collaborate with you on your projects." },
  { q: "How often is the content updated?", a: "Our content is updated daily with new job postings, exam schedules, and blog articles from industry experts." },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold gradient-text mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about EngiVora and how to make the most of it
          </p>
        </motion.div>
        <div className="mx-auto max-w-3xl space-y-4">
          {questions.map((item, i) => (
            <motion.div 
              key={item.q} 
              className="glass-panel rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <button 
                className="w-full text-left p-6 flex items-center justify-between group hover:bg-slate-900/50 transition-colors duration-300"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-slate-100 text-lg">{item.q}</span>
                <div className="text-slate-400 group-hover:text-sky-400 transition-colors">
                  {open === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-slate-400 text-base">{item.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}