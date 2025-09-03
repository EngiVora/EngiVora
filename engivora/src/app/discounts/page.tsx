import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Engivora - Discounts & Offers",
  description: "Exclusive deals, coupon codes, affiliate offers, and referrals for students.",
}

export default function DiscountsPage() {
  return (
    <div className="bg-blue-50 text-gray-800">
      <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl">Discounts &amp; Offers</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">Exclusive deals and savings for Engivora members.</p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Featured Offers</h2>
            <div className="relative">
              <div className="flex gap-8 overflow-x-auto pb-8">
                {[
                  {
                    title: "20% off on select courses",
                    desc: "Expand your knowledge with our top-rated engineering courses.",
                    cta: "View Offer",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLiK0joKD2l9p83OCFHkN8OZ2R6UGDOXMq3Cn1RHx43SYJwxFly10Pt9G5cKjw98PlQVegI7P8zgWH781_jyAhsT-x5pp8J4Z4fgsdPYbAZk_XgZo8N41plbHomLP4qkg3Z2cx_dQjfPxu_dlWLa-6H2TGBwp9ihIhI76s3vtkAOOEjWrI0phHZCwIqUK1AwvLpIv57gbi8NyAxUhH6mqQJJeqLH_UuFlF4YsPN3dJ4Zq9D8V-T_t5IzOHkawmoh6XaueSotbGnMg",
                  },
                  {
                    title: "Free access to premium resources",
                    desc: "Get unlimited access to our library of articles, papers, and more.",
                    cta: "Explore Now",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHizWWhTVHfQ_PKQEc7h4LnLtfVjPSXwcE7atFX1yzshoGImb55qmNPaghdGl-ZKe0KJbigYLx6SJGjmvgwBJfCw9LHT2RtJpcO53Rw3GlCi4lXg-T3BUYAo9RoiUGeMTIQE4HqAjZ2x2WHarIffoyqCBGvxlt0O1nU80Y0PeF-U32IHTGzjna9Sra01aAAMXrUlz1RfuemdGvmY-XkgqqIou7mFlvXf-XPXPFjEmZeCtiu9knLx3PO-8626mBrIgwGZpzQS34-G0",
                  },
                  {
                    title: "Exclusive discounts on lab equipment",
                    desc: "Gear up your lab with top-quality equipment at a lower price.",
                    cta: "Shop Deals",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH9v1fMfK3Bopk9alh_JmBLoxOpSzZYhKaSUEr6bSIRJUDKhAjzeOwdEzzGkZUNJsto9O0r62Zzb_23zDYd_kh6tKvgfYoBYC11aDjseWuvBNLvfOva4AANnpLwbu8TUXYvUzQ2wpQR4uuzPBQadpV72KWIkguL5vrfzpXSei9YGEYRC0NxaBwWMxjluFLrDyiRCD6-lI6kh-rFXv8-IoqqFPi2jFcBMlxMcePZcE1UL8SWOZyaIOv9dO8LI9Ay_b702OqoX2noSg",
                  },
                  {
                    title: "Student Software Pack",
                    desc: "Access essential engineering software for free.",
                    cta: "Download Now",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKkjl5tAIsUCq9RwMkFg75cwsVHfe0eFNBMW2XxMBz2RCK2ttp-CzMb8oUzzdfz9leO7XML7kmRvvpaujOmJ4RXPDaKsw2WiKE7gfgpP7iDaoN1eISCoycyg3Ih7pq7-24vYYK2YXsWyr3DLS2i0rzEj0rZePsAVcbV8IbnKMxIIPLFoU7QXYZQ7q8ACePJgGX_nDTlQKMEyqgJDhMmAZFidDG8xeTn1yOgo8c5i9maqOn8cSAVvrx7Ol1j8Hnj8O5kBcf6s_iMQs",
                  },
                ].map((offer, idx) => (
                  <div key={idx} className="group flex-shrink-0 w-80 flex flex-col rounded-lg overflow-hidden transition-shadow hover:shadow-xl bg-white shadow-md">
                    <div className="w-full h-48 relative overflow-hidden">
                      <Image src={offer.img} alt={offer.title} fill sizes="(min-width: 1024px) 20rem, 80vw" className="object-cover" />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{offer.title}</h3>
                      <p className="text-gray-500 text-sm mb-4">{offer.desc}</p>
                      <button aria-label={offer.cta} className="mt-auto w-full rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
                        <span>{offer.cta}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Coupon Codes</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "30% off on software tools",
                    code: "ENGIVORA30",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSXFqVNGTG5i1jc9ySQowsZKoFVV17YKO6oFm_7W9-bRj1fR6pVjr0nKG64EkWbTb_YFYsbIO3UvjFfUeKeUfFFasvBS_kb0t4Qmu7mExdT8OMoSuftUmr0Y2kh1VPksAmDjDwR8WHLRxbM1NWGtC0IFINwoVDwYKfST_Kzm9nCtRMjaTHkVKSwuY37XUkNTaVZTXOiIyYS58OJ2HZXuz7oVbR0hj5y7zz_OAyVxDQXRkCgzgwhs4gnY5rDW_cm58qZxBAIjXSfVg",
                  },
                  {
                    title: "15% off on textbooks",
                    code: "STUDY15",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW-gpxheo9XbMfNAWNRS78zRYbga9VbssQTiIEBpvOc-l8gkmLNqjyaYJDuP7JhVMhT-aC8L9DDxmQdhk1hS3MSIsC0RCUHaNyUJg8mFBObEO57vM8R-8p_uypAbeGVvNwnhjNISr5nmF78d71sJmoEZKBbPyHjV1ASTw18iLOcuB4muBJd8HhGugyYl4NImwi9X6Xlncz7s97Ls2aAeEt5BaYat_42ROyLcGWcX4JApsb3QS8_Za6WGkuOzH-qwqMnpnLplpYsHk",
                  },
                ].map((coupon, idx) => (
                  <div key={idx} className="flex items-center gap-6 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                    <div className="w-1/3 aspect-square rounded-md overflow-hidden relative">
                      <Image src={coupon.img} alt={coupon.title} fill sizes="(min-width: 1024px) 33vw, 80vw" className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center flex-1 gap-3">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{coupon.title}</p>
                        <p className="text-gray-500">Use code <span className="font-semibold text-blue-600">{coupon.code}</span></p>
                      </div>
                      <button aria-label={`Copy ${coupon.code}`} className="self-start rounded-md bg-blue-100 text-blue-700 px-4 py-2 text-sm font-semibold hover:bg-blue-200 transition-colors">
                        <span>Copy Code</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Affiliate Links</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Shop electronics with 10% cashback",
                    desc: "Click the link to activate your discount.",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpo3pfNYLNrFStJeXvHEXelM6GBJ3QdfzmcEY7NoY0Hk-xNOxEXkEylh5en4QIAfIqIaocZArxQqAdYtfMedXuLcoOutLx6yztXWUYLmDt7iqVRSyuHZ1F56EIyAlOzG0pT1QV5GP_tXEk6ys6424hu7VpLnU3CMIXiohmK26RrCl79pn5ur_dET1NH6QkTbYinKhA5N_MoF2jq1P1e3DE06u-Uu79atlxcK0SRY3zHKDI9acwirbhTZtO9XzNw2f-2KHCbj8anGc",
                  },
                  {
                    title: "Get 5% off on study materials",
                    desc: "Access the offer through our partner link.",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8QX9rvX50oz5GHUn0qv8v8Fry6Db2DqMcB03IX6v1phjPUs9_5PtWUPMC7t2lPsZsDj6HsV6-A-E-zXsHyZa-MYpPrpPbOcdWnYzXS5WMxHgMsoiS3r8s9MjyspZ6ECAdfWCTqxXX96Q1FKnkoaTXcoJ_N-P1LOVML-MUytlO3e6Byz1p4HmwofL9aU3ZGyYzxUvKDoqnl6XZPMV5dFttFerjEPYH0H1pVN37xlW3ZyjZ7-bvOlPPfrA494s6FTxu1ZLnj9ICUYs",
                  },
                ].map((aff, idx) => (
                  <div key={idx} className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative">
                        <Image src={aff.img} alt={aff.title} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{aff.title}</p>
                        <p className="text-gray-500 text-sm">{aff.desc}</p>
                      </div>
                      <a aria-label="Open affiliate link" href="#" className="self-center rounded-full bg-blue-600 p-3 text-white shadow-sm hover:bg-blue-700 transition-colors">
                        <svg className="feather feather-arrow-right" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 text-center">Referral Program</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-lg bg-white p-8 shadow-lg transition-shadow hover:shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="md:w-1/3 w-full rounded-lg shadow-md overflow-hidden relative aspect-video md:aspect-auto md:h-48">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwhFhgmjgHDJC9CSJvJZcJnhNcirAl2C70dlu_Ki5kJ5ErSXvnryTI6PaRtutcPjMOlSaUVp_ogZBTweS9s-NLI2L7MC3sY39SxMPRB6gjUuxVFmt8-Ei3UBZLXKFTpcRL7o2qAUbK5h3dn282NaUp1HnFgTQ3NoJrmJr5qrrYbEFM9qJv1ppKuCTU-R7gU4rr-R0r1W7M23jyQOSSJ-RnYEGsaJsS_J1f8o3H49Kusvp5zJO1hTP9-8Ru752YfM1iejo784DrR9M" alt="Referral Program" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center flex-1 gap-4 text-center md:text-left">
                <div>
                  <p className="text-2xl font-bold">Refer a friend and get a free course!</p>
                  <p className="opacity-90 mt-2">Share your referral link and earn rewards for every new member you bring to Engivora.</p>
                </div>
                <button aria-label="Get your referral link" className="self-center md:self-start rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 transition-colors">
                  <span>Get Your Referral Link</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


