export type Attraction = {
  slug: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  emoji: string;
};

export const attractions: Attraction[] = [
  {
    slug: "camino-real-guane",
    title_es: "Camino Real a Guane",
    title_en: "Camino Real to Guane",
    description_es:
      "Sendero empedrado de 10 km, construido por los indígenas Guane, que conecta Barichara con el pueblo de Guane entre miradores sobre el cañón del río Suárez.",
    description_en:
      "A 10 km stone-paved trail, built by the Guane people, linking Barichara to the village of Guane past viewpoints over the Suárez river canyon.",
    emoji: "🥾",
  },
  {
    slug: "salto-del-mico",
    title_es: "Mirador El Salto del Mico",
    title_en: "El Salto del Mico Viewpoint",
    description_es:
      "A un kilómetro de la catedral, uno de los miradores más populares del pueblo, con vistas abiertas sobre las montañas y el río Suárez, ideal al atardecer.",
    description_en:
      "A kilometer from the cathedral, one of the town's most popular viewpoints, with open views over the mountains and the Suárez river — best at sunset.",
    emoji: "🌄",
  },
  {
    slug: "cascada-juan-curi",
    title_es: "Cascada de Juan Curí",
    title_en: "Juan Curí Waterfall",
    description_es:
      "A pocos minutos de Barichara, una caída de agua de más de 200 metros con pozos naturales donde se puede nadar, rodeada de bosque húmedo tropical.",
    description_en:
      "A short drive from Barichara, a waterfall over 200 meters high with natural pools you can swim in, surrounded by tropical forest.",
    emoji: "💦",
  },
  {
    slug: "parque-chicamocha",
    title_es: "Cañón y Parque Nacional del Chicamocha",
    title_en: "Chicamocha Canyon & National Park",
    description_es:
      "A poca distancia en carro, el segundo cañón más grande del mundo: teleférico, parapente y rafting sobre uno de los paisajes más impresionantes de Santander.",
    description_en:
      "A short drive away, the world's second-largest canyon: cable car, paragliding and rafting over one of Santander's most striking landscapes.",
    emoji: "🪂",
  },
  {
    slug: "calle-real",
    title_es: "Calle Real y arquitectura colonial",
    title_en: "Calle Real & colonial architecture",
    description_es:
      "Calles empedradas, fachadas blancas y techos de teja entre las mejor conservadas de Colombia — Monumento Nacional desde 1978 y escenario perfecto para caminar sin rumbo.",
    description_en:
      "Cobblestone streets, whitewashed façades and tiled roofs among the best preserved in Colombia — a National Monument since 1978 and perfect for wandering.",
    emoji: "🏘️",
  },
  {
    slug: "talleres-artesania",
    title_es: "Talleres de talabartería y talla en piedra",
    title_en: "Leatherwork & stone-carving workshops",
    description_es:
      "Barichara es cuna de la talabartería en cuero y la talla en piedra. Varios talleres abren sus puertas para ver a los artesanos trabajar y llevarse una pieza única.",
    description_en:
      "Barichara is a birthplace of leatherwork and stone carving. Several workshops open their doors so visitors can watch artisans at work and take home a one-of-a-kind piece.",
    emoji: "🪵",
  },
];
