import React, { useState } from "react";
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  ChefHat,
  Menu,
  X,
  Phone,
  Info,
} from "lucide-react";
import { CategoryId, User } from "../types";
import { toPersianDigits } from "../lib/formatters";

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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navItems: { id: CategoryId; label: string }[] = [
    { id: "pots", label: "قابلمه" },
    { id: "pans", label: "ماهیتابه" },
    { id: "sets", label: "سرویس آشپزخانه" },
    { id: "dining", label: "ظروف پذیرایی" },
    { id: "appliances", label: "لوازم برقی" },
    { id: "tools", label: "ابزار آشپزی" },
  ];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchClick();
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          {/* 1 & 5 & 6. RIGHT SECTION: Brand Logo + Search (Box on desktop, Icon on mobile) + Menu Toggle on mobile */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* 1. Brand Logo & Name - Always on the Right corner */}
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 sm:gap-2.5 text-right group focus:outline-none shrink-0"
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
                - On large screens: full input box
                - On small screens: only search icon button */}

            {/* Search Box for Desktop (Large screen) */}
            <div className="hidden lg:flex items-center w-48 xl:w-64">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="جستجو در محصولات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  id="header-search-input"
                  className="w-full bg-slate-900/80 text-xs text-slate-100 placeholder-slate-400 pl-4 pr-9 py-2 rounded-full border border-slate-800 focus:outline-none focus:border-[#f09267]/60 focus:ring-1 focus:ring-[#f09267]/60 transition-all"
                />
                <button
                  onClick={onSearchClick}
                  id="header-search-btn"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f09267] transition-colors cursor-pointer"
                  title="جستجو"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
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

      {/* Mobile Search Dropdown Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0b101d]/95 backdrop-blur-2xl px-4 py-3 animate-fadeIn">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="جستجو در محصولات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              autoFocus
              className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-[#f09267]/50 focus:outline-none focus:ring-2 focus:ring-[#f09267]"
            />
            <button
              onClick={() => {
                onSearchClick();
                setMobileSearchOpen(false);
              }}
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f09267] flex items-center justify-center cursor-pointer"
              title="جستجو"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
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
