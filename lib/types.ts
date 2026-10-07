export type Category =
  | "experiencia"
  | "taller"
  | "transporte"
  | "evento"
  | "hotel"
  | "restaurante"
  | "comercio";

export type BusinessStatus = "borrador" | "aprobado" | "rechazado";

export type BusinessPlan = "basico" | "destacado" | "destacado_bilingue";

export type AuthorizationChannel = "whatsapp" | "correo" | "firma" | "formulario";

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
  website: string | null;
  instagram: string | null;
  source_url: string | null;
  is_sample: boolean;
  status: BusinessStatus;
  plan: BusinessPlan | null;
  authorized_at: string | null;
  authorized_by: string | null;
  authorization_channel: AuthorizationChannel | null;
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
