import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center overflow-hidden py-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Modern Kitchen"
          className="w-full h-full object-cover object-center filter brightness-[0.40] contrast-[1.1] scale-105"
        />
        {/* Gradients for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-[#0b101d]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b101d] via-transparent to-[#0b101d]/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-right">
        <div className="max-w-2xl space-y-6">
          {/* Subtle Tag
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-orange-200 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#f09267]" />
            <span>کالکشن اختصاصی سال ۲۰۲۶</span>
          </div> */}

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.25] tracking-tight">
            آشپزخانه مدرن شما،
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-[#f09267] via-[#f5ad8b] to-amber-200 mt-1">
              میراث فردا
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl">
            تجهیزات حرفه‌ای آشپزخانه برای کسانی که به هنر پخت و پز اهمیت
            می‌دهند. با برترین برندهای جهانی، دقت و زیبایی را به خانه خود
            بیاورید.
          </p>

          {/* Call to Action Button */}
          <div className="pt-2">
            <button
              onClick={onExploreClick}
              id="hero-explore-btn"
              className="peach-gradient-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-[#e87a48]/25 hover:shadow-[#e87a48]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
            >
              <span>مشاهده محصولات</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
