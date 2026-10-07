-- Visit Barichara — carga inicial: los 15 restaurantes y 15 hoteles mejor
-- calificados de Barichara (investigación de reseñas públicas en
-- TripAdvisor/Google/Booking, octubre 2026). Ejecutar una sola vez en el
-- SQL Editor de Supabase después de supabase/schema.sql.
-- Zonas, teléfonos y fotos quedan sin diligenciar: se completan desde el
-- panel de administración (/admin) o cuando cada negocio se vincule
-- directamente a la plataforma.

insert into public.businesses (slug, name, category, description_es, description_en, active) values
('restaurante-terra', 'Restaurante Terra', 'restaurante', 'Cocina italiana y mediterránea, uno de los restaurantes mejor calificados de Barichara.', 'Italian and Mediterranean cuisine, one of Barichara''s top-rated restaurants.', true),
('la-puerta-secret-kitchen', 'La Puerta Secret Kitchen', 'restaurante', 'Cocina internacional contemporánea en un ambiente íntimo.', 'Contemporary international cuisine in an intimate setting.', true),
('epice', 'Épice', 'restaurante', 'Cocina libanesa y marroquí con especias traídas de Medio Oriente.', 'Lebanese and Moroccan cuisine with Middle Eastern spices.', true),
('bari-comidas', 'Bari Comidas', 'restaurante', 'Italiana y pizzería, uno de los más visitados del pueblo.', 'Italian food and pizzeria, one of the town''s most visited spots.', true),
('elvia-cocina-local', 'Elvia Cocina Local', 'restaurante', 'Cocina de fusión santandereana servida en platos de barro bajo techos de bahareque.', 'Santander fusion cuisine served in clay dishes under traditional bahareque roofs.', true),
('shambala', 'Shambala', 'restaurante', 'Comida latina y opciones saludables en un espacio relajado.', 'Latin food and healthy options in a relaxed space.', true),
('frenchut', 'Frenchut', 'restaurante', 'Cocina francesa en el corazón de Barichara.', 'French cuisine in the heart of Barichara.', true),
('gringo-mikes', 'Gringo Mike''s Barichara', 'restaurante', 'Comida americana casera, hamburguesas y desayunos.', 'Homestyle American food, burgers and breakfasts.', true),
('en-el-patio', 'En El Patio Barichara', 'restaurante', 'Comida casera en un patio colonial, muy bien calificado por los visitantes.', 'Homestyle cooking in a colonial courtyard, highly rated by visitors.', true),
('el-compa', 'Restaurante El Compa', 'restaurante', 'Cocina tradicional santandereana con menú del día.', 'Traditional Santander cuisine with a daily set menu.', true),
('noa-restaurante', 'Noa Restaurante', 'restaurante', 'Mezcla ecléctica de platos de inspiración árabe y favoritos colombianos.', 'An eclectic mix of Middle-Eastern inspired dishes and Colombian favorites.', true),
('milana-barichara', 'Milana Barichara', 'restaurante', 'Experiencia de mesa a la huerta con ingredientes locales.', 'Farm-to-table dining experience with local ingredients.', true),
('mija', 'Mija', 'restaurante', 'Cocina latina, española y colombiana.', 'Latin, Spanish and Colombian cuisine.', true),
('el-puntal', 'El Puntal', 'restaurante', 'Comidas accesibles y deliciosas, famoso por sus hamburguesas.', 'Affordable and delicious meals, famous for its burgers.', true),
('filomena', 'Filomena', 'restaurante', 'Ambiente colonial, conocido por sus hamburguesas y sándwiches.', 'Colonial-style ambiance, known for burgers and sandwiches.', true),
('hotel-terra-barichara', 'Hotel Terra Barichara', 'hotel', 'Uno de los hoteles mejor calificados del pueblo, con desayuno incluido.', 'One of the town''s top-rated hotels, with breakfast included.', true),
('casa-barichara-boutique', 'Casa Barichara Boutique', 'hotel', 'Hotel boutique con piscina y vista a la cordillera de los Yariguíes, a 8 minutos de la plaza.', 'Boutique hotel with pool and views of the Yariguíes mountain range, 8 minutes from the main square.', true),
('casa-oniri', 'Casa Oniri Hotel Boutique', 'hotel', 'Arquitectura colonial con interiorismo contemporáneo, cerca de la plaza principal.', 'Colonial architecture with contemporary interior design, near the main square.', true),
('hotel-hicasua', 'Hotel Hicasua', 'hotel', 'Hotel con piscina al aire libre y spa, uno de los más reservados de Barichara.', 'Hotel with outdoor pool and spa, one of Barichara''s most booked.', true),
('serrania-del-viento', 'Serranía del Viento', 'hotel', 'Domos de glamping con desayuno incluido en medio de la naturaleza.', 'Glamping domes with breakfast included, surrounded by nature.', true),
('macedonia-hacienda', 'Macedonia Hacienda Hotel', 'hotel', 'Hotel campestre de lujo a minutos de Barichara.', 'Luxury countryside hotel minutes from Barichara.', true),
('la-nube-posada', 'La Nube Posada', 'hotel', 'Hotel boutique a dos cuadras del parque principal, con restaurante de fusión mediterránea.', 'Boutique hotel two blocks from the main park, with Mediterranean fusion restaurant.', true),
('posada-villa-paula', 'La Posada Villa Paula', 'hotel', 'Alojamiento acogedor y económico en el centro del pueblo.', 'Cozy, budget-friendly accommodation in the town center.', true),
('la-juanita-hostel', 'La Juanita Hostel', 'hotel', 'Hostel boutique en una casa patrimonial, con terraza y vistas al pueblo.', 'Boutique hostel in a heritage house, with terrace and town views.', true),
('color-de-hormiga', 'Color de Hormiga Reserva Natural', 'hotel', 'Finca en una reserva natural de 29 hectáreas sobre el Camino Real.', 'Farmhouse on a 29-hectare nature reserve along the Camino Real.', true),
('corata', 'Coratá', 'hotel', 'Casa de 300 años decorada con antigüedades y muebles de madera.', 'A 300-year-old house decorated with antiques and wood furnishings.', true),
('mision-santa-barbara', 'Hotel Misión Santa Bárbara', 'hotel', 'Hotel con muy altas calificaciones de huéspedes en el centro de Barichara.', 'Hotel with excellent guest ratings in central Barichara.', true),
('hotel-venturi', 'Hotel Boutique Venturi', 'hotel', 'Arquitectura colonial y contemporánea, con piscina y vista a las montañas.', 'Colonial and contemporary architecture, with pool and mountain views.', true),
('casa-yahri', 'Casa Yahri', 'hotel', 'Alojamiento con jardín, piscina al aire libre y wifi gratis.', 'Accommodation with garden, outdoor pool and free wifi.', true),
('achiotte', 'Achiotte by Masaya Collection', 'hotel', 'Alojamiento de colección con diseño cuidado en Barichara.', 'Collection-brand stay with thoughtful design in Barichara.', true)
on conflict (slug) do nothing;
