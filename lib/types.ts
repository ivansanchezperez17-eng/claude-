export type Category =
  | "experiencia"
  | "taller"
  | "transporte"
  | "evento"
  | "hotel"
  | "restaurante"
  | "comercio";

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
  price_from: string | null;
  schedule: string | null;
  duration: string | null;
  map_url: string | null;
  is_sample: boolean;
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
