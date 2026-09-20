import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { Product } from '../types';
import { formatToman } from '../lib/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [added, setAdded] = useState(false);

  const images = product.gallery && product.gallery.length > 0
    ? [product.image, ...product.gallery.filter(g => g !== product.image)]
    : [product.image];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative text-right text-slate-100 shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={onClose}
          id="close-product-modal-btn"
          className="absolute top-6 left-6 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative">
              <img
                src={selectedImage}
                alt={product.nameFa}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-[#f09267] text-white font-bold text-xs shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#f09267] scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#f09267] uppercase tracking-wider bg-[#f09267]/10 px-3 py-1 rounded-full border border-[#f09267]/20">
                  {product.brand}
                </span>

                <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} نظر)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
                {product.nameFa}
              </h2>
              {product.nameEn && (
                <p className="text-xs text-slate-400 font-mono dir-ltr text-right mb-3">
                  {product.nameEn}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">جنس بدنه:</span>
                <span className="text-white font-medium">{product.material || 'استاندارد لوکس'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">کشور سازنده:</span>
                <span className="text-white font-medium">{product.origin || 'اورجینال'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">وضعیت انبار:</span>
                <span className="text-emerald-400 font-bold">موجود در انبار مرکزی</span>
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">قیمت محصول:</span>
                <div className="text-left">
                  <span className="text-2xl font-black text-white">
                    {formatToman(product.price * quantity)}{' '}
                    <span className="text-xs font-normal text-slate-400">تومان</span>
                  </span>
                  {product.originalPrice && (
                    <div className="text-xs text-slate-500 line-through">
                      {formatToman(product.originalPrice * quantity)} تومان
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-300 font-medium">تعداد:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart & Wishlist buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  id="modal-add-to-cart-btn"
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'peach-gradient-btn shadow-[#f09267]/25'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>به سبد اضافه شد!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>افزودن به سبد خرید</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-4 rounded-2xl border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                  title="افزودن به علاقه مندی‌ها"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 text-center pt-2 border-t border-white/5">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/40">
                <ShieldCheck className="w-4 h-4 text-[#f09267]" />
                <span>۱۰۰٪ اورجینال</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/40">
                <Truck className="w-4 h-4 text-[#f09267]" />
                <span>ارسال سریع</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/40">
                <RefreshCw className="w-4 h-4 text-[#f09267]" />
                <span>۷ روز ضمانت بازگشت</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
