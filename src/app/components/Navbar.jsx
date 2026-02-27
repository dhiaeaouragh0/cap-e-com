import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Menu, X, ShoppingBag } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-sm border-b border-[#E8DCCB]/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag className="w-8 h-8 text-[#8B0000]" />
                <span className="text-2xl tracking-wider uppercase text-[#E8DCCB]">
                  STREETWEAR
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    className="relative text-[#E8DCCB] tracking-widest uppercase"
                    whileHover={{ color: '#8B0000' }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <motion.div
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#8B0000]"
                        layoutId="navbar-indicator"
                        initial={false}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#E8DCCB] z-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-30 bg-[#0E0E0E] md:hidden"
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : '100%',
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                className="text-4xl tracking-widest uppercase text-[#E8DCCB]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ color: '#8B0000', scale: 1.1 }}
              >
                {link.name}
                {isActive(link.path) && (
                  <div className="h-1 bg-[#8B0000] mt-2" />
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
}
