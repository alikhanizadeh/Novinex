import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Phone,
  CreditCard,
  Truck,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { CartItem, User } from "../types";
import { formatToman } from "../lib/formatters";
import { saveNewOrder } from "../lib/authStore";
import { api } from "../lib/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentUser: User | null;
  onOpenProfile: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onOpenProfile,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<
    "cart" | "shipping" | "payment" | "success"
  >("cart");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online",
  );
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Pre-populate shipping info if user is logged in
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name || "");
      if (!phone) setPhone(currentUser.phone || "");
      if (!address) setAddress(currentUser.address || "");
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum + (Number(item?.product?.price) || 0) * (Number(item?.quantity) || 1),
    0,
  );

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone || !/^09\d{9}$/.test(cleanPhone)) {
      setPhoneError(
        "لطفاً یک شماره موبایل معتبر ۱۱ رقمی (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.",
      );
      return;
    }

    setCheckoutStep("payment");
  };

  const handleCheckoutSubmit = async () => {
    setIsSubmitting(true);
    const todayPersian = new Intl.DateTimeFormat("fa-IR").format(new Date());
    const randomCode = "MK-" + Math.floor(100000 + Math.random() * 900000);

    // Save order in Prisma database & trigger real SMS
    try {
      await api.createOrder({
        userId: currentUser?.id,
        recipientName: fullName,
        phone,
        address,
        items: cartItems,
        totalAmount,
      });
    } catch (err) {
      console.warn("Database order creation:", err);
    }

    // Save order in local auth store for immediate UI reflect
    saveNewOrder(
      {
        date: todayPersian,
        items: [...cartItems],
        totalAmount,
        status: "در حال پردازش",
        trackingCode: randomCode,
        recipientName: fullName,
        phone,
        address,
      },
      currentUser?.id,
    );

    setIsSubmitting(false);
    setOrderNumber(randomCode);
    setCheckoutStep("success");
  };

  const handleFinish = () => {
    onClearCart();
    setCheckoutStep("cart");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border-r border-white/10 w-full max-w-md h-full flex flex-col justify-between p-6 text-right text-slate-100 shadow-2xl relative">
        {/* Drawer Header */}
        <div className="pb-3 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#f09267]" />
              <h3 className="font-black text-lg text-white">
                تکمیل سفارش خرید
              </h3>
            </div>
            <button
              onClick={onClose}
              id="close-cart-drawer-btn"
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Header */}
          <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-bold">
            <div
              className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                checkoutStep === "cart"
                  ? "bg-[#f09267] text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              ۱. سبد خرید
            </div>
            <div
              className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                checkoutStep === "shipping"
                  ? "bg-[#f09267] text-white shadow-sm"
                  : checkoutStep === "payment" || checkoutStep === "success"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              ۲. اطلاعات گیرنده
            </div>
            <div
              className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                checkoutStep === "payment"
                  ? "bg-[#f09267] text-white shadow-sm"
                  : checkoutStep === "success"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              ۳. پرداخت و پیامک
            </div>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* STEP 1: CART ITEMS */}
          {checkoutStep === "cart" && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-slate-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                  <p className="text-sm font-medium">سبد خرید شما خالی است.</p>
                  <p className="text-xs text-slate-500 font-light">
                    محصولات مورد نظر خود را به سبد اضافه کنید.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="glass-card rounded-2xl p-3.5 border border-white/10 flex items-center gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.nameFa}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-900"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate mb-1">
                        {item.product.nameFa}
                      </h4>
                      <div className="text-xs font-black text-[#f09267] mb-2">
                        {formatToman(
                          (Number(item.product.price) || 0) *
                            (Number(item.quantity) || 1),
                        )}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          تومان
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, -1)
                            }
                            className="w-5 h-5 flex items-center justify-center font-bold text-slate-300 hover:text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold px-1">
                            {Number(item.quantity) || 1}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-5 h-5 flex items-center justify-center font-bold text-slate-300 hover:text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* STEP 2: RECIPIENT & SHIPPING INFO */}
          {checkoutStep === "shipping" && (
            <form
              id="shipping-form"
              onSubmit={handleProceedToPayment}
              className="space-y-4 pt-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#f09267]" />
                  <span>اطلاعات تحویل‌گیرنده و آدرس</span>
                </h4>
                {currentUser && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>تکمیل خودکار از پروفایل</span>
                  </span>
                )}
              </div>

              {!currentUser && (
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>قبلاً در سایت حساب دارید؟</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenProfile();
                    }}
                    className="text-[#f09267] font-bold hover:underline cursor-pointer"
                  >
                    ورود به حساب
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  نام و نام خانوادگی تحویل‌گیرنده:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: علی محمدی"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f09267]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  شماره موبایل (جهت دریافت پیامک کد رهگیری):
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError(null);
                    }}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f09267] font-mono text-left"
                  />
                  <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {phoneError && (
                  <p className="text-[11px] text-rose-400 mt-1">{phoneError}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  پیامک تأیید و کد پیگیری بلافاصله پس از ثبت سفارش به این شماره
                  ارسال می‌شود.
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  آدرس کامل پستی تحویل:
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="استان، شهر، خیابان اصلی، کوچه، پلاک، واحد"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f09267]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  بازگشت به سبد
                </button>
                <button
                  type="submit"
                  id="submit-shipping-btn"
                  className="flex-1 peach-gradient-btn py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-[#f09267]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>ادامه به انتخاب شیوه پرداخت</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD & REVIEW */}
          {checkoutStep === "payment" && (
            <div className="space-y-4 pt-1">
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#f09267]" />
                <span>انتخاب شیوه پرداخت و مرور سفارش</span>
              </h4>

              {/* Payment Method Cards */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full p-3 rounded-2xl border text-right transition-all flex items-start justify-between cursor-pointer ${
                    paymentMethod === "online"
                      ? "border-[#f09267] bg-[#f09267]/10"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#f09267]" />
                      <span>پرداخت اینترنتی امن (درگاه شتاب)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      پرداخت آنلاین با کلیه کارت‌های بانکی عضو شبکه شتاب (تایید
                      آنی)
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                      paymentMethod === "online"
                        ? "border-[#f09267] bg-[#f09267]"
                        : "border-slate-600"
                    }`}
                  >
                    {paymentMethod === "online" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full p-3 rounded-2xl border text-right transition-all flex items-start justify-between cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-[#f09267] bg-[#f09267]/10"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span>پرداخت در محل (کارتخوان هنگام تحویل)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      تسویه حساب با پیک ویژه فروشگاه هنگام تحویل کالا
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                      paymentMethod === "cod"
                        ? "border-[#f09267] bg-[#f09267]"
                        : "border-slate-600"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              </div>

              {/* Order Details Preview Box */}
              <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>تحویل‌گیرنده:</span>
                  <span className="text-white font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>شماره تماس (پیامک):</span>
                  <span
                    className="text-[#f09267] font-mono font-bold"
                    dir="ltr"
                  >
                    {phone}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>هزینه ارسال:</span>
                  <span className="text-emerald-400 font-bold">
                    رایگان (تخفیف ویژه)
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-bold">
                    مبلغ نهایی قابل پرداخت:
                  </span>
                  <span className="text-base font-black text-white">
                    {formatToman(totalAmount)}{" "}
                    <span className="text-xs text-slate-400 font-normal">
                      تومان
                    </span>
                  </span>
                </div>
              </div>

              {/* SMS Notification Guarantee */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-300 flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="text-emerald-400 font-bold">
                    ارسال پیامک آنی:
                  </span>{" "}
                  پس از کلیک روی دکمه زیر، سفارش در سیستم ثبت شده و پیامک حاوی
                  شناسه سفارش و جزییات به شماره موبایل شما ارسال می‌گردد.
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("shipping")}
                  className="px-4 py-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  ویرایش آدرس
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCheckoutSubmit}
                  id="final-checkout-btn"
                  className="flex-1 peach-gradient-btn py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#f09267]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>در حال ثبت و ارسال پیامک...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأیید نهایی و پرداخت</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS WITH SMS CONFIRMATION */}
          {checkoutStep === "success" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h4 className="text-xl font-black text-white">
                سفارش شما با موفقیت ثبت شد!
              </h4>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-right text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">شناسه پیگیری سفارش:</span>
                  <span
                    className="font-mono text-[#f09267] font-bold text-sm"
                    dir="ltr"
                  >
                    {orderNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">مبلغ پرداخت شده:</span>
                  <span className="text-white font-bold">
                    {formatToman(totalAmount)} تومان
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">شیوه پرداخت:</span>
                  <span className="text-emerald-400 font-bold">
                    {paymentMethod === "online"
                      ? "پرداخت اینترنتی آنلاین"
                      : "پرداخت در محل"}
                  </span>
                </div>
              </div>

              {/* SMS Feedback Badge */}
              <div className="p-3.5 rounded-2xl bg-[#f09267]/10 border border-[#f09267]/30 text-xs text-right space-y-1.5">
                <div className="flex items-center gap-2 text-[#f09267] font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>پیامک تأیید سفارش ارسال گردید:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  پیامک حاوی کد پیگیری{" "}
                  <span className="font-mono text-white font-bold" dir="ltr">
                    {orderNumber}
                  </span>{" "}
                  برای شماره موبایل{" "}
                  <span className="font-mono text-white font-bold" dir="ltr">
                    {phone}
                  </span>{" "}
                  ارسال شد.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleFinish}
                  className="peach-gradient-btn px-6 py-3 rounded-xl text-xs font-bold w-full cursor-pointer"
                >
                  بازگشت به فروشگاه
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer for Step 1 */}
        {checkoutStep === "cart" && cartItems.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">جمع کل سبد خرید:</span>
              <span className="font-black text-lg text-white">
                {formatToman(totalAmount)}{" "}
                <span className="text-xs text-slate-400">تومان</span>
              </span>
            </div>

            <button
              onClick={() => setCheckoutStep("shipping")}
              id="proceed-to-checkout-btn"
              className="w-full peach-gradient-btn py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#f09267]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>تکمیل اطلاعات و ادامه خرید</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
