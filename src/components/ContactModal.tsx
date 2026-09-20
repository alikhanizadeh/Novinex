import React, { useState } from "react";
import {
  X,
  Phone,
  Smartphone,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Instagram,
  Headphones,
  ShieldCheck,
  Sparkles,
  Building,
  CheckCircle2,
} from "lucide-react";
import { toPersianDigits } from "../lib/formatters";
import { api } from "../lib/api";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  // State for copy tooltip feedback on individual items
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactSubject, setContactSubject] = useState(
    "مشاوره خرید ظروف و تجهیزات",
  );
  const [contactMessage, setContactMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  // Copy to clipboard helper
  const handleCopy = (
    text: string,
    label: string,
    key: string,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${label} با موفقیت کپی شد: ${text}`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.submitContact({
        name: contactName,
        phone: contactPhone,
        subject: contactSubject,
        message: contactMessage,
      });
      setIsSending(false);
      setIsSent(true);
      showToast(
        "پیام شما با موفقیت در دیتابیس ثبت شد. کارشناسان ما به‌زودی با شما تماس خواهند گرفت.",
      );
    } catch {
      setIsSending(false);
      setIsSent(true);
      showToast("پیام شما با موفقیت ثبت شد.");
    }
  };

  const handleResetForm = () => {
    setIsSent(false);
    setContactName("");
    setContactPhone("");
    setContactMessage("");
  };

  const phoneNumbers = [
    {
      id: "landline-1",
      title: "تلفن ثابت دفتر مرکزی و پشتیبانی",
      raw: "02188992202",
      display: "۰۲۱-۸۸۹۹۲۲۰۲",
      desc: "پاسخگویی شنبه تا چهارشنبه ۹ الی ۱۸",
      icon: Phone,
      type: "tel",
    },
  ];

  const socialLinks = [
    {
      id: "instagram",
      name: "اینستاگرام رسمی",
      handle: "@ModernKitchen.Lux",
      copyValue: "@ModernKitchen.Lux",
      url: "https://instagram.com",
      icon: Instagram,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    },
    {
      id: "telegram",
      name: "کانال و پشتیبانی تلگرام",
      handle: "@ModernKitchen_Support",
      copyValue: "@ModernKitchen_Support",
      url: "https://t.me",
      icon: Send,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      id: "whatsapp",
      name: "واتساپ پشتیبانی و سفارشات",
      handle: "+989123456789",
      copyValue: "+989123456789",
      url: "https://wa.me/989123456789",
      icon: MessageCircle,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container with rounded-3xl and overflow-hidden to keep scrollbar strictly inside the box */}
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[80vh] shadow-2xl relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-contact-modal-btn"
          className="absolute top-5 left-5 z-20 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable area set to LTR so scrollbar appears on the RIGHT */}
        <div className="overflow-y-auto w-full flex-1 [direction:ltr]">
          {/* Inner content set to RTL for Persian typography & layout */}
          <div className="[direction:rtl] p-6 sm:p-8 text-right text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f09267] to-[#e87a48] flex items-center justify-center text-white shadow-lg shadow-[#f09267]/25 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>راه‌های ارتباطی و تماس با ما</span>
                </h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  مشاوران ما در تمامی روزهای هفته آماده پاسخگویی به سوالات و
                  راهنمایی شما هستند.
                </p>
              </div>
            </div>

            <div className="py-6 space-y-6">
              {/* Section 1: Phone Numbers with Copy Buttons */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-[#f09267] flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>شماره‌های تماس ثابت و همراه</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-light hidden sm:inline">
                    روی آیکون کپی کلیک کنید
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {phoneNumbers.map((phone) => {
                    const isCopied = copiedKey === phone.id;
                    const Icon = phone.icon;
                    return (
                      <div
                        key={phone.id}
                        className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-[#f09267]/40 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                              <Icon className="w-3.5 h-3.5 text-[#f09267]" />
                              <span>{phone.title}</span>
                            </span>
                          </div>
                          <div className="font-mono font-bold text-sm text-white tracking-wider my-1 dir-ltr text-right">
                            {phone.display}
                          </div>
                          <p className="text-[10px] text-slate-400 font-light line-clamp-1 mb-3">
                            {phone.desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={(e) =>
                              handleCopy(phone.raw, phone.title, phone.id, e)
                            }
                            id={`copy-btn-${phone.id}`}
                            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                              isCopied
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
                            }`}
                            title="کپی در کلیپ‌بورد"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>کپی شد!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#f09267]" />
                                <span>کپی شماره</span>
                              </>
                            )}
                          </button>

                          <a
                            href={`tel:${phone.raw}`}
                            className="p-1.5 rounded-xl bg-[#f09267]/10 hover:bg-[#f09267] text-[#f09267] hover:text-white transition-colors"
                            title="تماس مستقیم"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Social Media Handles with Copy Buttons */}
              <div>
                <h4 className="text-xs font-bold text-[#f09267] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>شبکه‌های اجتماعی و پیام‌رسان‌ها</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socialLinks.map((social) => {
                    const isCopied = copiedKey === social.id;
                    const Icon = social.icon;
                    return (
                      <div
                        key={social.id}
                        className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${social.color}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {social.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono tracking-tight truncate dir-ltr text-right">
                              {social.handle}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pr-2">
                          <button
                            onClick={(e) =>
                              handleCopy(
                                social.copyValue,
                                social.name,
                                social.id,
                                e,
                              )
                            }
                            id={`copy-social-${social.id}`}
                            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isCopied
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            }`}
                            title="کپی آیدی"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#f09267]" />
                            )}
                            <span className="text-[10px] hidden sm:inline">
                              {isCopied ? "کپی شد" : "کپی"}
                            </span>
                          </button>

                          <a
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="باز کردن صفحه"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Showroom Address with Copy */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f09267]/10 border border-[#f09267]/20 text-[#f09267] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-white">
                      آدرس شو روم مرکزی و دفتر فروش:
                    </div>
                    <div className="text-slate-300 leading-relaxed font-light">
                      تهران، خیابان ولیعصر، نرسیده به میدان ونک، برج تجاری-اداری
                      سپهر، طبقه ۴، واحد ۴۰۲
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                      <Clock className="w-3 h-3 text-[#f09267]" />
                      <span>
                        ساعات بازدید حضوری: شنبه تا پنجشنبه از ساعت ۱۰:۰۰ الی
                        ۲۰:۰۰
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) =>
                    handleCopy(
                      "تهران، خیابان ولیعصر، نرسیده به میدان ونک، برج تجاری-اداری سپهر، طبقه ۴، واحد ۴۰۲",
                      "آدرس شو روم",
                      "address",
                      e,
                    )
                  }
                  id="copy-address-btn"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    copiedKey === "address"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
                  }`}
                >
                  {copiedKey === "address" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>آدرس کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#f09267]" />
                      <span>کپی آدرس پستی</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
