import React, { useState } from "react";
import { ChefHat, Phone, Mail, Instagram } from "lucide-react";
import { CategoryId } from "../types";
import { api } from "../lib/api";

interface FooterProps {
  onSelectCategory: (catId: CategoryId | "all") => void;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
  onNavigateAbout,
  onOpenContact,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      try {
        await api.subscribeNewsletter(newsletterEmail.trim());
      } catch (err) {
        console.error(err);
      }
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-[#070b14] border-t border-white/10 text-slate-300 relative z-10 pt-6 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14 text-right">
          {/* Col 1: About Brand */}
          <div className="space-y-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-right group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f09267] to-[#e87a48] flex items-center justify-center text-white shadow-md">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white group-hover:text-[#f09267] transition-colors">
                آشپزخانه مدرن
              </span>
            </button>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              تخصصی‌ترین مرجع تأمین تجهیزات آشپزخانه صنعتی و خانگی لوکس در
              ایران، همگام با سرآشپزهای بین‌المللی.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={onOpenContact}
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#f09267] hover:border-[#f09267] transition-colors"
                title="تماس با ما و شماره‌ها"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenContact}
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#f09267] hover:border-[#f09267] transition-colors"
                title="پشتیبانی و ایمیل"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenContact}
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#f09267] hover:border-[#f09267] transition-colors"
                title="شبکه‌های اجتماعی و آدرس"
              >
                <Instagram className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 2: Quick Access (دسترسی سریع) */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onSelectCategory("all");
                  }}
                  id="footer-nav-shop-btn"
                  className="hover:text-[#f09267] transition-colors"
                >
                  فروشگاه و محصولات
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateAbout}
                  id="footer-nav-about-btn"
                  className="hover:text-[#f09267] transition-colors font-medium text-slate-300"
                >
                  درباره ما (داستان برند و اصالت)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  id="footer-nav-contact-btn"
                  className="hover:text-[#f09267] transition-colors font-medium text-slate-300"
                >
                  تماس با ما (شماره‌ها و شبکه‌های اجتماعی)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#f09267] transition-colors"
                >
                  درخواست مشاوره رایگان
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <button
                  onClick={onNavigateAbout}
                  className="hover:text-white transition-colors"
                >
                  ضمانت اصالت ۱۰۰٪ کالا
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors"
                >
                  پیگیری سفارش و پشتیبانی VIP
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateAbout}
                  className="hover:text-white transition-colors"
                >
                  شرایط ارسال اکسپرس و بسته‌بندی ضدضربه
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors"
                >
                  آدرس شو روم حضوری
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
