export type Category = "hotel" | "restaurante" | "comercio";

export type Business = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  zone: string | null;
  description_es: string | null;
  description_en: string | null;
  phone: string | null;
  whatsapp: string | null;
  price_range: string | null;
  active: boolean;
  next_payment_due: string | null;
  created_at: string;
};

export type BusinessPhoto = {
  id: string;
  business_id: string;
  storage_path: string;
  position: number;
};
