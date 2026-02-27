import { motion } from 'motion/react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0E0E0E] border-t border-[#E8DCCB]/10 py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl tracking-wider uppercase text-[#E8DCCB] mb-4">
              STREETWEAR
            </h3>
            <p className="text-[#8B7355] leading-relaxed">
              Premium streetwear collection. Limited drops. Own the street.
            </p>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="tracking-widest uppercase text-[#E8DCCB] mb-4">
              LIVRAISON
            </h4>
            <ul className="space-y-2 text-[#8B7355]">
              <li>Livraison 48h – 24h</li>
              <li>Paiement à la livraison</li>
              <li>Livraison dans toute l'Algérie</li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="tracking-widest uppercase text-[#E8DCCB] mb-4">
              SUIVEZ-NOUS
            </h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center border border-[#E8DCCB]/20 text-[#E8DCCB] hover:bg-[#8B0000] hover:border-[#8B0000] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-[#E8DCCB]/10 text-center text-[#8B7355]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="tracking-wider">
            © {currentYear} STREETWEAR. ALL RIGHTS RESERVED.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
