import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatToman } from '../lib/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border-r border-white/10 w-full max-w-md h-full flex flex-col justify-between p-6 text-right text-slate-100 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-black text-lg text-white">علاقه‌مندی‌های شما</h3>
          </div>
          <button
            onClick={onClose}
            id="close-wishlist-drawer-btn"
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-medium">لیست علاقه مندی‌های شما خالی است.</p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-2xl p-3.5 border border-white/10 flex items-center gap-3"
              >
                <img
                  src={product.image}
                  alt={product.nameFa}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-900"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-white truncate mb-1">
                    {product.nameFa}
                  </h4>
                  <div className="text-xs font-black text-[#f09267] mb-2">
                    {formatToman(product.price)} <span className="text-[10px] text-slate-400 font-normal">تومان</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveWishlist(product);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#f09267] text-white font-bold text-[11px] flex items-center gap-1 hover:brightness-110"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>افزودن به سبد</span>
                    </button>

                    <button
                      onClick={() => onRemoveWishlist(product)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
