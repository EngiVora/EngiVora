import type { Metadata } from "next"
import Image from "next/image"
import React from "react"

export const metadata: Metadata = {
  title: "Engivora - Blogs",
  description: "Insights and articles for engineering students: trends, guides, and tips.",
}

export default function BlogsPage() {
  return (
    <div className="bg-sky-50">
      <main className="px-6 sm:px-10 lg:px-24 xl:px-40 flex-1 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-blue-900 text-4xl font-bold leading-tight tracking-tighter mb-2">Engivora Blogs</h2>
            <p className="text-blue-400 text-lg leading-relaxed">Stay updated with the latest insights and articles for engineering students.</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-12 lg:col-span-8 space-y-8">
              <h3 className="text-blue-900 text-2xl font-bold leading-tight tracking-tighter mb-4">Featured Articles</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <article className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="w-full h-48 overflow-hidden relative">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo"
                      alt="The Future of Engineering"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-blue-900 text-lg font-bold leading-tight mb-2 group-hover:text-blue-600 transition-colors">The Future of Engineering: Trends and Innovations</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">Explore the emerging trends and innovations shaping the future of engineering, from AI and robotics to sustainable technologies.</p>
                    <a className="inline-flex items-center font-bold text-blue-600 text-sm group-hover:underline" href="#">Read More <span className="ml-1">→</span></a>
                  </div>
                </article>

                <article className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="w-full h-48 overflow-hidden relative">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx8jPX4p2Z0x0TOI7gGFRTZsMD4gY2PdsUyCPRyQrlqW-wwDmKMkIlRM-H_pXaKn_A3OJsabnVntUrVBiYEeunowE99LUUeuIJMW1p3v6fN34WEkLXHYWSAeZFiTBdlx802s2NuZdVuw54lGYJTtdS6nr9zBn_ZF_w4osZgbgnqHR2PP8eolniIDMuHrDTI810fbHHFp7jdMl0k0MbZ9JwGE0mLGO4WgQUPOgMRSAXWwX3Bd_ndeoJFr0yuH8-k5veNPjAIX04ork"
                      alt="Mastering Engineering Interviews"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-blue-900 text-lg font-bold leading-tight mb-2 group-hover:text-blue-600 transition-colors">Mastering Engineering Interviews: Tips and Strategies</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">Ace your engineering interviews with expert tips and strategies, including common questions, preparation techniques, and follow-up advice.</p>
                    <a className="inline-flex items-center font-bold text-blue-600 text-sm group-hover:underline" href="#">Read More <span className="ml-1">→</span></a>
                  </div>
                </article>
              </div>

              <div className="mt-12">
                <h3 className="text-blue-900 text-2xl font-bold leading-tight tracking-tighter mb-4">Latest Posts</h3>
                <div className="space-y-6">
                  <article className="flex items-center gap-6 group bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="w-1/4 overflow-hidden rounded-md">
                      <div className="w-full aspect-square overflow-hidden relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC89Jwy3WaNxRBUQGonAzRjURd0j_lrh6coI5TuaTU_HfbJs3Rryhcx5H4pCoPByXtwkSJa_SorEoCEq5QxvK6l_sMrz0Ctzge8WGVyodeYene5tUT_PEdGqu4bhm5-u_AopmRonSAhO6XSD3IpG9bM7EgKGPwBWMy8M5RIL5fcU97B7muy0L_hT-tw83iPLgNppYQtshmyfBV4w5cI9LkuYGcla_0syf1I8Ws4ToLAI2aLzO5T0NMPxNcqpqi44CbMvKVParWPVqA"
                          alt="Portfolio article thumbnail"
                          fill
                          sizes="(min-width: 1024px) 25vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-blue-900 text-lg font-bold leading-tight mb-1 group-hover:text-blue-600 transition-colors">Building Your Engineering Portfolio: Projects and Experiences</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">Learn how to build a strong engineering portfolio with impactful projects.</p>
                      <a className="inline-flex items-center font-bold text-blue-600 text-xs group-hover:underline" href="#">Read More <span className="ml-1">→</span></a>
                    </div>
                  </article>

                  <article className="flex items-center gap-6 group bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="w-1/4 overflow-hidden rounded-md">
                      <div className="w-full aspect-square overflow-hidden relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFEwnsAwPmVuqHMVjCt_O4AqmkzRSo2NhmC8Q5EJKJ6e9Vp24PDNUPjVsyp-ErxW7SmWHibCtbTLn4kHVSVsrmVJ3zFA0NIIup80Cv93q3w4Q0s_ZSNPPJfguUT0nvdN28vGT5iEflqNmQryrM724OaW1NTx8tj1QJMjHrRXLu98JOOHJNB8iYDmVqJF5M651Y7gKZ_ILQZfUmSTLUNe4UQLiRLgRyR8pGQgascxKHQDni-7iQBQRqu7aN-fZ7nmWbhxh60PKi-ss"
                          alt="Networking article thumbnail"
                          fill
                          sizes="(min-width: 1024px) 25vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-blue-900 text-lg font-bold leading-tight mb-1 group-hover:text-blue-600 transition-colors">The Importance of Networking in Engineering</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">Discover the significance of networking in the engineering field.</p>
                      <a className="inline-flex items-center font-bold text-blue-600 text-xs group-hover:underline" href="#">Read More <span className="ml-1">→</span></a>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            <aside className="col-span-12 lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-blue-900 text-xl font-bold mb-4">Top Authors</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 group">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-md shrink-0">
                        <div className="relative w-full h-full">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc"
                            alt="Dr. Anya Sharma"
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-blue-900 font-bold group-hover:text-blue-600 transition-colors">Dr. Anya Sharma</h4>
                        <p className="text-gray-500 text-sm">Sustainable Engineering</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-md shrink-0">
                        <div className="relative w-full h-full">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0vvKTNYw6JqrZIUX-5vsKMkrNYHedkd0oWVkwEmSN3dJcUUVRZzPIuTfETfeeV793L4tWpPjpxQyCIFXKrX55Tk3If1U1n5YKGoDpe_g3fZzpVpEkt8ew6EMvYJnIO-T8m8rVJLYM6x3dUKHt8Z9Dw6-OAD5owkRqLehipWsNX9qYlgy3CK7Hvk7_nVbgdysBv88xlCEIcQAOnp4xRY9Cdk-xqOyQHogGxy46i_YVwEJ9V9Z4Be0VCl2NaMyROiw8FB59NspvCZw"
                            alt="Ethan Carter"
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-blue-900 font-bold group-hover:text-blue-600 transition-colors">Ethan Carter</h4>
                        <p className="text-gray-500 text-sm">AI &amp; Machine Learning</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-blue-900 text-xl font-bold mb-4">Trending Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <a className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors" href="#">AI</a>
                    <a className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors" href="#">Robotics</a>
                    <a className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors" href="#">Sustainability</a>
                    <a className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors" href="#">Career</a>
                    <a className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors" href="#">Portfolio</a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-20 pt-12 border-t border-blue-100">
            <h2 className="text-blue-900 text-3xl font-bold leading-tight tracking-tighter mb-10 text-center">More from the Blog</h2>
            <div className="relative">
              <div className="flex overflow-x-auto space-x-8 pb-8">
                {[1, 2, 3, 4, 5].map((card) => (
                  <article key={card} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl">
                    <div className="w-full h-40 overflow-hidden relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJwQMRV7MxmvnZhYBZQoU4ct1bgtCsQxkoD5ldMS9VSVjPCL8GPdkd98XHyQN8rli_-BXAUVXkEQ_5xXeEDYDST7UGilJMH77Mvxs0VvxKZ7TzX2EJcMqSbF2nhQ1MPWPVKnLg4c6FaKvx4GE4QpaTM1Jsu7BNeckw5mROPkWAQFPLXtgpcdTHYDWWGcAJCTrcHKHLbTjlsLKOxjnIPmj399_zVzrDI3ve3ZKpNUwz0Gsdas8qOzfFNKv9qScH4Uz3lW9DuegVfL8"
                        alt="More blog thumbnail"
                        fill
                        sizes="(min-width: 1024px) 20vw, 80vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-blue-900 text-md font-bold leading-tight mb-2 group-hover:text-blue-600 transition-colors">Team Collaboration in Engineering Projects</h3>
                      <p className="text-gray-600 text-xs leading-relaxed mb-3">Tips for effective teamwork and communication.</p>
                      <a className="font-bold text-blue-600 text-xs group-hover:underline" href="#">Read More →</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


