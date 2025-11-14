import Image from "next/image"

export function TrustedLogos() {
  const logos = [
    { name: "Next.js", src: "/next.svg" },
    { name: "Vercel", src: "/vercel.svg" },
    { name: "Globe", src: "/globe.svg" },
    { name: "Window", src: "/window.svg" },
  ]
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-6 opacity-80">
            {logos.map((l) => (
              <div key={l.name} className="flex justify-center">
                <Image src={l.src} alt={l.name} className="h-8" width={32} height={32} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}