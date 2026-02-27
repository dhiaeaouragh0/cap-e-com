import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getProducts } from '../services/api';
import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';
import { toast } from 'sonner';

export function Home() {
  const navigate = useNavigate();
  const productsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(1, 6);

      setProducts(data.products);

    } catch (error) {
      toast.error('Failed to load products', {
        style: {
          background: '#1A1A1A',
          color: '#E8DCCB',
          border: '1px solid #8B0000',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E]/40 via-[#0E0E0E]/60 to-[#0E0E0E] z-10" />
          <img
            src="https://images.unsplash.com/photo-1635650805015-2fa50682873a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMHVyYmFuJTIwbW9kZWx8ZW58MXx8fHwxNzcyMTIyMzI3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Streetwear"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl tracking-wider uppercase text-[#E8DCCB] mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              OWN THE STREET
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl tracking-widest uppercase text-[#8B0000] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              LIMITED DROP
            </motion.p>

            <motion.button
              className="px-12 py-4 bg-[#8B0000] text-[#E8DCCB] tracking-widest uppercase text-lg hover:bg-[#6B0000] transition-colors"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToProducts}
            >
              SHOP NOW
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={scrollToProducts}
        >
          <ChevronDown className="text-[#E8DCCB]" size={40} />
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section ref={productsRef} className="py-20 md:py-32 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl tracking-wider uppercase text-[#E8DCCB] mb-4">
              FEATURED COLLECTION
            </h2>
            <div className="w-24 h-1 bg-[#8B0000] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12">
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              className="px-12 py-4 border-2 border-[#8B0000] text-[#E8DCCB] tracking-widest uppercase hover:bg-[#8B0000] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
            >
              VIEW ALL PRODUCTS
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Delivery Info Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'LIVRAISON RAPIDE', desc: '48h – 24h' },
              { title: 'PAIEMENT SÉCURISÉ', desc: 'À la livraison' },
              { title: 'LIVRAISON NATIONALE', desc: 'Toute l\'Algérie' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl tracking-widest uppercase text-[#E8DCCB] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#8B7355]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
