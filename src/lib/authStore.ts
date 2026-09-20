import { User, OrderHistoryItem, CartItem } from "../types";

const USERS_STORAGE_KEY = "modern_kitchen_users";
const CURRENT_USER_KEY = "modern_kitchen_current_user";
const ORDERS_STORAGE_KEY = "modern_kitchen_orders";

// Initial pre-configured demo user
const INITIAL_DEMO_USERS: User[] = [
  {
    id: "user-demo-1",
    name: "سرآشپز گرامی",
    email: "chef@modernkitchen.ir",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    address: "تهران، خیابان ولیعصر، برج سپهر، واحد ۴۰۲",
    password: "password123",
    role: "سرآشپز VIP",
    joinedDate: "۱۴۰۲/۰۶/۱۵",
  },
];

function normalizeUser(user: Partial<User> & { createdAt?: string }): User {
  const joinedDate =
    user.joinedDate ||
    (user.createdAt
      ? new Intl.DateTimeFormat("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(user.createdAt))
      : new Intl.DateTimeFormat("fa-IR").format(new Date()));

  return {
    id: user.id || `user-${Date.now()}`,
    name: user.name || "کاربر",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    password: user.password || "",
    role: user.role || "عضو ویژه",
    joinedDate,
    avatar: user.avatar,
  };
}

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(INITIAL_DEMO_USERS),
      );
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error("Error saving current user:", e);
  }
}

export function registerUser(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
}): { success: boolean; message: string; user?: User } {
  const users = getStoredUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  // Check if email already exists
  const existingByEmail = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );
  if (existingByEmail) {
    return {
      success: false,
      message: "کاربری با این آدرس ایمیل قبلاً ثبت نام کرده است.",
    };
  }

  // Check phone if provided
  if (data.phone) {
    const existingByPhone = users.find(
      (u) => u.phone && u.phone.trim() === data.phone?.trim(),
    );
    if (existingByPhone) {
      return {
        success: false,
        message: "کاربری با این شماره موبایل قبلاً ثبت شده است.",
      };
    }
  }

  const todayPersian = new Intl.DateTimeFormat("fa-IR").format(new Date());

  const newUser: User = normalizeUser({
    id: "user-" + Date.now(),
    name: data.name.trim(),
    email: normalizedEmail,
    phone: data.phone?.trim() || "",
    address: data.address?.trim() || "",
    password: data.password,
    role: "عضو ویژه",
    joinedDate: todayPersian,
  });

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  setCurrentUser(newUser);

  return {
    success: true,
    message: "ثبت‌نام شما با موفقیت انجام شد.",
    user: newUser,
  };
}

export function loginUser(
  identifier: string,
  password: string,
): { success: boolean; message: string; user?: User } {
  const users = getStoredUsers();
  const cleanId = identifier.trim().toLowerCase();

  const found = users.find(
    (u) =>
      (u.email.toLowerCase() === cleanId ||
        (u.phone && u.phone === identifier.trim())) &&
      u.password === password,
  );

  if (!found) {
    return {
      success: false,
      message: "ایمیل/شماره موبایل یا رمز عبور وارد شده نادرست است.",
    };
  }

  setCurrentUser(found);
  return { success: true, message: `خوش آمدید ${found.name}!`, user: found };
}

export function loginDemoUser(): {
  success: boolean;
  message: string;
  user: User;
} {
  const users = getStoredUsers();
  const demoUser =
    users.find((u) => u.email === "chef@modernkitchen.ir") ||
    INITIAL_DEMO_USERS[0];
  setCurrentUser(demoUser);
  return {
    success: true,
    message: "با حساب پیش‌فرض سرآشپز VIP وارد شدید.",
    user: demoUser,
  };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function updateUserProfile(updated: Partial<User> & { id: string }): {
  success: boolean;
  message: string;
  user?: User;
} {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === updated.id);

  if (index === -1) {
    return { success: false, message: "کاربر یافت نشد." };
  }

  const currentUser = users[index];
  const newUserData: User = normalizeUser({
    ...currentUser,
    ...updated,
  });

  users[index] = newUserData;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  setCurrentUser(newUserData);

  return {
    success: true,
    message: "اطلاعات با موفقیت ذخیره شد.",
    user: newUserData,
  };
}

export function getStoredOrders(userId?: string): OrderHistoryItem[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const allOrders: (OrderHistoryItem & { userId?: string })[] =
      JSON.parse(raw);
    if (!userId) return allOrders;
    return allOrders.filter((o) => o.userId === userId || !o.userId);
  } catch {
    return [];
  }
}

export function saveNewOrder(
  order: Omit<OrderHistoryItem, "id">,
  userId?: string,
): OrderHistoryItem {
  const allOrders = getStoredOrders();
  const newOrder: OrderHistoryItem & { userId?: string } = {
    ...order,
    id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    userId,
  };

  allOrders.unshift(newOrder);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
  return newOrder;
}

// Cart persistence
const CART_STORAGE_KEY = "modern_kitchen_cart";
export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && item.product && item.product.id)
      .map((item) => {
        const rawQty = item.quantity;
        const validQty =
          typeof rawQty === "number" && !isNaN(rawQty) && rawQty > 0
            ? Math.floor(rawQty)
            : 1;
        return {
          product: item.product,
          quantity: validQty,
        };
      });
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Error saving cart:", e);
  }
}

// Wishlist persistence
const WISHLIST_STORAGE_KEY = "modern_kitchen_wishlist";
export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredWishlist(wishlist: string[]): void {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.error("Error saving wishlist:", e);
  }
}
