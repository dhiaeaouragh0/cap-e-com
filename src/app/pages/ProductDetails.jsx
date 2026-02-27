// ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';           // ← fixed import (was motion/react → wrong)
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { getProductById } from '../services/api';
import { OrderModal } from '../components/OrderModal';
import { Loader } from '../components/Loader';
import { toast } from 'sonner';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);

      // Auto-select first available variant (usually the default one)
      const defaultVariant = data.variants?.find(v => v.isDefault) || data.variants?.[0];
      if (defaultVariant) {
        setSelectedVariant(defaultVariant);
      }
    } catch (error) {
      toast.error('Failed to load product', {
        style: { background: '#1A1A1A', color: '#E8DCCB', border: '1px solid #8B0000' },
      });
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant', {
        style: { background: '#1A1A1A', color: '#E8DCCB', border: '1px solid #8B0000' },
      });
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) return <Loader />;
  if (!product || !selectedVariant) return null;

  const currentImage =
  selectedVariant?.images?.[0] ||
  product.variants?.find(v => v.isDefault)?.images?.[0] ||
  product.variants?.[0]?.images?.[0] ||
  '/placeholder.png';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8">
      <div className="container mx-auto">
        {/* Back */}
        <motion.button
          className="flex items-center gap-2 text-[#E8DCCB] hover:text-[#8B0000] mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          <span className="tracking-wider uppercase">Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <motion.div
            className="relative aspect-square bg-[#1A1A1A] overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={currentImage}
              alt={`${product.name} - ${selectedVariant?.name || ''}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder.png'; // fallback if even the default fails
                e.target.onerror = null; // prevent infinite loop
              }}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1 className="text-3xl md:text-5xl tracking-wider uppercase text-[#E8DCCB] mb-4">
                {product.name}
              </h1>
              <div className="w-16 h-1 bg-[#8B0000] mb-6" />
              <p className="text-3xl text-[#8B0000] mb-6">
                {selectedVariant.price.toLocaleString()} DZD
              </p>
              <p className="text-[#8B7355] leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Variant Selection (color / version) */}
            {product.variants?.length > 1 && (
              <div>
                <label className="block text-[#E8DCCB] tracking-wider uppercase mb-3">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <motion.button
                      key={variant.sku}
                      className={`px-5 py-2.5 border-2 tracking-wide transition-colors ${
                        selectedVariant.sku === variant.sku
                          ? 'bg-[#8B0000] border-[#8B0000] text-[#E8DCCB]'
                          : 'border-[#E8DCCB]/30 text-[#E8DCCB] hover:border-[#8B0000]'
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {variant.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-[#E8DCCB] tracking-wider uppercase mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <motion.button
                  className="w-12 h-12 border-2 border-[#E8DCCB]/20 text-[#E8DCCB] hover:border-[#8B0000] hover:text-[#8B0000] transition-colors flex items-center justify-center"
                  onClick={() => handleQuantityChange(-1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minus size={20} />
                </motion.button>
                <span className="text-2xl text-[#E8DCCB] w-12 text-center">
                  {quantity}
                </span>
                <motion.button
                  className="w-12 h-12 border-2 border-[#E8DCCB]/20 text-[#E8DCCB] hover:border-[#8B0000] hover:text-[#8B0000] transition-colors flex items-center justify-center"
                  onClick={() => handleQuantityChange(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                </motion.button>
              </div>
            </div>

            <motion.button
              className="w-full bg-[#8B0000] text-[#E8DCCB] py-5 tracking-widest uppercase text-lg hover:bg-[#6B0000] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
            >
              BUY NOW
            </motion.button>

            {/* Delivery info */}
            <div className="bg-[#1A1A1A] border border-[#E8DCCB]/10 p-6 space-y-2">
              <p className="text-[#E8DCCB] flex items-center gap-2">
                <span className="text-[#8B0000]">✓</span> Livraison 48h – 24h
              </p>
              <p className="text-[#E8DCCB] flex items-center gap-2">
                <span className="text-[#8B0000]">✓</span> Paiement à la livraison
              </p>
              <p className="text-[#E8DCCB] flex items-center gap-2">
                <span className="text-[#8B0000]">✓</span> Livraison dans toute l'Algérie
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        selectedVariant={selectedVariant}           // ← changed prop name
        initialQuantity={quantity}
      />
    </div>
  );
}