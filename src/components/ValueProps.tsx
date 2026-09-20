import React from 'react';
import { Truck, ShieldCheck, Lock, Headphones } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: Truck,
      title: 'ارسال سریع',
      subtitle: 'ارسال به تمام نقاط کشور در کمترین زمان',
    },
    {
      icon: ShieldCheck,
      title: 'ضمانت اصالت',
      subtitle: 'تضمین ۱۰۰٪ اورجینال بودن کالاها',
    },
    {
      icon: Lock,
      title: 'پرداخت امن',
      subtitle: 'درگاه‌های پرداخت معتبر و امن',
    },
    {
      icon: Headphones,
      title: 'پشتیبانی',
      subtitle: 'مشاوره تخصصی خرید تجهیزات',
    },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-slate-900/40 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/20 border border-white/5 hover:border-[#f09267]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f09267]/10 border border-[#f09267]/20 flex items-center justify-center text-[#f09267] shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
