// ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
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
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);

        if (data.optionTypes?.length) {
          const initial = {};
          data.optionTypes.forEach((opt) => {
            initial[opt.name] = opt.values[0];
          });
          setSelectedAttributes(initial);
        }
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Current variant
  const currentVariant = product?.variants?.find((variant) =>
    product.optionTypes?.every(
      (opt) => variant.attributes[opt.name] === selectedAttributes[opt.name]
    )
  );

  // Smart change: when user picks a new value, auto-adjust other options to valid combination
  const handleAttributeChange = (optionName, newValue) => {
    const newAttrs = { ...selectedAttributes, [optionName]: newValue };

    // Auto-fix other options to make sure combination exists
    product.optionTypes.forEach((opt) => {
      if (opt.name === optionName) return;

      const possibleValues = product.variants
        .filter((v) => {
          const temp = { ...newAttrs, [opt.name]: v.attributes[opt.name] };
          return product.optionTypes.every(
            (o) => v.attributes[o.name] === temp[o.name]
          );
        })
        .map((v) => v.attributes[opt.name]);

      if (possibleValues.length > 0 && !possibleValues.includes(newAttrs[opt.name])) {
        newAttrs[opt.name] = possibleValues[0]; // take first available
      }
    });

    setSelectedAttributes(newAttrs);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleBuyNow = () => {
    if (!currentVariant || (currentVariant.stock || 0) <= 0) {
      toast.error('Cette variante est épuisée');
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const isOutOfStock = !currentVariant || (currentVariant.stock || 0) <= 0;
  const currentImage =
    currentVariant?.images?.[0] ||
    product.variants?.[0]?.images?.[0] ||
    '/placeholder.png';

  const variantDisplayName = Object.values(selectedAttributes)
    .filter(Boolean)
    .join(' - ');

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-[#0E0E0E]">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <motion.button
          className="flex items-center gap-2 text-[#E8DCCB] hover:text-[#8B0000] mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          <span className="tracking-wider uppercase">Retour</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <motion.div
            className="relative aspect-square bg-[#1A1A1A] overflow-hidden rounded-3xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img
              src={currentImage}
              alt={`${product.name} - ${variantDisplayName}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = '/placeholder.png')}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div>
              <h1 className="text-4xl md:text-6xl tracking-wider uppercase text-[#E8DCCB] mb-4">
                {product.name}
              </h1>
              <div className="w-20 h-1 bg-[#8B0000] mb-6" />

              <p className="text-4xl text-[#8B0000] font-bold mb-2">
                {currentVariant ? currentVariant.price.toLocaleString() : '—'} DZD
              </p>

              <p className={`text-lg mb-6 ${isOutOfStock ? 'text-red-500' : 'text-[#8B7355]'}`}>
                {isOutOfStock ? '⚠️ Épuisé' : `${currentVariant?.stock || 0} en stock`}
              </p>

              <p className="text-[#8B7355] leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Options */}
            {product.optionTypes?.length > 0 && (
              <div className="space-y-7">
                {product.optionTypes.map((option) => (
                  <div key={option.name}>
                    <label className="block text-[#E8DCCB] tracking-wider uppercase mb-3 text-sm">
                      {option.displayName}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {option.values.map((value) => {
                        const isAvailable = product.variants.some(
                          (v) =>
                            v.attributes[option.name] === value &&
                            product.optionTypes.every(
                              (opt) =>
                                v.attributes[opt.name] ===
                                (opt.name === option.name ? value : selectedAttributes[opt.name])
                            )
                        );

                        return (
                          <motion.button
                            key={value}
                            onClick={() => handleAttributeChange(option.name, value)}
                            className={`px-6 py-3 border-2 tracking-wide transition-all rounded-full ${
                              selectedAttributes[option.name] === value
                                ? 'bg-[#8B0000] border-[#8B0000] text-white'
                                : isAvailable
                                ? 'border-[#E8DCCB]/40 text-[#E8DCCB] hover:border-[#8B0000]'
                                : 'border-[#E8DCCB]/10 text-[#8B7355] cursor-not-allowed opacity-50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {value}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-[#E8DCCB] tracking-wider uppercase mb-3">Quantité</label>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-12 h-12 border-2 border-[#E8DCCB]/20 text-[#E8DCCB] hover:border-[#8B0000] flex items-center justify-center rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={20} />
                </motion.button>

                <span className="text-3xl text-[#E8DCCB] w-16 text-center font-medium">
                  {quantity}
                </span>

                <motion.button
                  onClick={() => handleQuantityChange(1)}
                  className="w-12 h-12 border-2 border-[#E8DCCB]/20 text-[#E8DCCB] hover:border-[#8B0000] flex items-center justify-center rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={20} />
                </motion.button>
              </div>
            </div>

            {/* Buy Button */}
            <motion.button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full bg-[#8B0000] hover:bg-[#6B0000] text-[#E8DCCB] py-6 text-xl tracking-widest uppercase rounded-2xl disabled:opacity-50"
              whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
              whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
            >
              {isOutOfStock ? 'ÉPUISÉ - INDISPONIBLE' : 'COMMANDER MAINTENANT'}
            </motion.button>

            {/* Delivery Info */}
            {/* <div className="bg-[#1A1A1A] border border-[#E8DCCB]/10 p-6 rounded-2xl space-y-3 text-[#E8DCCB]">
              <p className="flex items-center gap-3"><span className="text-[#8B0000]">✓</span> Livraison 24h-48h</p>
              <p className="flex items-center gap-3"><span className="text-[#8B0000]">✓</span> Paiement à la livraison</p>
              <p className="flex items-center gap-3"><span className="text-[#8B0000]">✓</span> Toute l’Algérie</p>
            </div> */}
          </motion.div>
        </div>
      </div>

      {/* ORDER MODAL - now receives live quantity */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        selectedVariant={currentVariant}
        initialQuantity={quantity}   // ← now live and synced
      />
    </div>
  );
}