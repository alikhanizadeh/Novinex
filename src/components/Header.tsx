import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  ChefHat,
  Menu,
  X,
  Phone,
  Info,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { CategoryId, User, Product } from "../types";
import { toPersianDigits, formatToman } from "../lib/formatters";

interface HeaderProps {
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onSelectCategory: (catId: CategoryId | "all") => void;
  activeCategory: CategoryId | "all";
  onSearchClick: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onProfileClick: () => void;
  onNavigateHome: () => void;
  onNavigateAbout?: () => void;
  onOpenContact?: () => void;
  currentUser: User | null;
  currentView?: "home" | "about";
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  scrollToCatalog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onSelectCategory,
  activeCategory,
  onSearchClick,
  searchQuery,
  setSearchQuery,
  onProfileClick,
  onNavigateHome,
  onNavigateAbout,
  onOpenContact,
  currentUser,
  currentView = "home",
  products = [],
  onSelectProduct,
  scrollToCatalog,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  const navItems: { id: CategoryId; label: string }[] = [
    { id: "pots", label: "قابلمه" },
    { id: "pans", label: "ماهیتابه" },
    { id: "sets", label: "سرویس آشپزخانه" },
    { id: "dining", label: "ظروف پذیرایی" },
    { id: "appliances", label: "لوازم برقی" },
    { id: "tools", label: "ابزار آشپزی" },
  ];

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setDesktopSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products matching user input
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchingProducts = useMemo(() => {
    if (!trimmedQuery || !products.length) return [];
    return products.filter((p) => {
      const matchFa = p.nameFa.toLowerCase().includes(trimmedQuery);
      const matchEn = p.nameEn
        ? p.nameEn.toLowerCase().includes(trimmedQuery)
        : false;
      const matchBrand = p.brand
        ? p.brand.toLowerCase().includes(trimmedQuery)
        : false;
      const matchDesc = p.description
        ? p.description.toLowerCase().includes(trimmedQuery)
        : false;
      return matchFa || matchEn || matchBrand || matchDesc;
    });
  }, [trimmedQuery, products]);

  // Execute search: Only scroll if there are matching results
  const handlePerformSearch = () => {
    if (!trimmedQuery) return;

    if (matchingProducts.length > 0) {
      // Products found! Execute scroll and close mobile drawer
      if (scrollToCatalog) {
        scrollToCatalog();
      } else {
        onSearchClick();
      }
      setMobileSearchOpen(false);
      setDesktopSearchOpen(false);
    } else {
      // No products found: Do NOT scroll as requested by user
      // Keep search box open so user can see "کالایی با این هدف یافت نشد"
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePerformSearch();
      (e.target as HTMLInputElement).blur();
    }
  };

  // When clicking on an item from the suggestions list
  const handleSelectSuggestion = (product: Product) => {
    setSearchQuery(product.nameFa);
    setMobileSearchOpen(false);
    setDesktopSearchOpen(false);

    // Select product to view details
    if (onSelectProduct) {
      onSelectProduct(product);
    }

    // Scroll to catalog section
    if (scrollToCatalog) {
      scrollToCatalog();
    } else {
      onSearchClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          {/* 1 & 5 & 6. RIGHT SECTION: Brand Logo + Search (Box on desktop, Icon on mobile) + Menu Toggle on mobile */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* 1. Brand Logo & Name - Always on the Right corner */}
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 sm:gap-2.5 text-right group focus:outline-none shrink-0 cursor-pointer"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#f09267] to-[#e87a48] flex items-center justify-center text-white shadow-lg shadow-[#e87a48]/20 group-hover:scale-105 transition-transform shrink-0">
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-sm sm:text-base lg:text-xl font-black text-white tracking-tight group-hover:text-[#f09267] transition-colors whitespace-nowrap">
                آشپزخانه مدرن
              </span>
            </button>

            {/* 5. Search - Next to brand logo:
                - On large screens: full input box with live dropdown
                - On small screens: only search icon button */}

            {/* Search Box for Desktop (Large screen) */}
            <div
              ref={desktopSearchRef}
              className="hidden lg:flex items-center relative w-52 xl:w-72"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="جستجو در محصولات..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setDesktopSearchOpen(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setDesktopSearchOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  id="header-search-input"
                  className="w-full bg-slate-900/80 text-xs text-slate-100 placeholder-slate-400 pl-4 pr-9 py-2.5 rounded-full border border-slate-800 focus:outline-none focus:border-[#f09267]/60 focus:ring-1 focus:ring-[#f09267]/60 transition-all"
                />
                <button
                  onClick={handlePerformSearch}
                  id="header-search-btn"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f09267] transition-colors cursor-pointer"
                  title="جستجو"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop Live Suggestions Dropdown */}
              {desktopSearchOpen && trimmedQuery.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 xl:w-96 bg-[#0f172a]/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-scaleUp text-right">
                  {matchingProducts.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-bold px-1">
                        <span>
                          کالاهای مرتبط (
                          {toPersianDigits(matchingProducts.length)})
                        </span>
                        <span className="text-[#f09267]">
                          برای مشاهده کلیک کنید
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto space-y-1.5 custom-scrollbar pl-1">
                        {matchingProducts.slice(0, 6).map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSelectSuggestion(product)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer group border border-transparent hover:border-[#f09267]/30"
                          >
                            <img
                              src={product.image}
                              alt={product.nameFa}
                              className="w-11 h-11 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-white group-hover:text-[#f09267] transition-colors truncate">
                                {product.nameFa}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-bold text-[#f09267]">
                                  {formatToman(product.price)} تومان
                                </span>
                                {product.brand && (
                                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                    {product.brand}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-[#f09267] transition-colors shrink-0" />
                          </div>
                        ))}
                      </div>
                      {matchingProducts.length > 6 && (
                        <button
                          onClick={handlePerformSearch}
                          className="w-full pt-2 text-center text-[11px] font-bold text-[#f09267] hover:underline cursor-pointer border-t border-slate-800/80"
                        >
                          مشاهده تمام {toPersianDigits(matchingProducts.length)}{" "}
                          نتیجه در کاتالوگ ←
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 px-4 text-center space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">
                        کالایی با این عنوان یا مشخصات یافت نشد
                      </p>
                      <p className="text-[11px] text-slate-400">
                        لطفاً املای کلمه را بررسی کرده یا نام محصول دیگری را
                        جستجو کنید.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Icon button for Mobile (Small screen) */}
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              id="mobile-search-icon-btn"
              className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                mobileSearchOpen
                  ? "bg-[#f09267]/20 text-[#f09267] border border-[#f09267]/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="جستجو"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 6. Mobile Menu Toggle - On small screens, placed right next to Search icon */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileSearchOpen) setMobileSearchOpen(false);
              }}
              id="mobile-menu-toggle"
              className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                mobileMenuOpen
                  ? "bg-[#f09267]/20 text-[#f09267] border border-[#f09267]/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="منو"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* 6. Desktop Navigation Links (When screen is large, stays in normal layout) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => {
              const isActive =
                currentView === "home" && activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigateHome();
                    onSelectCategory(item.id);
                  }}
                  id={`nav-item-${item.id}`}
                  className={`text-xs xl:text-sm font-medium transition-all relative py-1 cursor-pointer ${
                    isActive
                      ? "text-[#f09267] font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#f09267] rounded-full" />
                  )}
                </button>
              );
            })}

            <div className="h-4 w-px bg-white/15 mx-1" />

            {/* About Us Link */}
            {onNavigateAbout && (
              <button
                onClick={onNavigateAbout}
                id="nav-about-btn"
                className={`text-xs xl:text-sm font-medium transition-all relative py-1 cursor-pointer ${
                  currentView === "about"
                    ? "text-[#f09267] font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                درباره ما
                {currentView === "about" && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#f09267] rounded-full" />
                )}
              </button>
            )}

            {/* Contact Us Link */}
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                id="nav-contact-btn"
                className="text-xs xl:text-sm font-medium text-slate-300 hover:text-[#f09267] transition-colors py-1 flex items-center gap-1 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#f09267]" />
                <span>تماس با ما</span>
              </button>
            )}
          </nav>

          {/* 2 & 4. LEFT SECTION: Cart Icon + User Account Icon (On the left corner in both large & small screens) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 4. Cart Button - On the left, right next to User Account */}
            <button
              onClick={onOpenCart}
              id="shopping-cart-btn"
              className="p-2 sm:p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors relative cursor-pointer"
              title="سبد خرید"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ee8a58] text-white text-[10px] sm:text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0b101d] animate-pulse">
                  {toPersianDigits(cartCount)}
                </span>
              )}
            </button>

            {/* 2. User Account / Profile Button - On the far left corner */}
            <button
              onClick={onProfileClick}
              id="user-profile-btn"
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full transition-all border cursor-pointer ${
                currentUser
                  ? "bg-slate-800/80 border-[#f09267]/30 text-white hover:border-[#f09267]"
                  : "bg-slate-800/40 border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title={
                currentUser
                  ? `حساب کاربری: ${currentUser.name}`
                  : "ورود / ثبت‌نام"
              }
            >
              {currentUser ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f09267] to-[#e87a48] text-white flex items-center justify-center font-black text-xs shadow-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold max-w-[85px] truncate text-slate-100">
                    {currentUser.name.split(" ")[0]}
                  </span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-slate-300" />
                  <span className="hidden sm:inline text-xs font-medium text-slate-300">
                    ورود / ثبت‌نام
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown Bar & Live Results */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0b101d]/98 backdrop-blur-2xl px-4 py-3 animate-fadeIn space-y-3">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="جستجو در محصولات (مثلاً قابلمه گرانیتی، تابه...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              autoFocus
              className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-20 pr-4 py-2.5 rounded-xl border border-[#f09267]/50 focus:outline-none focus:ring-2 focus:ring-[#f09267]"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title="پاک کردن متن"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handlePerformSearch}
                className="p-1.5 bg-[#f09267]/20 hover:bg-[#f09267] text-[#f09267] hover:text-white rounded-lg transition-colors cursor-pointer"
                title="جستجو"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Live Suggestions / Not Found Feedback */}
          {trimmedQuery.length > 0 && (
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3 shadow-xl text-right animate-fadeIn">
              {matchingProducts.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-bold px-1">
                    <span>
                      کالاهای منطبق ({toPersianDigits(matchingProducts.length)})
                    </span>
                    <span className="text-[#f09267]">
                      لمس کالا جهت انتخاب و اسکرول
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar pl-1">
                    {matchingProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectSuggestion(product)}
                        className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer border border-slate-800/60 hover:border-[#f09267]/40"
                      >
                        <img
                          src={product.image}
                          alt={product.nameFa}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-100 truncate">
                            {product.nameFa}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-[#f09267]">
                              {formatToman(product.price)} تومان
                            </span>
                            {product.brand && (
                              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                {product.brand}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePerformSearch}
                    className="w-full mt-2 py-2 text-center text-xs font-bold text-white bg-[#f09267]/20 hover:bg-[#f09267] rounded-xl transition-all cursor-pointer"
                  >
                    جستجوی تمام {toPersianDigits(matchingProducts.length)} محصول
                    در کاتالوگ
                  </button>
                </div>
              ) : (
                <div className="py-5 px-3 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    کالایی با این عنوان یا مشخصات یافت نشد
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    هیچ محصولی با عبارت «{searchQuery}» پیدا نشد. سرچ انجام
                    نمی‌شود تا عبارت را ویرایش فرمایید.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0b101d]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory("all");
                setMobileMenuOpen(false);
              }}
              className={`text-right px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                currentView === "home" && activeCategory === "all"
                  ? "bg-[#f09267]/10 text-[#f09267]"
                  : "text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              همه محصولات فروشگاه
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateHome();
                  onSelectCategory(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-right px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                  currentView === "home" && activeCategory === item.id
                    ? "bg-[#f09267]/10 text-[#f09267]"
                    : "text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-slate-800 my-2 pt-2 space-y-1">
              {onNavigateAbout && (
                <button
                  onClick={() => {
                    onNavigateAbout();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer ${
                    currentView === "about"
                      ? "bg-[#f09267]/10 text-[#f09267]"
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <span>درباره ما (داستان برند)</span>
                  <Info className="w-4 h-4 text-[#f09267]" />
                </button>
              )}

              {onOpenContact && (
                <button
                  onClick={() => {
                    onOpenContact();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium text-[#f09267] hover:bg-[#f09267]/10 flex items-center justify-between cursor-pointer"
                >
                  <span>تماس با ما و شماره‌ها</span>
                  <Phone className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
