import { fallbackBlogPosts, fallbackProducts } from "@/data/fallback";
import type {
  AuthResponse,
  BlogPost,
  BlogPostListItem,
  Cart,
  Order,
  Product,
  ProductCard,
  Profile,
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function request<T>(path: string, options?: FetchOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message =
      (await response.json().catch(() => null))?.detail ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildAuthHeaders(token?: string | null, sessionId?: string) {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(sessionId ? { "X-Session-Id": sessionId } : {}),
  };
}

export async function getProducts(): Promise<ProductCard[]> {
  try {
    return await request<ProductCard[]>("/products", {
      next: { revalidate: 120 },
    });
  } catch {
    return fallbackProducts;
  }
}

export async function getFeaturedProducts(): Promise<ProductCard[]> {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, 3);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await request<Product>(`/products/${slug}`, {
      next: { revalidate: 120 },
    });
  } catch {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    return await request<BlogPostListItem[]>("/blog", {
      next: { revalidate: 300 },
    });
  } catch {
    return fallbackBlogPosts;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await request<BlogPost>(`/blog/${slug}`, {
      next: { revalidate: 300 },
    });
  } catch {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function getCart(sessionId: string, token?: string | null): Promise<Cart> {
  return request<Cart>("/cart", {
    headers: buildAuthHeaders(token, sessionId),
    cache: "no-store",
  });
}

export async function upsertCartItem(
  payload: { product_id: string; quantity: number; mode?: "add" | "set" },
  sessionId: string,
  token?: string | null
): Promise<Cart> {
  return request<Cart>("/cart", {
    method: "POST",
    headers: buildAuthHeaders(token, sessionId),
    body: JSON.stringify({
      product_id: payload.product_id,
      quantity: payload.quantity,
      mode: payload.mode ?? "add",
    }),
  });
}

export async function removeCartItem(
  productId: string,
  sessionId: string,
  token?: string | null
): Promise<Cart> {
  return request<Cart>("/cart/item", {
    method: "DELETE",
    headers: buildAuthHeaders(token, sessionId),
    body: JSON.stringify({ product_id: productId }),
  });
}

export async function signup(payload: {
  email: string;
  password: string;
  full_name?: string;
  session_id?: string;
}) {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: {
  email: string;
  password: string;
  session_id?: string;
}) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshToken(refreshTokenValue: string) {
  return request<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshTokenValue }),
  });
}

export async function logout(refreshTokenValue: string) {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshTokenValue }),
  });
}

export async function getProfile(token: string): Promise<Profile> {
  return request<Profile>("/profile", {
    headers: buildAuthHeaders(token),
    cache: "no-store",
  });
}

export async function updateProfile(
  token: string,
  payload: {
    full_name?: string;
    default_address?: {
      label: string;
      full_name: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      phone?: string;
      is_default: boolean;
    };
  }
): Promise<Profile> {
  return request<Profile>("/profile", {
    method: "PUT",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function getOrders(token: string): Promise<Order[]> {
  return request<Order[]>("/orders", {
    headers: buildAuthHeaders(token),
    cache: "no-store",
  });
}

export async function createCheckout(
  sessionId: string,
  payload: {
    email: string;
    shipping_address: {
      full_name: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      phone?: string;
    };
    success_url?: string;
    cancel_url?: string;
    notes?: string;
  },
  token?: string | null
) {
  return request<{ order_id: string; stripe_session_id: string; checkout_url: string }>(
    "/checkout",
    {
      method: "POST",
      headers: buildAuthHeaders(token, sessionId),
      body: JSON.stringify(payload),
    }
  );
}

export async function subscribeToNewsletter(email: string) {
  return request<{ message: string }>("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function submitContactForm(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return request<{ message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

