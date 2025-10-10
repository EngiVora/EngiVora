"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function JobsPage() {
  return (
    <div className="bg-slate-950 text-slate-100">
      <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl"
              >
                Find Your <span className="bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent">Engineering</span> Job
              </motion.h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                Explore thousands of opportunities tailored for ambitious engineering students.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-slate-400" fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    className="block w-full rounded-md border-slate-800 bg-slate-950 pl-10 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-sky-600 focus:ring-sky-600"
                    placeholder="Job title or keyword"
                    defaultValue=""
                  />
                </div>

                <div className="relative">
                  <select aria-label="Filter by location" className="block w-full rounded-md border-slate-800 bg-slate-950 py-3 text-sm text-slate-100 focus:border-sky-600 focus:ring-sky-600">
                    <option>All Locations</option>
                    <option>Remote</option>
                    <option>San Francisco, CA</option>
                    <option>New York, NY</option>
                    <option>Los Angeles, CA</option>
                  </select>
                </div>

                <div className="relative">
                  <select aria-label="Filter by branch" className="block w-full rounded-md border-slate-800 bg-slate-950 py-3 text-sm text-slate-100 focus:border-sky-600 focus:ring-sky-600">
                    <option>All Branches</option>
                    <option>Mechanical</option>
                    <option>Software</option>
                    <option>Electrical</option>
                    <option>Civil</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <button className="flex items-center justify-center rounded-md h-12 px-6 bg-sky-600 text-white text-base font-semibold tracking-tight hover:bg-sky-500 w-full">
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 lg:col-span-3">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg sticky top-8">
                  <h3 className="text-lg font-bold mb-4">Featured Jobs</h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <h4 className="font-bold">Mechanical Engineer Intern</h4>
                      <p className="text-sm text-slate-400">Tech Solutions Inc.</p>
                      <p className="text-xs text-slate-500 mt-1">Remote</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <h4 className="font-bold">Software Engineer</h4>
                      <p className="text-sm text-slate-400">Innovate Systems</p>
                      <p className="text-xs text-slate-500 mt-1">San Francisco, CA</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <h4 className="font-bold">Electrical Engineer</h4>
                      <p className="text-sm text-slate-400">Power Grid Corp</p>
                      <p className="text-xs text-slate-500 mt-1">New York, NY</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <h4 className="font-bold">Civil Engineer Intern</h4>
                      <p className="text-sm text-slate-400">BuildWell Construction</p>
                      <p className="text-xs text-slate-500 mt-1">Los Angeles, CA</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <h4 className="font-bold">Product Design Engineer</h4>
                      <p className="text-sm text-slate-400">Creative Assembly</p>
                      <p className="text-xs text-slate-500 mt-1">Remote</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row items-start gap-6 border-l-4 border-l-sky-600">
                  <div className="w-full sm:w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6byUVckMqg6gmZhI9DsFjBLDSADsBBPdbK0f3saTH0PXJD9YJAs16HQ9MnxyasAzqznROviksz6opuPiyoJyisTxYAjpWCmFizrDCO6aURW1d-WdZFTaoyKNy2ZzalhBXRTNRmDdkxVVw41UdGHZy7rWhGsXLaHIeGt1oaekIAsRJ4uo0rM1zq4qrRpuFt7jfpDMYUj7fNrBkPGAJJoIs3i-5CHxbXbGsbotvV2xSoBN5Z5f6bGoPBuGE7oUOsyK-o8XaqQQOlk"
                      alt="Company logo"
                      className="h-full w-full object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-2xl font-bold">Mechanical Engineer Intern</h3>
                      <span className="text-xs font-semibold bg-sky-900/40 text-sky-300 px-2 py-1 rounded-full">Internship</span>
                    </div>
                    <p className="text-md text-slate-400 mb-3">Tech Solutions Inc. - Remote</p>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                      An exciting opportunity for a motivated student to gain hands-on experience in mechanical design and product development. You will work alongside our senior engineers on cutting-edge projects.
                    </p>
                    <div className="flex items-center gap-4">
                      <a className="inline-flex items-center justify-center rounded-md h-10 px-5 bg-sky-600 text-white text-sm font-semibold tracking-tight hover:bg-sky-500" href="#">
                        Apply Now
                      </a>
                      <span className="text-sm text-slate-500">Posted 2 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1IU2jpeLS_hX69bOnAJKS0x5aYfdFUQTtSMCJzdFoyCMO-l2uzzxdAHbJ5GXn5Jdz4s5SfaBe_HopIr46pVcy67W2hx8LUPsJLKDXOvLX_AN7wqM4oUWCPfCqXwNSX4UN4lWtRW-FyF4Wej-YaF0JtTxME4YPIztBrHxqhjw6hsBxrAFytx2wa83Tq-YBBgRwBkCDTROeNIa8yU82fibAWQXA1WcvnSqpQfVREyUWS-qoJubyq2m-NUQkxp2zKmpJuqMbOmwLxzA"
                          alt="Innovate Systems logo"
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Software Engineer</h3>
                        <p className="text-md text-slate-400">Innovate Systems</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-3 flex-grow mb-4">
                      Join our dynamic team and contribute to the development of our flagship product. This role is perfect for a recent graduate passionate about coding and problem-solving.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-semibold bg-emerald-900/40 text-emerald-300 px-2 py-1 rounded-full">Entry Level</span>
                      <a className="text-sm font-semibold text-sky-400 hover:underline" href="#">View Details →</a>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDux4P3_-rmP1G3tsHb2kbzpg44VRBZBwqlwfYovZXac4CLOml05b499gZ-DFWAB-I83A4du3_amUY_rSCVuL4VN13NFv7HzXizS13xko8zW2M0Bt46Pd1JpmNVGSN0Om7DE0UWXqqCiH3IvQZLwe04e2HOrYezmq-ZyD7z_EC0MiWlkLgyFgsx4C4-wEcIQhlsZsZyynIuFrn2EEwemNRMy1H0axAPet97__J6J6oHiKjQpWQjq-zXqE5WfKDc7CGnlMP5_D5dniI"
                          alt="Power Grid Corp logo"
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Electrical Engineer</h3>
                        <p className="text-md text-slate-400">Power Grid Corp</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-3 flex-grow mb-4">
                      We are seeking a skilled electrical engineer to design and oversee the installation of electrical equipment. A great opportunity to work on large-scale infrastructure projects.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-semibold bg-purple-900/40 text-purple-300 px-2 py-1 rounded-full">Full-time</span>
                      <a className="text-sm font-semibold text-sky-400 hover:underline" href="#">View Details →</a>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-sky-900/20 to-slate-900">
                  <div className="w-full sm:w-48 h-32 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVRSGwOZxSZBU-lgbk1M4YGdR-mMhb6aVpW8VN_HhB8n9geDwBKPOl4TWSgkvAY352thjCQveODsddEBrbssBMuFxTO_eoXgSswWccg4NH2Dzas2eIC5oqK9ohN9GgkigAu-CTC6i-UjqbQVq-shrT-sNn98iMWM-cEevzxEUQ2RHS_bT4gHjs5SpHhk1w7HgbHfMAXD8s2DaWRbVqTiNeMRAomX1rlg9xOJuu3Pr4z6c7iPbKn4Yz3ZMa8yALrbTulU8CB8i7KyQ"
                      alt="BuildWell Construction graphic"
                      className="h-full w-full object-cover"
                      width={192}
                      height={128}
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-2xl font-bold">Civil Engineer Intern</h3>
                    <p className="text-lg text-slate-400 mb-3">BuildWell Construction - Los Angeles, CA</p>
                    <p className="text-sm text-slate-400 mb-4">
                      Assist project managers with planning and execution of construction projects. This internship provides invaluable experience in the civil engineering field.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <a className="inline-flex items-center justify-center rounded-full h-16 w-16 bg-sky-600 text-white text-sm font-semibold tracking-tight hover:bg-sky-500 shadow-lg" href="#">
                      Apply
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-8 mt-8">
              <a aria-label="Previous page" className="flex size-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800" href="#">
                <svg fill="currentColor" height="18px" viewBox="0 0 256 256" width="18px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
              </a>
              <a className="text-sm font-bold flex size-10 items-center justify-center text-white rounded-md bg-sky-600 mx-1" href="#">1</a>
              <a className="text-sm font-medium flex size-10 items-center justify-center text-slate-300 rounded-md hover:bg-slate-800 mx-1" href="#">2</a>
              <a className="text-sm font-medium flex size-10 items-center justify-center text-slate-300 rounded-md hover:bg-slate-800 mx-1" href="#">3</a>
              <span className="text-sm font-medium flex size-10 items-center justify-center text-slate-400 mx-1">...</span>
              <a className="text-sm font-medium flex size-10 items-center justify-center text-slate-300 rounded-md hover:bg-slate-800 mx-1" href="#">10</a>
              <a aria-label="Next page" className="flex size-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800" href="#">
                <svg fill="currentColor" height="18px" viewBox="0 0 256 256" width="18px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


