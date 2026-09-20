import React from 'react';
import {
  ChefHat,
  ShieldCheck,
  Award,
  Sparkles,
  Flame,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Star,
  Gem,
  PackageCheck,
  Headphones
} from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onOpenContact: () => void;
  onExploreProducts: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onOpenContact,
  onExploreProducts,
}) => {
  const stats = [
    { label: 'سال سابقه درخشان در تأمین لوازم لوکس', value: '+۱۲' },
    { label: 'سرآشپز و رستوران معتبر همکار', value: '+۱,۵۰۰' },
    { label: 'محصول با ضمانت مادام‌العمر اصالت', value: '+۴۵۰' },
    { label: 'رضایت‌مندی مشتریان VIP', value: '۹۹.۴٪' },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'اصالت ۱۰۰٪ و ضمانت بین‌المللی',
      desc: 'تمامی محصولات مستقیماً از کارخانه‌های اصلی فرانسه، آلمان و ژاپن همراه با سرتیفیکیت رسمی وارد می‌شوند.',
    },
    {
      icon: Flame,
      title: 'متالورژی پیشرفته و ماندگاری مادام‌العمر',
      desc: 'استفاده از چدن خالص لایه‌ای، استیل ضدزنگ ۳۱۶ پزشکی و فولاد دمشقی ۶۷ لایه مقاوم در برابر سایش و شوک حرارتی.',
    },
    {
      icon: Gem,
      title: 'طراحی ارگونومیک و لوکس',
      desc: 'تلفیق هنر اصیل دست‌ساز اروپایی با دانش روز ارگونومی جهت ایجاد بالاترین سطح راحتی در پخت‌وپزهای طولانی.',
    },
    {
      icon: Headphones,
      title: 'پشتیبانی اختصاصی سرآشپزهای VIP',
      desc: 'مشاوره فنی تخصصی پیش از خرید توسط تیم کارشناسان ارشد آشپزی و خدمات پس از فروش فوری ۲۴ ساعته.',
    },
  ];

  const milestones = [
    {
      year: '۱۳۹۱',
      title: 'شروع مسیر با واردات تجهیزات چدنی استاب (Staub)',
      desc: 'آغاز فعالیت تخصصی با تمرکز بر واردات مستقیم قابلمه‌های چدن دست‌ساز فرانسه برای رستوران‌های فاخر تهران.',
    },
    {
      year: '۱۳۹۵',
      title: 'گسترش همکاری با چاقوسازان دمشقی ژاپن و آلمان',
      desc: 'اضافه شدن چاقوهای سرآشپز ارگونومیک با متریال فولاد ضدزنگ پرکربن و تیغه‌های آهنگری شده دستی.',
    },
    {
      year: '۱۳۹۹',
      title: 'تأسیس نخستین آزمایشگاه تست کیفیت و سختی‌سنجی آلیاژ',
      desc: 'ایجاد استاندارد سخت‌گیرانه برای بررسی پوشش‌های لعابی بدون سرب، مقاومت به خوردگی و ضخامت پایدار کف ظروف.',
    },
    {
      year: '۱۴۰۲',
      title: 'راه‌اندازی سامانه آنلاین هوشمند و باشگاه سرآشپزان VIP',
      desc: 'امکان خرید مستقیم، تحویل VIP اختصاصی در بسته‌بندی‌های ضدضربه و خدمات گارانتی تعویض بی قید و شرط.',
    },
  ];

  const team = [
    {
      name: 'استاد علیرضا رضوانی',
      role: 'سرآشپز ارشد و مدیر کنترل کیفی ابزارها',
      experience: '۱۸ سال سابقه در آشپزی ملل و دارنده مدرک Le Cordon Bleu',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'مهندس سهراب کیانی',
      role: 'متخصص متالورژی و مشاور ارشد آلیاژهای پخت',
      experience: 'کارشناس ارشد مهندسی مواد و پژوهشگر ظروف بدون روکش شیمیایی',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'خانم بهاره نوری',
      role: 'مدیر روابط مشتریان VIP و تضمین اصالت کالا',
      experience: '۱۰ سال تجربه در مدیریت خدمات لوکس و نمایندگی برندهای معتبر اروپایی',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 font-['Vazirmatn'] pb-20">
      
      {/* Breadcrumb & Navigation Top Bar */}
      <div className="border-b border-white/10 bg-[#0f172a]/70 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#f09267] transition-colors"
            >
              صفحه اصلی
            </button>
            <span>/</span>
            <span className="text-[#f09267] font-bold">درباره ما</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-all"
          >
            <span>بازگشت به فروشگاه</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10 bg-gradient-to-b from-[#0f172a] via-[#0b101d] to-[#070b14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(240,146,103,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f09267]/10 border border-[#f09267]/30 text-[#f09267] text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>داستان اصالت و کمال‌گرایی در آشپزی</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl mx-auto mb-6">
            خلق تجربه‌ای بی‌همتا از هنر آشپزی با ظروف <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09267] to-[#e87a48]">دست‌ساز و اصیل</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            «آشپزخانه مدرن» پناهگاه سرآشپزهای کمال‌گرا، رستوران‌های میشلن و عاشقان هنر طبخ در ایران است. ما برترین شاهکارهای چدنی، چاقوهای فولاد دمشقی و ظروف پذیرایی دست‌ساز جهان را بدون واسطه و با تضمین اصالت مطلق گردآوری کرده‌ایم.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreProducts}
              className="peach-gradient-btn px-7 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-[#f09267]/25 hover:scale-105 transition-transform flex items-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span>مشاهده کلکسیون محصولات</span>
            </button>
            <button
              onClick={onOpenContact}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#f09267]/50 text-slate-200 text-sm font-bold hover:text-white transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#f09267]" />
              <span>ارتباط با کارشناسان ما</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 border border-white/10 text-center shadow-xl backdrop-blur-xl"
            >
              <div className="text-2xl sm:text-3xl font-black text-[#f09267] mb-1 font-mono">
                {st.value}
              </div>
              <div className="text-xs text-slate-300 font-light leading-snug">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Story Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-right">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#f09267]">
              <Award className="w-4 h-4" />
              <span>چرا آشپزخانه مدرن؟</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-snug">
              ما باور داریم آشپزی یک هنر است، و هر هنرمند شایسته <span className="text-[#f09267]">بهترین ابزار</span> است.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              در دنیایی پر از ظروف بی‌کیفیت و روکش‌های شیمیایی ناپایدار، «آشپزخانه مدرن» با یک تعهد ساده متولد شد: 
              فراهم آوردن تجهیزاتی که نه تنها برای سال‌ها، بلکه برای <strong className="text-white font-bold">نسل‌ها</strong> باقی بمانند. 
              قابلمه‌های چدن لعابی Staub فرانسه با توزیع یکنواخت گرما، تیغه‌های دمشقی ژاپنی با لبه‌های لیزری، و ماهیتابه‌های استیل حرفه‌ای ما تجربه‌ای خلق می‌کنند که طعم و بافت غذا را به اوج می‌رساند.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-white font-bold block mb-0.5">بدون مواد سمی و دارای استانداردهای بهداشت غذایی FDA و LFGB</span>
                  <span className="text-slate-400 font-light">تضمین عدم آزادسازی هرگونه ماده شیمیایی نظیر PTFE، PFOA یا فلزات سنگین در حرارت‌های بسیار بالا.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-white font-bold block mb-0.5">بسته‌بندی VIP و ضمانت سلامت فیزیکی هنگام تحویل</span>
                  <span className="text-slate-400 font-light">ارسال در باکس‌های ضدضربه اختصاصی به همراه شناسنامه اصالت و کارت ضمانت تعویض فوری.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
                alt="کارگاه آشپزخانه مدرن"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-black/30 to-transparent" />
              
              <div className="absolute bottom-6 right-6 left-6 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f09267] flex items-center justify-center text-white font-black text-lg">
                    ★
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">انتخاب نخست سرآشپزان برتر ایران</h4>
                    <p className="text-[11px] text-slate-400">تأمین‌کننده انحصاری بیش از ۸۰ رستوران ستاره‌دار و هتل‌های ۵ ستاره</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-[#070b14]/70 border-y border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              ارزش‌های بنیادین و استانداردهای کیفی ما
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              اصولی که از اولین روز آغاز به کار تا امروز بدون هیچ سازشی به آن‌ها پایبند مانده‌ایم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-6 border border-white/10 hover:border-[#f09267]/40 transition-all text-right group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f09267]/10 border border-[#f09267]/20 flex items-center justify-center text-[#f09267] mb-4 group-hover:bg-[#f09267] group-hover:text-white transition-colors shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{v.title}</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestones / Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f09267] mb-2">
            <Clock className="w-4 h-4" />
            <span>تاریخچه و مسیر رشد</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            ۱۲ سال تعهد به کمال در متریال و خدمات
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative text-right flex flex-col justify-between"
            >
              <div>
                <div className="text-xl font-black text-[#f09267] font-mono mb-2">
                  {m.year}
                </div>
                <h4 className="text-sm font-bold text-white mb-2 leading-snug">{m.title}</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{m.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                گام #{i + 1} در تکامل برند
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experts & Team */}
      <div className="bg-[#070b14]/50 border-t border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f09267] mb-2">
              <Users className="w-4 h-4" />
              <span>تیم فنی و مشاوران ارشد</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              کارشناسانی که پشت هر انتخاب ایستاده‌اند
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 text-right group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                </div>

                <div className="p-6 space-y-2">
                  <h4 className="text-lg font-bold text-white">{member.name}</h4>
                  <div className="text-xs font-medium text-[#f09267]">{member.role}</div>
                  <p className="text-xs text-slate-400 font-light pt-2 leading-relaxed">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 border border-[#f09267]/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              آماده‌اید تجربه آشپزی خود را دگرگون کنید؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
              کلکسیون کامل محصولات ما را بررسی کرده و از ضمانت اصالت ۱۰۰٪ و خدمات مشاوره‌ای رایگان بهره‌مند شوید.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="peach-gradient-btn px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-[#f09267]/25"
              >
                خرید و مشاهده تمام محصولات
              </button>
              <button
                onClick={onOpenContact}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-all border border-slate-700"
              >
                تماس و درخواست مشاوره رایگان
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
