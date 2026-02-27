import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-8xl md:text-9xl tracking-wider uppercase text-[#8B0000] mb-4">
          404
        </h1>
        <p className="text-2xl md:text-3xl tracking-widest uppercase text-[#E8DCCB] mb-8">
          PAGE NOT FOUND
        </p>
        <motion.button
          className="px-12 py-4 bg-[#8B0000] text-[#E8DCCB] tracking-widest uppercase hover:bg-[#6B0000] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          GO HOME
        </motion.button>
      </motion.div>
    </div>
  );
}
