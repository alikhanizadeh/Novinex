import React, { useState, useEffect } from "react";
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  Heart,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Package,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Edit3,
  Save,
  Clock,
} from "lucide-react";
import { User, OrderHistoryItem } from "../types";
import {
  loginUser,
  registerUser,
  loginDemoUser,
  logoutUser,
  updateUserProfile,
  getStoredOrders,
  setCurrentUser,
} from "../lib/authStore";
import { api } from "../lib/api";
import { formatToman, toPersianDigits } from "../lib/formatters";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  showToast: (msg: string) => void;
  initialTab?: "login" | "register";
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onOpenWishlist,
  onOpenCart,
  showToast,
  initialTab,
}) => {
  // Navigation & Sub-views:
  // When unauthenticated: 'login' | 'register' | 'forgot'
  // When authenticated: 'profile' | 'orders'
  const [authTab, setAuthTab] = useState<"login" | "register" | "forgot">(
    "login",
  );
  const [activeUserTab, setActiveUserTab] = useState<"profile" | "orders">(
    "profile",
  );

  // Login Method inside Login Tab: 'otp' (SMS 4-digit) | 'password'
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");

  // Register SMS Verification Step: 1 = form details, 2 = verify 4-digit SMS code
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regOtpCode, setRegOtpCode] = useState("");
  const [regCountdown, setRegCountdown] = useState(0);
  const [regDevHint, setRegDevHint] = useState<string | null>(null);

  // OTP Login Form State (4-Digit SMS code)
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<1 | 2>(1); // 1: Enter Phone, 2: Enter 4-Digit Code
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpDevHint, setOtpDevHint] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // Orders State
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Error/Success Message inside modal
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize editing form with currentUser
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone || "");
      setEditAddress(currentUser.address || "");
      const userOrders = getStoredOrders(currentUser.id);
      setOrders(userOrders);
    } else {
      if (initialTab) {
        setAuthTab(initialTab);
      }
      setModalError(null);
      setModalSuccess(null);
    }
  }, [currentUser, isOpen, initialTab]);

  // OTP & Register Countdown timer
  useEffect(() => {
    if (otpCountdown <= 0 && regCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setRegCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown, regCountdown]);

  if (!isOpen) return null;

  // Clear feedback messages on tab switch
  const handleSwitchAuthTab = (tab: "login" | "register" | "forgot") => {
    setAuthTab(tab);
    setModalError(null);
    setModalSuccess(null);
  };

  // OTP Login Handler 1: Send SMS code
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    const cleanPhone = otpPhone.trim();
    if (!cleanPhone) {
      setModalError("لطفاً شماره موبایل خود را وارد نمایید.");
      return;
    }

    if (!/^09\d{9}$/.test(cleanPhone)) {
      setModalError("شماره موبایل نامعتبر است. نمونه صحیح: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendOtp(cleanPhone);
      setIsSubmitting(false);

      if (res.success) {
        setOtpStep(2);
        setOtpCountdown(120); // 2 minutes
        setModalSuccess("کد ۴ رقمی از طریق پیامک برای شماره شما ارسال شد.");
        if (res.code) {
          setOtpDevHint(res.code);
        }
      } else {
        setModalError(res.error || "خطا در ارسال پیامک");
      }
    } catch {
      setIsSubmitting(false);
      setModalError("خطا در برقراری ارتباط با سرور پیامک");
    }
  };

  // OTP Login Handler 2: Verify Code and Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    const cleanCode = otpCode.trim();
    if (cleanCode.length !== 4) {
      setModalError("لطفاً کد ۴ رقمی پیامک شده را به صورت کامل وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.verifyOtp({
        phone: otpPhone.trim(),
        code: cleanCode,
      });

      setIsSubmitting(false);

      if (res.success && res.user) {
        setCurrentUser(res.user);
        onUserChange(res.user);
        showToast(`خوش آمدید ${res.user.name}! ورود با موفقیت انجام شد.`);
        onClose();
      } else {
        setModalError(res.error || "کد وارد شده اشتباه یا منقضی شده است.");
      }
    } catch {
      setIsSubmitting(false);
      setModalError("خطا در اعتبارسنجی کد پیامک");
    }
  };

  // Register SMS Handler 1: Send verification code to registering phone
  const handleSendRegisterSms = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!regName.trim()) {
      setModalError("لطفاً نام و نام خانوادگی خود را وارد کنید.");
      return;
    }
    const cleanPhone = regPhone.trim();
    if (!cleanPhone || !/^09\d{9}$/.test(cleanPhone)) {
      setModalError(
        "لطفاً شماره موبایل معتبر ۱۱ رقمی (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.",
      );
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setModalError("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
      return;
    }
    if (regPassword.length < 6) {
      setModalError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setModalError("رمز عبور و تکرار آن با یکدیگر مطابقت ندارند.");
      return;
    }
    if (!acceptTerms) {
      setModalError("لطفاً شرایط و حریم خصوصی را تایید نمایید.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendOtp(cleanPhone);
      setIsSubmitting(false);

      if (res.success) {
        setRegStep(2);
        setRegCountdown(120);
        setModalSuccess("کد تأیید ۴ رقمی برای شماره موبایل شما پیامک شد.");
        if (res.code) {
          setRegDevHint(res.code);
        }
      } else {
        setModalError(res.error || "خطا در ارسال پیامک");
      }
    } catch {
      setIsSubmitting(false);
      setModalError("خطا در ارتباط با سرور پیامک");
    }
  };

  // Register SMS Handler 2: Verify code and finalize registration
  const handleVerifyRegisterSmsAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    const cleanCode = regOtpCode.trim();
    if (cleanCode.length !== 4) {
      setModalError("لطفاً کد ۴ رقمی پیامک شده را کامل وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Verify OTP with server
      const verifyRes = await api.verifyOtp({
        phone: regPhone.trim(),
        code: cleanCode,
        name: regName.trim(),
      });

      if (!verifyRes.success) {
        setIsSubmitting(false);
        setModalError(
          verifyRes.error || "کد وارد شده اشتباه یا منقضی شده است.",
        );
        return;
      }

      // 2. Update user info with the email, password, and address from register form
      const serverRes = await api.registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        address: regAddress.trim(),
        password: regPassword,
      });

      setIsSubmitting(false);

      if (serverRes.success && serverRes.user) {
        setCurrentUser(serverRes.user);
        onUserChange(serverRes.user);
        showToast("ثبت‌نام شما با تأیید شماره موبایل با موفقیت انجام شد.");
        onClose();
        return;
      }

      // Fallback
      if (verifyRes.user) {
        setCurrentUser(verifyRes.user);
        onUserChange(verifyRes.user);
        showToast("ثبت‌نام شما با موفقیت تکمیل شد.");
        onClose();
      }
    } catch {
      setIsSubmitting(false);
      setModalError("خطا در اعتبارسنجی کد پیامک یا ثبت اطلاعات.");
    }
  };

  // Password strength calculation
  const getPasswordStrength = (
    pass: string,
  ): { label: string; color: string; percent: number } => {
    if (!pass) return { label: "", color: "bg-transparent", percent: 0 };
    if (pass.length < 6)
      return {
        label: "ضعیف (حداقل ۶ کاراکتر)",
        color: "bg-rose-500",
        percent: 30,
      };
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);
    if (hasLetters && hasNumbers && (hasSpecial || pass.length >= 8)) {
      return { label: "بسیار قوی", color: "bg-emerald-500", percent: 100 };
    }
    return { label: "متوسط", color: "bg-amber-500", percent: 65 };
  };

  const passStrength = getPasswordStrength(regPassword);

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setModalError("لطفاً ایمیل / شماره موبایل و رمز عبور را وارد کنید.");
      return;
    }

    setIsSubmitting(true);

    // 1. Try server login first
    try {
      const serverRes = await api.loginUser({
        email: loginIdentifier,
        password: loginPassword,
      });
      if (serverRes.success && serverRes.user) {
        setIsSubmitting(false);
        setCurrentUser(serverRes.user);
        onUserChange(serverRes.user);
        showToast(`خوش آمدید ${serverRes.user.name}!`);
        setModalSuccess(`خوش آمدید ${serverRes.user.name}!`);
        return;
      }
    } catch {
      // Continue to local fallback
    }

    // 2. Local fallback
    const res = loginUser(loginIdentifier, loginPassword);
    setIsSubmitting(false);
    if (res.success && res.user) {
      onUserChange(res.user);
      showToast(res.message);
      setModalSuccess(res.message);

      // Background register in database if not there
      api
        .registerUser({
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          password: loginPassword,
          address: res.user.address,
        })
        .catch(() => {});
    } else {
      setModalError(res.message);
    }
  };

  // Demo Login handler
  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    const res = loginDemoUser();
    setIsSubmitting(false);
    onUserChange(res.user);
    showToast(res.message);

    // Ensure demo user is recorded in backend database as well
    api
      .registerUser({
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        password: "password123",
        address: res.user.address,
        role: res.user.role,
      })
      .catch(() => {});
  };

  // Register handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!regName.trim()) {
      setModalError("لطفاً نام و نام خانوادگی خود را وارد کنید.");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setModalError("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
      return;
    }
    if (regPassword.length < 6) {
      setModalError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setModalError("رمز عبور و تکرار آن با یکدیگر مطابقت ندارند.");
      return;
    }
    if (!acceptTerms) {
      setModalError("لطفاً شرایط و حریم خصوصی را تایید نمایید.");
      return;
    }

    setIsSubmitting(true);

    // 1. Try server register first
    try {
      const serverRes = await api.registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        address: regAddress.trim(),
        password: regPassword,
      });

      if (serverRes.success && serverRes.user) {
        setIsSubmitting(false);
        setCurrentUser(serverRes.user);
        onUserChange(serverRes.user);
        showToast("ثبت‌نام شما با موفقیت در سیستم ثبت گردید.");
        return;
      }
    } catch {
      // Fallback
    }

    // 2. Local fallback
    const res = registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      password: regPassword,
    });
    setIsSubmitting(false);

    if (res.success && res.user) {
      onUserChange(res.user);
      showToast(res.message);
    } else {
      setModalError(res.message);
    }
  };

  // Forgot password handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (forgotStep === 1) {
      if (!forgotEmail.trim()) {
        setModalError("لطفاً ایمیل خود را وارد کنید.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setForgotStep(2);
        setModalSuccess(
          "کد تایید ۶ رقمی به ایمیل شما ارسال شد (کد پیش‌فرض: ۱۲۳۴۵۶)",
        );
      }, 500);
    } else {
      if (!forgotCode.trim()) {
        setModalError("لطفاً کد تایید را وارد کنید.");
        return;
      }
      if (forgotNewPassword.length < 6) {
        setModalError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد.");
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        showToast("رمز عبور با موفقیت به‌روزرسانی شد. اکنون وارد شوید.");
        setAuthTab("login");
        setForgotStep(1);
        setLoginIdentifier(forgotEmail);
      }, 400);
    }
  };

  // Save profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!editName.trim()) {
      setModalError("نام نمی‌تواند خالی باشد.");
      return;
    }

    // Try server update
    api
      .updateUserProfile({
        id: currentUser.id,
        email: currentUser.email,
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
      })
      .catch(() => {});

    const res = updateUserProfile({
      id: currentUser.id,
      name: editName,
      phone: editPhone,
      address: editAddress,
    });

    if (res.success && res.user) {
      onUserChange(res.user);
      setIsEditingProfile(false);
      showToast("اطلاعات کاربری با موفقیت ویرایش شد.");
    } else {
      setModalError(res.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    onUserChange(null);
    showToast("شما با موفقیت از حساب کاربری خارج شدید.");
    setAuthTab("login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-right text-slate-100 shadow-2xl relative">
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          id="close-profile-modal-btn"
          className="absolute top-5 left-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Global Error/Success Alert */}
        {modalError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{modalError}</span>
          </div>
        )}
        {modalSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{modalSuccess}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE 1: USER IS NOT LOGGED IN (LOGIN / REGISTER / FORGOT FLOW) */}
        {/* ========================================================================= */}
        {!currentUser ? (
          <div>
            {/* Header / Brand */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f09267] to-[#e87a48] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#f09267]/20 mb-3">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {authTab === "login" && "ورود به حساب کاربری"}
                {authTab === "register" && "ثبت‌نام در آشپزخانه مدرن"}
                {authTab === "forgot" && "بازیابی رمز عبور"}
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                {authTab === "login" &&
                  "ورود با کد پیامکی یک‌بار مصرف یا کلمه عبور اختصاصی"}
                {authTab === "register" &&
                  "عضو باشگاه مشتریان شوید و شماره موبایل خود را تایید نمایید"}
                {authTab === "forgot" &&
                  "اطلاعات حساب خود را جهت بازیابی رمز عبور وارد نمایید"}
              </p>
            </div>

            {/* Auth Tabs Switcher (Only 2 Tabs: Login and Register) */}
            {authTab !== "forgot" && (
              <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6 gap-1">
                <button
                  type="button"
                  id="tab-login-btn"
                  onClick={() => handleSwitchAuthTab("login")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    authTab === "login"
                      ? "bg-[#f09267] text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ورود به حساب</span>
                </button>
                <button
                  type="button"
                  id="tab-register-btn"
                  onClick={() => handleSwitchAuthTab("register")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    authTab === "register"
                      ? "bg-[#f09267] text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>ثبت‌نام کاربر جدید</span>
                </button>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* VIEW A: LOGIN TAB (SMS OTP or Password) */}
            {/* ---------------------------------------------------- */}
            {authTab === "login" && (
              <div className="space-y-4">
                {/* Login Method Toggle */}
                <div className="flex p-1 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("otp");
                      setModalError(null);
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                      loginMethod === "otp"
                        ? "bg-slate-800 text-[#f09267] shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>کد یک‌بار مصرف پیامکی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("password");
                      setModalError(null);
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                      loginMethod === "password"
                        ? "bg-slate-800 text-[#f09267] shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>کلمه عبور</span>
                  </button>
                </div>

                {/* Sub-mode 1: SMS OTP Login */}
                {loginMethod === "otp" ? (
                  <div>
                    {otpStep === 1 ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            شماره موبایل:
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              dir="ltr"
                              value={otpPhone}
                              onChange={(e) => setOtpPhone(e.target.value)}
                              placeholder="09123456789"
                              id="login-otp-phone-input"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267] text-left font-mono tracking-wider"
                            />
                            <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1.5">
                            کد تأیید ۴ رقمی به این شماره ارسال خواهد شد.
                          </p>
                        </div>

                        <button
                          type="submit"
                          id="login-send-otp-btn"
                          disabled={isSubmitting}
                          className="w-full py-3 rounded-xl bg-[#f09267] hover:bg-[#e87a48] text-white font-bold text-xs shadow-lg shadow-[#f09267]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>در حال ارسال پیامک...</span>
                            </>
                          ) : (
                            <>
                              <span>ارسال کد تأیید ۴ رقمی</span>
                              <ArrowRight className="w-4 h-4 rotate-180" />
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                          <div className="text-slate-300">
                            ارسال به:{" "}
                            <span
                              className="font-mono text-[#f09267] font-bold"
                              dir="ltr"
                            >
                              {otpPhone}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpStep(1);
                              setOtpCode("");
                              setModalError(null);
                            }}
                            className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            ویرایش شماره
                          </button>
                        </div>

                        {otpDevHint && (
                          <div className="p-2.5 bg-[#f09267]/10 border border-[#f09267]/30 rounded-xl text-center text-xs text-[#f09267] font-medium flex items-center justify-center gap-2">
                            <span>کد دریافتی:</span>
                            <span className="font-mono text-base font-black tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-[#f09267]/40">
                              {otpDevHint}
                            </span>
                            <button
                              type="button"
                              onClick={() => setOtpCode(otpDevHint)}
                              className="text-[10px] underline hover:text-white mr-1"
                            >
                              (جاگذاری خودکار)
                            </button>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                            کد ۴ رقمی ارسال شده را وارد نمایید:
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            dir="ltr"
                            autoFocus
                            value={otpCode}
                            onChange={(e) =>
                              setOtpCode(
                                e.target.value.replace(/\D/g, "").slice(0, 4),
                              )
                            }
                            placeholder="••••"
                            id="login-otp-code-input"
                            className="w-full bg-slate-900 border-2 border-slate-700 focus:border-[#f09267] rounded-2xl py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder-slate-600 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          {otpCountdown > 0 ? (
                            <div className="flex items-center gap-1.5 text-amber-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                ارسال مجدد تا {Math.floor(otpCountdown / 60)}:
                                {(otpCountdown % 60)
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendOtp()}
                              className="text-[#f09267] hover:underline font-bold text-xs cursor-pointer"
                            >
                              ارسال مجدد کد تأیید
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          id="login-verify-otp-btn"
                          disabled={isSubmitting || otpCode.length !== 4}
                          className="w-full py-3 rounded-xl bg-[#f09267] hover:bg-[#e87a48] text-white font-bold text-xs shadow-lg shadow-[#f09267]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>در حال بررسی...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تأیید و ورود به حساب</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  /* Sub-mode 2: Password Login */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        ایمیل یا شماره موبایل:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="chef@modernkitchen.ir یا ۰۹۱۲..."
                          id="login-identifier-input"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                        />
                        <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          رمز عبور:
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSwitchAuthTab("forgot")}
                          className="text-[11px] text-[#f09267] hover:underline"
                        >
                          فراموشی رمز عبور؟
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          id="login-password-input"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                        />
                        <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <button
                          type="button"
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-[#f09267] focus:ring-0"
                        />
                        <span className="text-xs text-slate-400">
                          مرا به خاطر بسپار
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="submit-login-btn"
                      className="w-full peach-gradient-btn py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#f09267]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>ورود به حساب کاربری</span>
                    </button>

                    {/* Quick 1-Click Demo Login */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-[#0f172a] px-3 text-slate-500 font-light">
                          یا ورود تست
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isSubmitting}
                      id="quick-demo-login-btn"
                      className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#f09267]/40 text-slate-200 text-xs font-semibold hover:text-[#f09267] transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#f09267]" />
                      <span>ورود تستی با اکانت دمو (سرآشپز VIP)</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* VIEW B: REGISTRATION FORM WITH SMS VERIFICATION */}
            {/* ---------------------------------------------------- */}
            {authTab === "register" && (
              <div>
                {regStep === 1 ? (
                  <form
                    onSubmit={handleSendRegisterSms}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        نام و نام خانوادگی{" "}
                        <span className="text-rose-400">*</span>:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="مثال: علی محمدی"
                          id="reg-name-input"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                        />
                        <UserIcon className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          شماره موبایل (جهت دریافت کد تأیید){" "}
                          <span className="text-rose-400">*</span>:
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            dir="ltr"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            id="reg-phone-input"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267] font-mono"
                          />
                          <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          ایمیل <span className="text-rose-400">*</span>:
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="your@email.com"
                            id="reg-email-input"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                          />
                          <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        آدرس پیش‌فرض جهت ارسال سفارش‌ها (اختیاری):
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="استان، شهر، خیابان اصلی، پلاک..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                        />
                        <MapPin className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          رمز عبور <span className="text-rose-400">*</span>:
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? "text" : "password"}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="حداقل ۶ کاراکتر"
                            id="reg-password-input"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                          />
                          <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showRegPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          تکرار رمز عبور{" "}
                          <span className="text-rose-400">*</span>:
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? "text" : "password"}
                            required
                            value={regConfirmPassword}
                            onChange={(e) =>
                              setRegConfirmPassword(e.target.value)
                            }
                            placeholder="تکرار رمز"
                            id="reg-confirm-password-input"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                          />
                          <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Password Strength Meter */}
                    {regPassword && (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>قدرت رمز:</span>
                          <span className="font-bold">
                            {passStrength.label}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passStrength.color}`}
                            style={{ width: `${passStrength.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-[#f09267] focus:ring-0 mt-0.5"
                        />
                        <span className="text-[11px] text-slate-400 leading-relaxed">
                          کلیه قوانین خرید، ضمانت اصالت کالا و حفظ حریم خصوصی را
                          می‌پذیرم.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="submit-register-btn"
                      className="w-full peach-gradient-btn py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#f09267]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>در حال ارسال پیامک...</span>
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4" />
                          <span>ارسال کد تأیید ۴ رقمی به موبایل</span>
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Verify SMS OTP to finalize registration */
                  <form
                    onSubmit={handleVerifyRegisterSmsAndSubmit}
                    className="space-y-4"
                  >
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div className="text-slate-300">
                        پیامک تایید به شماره:{" "}
                        <span
                          className="font-mono text-[#f09267] font-bold"
                          dir="ltr"
                        >
                          {regPhone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRegStep(1);
                          setRegOtpCode("");
                          setModalError(null);
                        }}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        ویرایش اطلاعات
                      </button>
                    </div>

                    {regDevHint && (
                      <div className="p-2.5 bg-[#f09267]/10 border border-[#f09267]/30 rounded-xl text-center text-xs text-[#f09267] font-medium flex items-center justify-center gap-2">
                        <span>کد دریافتی:</span>
                        <span className="font-mono text-base font-black tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-[#f09267]/40">
                          {regDevHint}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRegOtpCode(regDevHint)}
                          className="text-[10px] underline hover:text-white mr-1"
                        >
                          (جاگذاری خودکار)
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                        کد ۴ رقمی پیامک شده برای شماره شما:
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        dir="ltr"
                        autoFocus
                        value={regOtpCode}
                        onChange={(e) =>
                          setRegOtpCode(
                            e.target.value.replace(/\D/g, "").slice(0, 4),
                          )
                        }
                        placeholder="••••"
                        id="reg-otp-code-input"
                        className="w-full bg-slate-900 border-2 border-slate-700 focus:border-[#f09267] rounded-2xl py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      {regCountdown > 0 ? (
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            ارسال مجدد تا {Math.floor(regCountdown / 60)}:
                            {(regCountdown % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendRegisterSms()}
                          className="text-[#f09267] hover:underline font-bold text-xs cursor-pointer"
                        >
                          ارسال مجدد کد تأیید
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      id="verify-reg-otp-submit-btn"
                      disabled={isSubmitting || regOtpCode.length !== 4}
                      className="w-full py-3 rounded-xl bg-[#f09267] hover:bg-[#e87a48] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#f09267]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>در حال اعتبارسنجی و ثبت حساب...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تأیید نهایی کد پیامک و ثبت حساب</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* VIEW C: FORGOT PASSWORD FORM */}
            {/* ---------------------------------------------------- */}
            {authTab === "forgot" && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {forgotStep === 1 ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        ایمیل ثبت‌نام شده:
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="example@mail.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f09267]"
                        />
                        <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full peach-gradient-btn py-3 rounded-xl font-bold text-xs shadow-md"
                    >
                      ارسال کد تایید بازیابی
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        کد تایید ۶ رقمی:
                      </label>
                      <input
                        type="text"
                        required
                        value={forgotCode}
                        onChange={(e) => setForgotCode(e.target.value)}
                        placeholder="۱۲۳۴۵۶"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-center font-mono tracking-widest text-white focus:outline-none focus:border-[#f09267]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        رمز عبور جدید:
                      </label>
                      <input
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="حداقل ۶ کاراکتر"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f09267]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full peach-gradient-btn py-3 rounded-xl font-bold text-xs shadow-md"
                    >
                      تغییر رمز عبور و بازگشت به ورود
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleSwitchAuthTab("login")}
                  className="w-full text-center text-xs text-slate-400 hover:text-white pt-2"
                >
                  ← بازگشت به صفحه ورود
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* STATE 2: USER IS LOGGED IN (PROFILE DASHBOARD & ORDERS HISTORY) */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* User Header Profile Card */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f09267] to-[#e87a48] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#f09267]/25">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{currentUser.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <Sparkles className="w-3 h-3" />
                      <span>{currentUser.role || "عضو ویژه"}</span>
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentUser.email}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    عضویت از تاریخ: {toPersianDigits(currentUser.joinedDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs: Profile vs Orders */}
            <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
              <button
                type="button"
                id="user-tab-profile-btn"
                onClick={() => setActiveUserTab("profile")}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeUserTab === "profile"
                    ? "bg-[#f09267] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>اطلاعات حساب</span>
              </button>
              <button
                type="button"
                id="user-tab-orders-btn"
                onClick={() => setActiveUserTab("orders")}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeUserTab === "orders"
                    ? "bg-[#f09267] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>تاریخچه سفارشات ({toPersianDigits(orders.length)})</span>
              </button>
            </div>

            {/* ---------------------------------------------------- */}
            {/* SUB-TAB 1: PROFILE INFO & EDITING */}
            {/* ---------------------------------------------------- */}
            {activeUserTab === "profile" && (
              <div className="space-y-4">
                {!isEditingProfile ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-[#f09267]" />
                          نام و نام خانوادگی:
                        </span>
                        <span className="text-white font-medium">
                          {currentUser.name}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#f09267]" />
                          ایمیل:
                        </span>
                        <span className="text-white font-medium">
                          {currentUser.email}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#f09267]" />
                          شماره همراه:
                        </span>
                        <span className="text-white font-medium">
                          {currentUser.phone
                            ? toPersianDigits(currentUser.phone)
                            : "ثبت نشده"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#f09267]" />
                          آدرس ارسال:
                        </span>
                        <span className="text-white font-medium max-w-[200px] truncate text-left dir-rtl">
                          {currentUser.address || "ثبت نشده"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditingProfile(true)}
                      id="edit-profile-btn"
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>ویرایش اطلاعات حساب</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        نام کامل:
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#f09267]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        شماره همراه:
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#f09267]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        آدرس پیش‌فرض ارسال:
                      </label>
                      <textarea
                        rows={2}
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#f09267]"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 peach-gradient-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>ذخیره تغییرات</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                      >
                        انصراف
                      </button>
                    </div>
                  </form>
                )}

                {/* Quick links to Cart and Wishlist */}
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] text-slate-500 font-bold px-1">
                    دسترسی سریع
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#f09267]" />
                        <span>سبد خرید</span>
                      </div>
                      <span className="text-slate-500">←</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenWishlist();
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>علاقه‌مندی‌ها</span>
                      </div>
                      <span className="text-slate-500">←</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* SUB-TAB 2: ORDER HISTORY */}
            {/* ---------------------------------------------------- */}
            {activeUserTab === "orders" && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5 space-y-2">
                    <Package className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">
                      شما هنوز سفارشی ثبت نکرده‌اید.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        const el = document.getElementById("products-catalog");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="peach-gradient-btn px-4 py-2 rounded-xl text-xs font-bold mt-2"
                    >
                      مشاهده و خرید محصولات
                    </button>
                  </div>
                ) : (
                  orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-[#f09267]/30 transition-all text-xs"
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer select-none"
                          onClick={() =>
                            setExpandedOrderId(isExpanded ? null : order.id)
                          }
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-white font-bold">
                                {order.trackingCode || order.id}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {order.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>تاریخ: {toPersianDigits(order.date)}</span>
                              <span>•</span>
                              <span>
                                {toPersianDigits(order.items.length)} قلم کالا
                              </span>
                            </div>
                          </div>

                          <div className="text-left">
                            <div className="font-black text-sm text-[#f09267]">
                              {formatToman(order.totalAmount)} تومان
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {isExpanded ? "بستن جزئیات ▲" : "مشاهده جزئیات ▼"}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Items */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.nameFa}
                                    className="w-8 h-8 rounded-lg object-cover bg-slate-900"
                                  />
                                  <span className="text-slate-200">
                                    {item.product.nameFa}
                                  </span>
                                  <span className="text-slate-500">
                                    × {toPersianDigits(item.quantity)}
                                  </span>
                                </div>
                                <span className="text-slate-300 font-medium">
                                  {formatToman(
                                    item.product.price * item.quantity,
                                  )}{" "}
                                  تومان
                                </span>
                              </div>
                            ))}

                            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                              <span className="text-slate-500">
                                آدرس تحویل:{" "}
                              </span>
                              <span>{order.address}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Logout Button */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={handleLogout}
                id="logout-btn"
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
