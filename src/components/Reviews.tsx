import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS } from '../data/products';
import { Review } from '../types';
import { api } from '../lib/api';

export const Reviews: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);

  useEffect(() => {
    let isMounted = true;
    api.getReviews().then((data) => {
      if (isMounted && data && data.length > 0) {
        setReviewsList(data);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          نظرات مشتریان ما
        </h2>
        <p className="text-sm text-slate-400 font-light mb-3">
          تجربه سرآشپزهایی که به ما اعتماد کرده‌اند
        </p>
        <div className="w-16 h-1 bg-[#f09267] rounded-full mx-auto" />
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="glass-card rounded-2xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between hover:border-[#f09267]/40 transition-all duration-300 relative group"
          >
            <Quote className="w-8 h-8 text-[#f09267]/20 absolute top-6 left-6" />

            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                "{rev.comment}"
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
                {rev.name.charAt(0)}
              </div>
              <div className="text-right">
                <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                <p className="text-xs text-slate-400 font-light">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
