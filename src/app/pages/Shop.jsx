import { useState, useEffect } from 'react';
import { motion } from 'motion/react';          // ← correction importante
import { getProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';
import { toast } from 'sonner';

export function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      toast.error('Impossible de charger les produits', {
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

  // Helper : trouve la première image disponible (variant default ou premier variant)
  const getMainImage = (product) => {
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    return defaultVariant?.images?.[0] || null;
  };

  // Helper : prix à afficher (basePrice ou prix du variant default)
  const getDisplayPrice = (product) => {
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    return defaultVariant?.price || product.basePrice || 0;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-[#0E0E0E]">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl tracking-wider uppercase text-[#E8DCCB] mb-4">
            SHOP COLLECTION
          </h1>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto mb-6" />
          <p className="text-[#8B7355] tracking-wider text-lg">
            Pièces streetwear premium. Quantités limitées.
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product._id}           // ← correction : _id existe
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard
                  product={{
                    ...product,
                    // On enrichit un peu pour faciliter le travail dans ProductCard
                    mainImage: getMainImage(product),
                    displayPrice: getDisplayPrice(product),
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-3xl text-[#8B7355] tracking-widest uppercase font-light">
              Aucun produit disponible pour le moment
            </p>
            <p className="mt-4 text-[#E8DCCB]/70">
              Revenez bientôt — de nouvelles pièces arrivent !
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}