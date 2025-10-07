import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface CtaBannerProps {
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function CtaBanner({
  title = "Ready to supercharge your journey?",
  description = "Join thousands of students leveling up with Engivora.",
  primaryAction = {
    label: "Get started",
    href: "/signup"
  },
  secondaryAction = {
    label: "Explore resources",
    href: "/blogs"
  }
}: CtaBannerProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl" />
          </div>

          {/* Main Content */}
          <div className="relative rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-teal-600 p-8 md:p-12 text-white shadow-2xl shadow-sky-500/20 border border-sky-400/30 backdrop-blur-sm">
            {/* Grid Layout */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="space-y-4">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
                >
                  {title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-sky-100/90 leading-relaxed max-w-xl"
                >
                  {description}
                </motion.p>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 justify-start lg:justify-end"
              >
                {/* Primary Button */}
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={primaryAction.href}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-sky-700 font-semibold px-8 py-4 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200 min-w-[160px]"
                >
                  <span>{primaryAction.label}</span>
                  <ArrowRightIcon className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </motion.a>

                {/* Secondary Button */}
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={secondaryAction.href}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-white font-semibold px-8 py-4 hover:bg-white/15 hover:ring-white/30 transition-all duration-200 min-w-[160px]"
                >
                  <span>{secondaryAction.label}</span>
                </motion.a>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-3xl rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-bl-3xl rounded-tr-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
