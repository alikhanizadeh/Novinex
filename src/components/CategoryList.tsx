import React from 'react';
import { CATEGORIES } from '../data/products';
import { CategoryId } from '../types';

interface CategoryListProps {
  activeCategory: CategoryId | 'all';
  onSelectCategory: (catId: CategoryId | 'all') => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Heading with Orange Underline */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
          دسته‌بندی محصولات
        </h2>
        <div className="w-16 h-1 bg-[#f09267] rounded-full mx-auto" />
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              id={`cat-card-${cat.id}`}
              className={`group flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 border ${
                isSelected
                  ? 'bg-slate-800/90 border-[#f09267] shadow-lg shadow-[#f09267]/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/70 hover:border-slate-700'
              }`}
            >
              {/* Rounded Image Frame */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 border border-white/10 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <img
                  src={cat.image}
                  alt={cat.nameFa}
                  className="w-full h-full object-cover object-center filter contrast-[1.05]"
                />
              </div>

              {/* Label */}
              <span className={`text-sm font-bold transition-colors ${
                isSelected ? 'text-[#f09267]' : 'text-slate-200 group-hover:text-white'
              }`}>
                {cat.nameFa}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
