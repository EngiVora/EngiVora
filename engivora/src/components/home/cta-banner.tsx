import Link from "next/link";
import { motion } from "framer-motion";

export function CtaBanner() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="rounded-3xl bg-gradient-to-r from-sky-900/30 to-purple-900/30 p-12 text-white border border-sky-800/50 backdrop-blur-sm shadow-2xl hover:from-sky-900/40 hover:to-purple-900/40 transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to Supercharge Your Journey?
              </h3>
              <p className="text-sky-100 text-lg max-w-2xl">
                Join thousands of students leveling up with EngiVora. Start your journey today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-4 transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/30"
              >
                Get Started
              </Link>
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 border border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Explore Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}