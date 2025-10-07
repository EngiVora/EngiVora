"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

type UpcomingItem = {
  id: string
  title: string
  institution: string
  date: string
  image: string
}

const upcoming: UpcomingItem[] = [
  {
    id: "thermo",
    title: "Thermodynamics Exam",
    institution: "City College",
    date: "July 20, 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmT7ROMoMsK2UnyY2rmN_ZgFMw5JLlv_EC07--IxAafJogoTFfOqEsyv7ZfYiciCERmg91LicnHpSxAg6rDtuIi7B-NrbnsRgJ9IBBnNUJCqfsnvYjg0oL7-JA5Ey-a4yZsYiArFvIo1NHSrFeQpPLBiPEpFEd3xzUR64RTziA9unL3nNcynhhUhfZ5Jc7e9RkbXWGKhmgmEpIAiZOkDc4_QPLaB8I2Ys4rZoNf8DTR9RioyYkujhveKvfYmVKCQWibQSwx2llfqM",
  },
  {
    id: "eee",
    title: "Electrical Engineering Exam",
    institution: "Technical Institute",
    date: "July 25, 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_C4QnsvaON6lEjCdyWTLsVtjpgZfpDF_wdwR4bMAfmIa-J75kddtqJdl7soXDPy-LtTU07V-dW6DAJ3czDnNGv5dxc-ZerstgxoshKqU2qiuQcSlH-L3HUrPpv0VFcI3-JSS0n6K6aJ48e9WduOKWogEAMBCporyhL-HRllZbsuNdq5HZicM_V3zDqqvz9sGYAGPmcVhdf82_1fe7aEBH0CN1UxgVPL-0lGKSaNuihQShGXe_g61iu5KQ958WET8OeaApu7RAnWU",
  },
  {
    id: "mech",
    title: "Mechanical Design Exam",
    institution: "Polytechnic University",
    date: "August 5, 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXhXUW7R7ymVYcA1Wb-ygm-fRmkq1yZwQ19mHFAGdZWjTy95s90h9ujT6M0t2K9_wD7gwp4FNxzid3lpQarBmo4-r4y5fwlaeEy5oSLrn0BEUEt1apqBZDZG0do8vWJDcIXUgxBQiN6dIPbOh5S4TLGskkwxtX3DbHis__chgjuzSevM5FNFAgNWG9CIQ7mXWgfJBSI3Y5VTTlaKmOik015FOrqPnxMhGlltzKAck-attaxg7GZSTJdfD7xOTDsJCGO_zDHnUwv_A",
  },
  {
    id: "fluid",
    title: "Fluid Mechanics",
    institution: "Global Tech",
    date: "August 10, 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSF05e2HC9BPCELrCKYehau509GDr9g6BDNem9sqOTam1S4oKL8DUn5S1fZ8v8cR8eA2ip0MGUkHEUIYS_8zJAvWyDzD3FCNIPxlx4j_4IKmjQWqXqumyq6SzKd3eTQT_uiH9xXtphpxB10BN_VHR2el-P4Y2ZuEVJqM-S0fdp45FnFhduYnsAiukZgRbru8Nf_6XtMdTef6j0Vz7pBUoq0JMcTlTrxZwWaFFJbEDQWzmvjUhafDHoBgVavyhTsLq5zaFQQxNMFqw",
  },
]

export default function ExamsPage() {
  return (
    <main className="flex-1 bg-slate-950 px-4 sm:px-6 lg:px-20 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Exam Updates
          </motion.h2>
          <p className="mt-2 text-base md:text-lg text-slate-400">Stay informed about upcoming exams and important deadlines.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search for exams by subject or institution"
              aria-label="Search exams"
              className="h-12 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-4 text-sm md:text-base text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {[
            { label: "All", primary: true },
            { label: "Subject" },
            { label: "Institution" },
            { label: "Date" },
          ].map((f) => (
            <button
              key={f.label}
              className={
                f.primary
                  ? "rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
                  : "rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-800"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Left big card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden"
          >
            <div
              className="h-40 w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMfIFU4e0eEDP_Oo_ALTcq-djJpCW-2lTOExw9CAJJxPuP1wSUGf1RaoBWNz7eAMARc2B43MOWhfFa8OUMEG18OJutW2kyDJZQJCduBaDHN-dx5MYwsM90N0HH2rmI_tq2Ru19tHRqWWWIWz1_yAlm44Q-KOOQgUoPgvRxa2iWXlCAQvxo2fizm6cxo88yUUq9MsmJkf-X0qJgGMnRf4PjeKfpDDMuCHLrKy6AcqwYw5iSPToL5YHWcFaE8l4cGi1ljtlsXaJ4k74")',
              }}
            />
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold">Calculus II Exam</h3>
              <p className="mt-1 text-sm text-slate-400">Institution: State University</p>
              <p className="mt-1 text-sm text-slate-400">Date: July 15, 2024</p>
              <button className="mt-4 w-full rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-400">View Details</button>
            </div>
          </motion.div>

          {/* Middle: Upcoming list */}
          <div className="col-span-1 lg:col-span-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Exams</h3>
              <div className="max-h-96 overflow-y-auto pr-2">
                {upcoming.map((u) => (
                  <div key={u.id} className="flex items-center gap-6 rounded-md p-4 mb-4 last:mb-0 hover:bg-slate-800">
                    <div
                      className="h-20 w-28 shrink-0 rounded-md bg-cover bg-center"
                      style={{ backgroundImage: `url("${u.image}")` }}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold">{u.title}</h4>
                      <p className="text-sm text-slate-400">Institution: {u.institution}, Date: {u.date}</p>
                    </div>
                    <Link href="#" className="text-sky-400 hover:underline text-sm font-medium">Details</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overlay image card */}
          <div className="relative flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSF05e2HC9BPCELrCKYehau509GDr9g6BDNem9sqOTam1S4oKL8DUn5S1fZ8v8cR8eA2ip0MGUkHEUIYS_8zJAvWyDzD3FCNIPxlx4j_4IKmjQWqXqumyq6SzKd3eTQT_uiH9xXtphpxB10BN_VHR2el-P4Y2ZuEVJqM-S0fdp45FnFhduYnsAiukZgRbru8Nf_6XtMdTef6j0Vz7pBUoq0JMcTlTrxZwWaFFJbEDQWzmvjUhafDHoBgVavyhTsLq5zaFQQxNMFqw")',
              }}
            />
            <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-60 transition-opacity z-10" />
            <div className="p-6 flex-1 flex flex-col justify-end z-20 text-white">
              <h3 className="text-lg font-bold">Materials Science</h3>
              <p className="mt-1 text-sm">Institution: University of Engineering, Date: August 15, 2024</p>
              <button className="mt-4 w-full rounded-md bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/30 border border-white/30">View Details</button>
            </div>
          </div>

          {/* Structural analysis card */}
          <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold">Structural Analysis</h3>
              <p className="mt-1 text-sm text-slate-400">Institution: National Institute, Date: August 20, 2024</p>
              <p className="mt-4 text-sm text-slate-300">Prepare for a comprehensive exam covering key concepts in structural analysis. Key topics include trusses, beams, and frames.</p>
            </div>
            <div className="bg-slate-900 p-4 border-t border-slate-800 mt-auto">
              <Link href="#" className="text-sm font-medium text-sky-400 hover:underline">Download Syllabus</Link>
            </div>
          </div>

          {/* Promo card */}
          <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden items-center text-center p-6">
            <div className="h-24 w-24 rounded-full bg-sky-900/40 text-sky-300 flex items-center justify-center mb-4">📘</div>
            <h3 className="text-lg font-bold">Digital Logic Design</h3>
            <p className="mt-1 text-sm text-slate-400">Institution: Tech Academy, Date: August 22, 2024</p>
            <button className="mt-4 rounded-full bg-teal-500 px-6 py-2 text-sm font-medium text-white hover:bg-teal-400">Register Now</button>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-center">
          <nav aria-label="Pagination" className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800">‹</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-600 text-sm font-bold text-white">1</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-md text-sm text-slate-300 hover:bg-slate-800">2</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-md text-sm text-slate-300 hover:bg-slate-800">3</button>
            <span className="flex h-10 w-10 items-center justify-center text-sm text-slate-400">...</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-md text-sm text-slate-300 hover:bg-slate-800">10</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800">›</button>
          </nav>
        </div>
      </div>
    </main>
  )
}


