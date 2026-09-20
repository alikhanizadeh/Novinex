import React from "react";
import {
  Lock,
  UserPlus,
  LogIn,
  X,
  ShoppingBag,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { Product } from "../types";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAction: "cart" | "wishlist";
  product?: Product | null;
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  targetAction,
  product,
  onNavigateToRegister,
  onNavigateToLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0f172a] border border-[#f09267]/40 w-full max-w-md rounded-3xl p-6 text-right text-slate-100 shadow-2xl relative space-y-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-auth-required-modal-btn"
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-[#f09267]/15 border border-[#f09267]/30 flex items-center justify-center text-[#f09267] shadow-inner relative">
            <Lock className="w-8 h-8 stroke-[1.8]" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#f09267] text-white flex items-center justify-center text-[10px] shadow">
              {targetAction === "cart" ? (
                <ShoppingBag className="w-3.5 h-3.5" />
              ) : (
                <Heart className="w-3.5 h-3.5 fill-white" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-black text-white">
            ورود یا ثبت‌نام در آشپزخانه مدرن
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs font-light">
            جهت افزودن{" "}
            {product ? (
              <span className="font-bold text-white">«{product.nameFa}»</span>
            ) : (
              "محصول"
            )}{" "}
            به {targetAction === "cart" ? "سبد خرید" : "لیست علاقه‌مندی‌ها"}،
            لطفاً ابتدا وارد حساب کاربری خود شوید یا به راحتی ثبت‌نام کنید.
          </p>
        </div>
        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Button: Direct to Register */}
          <button
            type="button"
            onClick={onNavigateToRegister}
            id="auth-required-register-btn"
            className="w-full peach-gradient-btn py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#f09267]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت‌نام کاربر جدید </span>
          </button>

          {/* Secondary Button: Direct to Login */}
          <button
            type="button"
            onClick={onNavigateToLogin}
            id="auth-required-login-btn"
            className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#f09267]/40 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#f09267]" />
            <span>ورود به حساب کاربری موجود</span>
          </button>
        </div>
      </div>
    </div>
  );
};
