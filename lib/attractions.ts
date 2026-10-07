export type Attraction = {
  slug: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  emoji: string;
};

// Todos los datos verificados por fuente — ver tabla de fuentes entregada
// junto con este archivo. Solo atractivos dentro del municipio de Barichara
// (Guane es un corregimiento del propio municipio, no un pueblo aparte).
export const attractions: Attraction[] = [
  {
    slug: "camino-real-guane",
    title_es: "Camino Real a Guane",
    title_en: "Camino Real to Guane",
    description_es:
      "Sendero de piedra de cerca de 9 km que predata la conquista española, reconstruido en 1864 por el ingeniero Geo von Lengerke. Conecta Barichara con el corregimiento de Guane entre vistas del cañón del río Suárez; caminarlo completo toma entre 2 y 3 horas.",
    description_en:
      "A roughly 9 km stone trail predating the Spanish conquest, rebuilt in 1864 by engineer Geo von Lengerke. It links Barichara with the Guane township past views of the Suárez river canyon; walking it end to end takes 2-3 hours.",
    emoji: "🥾",
  },
  {
    slug: "salto-del-mico",
    title_es: "Mirador El Salto del Mico",
    title_en: "El Salto del Mico Viewpoint",
    description_es:
      "A pocos minutos a pie del parque principal, uno de los miradores más visitados de Santander, con vista panorámica del cañón del río Suárez y las montañas de la región.",
    description_en:
      "A few minutes' walk from the main square, one of Santander's most-visited viewpoints, with panoramic views of the Suárez river canyon and the surrounding mountains.",
    emoji: "🌄",
  },
  {
    slug: "guane-museo",
    title_es: "Guane y su Museo Paleontológico y Arqueológico",
    title_en: "Guane & its Paleontological and Archaeological Museum",
    description_es:
      "Corregimiento de Barichara a unos 20 minutos en carro, con calles de piedra amarilla talladas a mano. Su museo, en la plaza principal, conserva fósiles marinos y piezas de la cultura indígena Guane.",
    description_en:
      "A township of Barichara about 20 minutes away by car, with hand-carved yellow stone streets. Its museum, on the main square, holds marine fossils and artifacts from the indigenous Guane culture.",
    emoji: "🦴",
  },
  {
    slug: "catedral-inmaculada-concepcion",
    title_es: "Catedral de la Inmaculada Concepción",
    title_en: "Immaculate Conception Cathedral",
    description_es:
      "Construida hacia 1838 frente al parque principal, en piedra amarilla de canteras de la región. Sus 10 columnas monolíticas de 5 metros sostienen un techo de madera tallada y un altar mayor recubierto en oro.",
    description_en:
      "Built around 1838 facing the main square, in yellow stone from regional quarries. Its ten 5-meter monolithic columns support a carved wooden ceiling and a gold-leafed main altar.",
    emoji: "⛪",
  },
  {
    slug: "calle-real",
    title_es: "Calle Real y arquitectura colonial",
    title_en: "Calle Real & colonial architecture",
    description_es:
      "El centro histórico de Barichara es Monumento Nacional desde 1978 (Decreto 1654). Calles empedradas, fachadas blancas y techos de teja, entre la arquitectura colonial mejor conservada de Colombia.",
    description_en:
      "Barichara's historic center has been a National Monument since 1978 (Decree 1654). Cobblestone streets, whitewashed façades and tiled roofs, among the best-preserved colonial architecture in Colombia.",
    emoji: "🏘️",
  },
  {
    slug: "talleres-artesania",
    title_es: "Talleres de talla en piedra y talabartería",
    title_en: "Stone-carving & leatherwork workshops",
    description_es:
      "Más de 100 artesanos tallan a diario la piedra arenisca de la provincia Guanentina, un oficio heredado de los indígenas Guane. Varios talleres a las afueras del pueblo reciben visitantes.",
    description_en:
      "Over 100 artisans carve the Guanentina province's sandstone daily, a craft inherited from the indigenous Guane people. Several workshops on the edge of town welcome visitors.",
    emoji: "🪵",
  },
];
