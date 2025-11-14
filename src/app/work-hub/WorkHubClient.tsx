"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorkHubClient() {
  return (
    <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold tracking-tighter"
          >
            Work Hub
          </motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Explore projects and opportunities to enhance your engineering
            skills.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6 px-4 sm:px-0">
            Featured Projects
          </h2>
          <div className="flex space-x-8 overflow-x-auto pb-6 -mb-6">
            {[
              {
                id: "1",
                statusClass: "bg-green-100 text-green-800",
                status: "Open",
                title: "Autonomous Drone Navigation System",
                desc: "Develop a drone capable of navigating complex environments autonomously.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBimXFuIxr5Cd0DrrnkQ3myr_LU7p9SWluKnwVYWmfwQUnfSZw6ktPB_PhWKTkxqkapjwOTq8vwlgMlBe-vKO85NdhfoIRjNdt9d6MBJQWRfxj2YmM07viQE9Z2XMLV1AS3qaiPgG8hkifCa4q1DbQZE6iejrA1DkHsDvXvV26V8uptaGcrGLQJa5O4cj-yuiJEzd37GfLgAXQMNaSxRCImekiN3uT9Tz2cB6FvCYMpMlboxS7oeeW7VfS7prFFZaGZT1ATWsXQYUY",
              },
              {
                id: "2",
                statusClass: "bg-yellow-100 text-yellow-800",
                status: "In Progress",
                title: "Smart Agriculture Monitoring",
                desc: "Monitor crop health and soil conditions to optimize agricultural practices.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH2B3R68rXfPTE6c3mR4-onZAQvDmjzJ9cuVsQeI1GPkIXpsEGCARGFLUW5MtxU8c-ZaqiEJtfrCaynVMuJNPexMlGPw8YCj0QIE9ehbDSK8aaPyhKailiVVkmHY_vPiwWA-NyeF4ng4844mwQEDKepP9-PjDt3OM0S_P8HXKW_eKSD6BgCB2ORLotzA53upSfJupwtpext23ByF91PJLJSStYmGcqICcU7a_PZJrsCoN0uD27ul73RzVbPnyQolP06ErQ6kWUgy8",
              },
              {
                id: "3",
                statusClass: "bg-gray-100 text-gray-800",
                status: "Completed",
                title: "Renewable Energy Grid Integration",
                desc: "Integrate solar and wind sources into existing power grids.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1saGR20qhEquw9a-di530B4ww2pfZ3_Lax78WHda44TGzMN8ECkwRSy6N7wUdGFxzCQoP1IYeSJX_eFBuWaZNELE-xYkkPsBb0SLYPDEghaifQKkyRDtNpZq9XHeSnYqpULi8WrOvGp9oCwc0Oek2_Vb10oeKi__oZKj-0VSpcsA2Xs3MtHSV8gVcL5HNTDrgrV9wNBFgZP8sPOmt6rrTpAGkkhlYe4JebTsNrZyYfLiSjCkcfqpKBYq-dp-3mwyz5jzbsLWqrYU",
              },
              {
                id: "4",
                statusClass: "bg-green-100 text-green-800",
                status: "Open",
                title: "3D-Printed Prosthetics",
                desc: "Design and create affordable, custom-fit prosthetic limbs using 3D printing technology.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9kDCwmqC5iGJhE7Q22ywVSGw73uC_VpW1tiCznE6wUyJ8K0g4LXJKYPRtXeOjfjCa4h19ObZpBd6xLCUixBKOZDhlMcFdVuXqjGUEMmS8Kvu0mGS063mefglQUs7ScSyyeTGQvMKMUo3x_tlinch3E1-0Gl7kNFAsIcWnGdM1NhcEef86jOyAEdCVRmpECPMvIhlp5zLUhSkHsJUQkuoGyW-q7UDneX0a5wPrbcK4rbj_iSfHk8h6otuNXfzEd14i6wGlTDqOD6o",
              },
            ].map((card, idx) => (
              <Link
                key={idx}
                href={`/work-hub/projects/${card.id}`}
                className="flex-none w-[360px] group relative overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-md transition-shadow hover:shadow-sky-500/20"
              >
                <div className="h-48 w-full relative">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    sizes="(min-width: 1024px) 360px, 80vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span
                    className={`inline-block ${card.statusClass} text-xs font-medium px-2.5 py-0.5 rounded-full mb-2`}
                  >
                    {card.status}
                  </span>
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="mt-2 text-slate-400">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Latest Opportunities
            </h2>
          </div>

          <Link
            href="/work-hub/opportunities/1"
            className="group relative flex flex-col overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-md transition-shadow hover:shadow-sky-500/20"
          >
            <div className="h-48 w-full relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXJTVYo-zRR3-Bs3RdhOPwaDIkDjnUejgkfksENmmJnANZn18Tst0et15DWm39341f4S-Af3w3JOjmG6OLXZRlVUZYamxD6E6yu8-_oMS1Xyl_LAmOUnRr23-H8Uf1s_R1r5CGuOVJRB2Mgu8BQxqpqZ02qEiGcATJTUOdpIYXZTTdMe2m1rjKq_17L_2yNNenI0MRozjNNRos1PrQhPL4Lj3P7ysg7W6aC4u4uctYVThXJ4vt_75xck3FgwynVIjnH3KoMlFm7xY"
                alt="Internship: Robotics and Automation"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 flex-grow">
              <span className="inline-block bg-sky-900/40 text-sky-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                Internship
              </span>
              <h3 className="text-xl font-bold">
                Internship: Robotics and Automation
              </h3>
              <p className="mt-2 text-slate-400">
                Gain hands-on experience in robotics and automation by working
                on real-world projects with industry experts.
              </p>
            </div>
            <div className="p-6 pt-0">
              <span className="font-semibold text-sky-400 group-hover:text-sky-300">
                Apply Now →
              </span>
            </div>
          </Link>

          <Link
            href="/work-hub/opportunities/2"
            className="lg:col-span-2 group relative flex flex-col overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-md transition-shadow hover:shadow-sky-500/20"
          >
            <div className="flex-1 flex-col sm:flex-row flex">
              <div className="sm:w-2/5 relative h-48 sm:h-auto">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGDS8qv5m9nCzESb39k3qt8KBVm3csZRtSbk_xms8nvDHqVtBvGmv5xTu3BvLMkmG6iMEWmHZuLyYx2FBBBSfKSHPsQpkuysJYoMLgcPpaFPIINyXi_bR6V4fI0CJazCyDl0k0x_xfq8ZbnHChPZUZ_9nVQr5At8Ib2w8LQu-4va-8lQiRvZc6WEpKy0nVynIprYXWvJwJoc8JQZNE52yr30e3DaRh_amM3osbYbJIv1CcBRaHarXILDp_nADlYIzUPizuLcuVL8I"
                  alt="Research Assistant: AI in Engineering"
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-sky-900/40 text-sky-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                    Research
                  </span>
                  <h3 className="text-xl font-bold">
                    Research Assistant: AI in Engineering
                  </h3>
                  <p className="mt-2 text-slate-400">
                    Assist in research projects focused on applying artificial
                    intelligence techniques to solve engineering challenges.
                  </p>
                </div>
                <div className="mt-4">
                  <span className="font-semibold text-sky-400 group-hover:text-sky-300">
                    Learn More →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/work-hub/opportunities/3"
            className="group relative overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-md transition-shadow hover:shadow-sky-500/20"
          >
            <div className="p-6">
              <span className="inline-block bg-purple-900/40 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                Volunteer
              </span>
              <h3 className="text-xl font-bold">
                Engineering Outreach Program
              </h3>
              <p className="mt-2 text-slate-400">
                Inspire the next generation of engineers by volunteering in
                outreach programs and workshops for students.
              </p>
              <div className="mt-4">
                <span className="font-semibold text-sky-400 group-hover:text-sky-300">
                  Get Involved →
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/work-hub/opportunities/4"
            className="group relative overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-md transition-shadow hover:shadow-sky-500/20"
          >
            <div className="p-6">
              <span className="inline-block bg-teal-900/40 text-teal-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                Competition
              </span>
              <h3 className="text-xl font-bold">Annual Design Challenge</h3>
              <p className="mt-2 text-slate-400">
                Showcase your skills and compete with peers in our annual
                engineering design competition.
              </p>
              <div className="mt-4">
                <span className="font-semibold text-sky-400 group-hover:text-sky-300">
                  Register Now →
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/work-hub/opportunities/5"
            className="group relative overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-md transition-shadow hover:shadow-sky-500/20"
          >
            <div className="p-6">
              <span className="inline-block bg-orange-900/40 text-orange-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                Hackathon
              </span>
              <h3 className="text-xl font-bold">Innovate for Good Hackathon</h3>
              <p className="mt-2 text-slate-400">
                Collaborate with a team to build innovative solutions for social
                and environmental problems.
              </p>
              <div className="mt-4">
                <span className="font-semibold text-sky-400 group-hover:text-sky-300">
                  Join Hackathon →
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-24 bg-sky-700 rounded-lg p-8 sm:p-12 text-white">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Get Involved?
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-sky-100">
              Upload your resume to be considered for opportunities and
              projects, or log in to see full details.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/profile"
                className="flex w-full sm:w-auto items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-sky-700 hover:bg-slate-100 md:py-4 md:px-10 md:text-lg"
              >
                Upload Resume
              </Link>
              <Link
                href="/work-hub/opportunities"
                className="flex w-full sm:w-auto items-center justify-center rounded-md border border-sky-400 bg-sky-700 px-8 py-3 text-base font-medium text-white hover:bg-sky-600 md:py-4 md:px-10 md:text-lg"
              >
                View Full Details
              </Link>
            </div>
            <p className="mt-4 text-xs text-sky-100">
              Login or sign up required for full access.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
