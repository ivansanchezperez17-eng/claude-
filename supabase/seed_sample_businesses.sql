-- Visit Barichara — 8 negocios de ejemplo (is_sample = true), uno o dos por
-- cada categoría, para ver el directorio lleno antes de tener clientes
-- reales en todas las categorías nuevas. Seguros de borrar en bloque con
-- `delete from public.businesses where is_sample = true;` cuando ya no se
-- necesiten.

insert into public.businesses
  (slug, name, category, description_es, description_en, price_from, schedule, duration, map_url, is_sample, active)
values
('tour-fotografico-ejemplo', 'Tour Fotográfico Barichara (ejemplo)', 'experiencia',
 'Recorrido guiado de 2 horas por las calles coloniales con un fotógrafo local. Negocio de ejemplo para mostrar el directorio.',
 'A 2-hour guided walk through the colonial streets with a local photographer. Sample listing to preview the directory.',
 'Desde $80.000 por persona', '8:00 am y 4:00 pm', '2 horas',
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true),

('cabalgata-atardecer-ejemplo', 'Cabalgata al Atardecer (ejemplo)', 'experiencia',
 'Cabalgata guiada hasta un mirador cercano para ver el atardecer sobre el cañón. Negocio de ejemplo.',
 'Guided horseback ride to a nearby viewpoint to watch the canyon sunset. Sample listing.',
 'Desde $100.000 por persona', '4:00 pm', '2.5 horas',
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true),

('taller-talla-piedra-ejemplo', 'Taller de Talla en Piedra (ejemplo)', 'taller',
 'Clase práctica de talla en piedra con artesanos locales, te llevas tu propia pieza. Negocio de ejemplo.',
 'Hands-on stone-carving class with local artisans — take home your own piece. Sample listing.',
 'Desde $65.000 por persona', '10:00 am - 12:00 m', '2 horas',
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true),

('transporte-sangil-ejemplo', 'Transporte Barichara - San Gil (ejemplo)', 'transporte',
 'Servicio de transporte privado entre Barichara y San Gil, con parada en Guane. Negocio de ejemplo.',
 'Private transport service between Barichara and San Gil, with a stop in Guane. Sample listing.',
 'Desde $25.000 por persona', 'Bajo reserva', '45 minutos',
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true),

('festival-cuadros-ejemplo', 'Festival de Cuadros de Barichara (ejemplo)', 'evento',
 'Festival anual de arte y música en el parque principal, con artesanos y gastronomía local. Negocio de ejemplo.',
 'Annual arts and music festival in the main park, with local artisans and food. Sample listing.',
 'Entrada libre', 'Todo el día', 'Un fin de semana',
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true),

('posada-ejemplo', 'Posada Ejemplo del Pueblo', 'hotel',
 'Posada acogedora de 6 habitaciones cerca del parque principal. Negocio de ejemplo para mostrar el directorio.',
 'Cozy 6-room posada near the main square. Sample listing to preview the directory.',
 'Desde $150.000 por noche', 'Check-in 2:00 pm', null,
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true),

('fogon-muestra', 'Fogón de Muestra', 'restaurante',
 'Cocina santandereana casera, menú del día y platos a la carta. Negocio de ejemplo.',
 'Homestyle Santander cooking, daily set menu and à la carte dishes. Sample listing.',
 'Desde $20.000', '11:00 am - 9:00 pm', null,
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true),

('tienda-ceramica-ejemplo', 'Tienda de Cerámica Ejemplo', 'comercio',
 'Tienda de cerámica y artesanías locales, piezas hechas a mano en Barichara. Negocio de ejemplo.',
 'Shop with local ceramics and handicrafts, handmade in Barichara. Sample listing.',
 'Piezas desde $15.000', '9:00 am - 6:00 pm', null,
 'https://www.google.com/maps/search/?api=1&query=Barichara+Santander', true, true)
on conflict (slug) do nothing;
