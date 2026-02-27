import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // fixed import
import { X } from 'lucide-react';
import { createOrder } from '../services/api';
import { toast } from 'sonner';
import { getWillaya } from '../services/api'; // ← import getWillaya for fetching wilayas

export function OrderModal({
  isOpen,
  onClose,
  product,
  selectedVariant,       // ← now using selectedVariant from ProductDetails
  initialQuantity = 1,
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    wilaya: '',
    address: '',
    deliveryType: 'domicile', // default
    note: '',
    quantity: initialQuantity,
  });

  const [wilayas, setWilayas] = useState([]);
  const [wilayasLoading, setWilayasLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch wilayas from your API
  useEffect(() => {
    if (isOpen) {
      const fetchWilayas = async () => {
        try {
          const data = await getWillaya(); // Using the custom getWillaya API function
          const list = Array.isArray(data)
            ? data.map(item => typeof item === 'string' ? item : item.name || item)
            : [];
          setWilayas(list.sort());
        } catch (err) {
          console.error(err);
          toast.error('Impossible de charger la liste des wilayas', {
            style: {
              background: '#1A1A1A',
              color: '#E8DCCB',
              border: '1px solid #8B0000',
            },
          });
          // Fallback to hardcoded minimal list if needed
          setWilayas(['Alger', 'Oran', 'Constantine', 'Blida']);
        } finally {
          setWilayasLoading(false);
        }
      };

      fetchWilayas();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ────────────────────────────────────────────────
  //     NOUVEAU : Calcul du prix de livraison
  // ────────────────────────────────────────────────
  const getShippingCost = () => {
    if (!formData.wilaya) return 0;

    const selectedWilaya = wilayas.find(w => w.nom === formData.wilaya);
    if (!selectedWilaya) return 0;

    return formData.deliveryType === 'domicile'
      ? selectedWilaya.prixDomicile || 0
      : selectedWilaya.prixAgence  || 0;
  };

  // Prix produit
  const productPrice = (selectedVariant?.price || 0) * formData.quantity;

  // Frais de livraison
  const shippingCost = getShippingCost();

  // Total final
  const total = productPrice + shippingCost;

  // ────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        productId: product._id,              // ← use _id
        variantSku: selectedVariant?.sku,    // ← crucial
        quantity: Number(formData.quantity),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        wilaya: formData.wilaya,
        deliveryType: formData.deliveryType,
        address: formData.address,
        note: formData.note.trim() || undefined,
      };

      await createOrder(orderData);

      toast.success('Commande enregistrée ! Nous vous contacterons bientôt.', {
        duration: 6000,
        style: { background: '#1A1A1A', color: '#E8DCCB', border: '1px solid #8B0000' },
      });

      // Reset & close
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
      console.error(error);
      toast.error(error.message || 'Échec de la commande. Réessayez.', {
        style: { background: '#1A1A1A', color: '#E8DCCB', border: '1px solid #8B0000' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const total = (selectedVariant?.price || 0) * formData.quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="bg-[#1A1A1A] border border-[#E8DCCB]/20 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#E8DCCB]/10 p-5 flex items-center justify-between z-10">
                <h2 className="text-xl md:text-2xl tracking-widest uppercase text-[#E8DCCB]">
                  FINALISER VOTRE COMMANDE
                </h2>
                <button onClick={onClose} className="text-[#E8DCCB] hover:text-[#8B0000]">
                  <X size={28} />
                </button>
              </div>

              <div className="p-5 md:p-6 space-y-6">
                {/* Product preview */}
                <div className="bg-[#0E0E0E] p-4 border border-[#E8DCCB]/10 rounded">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-[#E8DCCB]">{product.name}</h3>
                      <p className="text-[#8B7355] text-sm">
                        Variante: {selectedVariant?.name || '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#8B0000] text-xl font-bold">
                        {selectedVariant?.price?.toLocaleString() || '—'} DZD
                      </p>
                      <p className="text-[#E8DCCB]/70 text-sm">Qté: {formData.quantity}</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition"
                        placeholder="Dhiaeddine Aouragh"
                      />
                    </div>

                    <div>
                      <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        required
                        pattern="0[5-7][0-9]{8}"
                        className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition"
                        placeholder="0770123456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition"
                      placeholder="dhiaeaouragh0@gmail.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                        Wilaya *
                      </label>
                      {wilayasLoading ? (
                        <div className="text-[#8B7355]">Chargement...</div>
                      ) : (
                        <select
                          name="wilaya"
                          value={formData.wilaya}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition"
                        >
                          <option value="">Choisissez votre wilaya</option>
                          {wilayas.map((w) => (
                            <option key={w._id || w.numero} value={w.nom}>
                              {w.nom} 
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                        Type de livraison *
                      </label>
                      <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition"
                      >
                        <option value="domicile">À domicile</option>
                        <option value="bureau">Point relais / Bureau</option>
                        {/* Add more if your backend supports */}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                      Adresse complète *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition resize-none"
                      placeholder="Cité 2000 Logts, Bloc C, Apt 12, Alger"
                    />
                  </div>

                  <div>
                    <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                      Note / Instructions (optionnel)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition resize-none"
                      placeholder="Livrer après 18h svp"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                    <div>
                      <label className="block text-[#E8DCCB] tracking-wide uppercase text-sm mb-1.5">
                        Quantité *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full bg-[#0E0E0E] border border-[#E8DCCB]/30 px-4 py-3 text-[#E8DCCB] focus:border-[#8B0000] outline-none transition"
                      />
                    </div>

                    <div className="text-right">
                      <div className="text-[#E8DCCB]/80 text-sm">Total à payer</div>
                      <div className="text-2xl md:text-3xl font-bold text-[#8B0000]">
                        {total.toLocaleString()} DZD
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || wilayasLoading}
                    className="w-full bg-[#8B0000] text-[#E8DCCB] py-4 tracking-widest uppercase text-lg hover:bg-[#6B0000] disabled:opacity-50 disabled:cursor-not-allowed transition mt-4"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? 'ENVOI EN COURS...' : 'CONFIRMER LA COMMANDE'}
                  </motion.button>
                </form>

                <div className="text-center text-[#8B7355] text-sm pt-2">
                  Paiement à la livraison • Livraison dans toute l'Algérie
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}