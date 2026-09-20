import {
  Category,
  Product,
  Review,
  User,
  OrderHistoryItem,
  CartItem,
} from "../types";

export const api = {
  // Check Database Status (Neon PostgreSQL via Prisma)
  async getDatabaseStatus(): Promise<{
    status: string;
    database: string;
    connected: boolean;
    latencyMs?: number;
    stats?: {
      products: number;
      users: number;
      orders: number;
      categories: number;
      reviews: number;
      contactMessages: number;
    };
  }> {
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error("Health check failed");
      return await res.json();
    } catch {
      return {
        status: "offline",
        database: "Neon PostgreSQL",
        connected: false,
      };
    }
  },

  // Get all categories from PostgreSQL
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return await res.json();
    } catch (e) {
      console.warn("Using fallback categories due to API error:", e);
      return [];
    }
  },

  // Get products with optional filtering, search, sorting and pagination
  async getProducts(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    specialOffer?: boolean;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== "all") {
        searchParams.set("category", params.category);
      }
      if (params?.search) {
        searchParams.set("search", params.search);
      }
      if (params?.featured) {
        searchParams.set("featured", "true");
      }
      if (params?.specialOffer) {
        searchParams.set("specialOffer", "true");
      }
      if (params?.inStock) {
        searchParams.set("inStock", "true");
      }
      if (params?.minPrice !== undefined) {
        searchParams.set("minPrice", String(params.minPrice));
      }
      if (params?.maxPrice !== undefined) {
        searchParams.set("maxPrice", String(params.maxPrice));
      }
      if (params?.sortBy) {
        searchParams.set("sortBy", params.sortBy);
      }
      if (params?.page) {
        searchParams.set("page", String(params.page));
      }
      if (params?.limit) {
        searchParams.set("limit", String(params.limit));
      }

      const res = await fetch(`/api/products?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    } catch (e) {
      console.warn("API error fetching products from Neon PostgreSQL:", e);
      return [];
    }
  },

  // Get single product with full specs, reviews, and related items
  async getProductById(
    id: string,
  ): Promise<(Product & { relatedProducts?: Product[] }) | null> {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Save new order to Neon PostgreSQL Database
  async createOrder(orderData: {
    userId?: string;
    recipientName: string;
    phone: string;
    address: string;
    items: any[];
    totalAmount: number;
    notes?: string;
  }): Promise<{ success: boolean; order?: any; error?: string }> {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Get User Orders or Search by Tracking Code
  async getUserOrders(
    userId?: string,
    trackingCode?: string,
  ): Promise<OrderHistoryItem[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.set("userId", userId);
      if (trackingCode) params.set("trackingCode", trackingCode);

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Get single order by tracking code or ID
  async getOrderDetails(idOrTracking: string): Promise<any | null> {
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(idOrTracking)}`,
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // User Auth Register / Upsert
  async registerUser(userData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password?: string;
    role?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // User Login
  async loginUser(credentials: {
    email: string;
    password?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Send 4-Digit OTP SMS Code
  async sendOtp(phone: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    phone?: string;
    provider?: string;
    code?: string;
  }> {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      return await res.json();
    } catch (e: any) {
      return {
        success: false,
        error: e.message || "خطا در برقراری ارتباط با سرور پیامک",
      };
    }
  },

  // Verify 4-Digit OTP SMS Code & Login
  async verifyOtp(params: {
    phone: string;
    code: string;
    name?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    user?: User;
  }> {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || "خطا در تأیید کد" };
    }
  },

  // Update User Profile
  async updateUserProfile(profileData: {
    id?: string;
    email: string;
    name?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Wishlist API
  async getWishlist(userId: string): Promise<Product[]> {
    try {
      const res = await fetch(
        `/api/wishlist?userId=${encodeURIComponent(userId)}`,
      );
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async toggleWishlist(
    userId: string,
    productId: string,
  ): Promise<{ success: boolean; added: boolean }> {
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      return await res.json();
    } catch {
      return { success: false, added: false };
    }
  },

  // Cart API
  async getCart(userId: string): Promise<CartItem[]> {
    try {
      const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async addToCart(
    userId: string,
    productId: string,
    quantity = 1,
  ): Promise<{ success: boolean; message?: string; cart?: CartItem[] }> {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async updateCartQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<{ success: boolean; cart?: CartItem[] }> {
    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async removeFromCart(
    userId: string,
    productId: string,
  ): Promise<{ success: boolean; cart?: CartItem[] }> {
    try {
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async clearCart(userId: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch("/api/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  // Reviews API
  async getReviews(productId?: string): Promise<Review[]> {
    try {
      const url = productId
        ? `/api/reviews?productId=${encodeURIComponent(productId)}`
        : "/api/reviews";
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async submitReview(data: {
    name: string;
    comment: string;
    rating: number;
    productId?: string;
    userId?: string;
    role?: string;
  }): Promise<{ success: boolean; review?: any; error?: string }> {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Submit Contact Form
  async submitContact(data: {
    name: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Subscribe Newsletter
  async subscribeNewsletter(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Sync / Seed Default Catalog into Neon PostgreSQL
  async syncDefaultCatalog(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },
};
