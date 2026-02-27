import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function ProductCard({ product }) {
  const navigate = useNavigate();

  // 🔥 Get default variant
  const defaultVariant =
    product.variants?.find(v => v.isDefault) || product.variants?.[0];

  const image =
    defaultVariant?.images?.[0] ||
    "https://via.placeholder.com/500x500?text=No+Image";

  const price = defaultVariant?.price || product.basePrice || 0;

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/product/${product._id}`)} // ✅ use _id
    >
      <div className="relative overflow-hidden bg-[#1A1A1A] aspect-square mb-4">
        <motion.img
          src={image} // ✅ fixed
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-[#8B0000]/0 group-hover:bg-[#8B0000]/20 transition-colors duration-300" />
      </div>
      
      <div className="space-y-2">
        <h3 className="tracking-wider uppercase text-[#E8DCCB]">
          {product.name}
        </h3>

        <p className="text-[#8B7355] line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-2xl text-[#8B0000]">
            {price} DZD
          </p>

          <motion.button
            className="px-6 py-2 bg-[#8B0000] text-[#E8DCCB] tracking-widest uppercase hover:bg-[#6B0000] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product._id}`); // ✅ fixed
            }}
          >
            BUY NOW
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}