import React, { useState, useEffect } from "react";
import { PRODUCTS } from "./data/products";
import { Product, CartItem, CategoryId, User } from "./types";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryList } from "./components/CategoryList";
import { BestSellers } from "./components/BestSellers";
import { AllProductsGrid } from "./components/AllProductsGrid";
import { ValueProps } from "./components/ValueProps";
import { Reviews } from "./components/Reviews";
import { Footer } from "./components/Footer";
import { AboutPage } from "./components/AboutPage";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { UserProfileModal } from "./components/UserProfileModal";
import { ContactModal } from "./components/ContactModal";
import { AuthRequiredModal } from "./components/AuthRequiredModal";
import {
  getCurrentUser,
  getStoredCart,
  saveStoredCart,
  getStoredWishlist,
  saveStoredWishlist,
} from "./lib/authStore";
import { api } from "./lib/api";
import { Check, AlertCircle, UserPlus } from "lucide-react";

export default function App() {
  // Current active view: 'home' | 'about'
  const [currentView, setCurrentView] = useState<"home" | "about">("home");

  // Dynamic products list from Neon PostgreSQL backend
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Current logged in user (loaded from localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getCurrentUser(),
  );

  // Cart initialized from stored cart (defaults to empty if user cleared it)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getStoredCart());

  // Wishlist initialized from stored wishlist (defaults to empty if user cleared it)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    getStoredWishlist(),
  );
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Auth Required Modal State
  const [authRequired, setAuthRequired] = useState<{
    isOpen: boolean;
    targetAction: "cart" | "wishlist";
    product: Product | null;
  }>({
    isOpen: false,
    targetAction: "cart",
    product: null,
  });

  // Controls which tab opens in UserProfileModal ('login' | 'register')
  const [profileInitialTab, setProfileInitialTab] = useState<
    "login" | "register"
  >("login");

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    saveStoredCart(cartItems);
  }, [cartItems]);

  // Sync wishlist with localStorage whenever it changes
  useEffect(() => {
    saveStoredWishlist(wishlistIds);
  }, [wishlistIds]);

  // Load products and user's server-side wishlist on mount / user change
  useEffect(() => {
    let isMounted = true;
    api
      .getProducts()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});

    // If user is logged in, fetch their wishlist and cart from Neon PostgreSQL
    if (currentUser?.id) {
      api
        .getWishlist(currentUser.id)
        .then((serverWishlist) => {
          if (isMounted && Array.isArray(serverWishlist)) {
            const serverIds = serverWishlist.map((p) => p.id);
            // Merge server wishlist with local wishlist (without duplicates)
            setWishlistIds((prev) =>
              Array.from(new Set([...prev, ...serverIds])),
            );
          }
        })
        .catch(() => {});

      api
        .getCart(currentUser.id)
        .then((serverCart) => {
          if (isMounted && Array.isArray(serverCart) && serverCart.length > 0) {
            setCartItems(serverCart);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Enhanced Toast Notification
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    type?: "success" | "warning";
    action?: {
      label: string;
      onClick: () => void;
    };
  } | null>(null);

  const showToast = (
    msg: string,
    type: "success" | "warning" = "success",
    action?: { label: string; onClick: () => void },
  ) => {
    setToastNotification({ message: msg, type, action });
    setTimeout(
      () => {
        setToastNotification(null);
      },
      action ? 6500 : 3500,
    );
  };

  // Helper to open Registration modal directly
  const handleOpenRegisterFromAction = () => {
    setAuthRequired({ isOpen: false, targetAction: "cart", product: null });
    setProfileInitialTab("register");
    setIsProfileOpen(true);
  };

  // Helper to open Login modal directly
  const handleOpenLoginFromAction = () => {
    setAuthRequired({ isOpen: false, targetAction: "cart", product: null });
    setProfileInitialTab("login");
    setIsProfileOpen(true);
  };

  // User change handler (sync cart & wishlist on login/switch)
  const handleUserChange = (user: User | null) => {
    setCurrentUser(user);
    if (user?.id) {
      api
        .getCart(user.id)
        .then((serverCart) => {
          if (Array.isArray(serverCart) && serverCart.length > 0) {
            setCartItems(serverCart);
          }
        })
        .catch(() => {});

      api
        .getWishlist(user.id)
        .then((serverWishlist) => {
          if (Array.isArray(serverWishlist)) {
            setWishlistIds(serverWishlist.map((p) => p.id));
          }
        })
        .catch(() => {});
    }
  };

  // Navigation handlers
  const handleNavigateHome = () => {
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateAbout = () => {
    setCurrentView("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenContact = () => {
    setIsContactOpen(true);
  };

  const handleExploreProducts = () => {
    setCurrentView("home");
    setTimeout(() => {
      const el = document.getElementById("products-catalog");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Cart operations (safe with both mouse events and numeric quantities)
  const handleAddToCart = async (
    product: Product,
    quantityOrEvent?: number | React.MouseEvent,
    event?: React.MouseEvent,
  ) => {
    // If user is not logged in, show auth required notification and modal
    if (!currentUser) {
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      } else if (
        quantityOrEvent &&
        typeof (quantityOrEvent as any).stopPropagation === "function"
      ) {
        (quantityOrEvent as any).stopPropagation();
      }
      setAuthRequired({
        isOpen: true,
        targetAction: "cart",
        product,
      });
      showToast(
        `برای افزودن «${product.nameFa}» به سبد خرید، لطفاً ابتدا ثبت‌نام کنید یا وارد شوید.`,
        "warning",
        {
          label: "ثبت‌نام سریع",
          onClick: handleOpenRegisterFromAction,
        },
      );
      return;
    }

    let qty = 1;
    if (typeof quantityOrEvent === "number") {
      qty = quantityOrEvent > 0 ? Math.floor(quantityOrEvent) : 1;
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
    } else if (
      quantityOrEvent &&
      typeof (quantityOrEvent as any).stopPropagation === "function"
    ) {
      (quantityOrEvent as any).stopPropagation();
      qty = 1;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: (Number(item.quantity) || 1) + qty }
            : item,
        );
      }
      return [...prev, { product, quantity: qty }];
    });

    showToast(`"${product.nameFa}" به سبد خرید اضافه شد.`);

    // If user is logged in, sync with backend database
    if (currentUser?.id) {
      try {
        await api.addToCart(currentUser.id, product.id, qty);
      } catch (err) {
        console.warn("Could not sync cart with server:", err);
      }
    }
  };

  const handleUpdateCartQuantity = async (productId: string, delta: number) => {
    let newCalculatedQty = 0;
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.product.id === productId) {
              const currentQty = Number(item.quantity) || 1;
              const newQty = currentQty + delta;
              newCalculatedQty = newQty;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );

    if (currentUser?.id) {
      try {
        if (newCalculatedQty > 0) {
          await api.updateCartQuantity(
            currentUser.id,
            productId,
            newCalculatedQty,
          );
        } else {
          await api.removeFromCart(currentUser.id, productId);
        }
      } catch (err) {
        console.warn("Could not update cart quantity on server:", err);
      }
    }
  };

  const handleRemoveCartItem = async (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
    if (currentUser?.id) {
      try {
        await api.removeFromCart(currentUser.id, productId);
      } catch (err) {
        console.warn("Could not remove cart item on server:", err);
      }
    }
  };

  const handleClearCart = async () => {
    setCartItems([]);
    if (currentUser?.id) {
      try {
        await api.clearCart(currentUser.id);
      } catch (err) {
        console.warn("Could not clear cart on server:", err);
      }
    }
  };

  // Wishlist operations
  const handleToggleWishlist = async (
    product: Product,
    e?: React.MouseEvent,
  ) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }

    // If user is not logged in, show auth required notification and modal
    if (!currentUser) {
      setAuthRequired({
        isOpen: true,
        targetAction: "wishlist",
        product,
      });
      showToast(
        `برای افزودن «${product.nameFa}» به لیست علاقه‌مندی‌ها، لطفاً ابتدا ثبت‌نام کنید یا وارد شوید.`,
        "warning",
        {
          label: "ثبت‌نام سریع",
          onClick: handleOpenRegisterFromAction,
        },
      );
      return;
    }

    const isCurrentlyInWishlist = wishlistIds.includes(product.id);

    if (isCurrentlyInWishlist) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`"${product.nameFa}" از لیست علاقه‌مندی‌ها حذف شد.`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`"${product.nameFa}" به علاقه‌مندی‌ها اضافه شد.`);
    }

    // If user is logged in, sync with backend database
    if (currentUser?.id) {
      try {
        await api.toggleWishlist(currentUser.id, product.id);
      } catch (err) {
        console.warn("Could not sync wishlist with server:", err);
      }
    }
  };

  // Scroll to catalog
  const scrollToCatalog = () => {
    setCurrentView("home");
    setTimeout(() => {
      const el = document.getElementById("products-catalog");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleCategorySelect = (catId: CategoryId | "all") => {
    setActiveCategory(catId);
    scrollToCatalog();
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-['Vazirmatn'] selection:bg-[#f09267] selection:text-white">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-[#0f172a] border ${
            toastNotification.type === "warning"
              ? "border-amber-500/80 shadow-amber-500/10"
              : "border-[#f09267]"
          } text-white px-5 py-3.5 rounded-2xl shadow-2xl flex flex-wrap items-center gap-3 text-xs font-bold animate-bounce max-w-md`}
        >
          <div
            className={`w-7 h-7 rounded-full ${
              toastNotification.type === "warning"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-[#f09267] text-white"
            } flex items-center justify-center shrink-0`}
          >
            {toastNotification.type === "warning" ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="flex-1 leading-relaxed">
            {toastNotification.message}
          </span>

          {toastNotification.action && (
            <button
              onClick={toastNotification.action.onClick}
              className="peach-gradient-btn px-3 py-1.5 rounded-xl text-[11px] font-bold text-white flex items-center gap-1 shrink-0 shadow hover:brightness-110 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{toastNotification.action.label}</span>
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectCategory={handleCategorySelect}
        activeCategory={activeCategory}
        onSearchClick={scrollToCatalog}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim()) scrollToCatalog();
        }}
        onProfileClick={() => setIsProfileOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateAbout={handleNavigateAbout}
        onOpenContact={handleOpenContact}
        currentUser={currentUser}
        currentView={currentView}
      />

      {/* Main View Router */}
      {currentView === "about" ? (
        <AboutPage
          onNavigateHome={handleNavigateHome}
          onOpenContact={handleOpenContact}
          onExploreProducts={handleExploreProducts}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Banner */}
          <Hero onExploreClick={scrollToCatalog} />

          {/* Product Categories */}
          <CategoryList
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Best Sellers Section */}
          <BestSellers
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onViewAllClick={() => {
              setActiveCategory("all");
              scrollToCatalog();
            }}
          />

          {/* Value Propositions / Features */}
          <ValueProps />

          {/* All Products Catalog */}
          <AllProductsGrid
            products={products}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            searchQuery={searchQuery}
          />

          {/* Customer Reviews */}
          <Reviews />
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={handleCategorySelect}
        onNavigateHome={handleNavigateHome}
        onNavigateAbout={handleNavigateAbout}
        onOpenContact={handleOpenContact}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={
          selectedProduct ? wishlistIds.includes(selectedProduct.id) : false
        }
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Wishlist Slide-Over Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={(p) => handleToggleWishlist(p)}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* User Profile / Auth Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        showToast={showToast}
        initialTab={profileInitialTab}
      />

      {/* Auth Required Interceptor Modal */}
      <AuthRequiredModal
        isOpen={authRequired.isOpen}
        onClose={() => setAuthRequired((prev) => ({ ...prev, isOpen: false }))}
        targetAction={authRequired.targetAction}
        product={authRequired.product}
        onNavigateToRegister={handleOpenRegisterFromAction}
        onNavigateToLogin={handleOpenLoginFromAction}
      />

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        showToast={showToast}
      />
    </div>
  );
}
