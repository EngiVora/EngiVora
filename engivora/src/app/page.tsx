export default function HomePage() {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* Hero */}
      <section className="relative min-h-[600px] overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block">Your Engineering Journey,</span>
              <span className="block text-blue-600">Simplified & Supercharged.</span>
            </h2>
            <p className="mt-6 text-xl text-gray-500">Stay ahead with the latest updates, resources, and opportunities tailored for engineering students. Your central hub for success is here.</p>
          </div>
          <div className="mt-12 flex justify-center gap-4">
            <a href="#" className="flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105">Get Started Now</a>
            <a href="#" className="flex items-center justify-center rounded-full bg-blue-100 px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-transform hover:scale-105">Explore Features</a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-blue-600 py-4 overflow-hidden">
          <div className="ticker flex whitespace-nowrap">
            <div className="inline-flex items-center gap-12">
              <span className="text-white font-medium text-lg flex items-center gap-2">NEW: GATE 2025 Registration Open</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">Internship at TechCorp | Deadline: 25th Dec</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">50% OFF on Engineering Textbooks</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">Webinar: AI in Modern Engineering</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">NEW: GATE 2025 Registration Open</span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">Internship at TechCorp | Deadline: 25th Dec</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold tracking-tight">Explore Engivora&apos;s Features</h3>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">Everything you need in one place. From exam schedules to career opportunities, we&apos;ve got you covered.</p>
          </div>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto scroll-container snap-x snap-mandatory">
            <div className="min-w-[280px] sm:min-w-[320px] snap-start bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col p-8 items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16m0 0h12"></path><path d="M12 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6v12Z"></path><path d="M9 14h.01"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-2 text-gray-900">Exam Updates</h4>
              <p className="text-base text-gray-500 mb-6 flex-grow">Never miss a deadline. Get timely notifications for all major engineering exams.</p>
              <a href="#" className="mt-auto inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-orange-600 hover:scale-105">See Updates →</a>
            </div>
            <div className="min-w-[280px] sm:min-w-[320px] snap-start bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col p-8 items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
              </div>
              <h4 className="text-2xl font-bold mb-2 text-gray-900">Jobs & Internships</h4>
              <p className="text-base text-gray-500 mb-6 flex-grow">Discover curated job postings and internship opportunities from top companies.</p>
              <a href="#" className="mt-auto inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-orange-600 hover:scale-105">Find Opportunities →</a>
            </div>
            <div className="min-w-[280px] sm:min-w-[320px] snap-start bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col p-8 items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-2 text-gray-900">Blogs</h4>
              <p className="text-base text-gray-500 mb-6 flex-grow">Gain insights from articles on cutting-edge tech, career advice, and student life.</p>
              <a href="#" className="mt-auto inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-orange-600 hover:scale-105">Read Articles →</a>
            </div>
            <div className="min-w-[280px] sm:min-w-[320px] snap-start bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col p-8 items-center text-center md:col-start-1 lg:col-start-auto">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-2 text-gray-900">Discounts</h4>
              <p className="text-base text-gray-500 mb-6 flex-grow">Access exclusive deals on textbooks, software, and tools for students.</p>
              <a href="#" className="mt-auto inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-orange-600 hover:scale-105">Get Deals →</a>
            </div>
            <div className="min-w-[280px] sm:min-w-[320px] snap-start bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col p-8 items-center text-center text-white md:col-span-2 lg:col-span-1">
              <div className="p-4 bg-white/20 rounded-full mb-4">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3.19a2 2 0 0 1 1.74.85l.23.33a2 2 0 0 0 1.74.82h3.18a2 2 0 0 0 1.74-.85l.23-.33a2 2 0 0 1 1.74-.82H21a2 2 0 0 1 2 2v3Z"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-2">Work Hub</h4>
              <p className="text-base text-blue-200 mb-6 flex-grow">Collaborate on projects, share resources, and connect with fellow students in a dedicated workspace.</p>
              <a href="#" className="mt-auto inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105">Enter the Hub →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold tracking-tight">Featured Student Projects</h3>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Innovative projects by students from the Engivora community.</p>
          </div>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto scroll-container snap-x snap-mandatory">
            <div className="min-w-[300px] sm:min-w-[360px] snap-start group bg-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnR5149ogfRz9XoH3RgFUBoS9BSGmYHb7N4h1QHiit2Nu3G9kTMKZ0oDA5rOOU-B4Qcoqnp6mB7M-1a1yuyGkuEnzmIopoMAWPisRR2Jyc2yymh14oUN31C1BBphQH9Ln6ACCD873084IBoZMo4tYxjVISbxGKEV4-AcZsFsLIwkTtZvOB60mi009wRwhL9yff4l1m9cHgY17fzLO6r2bMs3fZdRkeU9NJuj9OIft2Jlw21JCu5lF9P_U3vSy_ltL0co6NM-FoOKE")' }} />
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Autonomous Delivery Drone</h4>
                <p className="text-sm text-gray-500 mb-4">A project focusing on last-mile delivery solutions using UAV technology.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" alt="User 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKy98BJ3cuGx1oy66YdbeEAxCHrmSR4YIqAzVMrKKS-beYo-9iOU0yDPFi7Uf9rEiDtjmS0KpYDHZ-YZljqzYNOmhU0eYRhfoK8Yk4ZfBuVuDNWWYXCXo9ucw2ADv60iJqr8PmoqR47xbePk7ElG5bZ0BY0ZvUk602tEZT_eMpCNEKnMls3EV8Hgs5HgzrWhBYRxCXPMh8jQD4T_mJZD1jM0z0axYylVGYf_CZq_uU8etDguQBmdImnzNGJ5_x_Kf4F0A3EsmKQwI" />
                    <span className="text-xs font-semibold text-gray-500 pl-3">+2 collaborators</span>
                  </div>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">View Project →</a>
                </div>
              </div>
            </div>
            <div className="min-w-[300px] sm:min-w-[360px] snap-start group bg-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGMXDZmCjWAOonAwr2CyYxECjo9ximUpBKGUyGqk-FcnFtPWt2DrbvPnDdCvhSnF6TY-v_ivArvqsxJbirTPU4EKEnMYaCys1f1cVreobX7G4A5XTT7Uo1Ld5JWaOp0lLup-qJsaUb5lgzMeHzo5zM2JsHH1TExF-tZDgN-5zdP3S-C9W0DW1Az3e84MBf7Z5L3Wjp_IwHMZi43aOD1wnR73-TAr19SUjfKA_0Rnme5r9JRVT7Wr39AJXkhbDFDM_uYDceL5QJV330")' }} />
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Smart Water Management System</h4>
                <p className="text-sm text-gray-500 mb-4">An IoT-based system for efficient water usage monitoring and control.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" alt="User 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw9Sv26xx40qYzxO0PBnnfSqxATa6weI2j--83ogHQN_lBu9RjLfiP8dTv3VlCFuj3oqTVuRt9EjKLfUfhx5uZYf_tL3TV34CkY-ZSiGOMl-OyN3y-PJTZjumqDWzyIAbszYmWTCasm_Mf0kDTTnDPUnh5YAU7Y70g7cC34xaJXUY8474hYsLQpbpmQOoiTMaFNcafQYilp6W83rp7hXLFuDyJJ9DGxrieA5tvN-2ViiK0fFH7vnPMf-J5zgK_iwfgW3zJPKo06es" />
                  </div>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">View Project →</a>
                </div>
              </div>
            </div>
            <div className="min-w-[300px] sm:min-w-[360px] snap-start group bg-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center">
              <a href="#" className="text-center p-6">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-600 text-white mx-auto mb-4">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 20v-6m0-6V8m0-6v.01"></path><path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M20 12h-6m-6 0H8m-6 0h-.01"></path><path d="M8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M16 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path></svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-blue-600">Submit Your Project</h4>
                <p className="text-sm text-blue-700">Get your work featured and recognized by the community.</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <div className="text-left">
                <h3 className="text-4xl font-extrabold tracking-tight">Upcoming Events</h3>
                <p className="mt-4 text-lg text-gray-500">Don&apos;t miss out on these workshops, webinars, and competitions.</p>
                <a href="#" className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-100 px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-transform hover:scale-105">View All Events</a>
              </div>
            </div>
            <div className="lg:col-span-2 flex sm:grid sm:grid-cols-2 gap-6 sm:gap-8 overflow-x-auto scroll-container snap-x snap-mandatory">
              {[
                { day: "15", mon: "JAN", tag: "Webinar", title: "Intro to Quantum Computing", tagBg: "bg-green-100 text-green-800" },
                { day: "22", mon: "JAN", tag: "Workshop", title: "Robotics & Automation", tagBg: "bg-yellow-100 text-yellow-800" },
                { day: "05", mon: "FEB", tag: "Competition", title: "National Hackathon 2025", tagBg: "bg-red-100 text-red-800" },
                { day: "18", mon: "FEB", tag: "Meetup", title: "Alumni Networking Night", tagBg: "bg-purple-100 text-purple-800" },
              ].map((e, i) => (
                <div key={i} className="min-w-[280px] sm:min-w-0 snap-start bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg">
                        <span className="text-3xl font-bold">{e.day}</span>
                        <span className="text-xs font-semibold">{e.mon}</span>
                      </div>
                      <div>
                        <span className={`inline-block ${e.tagBg} text-xs font-semibold px-3 py-1 rounded-full mb-2`}>{e.tag}</span>
                        <h4 className="font-bold text-gray-900">{e.title}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Poll */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Quick Poll</h3>
                <p className="mt-4 text-lg text-blue-200">Help us understand you better! Your opinion matters.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-4">What&apos;s your biggest challenge as an engineering student?</h4>
                <form className="space-y-4">
                  {[
                    "Time Management",
                    "Tough Coursework",
                    "Finding Internships",
                    "Other",
                  ].map((label) => (
                    <label key={label} className="flex items-center p-4 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer transition-colors">
                      <input type="radio" name="poll" className="h-5 w-5 text-emerald-500 border-transparent rounded-full focus:ring-2 focus:ring-emerald-500" />
                      <span className="ml-4 font-medium">{label}</span>
                    </label>
                  ))}
                  <button type="submit" className="w-full flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 mt-6">Vote</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
