// OrderModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createOrder } from '../services/api';
import { getWillaya } from '../services/api';
import { toast } from 'sonner';

export function OrderModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
  initialQuantity = 1,
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    wilaya: '',
    address: '',
    deliveryType: 'domicile',
    note: '',
    quantity: 1,
  });

  const [wilayas, setWilayas] = useState([]);
  const [wilayasLoading, setWilayasLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 FIX: Sync quantity every time modal opens or quantity changes in ProductDetails
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        quantity: initialQuantity,
      }));
    }
  }, [isOpen, initialQuantity]);

  // Fetch wilayas
  useEffect(() => {
    if (!isOpen) return;

    const fetchWilayas = async () => {
      try {
        const data = await getWillaya();
        const formatted = Array.isArray(data)
          ? data.map(item =>
              typeof item === 'string'
                ? { nom: item, prixDomicile: 350, prixAgence: 250 }
                : item
            )
          : [];
        setWilayas(formatted.sort((a, b) => a.nom.localeCompare(b.nom)));
      } catch (err) {
        toast.error('Impossible de charger les wilayas');
        setWilayas([
          { nom: 'Alger', prixDomicile: 350, prixAgence: 250 },
          { nom: 'Oran', prixDomicile: 400, prixAgence: 300 },
        ]);
      } finally {
        setWilayasLoading(false);
      }
    };

    fetchWilayas();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getShippingCost = () => {
    if (!formData.wilaya) return 0;
    const wilayaData = wilayas.find(w => w.nom === formData.wilaya);
    if (!wilayaData) return 0;

    return formData.deliveryType === 'domicile'
      ? (wilayaData.prixDomicile || 350)
      : (wilayaData.prixAgence || 250);
  };

  const productPrice = (selectedVariant?.price || 0) * formData.quantity;
  const shippingCost = getShippingCost();
  const total = productPrice + shippingCost;

  const isOutOfStock = !selectedVariant || (selectedVariant.stock || 0) <= 0;

  const variantDisplay = selectedVariant?.attributes
    ? Object.values(selectedVariant.attributes).join(' - ')
    : selectedVariant?.sku || '—';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    setIsSubmitting(true);

    try {
      const orderData = {
        productId: product._id,
        variantSku: selectedVariant.sku,
        quantity: Number(formData.quantity),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        wilaya: formData.wilaya,
        deliveryType: formData.deliveryType,
        address: formData.address,
        note: formData.note.trim() || undefined,
      };

      await createOrder(orderData);

      toast.success('Commande enregistrée avec succès ! Nous vous contacterons très bientôt.', {
        duration: 7000,
      });

      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        wilaya: '',
        address: '',
        deliveryType: 'domicile',
        note: '',
        quantity: 1,
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Échec de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="bg-[#1A1A1A] border border-[#E8DCCB]/20 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#E8DCCB]/10 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl tracking-widest uppercase text-[#E8DCCB]">
                  FINALISER LA COMMANDE
                </h2>
                <button onClick={onClose} className="text-[#E8DCCB] hover:text-[#8B0000]">
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Summary */}
                <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#E8DCCB]/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium text-[#E8DCCB]">{product.name}</h3>
                      <p className="text-[#8B7355] text-sm mt-1">
                        Variante : <span className="text-[#E8DCCB]">{variantDisplay}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#8B0000]">
                        {selectedVariant?.price?.toLocaleString()} DZD
                      </p>
                      <p className="text-sm text-[#E8DCCB]/70">
                        Qté : {formData.quantity}
                      </p>
                    </div>
                  </div>
                  {isOutOfStock && (
                    <p className="text-red-500 text-sm mt-3 font-medium">⚠️ Cette variante est épuisée</p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#E8DCCB] text-sm tracking-wider uppercase mb-1.5">Nom complet *</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] rounded-lg"
                        placeholder="Dhiaeddine Aouragh"
                      />
                    </div>
                    <div>
                      <label className="block text-[#E8DCCB] text-sm tracking-wider uppercase mb-1.5">Téléphone *</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        required
                        pattern="0[5-7][0-9]{8}"
                        className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] rounded-lg"
                        placeholder="0770123456"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[#E8DCCB] text-sm tracking-wider uppercase mb-1.5">Email (optionnel)</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] rounded-lg"
                    />
                  </div>

                  {/* Wilaya + Delivery Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#E8DCCB] text-sm tracking-wider uppercase mb-1.5">Wilaya *</label>
                      {wilayasLoading ? (
                        <div className="text-[#8B7355]">Chargement des wilayas...</div>
                      ) : (
                        <select
                          name="wilaya"
                          value={formData.wilaya}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] rounded-lg"
                        >
                          <option value="">Choisissez votre wilaya</option>
                          {wilayas.map((w) => (
                            <option key={w.nom} value={w.nom}>
                              {w.nom}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#E8DCCB] text-sm tracking-wider uppercase mb-1.5">Type de livraison *</label>
                      <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] rounded-lg"
                      >
                        <option value="domicile">À domicile </option>
                        <option value="agence">Agence </option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[#E8DCCB] text-sm tracking-wider uppercase mb-1.5">Adresse complète *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] rounded-lg resize-none"
                      placeholder="Cité 2000 Logts, Bloc C, Apt 12..."
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-[#E8DCCB] text-sm tracking-wider uppercase mb-1.5">Note / Instructions (optionnel)</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] rounded-lg resize-none"
                    />
                  </div>

                  {/* Quantity + Total */}
                  <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#E8DCCB]/10">
                    <div className="flex justify-between items-center text-xl">
                      <div className="text-[#E8DCCB]">Total à payer</div>
                      <div className="font-bold text-[#8B0000] text-3xl">
                        {total.toLocaleString()} DZD
                      </div>
                    </div>
                    <p className="text-xs text-[#8B7355] mt-1">
                      Produit : {productPrice.toLocaleString()} DZD + Livraison : {shippingCost} DZD
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isOutOfStock}
                    className="w-full bg-[#8B0000] hover:bg-[#6B0000] text-[#E8DCCB] py-5 tracking-widest uppercase text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting
                      ? 'ENVOI DE LA COMMANDE...'
                      : isOutOfStock
                      ? 'ÉPUISÉ - INDISPONIBLE'
                      : 'CONFIRMER LA COMMANDE'}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}