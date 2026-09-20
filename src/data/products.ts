import { Category, Product, Review } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'pots',
    nameFa: 'قابلمه',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
    count: 14
  },
  {
    id: 'pans',
    nameFa: 'ماهیتابه',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=400&q=80',
    count: 18
  },
  {
    id: 'sets',
    nameFa: 'سرویس آشپزخانه',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80',
    count: 10
  },
  {
    id: 'dining',
    nameFa: 'ظروف پذیرایی',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
    count: 22
  },
  {
    id: 'appliances',
    nameFa: 'لوازم برقی',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&q=80',
    count: 16
  },
  {
    id: 'tools',
    nameFa: 'ابزار آشپزی',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=400&q=80',
    count: 25
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'staub-cocotte-black',
    nameFa: 'سرویس چدن Staub سری حرفه‌ای',
    nameEn: 'Staub Cast Iron Cocotte Oval',
    brand: 'Staub',
    category: 'pots',
    price: 18500000,
    originalPrice: 21000000,
    rating: 4.9,
    reviewsCount: 42,
    badge: 'پیشنهاد ویژه',
    isSpecialOffer: true,
    isFeatured: true,
    inStock: true,
    material: 'چدن لعاب‌دار فرانسوی',
    origin: 'فرانسه',
    specs: 'ساخت فرانسه، با دوام مادام‌العمر برای سرآشپزهای حرفه‌ای',
    description: 'ظروف چدنی لعاب‌دار اسـتوب (Staub) ساخته شده در فرانسه، انتخاب اول سرآشپزهای دارنده ستاره میشلن در سراسر جهان است. این سرویس دارای درب با فناوری چرخش رطوبت خودکار برای پخت آرام و حفظ کامل عصاره غذایی می‌باشد.',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'damascus-knife-set',
    nameFa: 'ست چاقوی دمشق',
    nameEn: 'Damascus Chef Knife Set',
    brand: 'Shun / Yoshihiro',
    category: 'tools',
    price: 9800000,
    rating: 5.0,
    reviewsCount: 38,
    isFeatured: true,
    inStock: true,
    material: 'فولاد دمشقی ۶۷ لایه AUS-10',
    origin: 'ژاپن',
    specs: 'تیغه ۶۷ لایه دست‌ساز ژاپنی',
    description: 'ست چاقوی ساخت ژاپن با تیغه‌های فولادی دمشقی ۶۷ لایه. دارای سختی HRC 60±2 با دسته‌های ارگونومیک چوب رز رزین و بالانس وزنی بی‌نظیر برای برش‌های بسیار دقیق.',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'smeg-espresso-machine',
    nameFa: 'اسپرسوساز SMEG',
    nameEn: 'SMEG 50s Retro Espresso Machine',
    brand: 'SMEG',
    category: 'appliances',
    price: 12900000,
    originalPrice: 14500000,
    rating: 4.8,
    reviewsCount: 29,
    isFeatured: true,
    inStock: true,
    material: 'استیل ضدزنگ و کروم آلومینیوم',
    origin: 'ایتالیا',
    specs: 'طراحی رترو، عملکرد مدرن',
    description: 'دستگاه اسپرسوساز پمپ ۱۵ بار اسمگ با طراحی نوستالژیک دهه ۵۰ میلادی، نازل بخار حرفه‌ای کاپوچینو و سیستم گرمایش ترموبلاک سریع برای تهیه قهوه‌ای با کریما غلیظ و عالی.',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mauviel-copper-set',
    nameFa: 'سرویس ظروف مسی Mauviel',
    nameEn: 'Mauviel M150 Heritage Copper Cookware Set',
    brand: 'Mauviel 1830',
    category: 'sets',
    price: 24200000,
    originalPrice: 27000000,
    rating: 4.95,
    reviewsCount: 19,
    isFeatured: true,
    inStock: true,
    material: 'مس خالص ۱.۵ میلی‌متری با لایه داخلی استیل',
    origin: 'فرانسه',
    specs: 'بالاترین رسانایی حرارتی برای پختی یکنواخت و حرفه‌ای',
    description: 'ظروف مسی لوکس مویل ساخت منطقه نورماندی فرانسه از سال ۱۸۳۰. با ضخامت ۱.۵ میلی‌متری و پوشش استیل ضدزنگ داخلی، نهایت دقت و سرعت را در انتقال حرارت به آشپز هدیه می‌دهد.',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'le-creuset-dutch-oven-orange',
    nameFa: 'قابلمه چدنی لوکروزه نارنجی ۴.۵ لیتری',
    nameEn: 'Le Creuset Signature Round Dutch Oven Volcanic',
    brand: 'Le Creuset',
    category: 'pots',
    price: 16800000,
    rating: 4.9,
    reviewsCount: 56,
    inStock: true,
    material: 'چدن لعاب‌دار رنگی',
    origin: 'فرانسه',
    specs: 'مقاومت تا ۲۶۰ درجه سانتی‌گراد فر',
    description: 'رنگ آتشفشانی کلاسیک برند فرانسه لوکروزه. ایده‌آل برای خورش‌ها، نان پزی در فر، و پخت آهسته انواع گوشت.',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kitchenaid-artisan-stand-mixer',
    nameFa: 'همزن حرفه‌ای ایستاده KitchenAid Artisan',
    nameEn: 'KitchenAid Artisan 4.8L Stand Mixer',
    brand: 'KitchenAid',
    category: 'appliances',
    price: 21500000,
    originalPrice: 23000000,
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    material: 'بدنه تمام چدنی سنگین',
    origin: 'آمریکا',
    specs: 'موتور ۳۰۰ وات دنده فلزی مستقیم',
    description: 'همزن ایستاده محبوب شیرینی‌پزان حرفه‌ای. دارای کاسه استیل ۴.۸ لیتری دسته دار و سه سری مختلف ورز خمیر، همزن تخم مرغ و پدل مخلوط کن.',
    image: 'https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'de-buyer-carbon-steel-pan',
    nameFa: 'ماهیتابه کربن استیل De Buyer Mineral B',
    nameEn: 'De Buyer Mineral B Pro Carbon Steel Pan 28cm',
    brand: 'De Buyer',
    category: 'pans',
    price: 4900000,
    rating: 4.75,
    reviewsCount: 24,
    inStock: true,
    material: 'فولاد کربنی ۱۰۰٪ طبیعی با پوشش موم عسل',
    origin: 'فرانسه',
    specs: 'مقاومت حرارتی فوق‌العاده بالا برای استیک',
    description: 'ماهیتابه کربن استیل حرفه‌ای فرانسه بدون هیچگونه مواد شیمیایی PTFE یا PFOA. با روغن‌کاری اولیه خاصیت نچسب طبیعی پیدا کرده و طول عمر ابدی دارد.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'zwilling-pro-chef-knife',
    nameFa: 'چاقوی سرآشپز ۲۰ سانتی‌متری Zwilling Pro',
    nameEn: 'Zwilling J.A. Henckels Pro 8-inch Chef Knife',
    brand: 'Zwilling',
    category: 'tools',
    price: 6200000,
    rating: 4.85,
    reviewsCount: 47,
    inStock: true,
    material: 'فولاد یکپارچه یخ‌زده Friodur',
    origin: 'آلمان',
    specs: 'طراحی ویژه بولستر زاویه‌دار',
    description: 'چاقوی سرآشپز اورجینال زویلینگ ساخت زولینگن آلمان. فورج شده از یک تکه فولاد کربن بالا با زاویه برش ۱۵ درجه در هر طرف.',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'villeroy-boch-dinnerware-set',
    nameFa: 'سرویس غذاخوری ۲۴ پارچه Villeroy & Boch',
    nameEn: 'Villeroy & Boch Manufacture Rock Dinnerware',
    brand: 'Villeroy & Boch',
    category: 'dining',
    price: 19500000,
    originalPrice: 22000000,
    rating: 4.9,
    reviewsCount: 15,
    inStock: true,
    material: 'پرسیلین با بافت سنگ طبیعی گرانیت',
    origin: 'آلمان',
    specs: 'طراحی مدرن مات با بافت صخره‌ای',
    description: 'سرویس پذیرایی مدرن آلمانی با لعاب مات و ساختار صخره‌ای مشکی. قابل استفاده در مایکروویو و ماشین ظرفشویی.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wusthof-knife-block-classic',
    nameFa: 'پایه ۷ پارچه چاقو Wüsthof Classic Ikon',
    nameEn: 'Wüsthof Classic Ikon 7-Piece Knife Block Set',
    brand: 'Wüsthof',
    category: 'tools',
    price: 18200000,
    rating: 4.95,
    reviewsCount: 22,
    inStock: true,
    material: 'فولاد آلیاژی X50CrMoV15',
    origin: 'آلمان',
    specs: 'پایه بلوک چوبی راش طبیعی',
    description: 'مجموعه کامل چاقوهای آشپزخانه ووستوف آلمان شامل چاقوی نان، چاقوی سرآشپز، چاقوی سبزیجات، قیچی آشپزخانه و مسقل تیزکننده.',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'امیررضا علوی',
    role: 'سرآشپز اجرایی هتل',
    rating: 5,
    comment: 'کیفیت چاقوهای ژاپنی که از اینجا تهیه کردم بی‌نظیر است. برای یک سرآشپز حرفه‌ای، داشتن ابزار دقیق بسیار حیاتی است.'
  },
  {
    id: 'rev-2',
    name: 'سارا موسوی',
    role: 'طراح داخلی',
    rating: 5,
    comment: 'سرویس اسمگ آشپزخانه من را تحول کرد. هم زیبایی و هم کارایی در بالاترین سطح ممکن قرار دارند. ممنون از ارسال سریع‌تانه.'
  },
  {
    id: 'rev-3',
    name: 'حمید کریمی',
    role: 'علاقه‌مند به آشپزی',
    rating: 5,
    comment: 'واقعاً پیدا کردن برند Staub اصل در ایران کار سختی بود تا اینکه با این مجموعه آشنا شدم. بسته‌بندی و ضمانت کالا عالی بود.'
  }
];
