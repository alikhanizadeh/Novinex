import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatToman } from '../lib/formatters';

interface BestSellersProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, e?: React.MouseEvent) => void;
  onToggleWishlist: (p: Product, e?: React.MouseEvent) => void;
  wishlistIds: string[];
  onViewAllClick: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onViewAllClick,
}) => {
  // Find featured products matching the screenshot
  const staub = products.find((p) => p.id === 'staub-cocotte-black') || products[0];
  const damascus = products.find((p) => p.id === 'damascus-knife-set') || products[1];
  const smeg = products.find((p) => p.id === 'smeg-espresso-machine') || products[2];
  const mauviel = products.find((p) => p.id === 'mauviel-copper-set') || products[3];

  return (
    <section className="py-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            محصولات پرفروش
          </h2>
          <div className="w-16 h-1 bg-[#f09267] rounded-full" />
        </div>

        <button
          onClick={onViewAllClick}
          id="view-all-bestsellers-btn"
          className="text-sm font-semibold text-slate-400 hover:text-[#f09267] transition-colors"
        >
          مشاهده همه
        </button>
      </div>

      {/* Main Layout Grid matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Large Featured Staub Card (Right side in RTL - 6 cols) */}
        <div className="lg:col-span-6 relative group rounded-3xl overflow-hidden glass-card border border-white/10 flex flex-col justify-between p-6 sm:p-8 min-h-[480px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={staub.image}
              alt={staub.nameFa}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-[#0b101d]/60 to-transparent" />
          </div>

          {/* Top Tag & Wishlist */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/90 text-slate-950 font-black text-xs shadow-md">
              پیشنهاد ویژه
            </span>
            <button
              onClick={(e) => onToggleWishlist(staub, e)}
              className={`p-3 rounded-full backdrop-blur-md border transition-colors ${
                wishlistIds.includes(staub.id)
                  ? 'bg-rose-500/80 text-white border-rose-500'
                  : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
              }`}
              title="افزودن به علاقه‌مندی‌ها"
            >
              <Heart className={`w-5 h-5 ${wishlistIds.includes(staub.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 pt-16">
            <h3
              onClick={() => onSelectProduct(staub)}
              className="text-2xl sm:text-3xl font-black text-white mb-2 cursor-pointer hover:text-[#f09267] transition-colors"
            >
              {staub.nameFa}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light mb-6 line-clamp-2">
              {staub.specs}
            </p>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {formatToman(staub.price)} <span className="text-xs font-normal text-slate-400">تومان</span>
                </span>
                {staub.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatToman(staub.originalPrice)} تومان
                  </span>
                )}
              </div>

              <button
                onClick={(e) => onAddToCart(staub, e)}
                id="add-staub-cart-btn"
                className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:bg-[#f09267] hover:text-white transition-all transform group-hover:scale-105"
                title="افزودن به سبد خرید"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Left Side Grid (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Top 2 Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Damascus Knife Card */}
            <div
              onClick={() => onSelectProduct(damascus)}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between group cursor-pointer hover:border-[#f09267]/50 transition-all duration-300 relative"
            >
              <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative bg-slate-900/50">
                <img
                  src={damascus.image}
                  alt={damascus.nameFa}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(damascus, e);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/70 backdrop-blur-md text-white hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${wishlistIds.includes(damascus.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-white text-base mb-1 group-hover:text-[#f09267] transition-colors">
                  {damascus.nameFa}
                </h4>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">{damascus.specs}</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-sm">
                    {formatToman(damascus.price)} <span className="text-[10px] text-slate-400">تومان</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(damascus, e);
                    }}
                    className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-[#f09267] hover:text-white transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SMEG Espresso Card */}
            <div
              onClick={() => onSelectProduct(smeg)}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between group cursor-pointer hover:border-[#f09267]/50 transition-all duration-300 relative"
            >
              <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative bg-slate-900/50">
                <img
                  src={smeg.image}
                  alt={smeg.nameFa}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(smeg, e);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/70 backdrop-blur-md text-white hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${wishlistIds.includes(smeg.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-white text-base mb-1 group-hover:text-[#f09267] transition-colors">
                  {smeg.nameFa}
                </h4>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">{smeg.specs}</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-sm">
                    {formatToman(smeg.price)} <span className="text-[10px] text-slate-400">تومان</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(smeg, e);
                    }}
                    className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-[#f09267] hover:text-white transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Wide Mauviel Card */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#f09267]/50 transition-all duration-300">
            <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-900/50">
              <img
                src={mauviel.image}
                alt={mauviel.nameFa}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 text-right space-y-2 w-full">
              <h4
                onClick={() => onSelectProduct(mauviel)}
                className="text-xl font-black text-white cursor-pointer hover:text-[#f09267] transition-colors"
              >
                {mauviel.nameFa}
              </h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {mauviel.specs}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="font-black text-white text-lg">
                  {formatToman(mauviel.price)} <span className="text-xs text-slate-400">تومان</span>
                </span>

                <button
                  onClick={(e) => onAddToCart(mauviel, e)}
                  id="quick-buy-mauviel-btn"
                  className="peach-gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-[#f09267]/30 transition-all"
                >
                  خرید سریع
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
