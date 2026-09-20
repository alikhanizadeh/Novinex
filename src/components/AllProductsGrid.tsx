import React, { useState, useMemo } from "react";
import { Product, CategoryId } from "../types";
import { CATEGORIES } from "../data/products";
import { formatToman } from "../lib/formatters";
import {
  Heart,
  ShoppingBag,
  Star,
  SlidersHorizontal,
  Check,
} from "lucide-react";

interface AllProductsGridProps {
  products: Product[];
  activeCategory: CategoryId | "all";
  onSelectCategory: (catId: CategoryId | "all") => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, e?: React.MouseEvent) => void;
  onToggleWishlist: (p: Product, e?: React.MouseEvent) => void;
  wishlistIds: string[];
  searchQuery: string;
}

export const AllProductsGrid: React.FC<AllProductsGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  searchQuery,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating"
  >("featured");

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ["all", ...Array.from(set)];
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== "all") {
          const productCategory =
            typeof p.category === "string"
              ? p.category
              : (p.category as any)?.id || (p as any).categoryId;
          if (productCategory !== activeCategory) {
            return false;
          }
        }
        // Brand filter
        if (selectedBrand !== "all" && p.brand !== selectedBrand) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName =
            p.nameFa.toLowerCase().includes(q) ||
            (p.nameEn && p.nameEn.toLowerCase().includes(q));
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSpecs = p.specs.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchSpecs) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, activeCategory, selectedBrand, searchQuery, sortBy]);

  return (
    <section
      id="products-catalog"
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
    >
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            فروشگاه تجهیزات لوکس
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            مجموعه‌ای کاملاً اورجینال از بهترین برندهای جهانی آشپزخانه
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">مرتب‌سازی:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            id="sort-products-select"
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#f09267]"
          >
            <option value="featured">پیش‌فرض (محبوب‌ترین)</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
            <option value="rating">بیشترین امتیاز</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs: Categories & Brands */}
      <div className="space-y-4 mb-10">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "bg-[#f09267] text-white shadow-md shadow-[#f09267]/20"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800"
            }`}
          >
            همه محصولات ({products.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[#f09267] text-white shadow-md shadow-[#f09267]/20"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800"
              }`}
            >
              {cat.nameFa}
            </button>
          ))}
        </div>

        {/* Brand Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 shrink-0 font-medium ml-1">
            برند:
          </span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                selectedBrand === b
                  ? "bg-slate-800 text-[#f09267] border border-[#f09267]/50"
                  : "bg-slate-900/50 text-slate-400 border border-slate-800/60 hover:text-white"
              }`}
            >
              {b === "all" ? "همه برندها" : b}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-white/10 my-8">
          <p className="text-slate-400 text-sm mb-4">
            هیچ محصولی با مشخصات انتخاب شده یافت نشد.
          </p>
          <button
            onClick={() => {
              onSelectCategory("all");
              setSelectedBrand("all");
            }}
            className="peach-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            بازنشانی فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between group cursor-pointer hover:border-[#f09267]/50 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="w-full h-52 rounded-xl overflow-hidden mb-4 relative bg-slate-900/50">
                  <img
                    src={product.image}
                    alt={product.nameFa}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-[#f09267] text-white text-[10px] font-black shadow-md">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product, e);
                    }}
                    className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isWishlisted
                        ? "bg-rose-500 text-white"
                        : "bg-slate-900/70 text-white hover:text-rose-400"
                    }`}
                    title="افزودن به علاقه‌مندی‌ها"
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-slate-300">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-base mb-1 group-hover:text-[#f09267] transition-colors line-clamp-1">
                      {product.nameFa}
                    </h3>
                    <p className="text-xs text-slate-400 font-light mb-4 line-clamp-2 leading-relaxed">
                      {product.specs}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                    <div>
                      <span className="font-black text-white text-base">
                        {formatToman(product.price)}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          تومان
                        </span>
                      </span>
                      {product.originalPrice && (
                        <div className="text-[10px] text-slate-500 line-through">
                          {formatToman(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, e);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-[#f09267] hover:text-white transition-colors shadow-md"
                      title="افزودن به سبد خرید"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
