import { motion } from 'motion/react';

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E0E0E]">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-[#8B0000]"
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
        <motion.p
          className="text-[#E8DCCB] tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          LOADING
        </motion.p>
      </div>
    </div>
  );
}
