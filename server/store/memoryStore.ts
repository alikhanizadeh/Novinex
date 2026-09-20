import { REVIEWS } from "../../src/data/products";

// In-memory fallback stores for when external DATABASE_URL is not yet provided
export const memoryUserStore = new Map<string, any>();
export const memoryOrderStore: any[] = [];
export const memoryReviewStore: any[] = [...REVIEWS];
export const memoryContactStore: any[] = [];
export const memorySubscriberStore = new Set<string>();
export const memoryWishlistStore = new Map<string, Set<string>>();
export const memoryCartStore = new Map<string, Map<string, number>>();

export const formatJoinedDate = (value?: string | Date) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("fa-IR").format(new Date());
  }
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const normalizeUserResponse = (user: any) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || "کاربر",
    email: String(user.email || "").toLowerCase(),
    phone: user.phone || "",
    address: user.address || "",
    password: user.password || "",
    role: user.role || "عضو ویژه",
    avatar: user.avatar || undefined,
    joinedDate: user.joinedDate || formatJoinedDate(user.createdAt),
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || user.createdAt || new Date().toISOString(),
  };
};
