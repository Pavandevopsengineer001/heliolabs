export type Ingredient = {
  name: string;
  benefit: string;
};

export type Review = {
  name: string;
  title: string;
  rating: number;
};

export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price_cents: number;
  image_url: string;
  skin_types: string[];
  concerns: string[];
  featured: boolean;
  rating: number;
  review_count: number;
};

export type Product = ProductCard & {
  description: string;
  gallery: string[];
  ingredients: Ingredient[];
  benefits: string[];
  how_to_use: string[];
  reviews: Review[];
  stock_available: number;
  created_at?: string;
};

export type CartItem = {
  product_id: string;
  name: string;
  slug: string;
  image_url: string;
  unit_price_cents: number;
  quantity: number;
  subtotal_cents: number;
  stock_available: number;
};

export type Cart = {
  id?: string | null;
  items: CartItem[];
  total_items: number;
  subtotal_cents: number;
};

export type User = {
  id: string;
  email: string;
  full_name?: string | null;
  role: "customer" | "admin";
  created_at: string;
};

export type Address = {
  id?: string;
  label: string;
  full_name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string | null;
  is_default: boolean;
};

export type Profile = User & {
  addresses: Address[];
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  image_url: string;
  quantity: number;
  unit_price_cents: number;
};

export type Order = {
  id: string;
  email: string;
  status: string;
  currency: string;
  subtotal_amount_cents: number;
  total_amount_cents: number;
  stripe_checkout_session_id?: string | null;
  created_at: string;
  updated_at: string;
  shipping_address: Record<string, string>;
  items: OrderItem[];
};

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  seo_description: string;
  hero_image: string;
  tags: string[];
  published_at: string;
};

export type BlogPost = BlogPostListItem & {
  content_markdown: string;
};

