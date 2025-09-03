import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Engivora - Student Profile",
  description: "View and manage your student profile, projects, skills, and activity.",
}

export default function StudentProfilePage() {
  return (
    <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-2 ring-blue-100">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO9PNq_uNRK3gsks-7qTqlbAX2m4GPXlF9xQzv3kcQ24hpC-OBX2Kg3HEKZJFIm295KGr-5zHkfF7KyzEZIKjbipC2WplysSxm3goMIK3PEJudTVJxmqAOkoMhFJ5ra09y4kvym2QbMIuRReZ4Nl5XXdxl9snVf4r-J85uzcpEu9Zi5_XCgvQhfGlC3nro1-UabR4ijDZVS0kUvDUMtsdq-0rMQpODD0iJ-nWCAMZsQlSikHaaens5vlM6GP4VPx3v9RuqJL2xrrE"
                alt="Profile picture"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Khushi Sinha</h1>
                  <p className="text-gray-600">B.Tech, Computer Science • 2026 • Bangalore, IN</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Edit Profile</button>
                  <button className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Share</button>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-md">
                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <div className="text-xl font-extrabold text-blue-700">12</div>
                  <div className="text-xs text-blue-800/80 font-medium">Projects</div>
                </div>
                <div className="rounded-lg bg-green-50 p-3 text-center">
                  <div className="text-xl font-extrabold text-green-700">8</div>
                  <div className="text-xs text-green-800/80 font-medium">Certifications</div>
                </div>
                <div className="rounded-lg bg-purple-50 p-3 text-center">
                  <div className="text-xl font-extrabold text-purple-700">23</div>
                  <div className="text-xs text-purple-800/80 font-medium">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">About</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Passionate engineering student focused on AI/ML and full‑stack development. Enjoys building
                scalable apps, participating in hackathons, and contributing to open‑source. Currently exploring
                robotics applications in agriculture and energy.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "TypeScript",
                  "React",
                  "Next.js",
                  "Node.js",
                  "Python",
                  "TensorFlow",
                  "TailwindCSS",
                ].map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Autonomous Drone Navigation",
                    tag: "Open",
                    tagClass: "bg-green-100 text-green-800",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBimXFuIxr5Cd0DrrnkQ3myr_LU7p9SWluKnwVYWmfwQUnfSZw6ktPB_PhWKTkxqkapjwOTq8vwlgMlBe-vKO85NdhfoIRjNdt9d6MBJQWRfxj2YmM07viQE9Z2XMLV1AS3qaiPgG8hkifCa4q1DbQZE6iejrA1DkHsDvXvV26V8uptaGcrGLQJa5O4cj-yuiJEzd37GfLgAXQMNaSxRCImekiN3uT9Tz2cB6FvCYMpMlboxS7oeeW7VfS7prFFZaGZT1ATWsXQYUY",
                    desc: "SLAM-based autonomous path planning and obstacle avoidance.",
                  },
                  {
                    title: "AI in Engineering Research",
                    tag: "Research",
                    tagClass: "bg-blue-100 text-blue-800",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGDS8qv5m9nCzESb39k3qt8KBVm3csZRtSbk_xms8nvDHqVtBvGmv5xTu3BvLMkmG6iMEWmHZuLyYx2FBBBSfKSHPsQpkuysJYoMLgcPpaFPIINyXi_bR6V4fI0CJazCyDl0k0x_xfq8ZbnHChPZUZ_9nVQr5At8Ib2w8LQu-4va-8lQiRvZc6WEpKy0nVynIprYXWvJwJoc8JQZNE52yr30e3DaRh_amM3osbYbJIv1CcBRaHarXILDp_nADlYIzUPizuLcuVL8I",
                    desc: "Applied ML for predictive maintenance and anomaly detection.",
                  },
                ].map((item) => (
                  <article key={item.title} className="group relative overflow-hidden rounded-lg bg-white ring-1 ring-gray-200">
                    <div className="relative h-40 w-full">
                      <Image src={item.img} alt={item.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <span className={`inline-block ${item.tagClass} text-xs font-medium px-2.5 py-0.5 rounded-full mb-2`}>{item.tag}</span>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
                      <a href="#" className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">View details →</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <ul className="space-y-4">
                {[
                  { when: "2h ago", text: "Applied to Internship: Robotics and Automation" },
                  { when: "1d ago", text: "Published project update: SLAM module latency -15%" },
                  { when: "3d ago", text: "Earned badge: Open Source Contributor" },
                ].map((act) => (
                  <li key={act.text} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{act.text}</p>
                      <p className="text-xs text-gray-500">{act.when}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Email</dt>
                  <dd className="font-medium text-gray-900">khushi@example.com</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Location</dt>
                  <dd className="font-medium text-gray-900">Bangalore, IN</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Website</dt>
                  <dd className="font-medium text-blue-600"><a href="#">khushi.dev</a></dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2">
                <a aria-label="Open GitHub" href="#" className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200">GitHub</a>
                <a aria-label="Open LinkedIn" href="#" className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">LinkedIn</a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Education</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image src="/vercel.svg" alt="College logo" fill sizes="40px" className="object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">B.Tech, Computer Science</p>
                    <p className="text-xs text-gray-600">2022 – 2026 • CGPA: 8.9/10</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Experience</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900">Software Intern • Innovate Systems</p>
                  <p className="text-xs text-gray-600">Jun 2024 – Aug 2024 • Bangalore (Remote)</p>
                  <p className="mt-1 text-sm text-gray-700">Built internal dashboards using Next.js and optimized API responses by 30%.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Campus Ambassador • Dev Community</p>
                  <p className="text-xs text-gray-600">Jan 2024 – Apr 2024</p>
                  <p className="mt-1 text-sm text-gray-700">Organized workshops and grew local chapter to 200+ members.</p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-16 bg-blue-600 rounded-lg p-8 sm:p-12 text-white">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Looking for opportunities?</h2>
            <p className="mt-3 max-w-2xl text-blue-100">
              Keep your profile updated and enable notifications to get matched with internships, research roles, and hackathons.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button className="flex w-full sm:w-auto items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50">Enable Alerts</button>
              <a href="/work-hub" className="flex w-full sm:w-auto items-center justify-center rounded-md border border-blue-300 bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700">Browse Opportunities</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}


