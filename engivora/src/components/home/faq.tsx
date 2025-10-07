"use client"

import { useState } from "react"

const questions = [
  { q: "Is Engivora free to use?", a: "Yes, core features are free for students." },
  { q: "How do I get job alerts?", a: "Follow the Jobs page and enable notifications." },
  { q: "Can I submit my project?", a: "Yes, use the Work Hub to create or submit a project." },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-4xl font-extrabold tracking-tight mb-12">Frequently asked</h3>
        <div className="mx-auto max-w-3xl space-y-4">
          {questions.map((item, i) => (
            <div key={item.q} className="glass-panel p-4">
              <button className="w-full text-left" onClick={() => setOpen(open === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{item.q}</span>
                  <span className="text-slate-400">{open === i ? "–" : "+"}</span>
                </div>
              </button>
              {open === i && (
                <p className="mt-3 text-slate-400 text-sm">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


