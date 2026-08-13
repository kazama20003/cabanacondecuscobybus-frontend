/* ---------- Datos del negocio: Inca Travel Peru ---------- */

export const CONTACT = {
  email: "reservas@incatravelperu.com",
  phone: "+51 984 123 456",
  whatsapp: "51984123456",
  address: "Portal de Panes 123, Plaza de Armas, Cusco",
  city: "Cusco, Perú",
};

/* ---------- media URLs (Cloudinary) ---------- */
export const MEDIA_VIDEO =
  "https://res.cloudinary.com/dhkb93mix/video/upload/v1773250748/11929213_1920_1080_60fps_ulvu5b.mp4";
export const MEDIA_IMAGE =
  "https://res.cloudinary.com/dhkb93mix/image/upload/v1786211023/big-ca579d84d7d5736a2999e621892f1a44_upjf05.jpg";
export const IMG_SAN_LAZARO =
  "https://res.cloudinary.com/dhkb93mix/image/upload/v1786211023/the-san-lazaro-neighborhood-the-oldest-in-arequipa-272_nac7bs.jpg";
export const IMG_TEMPLO =
  "https://res.cloudinary.com/dhkb93mix/image/upload/v1786211022/arequipa-peru-temple-7186-main_uxvqws.jpg";
export const PHOTOS = [MEDIA_IMAGE, IMG_SAN_LAZARO, IMG_TEMPLO];

/* ---------- Transporte turístico (producto principal) ---------- */

export type RouteStop = { name: string; time: string; note?: string };

export type TransportRoute = {
  slug: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  priceFrom: number; // PEN
  departures: string[]; // horarios de salida
  frequency: string;
  vehicle: string;
  stops: RouteStop[];
  highlights: string[];
  description: string;
  image: string;
};

export const transportRoutes: TransportRoute[] = [
  {
    slug: "cusco-arequipa",
    from: "Cusco",
    to: "Arequipa",
    duration: "10 h aprox.",
    distance: "486 km",
    priceFrom: 90,
    departures: ["07:30", "20:30"],
    frequency: "Salidas diarias",
    vehicle: "Bus turístico 2 pisos · asientos semicama 140°",
    stops: [
      { name: "Terminal Cusco", time: "07:30", note: "Embarque 30 min antes" },
      { name: "Sicuani", time: "09:45", note: "Parada técnica" },
      { name: "Juliaca", time: "12:30" },
      { name: "Terminal Arequipa", time: "17:30" },
    ],
    highlights: [
      "Asientos semicama con reclinación 140°",
      "WiFi a bordo y puertos USB",
      "Snack y bebida incluidos",
      "Baño a bordo y aire acondicionado",
    ],
    description:
      "Nuestra ruta insignia conecta la capital imperial con la Ciudad Blanca atravesando el altiplano. Viaje directo con paradas técnicas, buses modernos y tripulación bilingüe.",
    image: MEDIA_IMAGE,
  },
  {
    slug: "arequipa-chivay-colca",
    from: "Arequipa",
    to: "Chivay (Valle del Colca)",
    duration: "3 h 30 min",
    distance: "160 km",
    priceFrom: 35,
    departures: ["03:30", "08:00", "13:00"],
    frequency: "Salidas diarias",
    vehicle: "Sprinter turística · 19 asientos",
    stops: [
      { name: "Arequipa (recojo de hotel)", time: "08:00" },
      { name: "Mirador de los Volcanes (Patapampa, 4 910 m)", time: "10:00", note: "Parada fotográfica" },
      { name: "Chivay", time: "11:30" },
    ],
    highlights: [
      "Recojo desde tu hotel en Arequipa",
      "Parada en el mirador de volcanes a 4 910 m",
      "Chofer profesional y oxígeno a bordo",
      "Conexión con la Cruz del Cóndor",
    ],
    description:
      "Ruta hacia el corazón del Valle del Colca, uno de los cañones más profundos del mundo. Ideal para conectar con el avistamiento de cóndores en la Cruz del Cóndor.",
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "chivay-cabanaconde",
    from: "Chivay",
    to: "Cabanaconde",
    duration: "2 h 15 min",
    distance: "54 km",
    priceFrom: 20,
    departures: ["06:00", "11:00", "16:00"],
    frequency: "Salidas diarias",
    vehicle: "Van turística · 15 asientos",
    stops: [
      { name: "Chivay", time: "06:00" },
      { name: "Yanque", time: "06:25" },
      { name: "Cruz del Cóndor", time: "07:30", note: "Parada 40 min para avistamiento" },
      { name: "Cabanaconde", time: "08:15" },
    ],
    highlights: [
      "Parada de 40 min en la Cruz del Cóndor",
      "Punto de partida del trek al oasis de Sangalle",
      "Paradas en pueblos tradicionales del valle",
    ],
    description:
      "El tramo más escénico del Colca: de Chivay a Cabanaconde con parada en la Cruz del Cóndor en horario de vuelo de los cóndores. Perfecto para trekkers rumbo al oasis.",
    image: IMG_TEMPLO,
  },
  {
    slug: "cusco-puno",
    from: "Cusco",
    to: "Puno",
    duration: "7 h aprox.",
    distance: "389 km",
    priceFrom: 60,
    departures: ["07:00"],
    frequency: "Salidas diarias",
    vehicle: "Bus turístico con guía · ruta del sol",
    stops: [
      { name: "Terminal Cusco", time: "07:00" },
      { name: "Andahuaylillas (Capilla Sixtina de América)", time: "08:00", note: "Visita guiada" },
      { name: "Raqchi (Templo de Wiracocha)", time: "09:30", note: "Visita guiada" },
      { name: "La Raya (4 335 m)", time: "11:00", note: "Parada fotográfica" },
      { name: "Puno", time: "14:00" },
    ],
    highlights: [
      "Ruta del Sol con visitas guiadas incluidas",
      "Almuerzo buffet en Sicuani",
      "Guía bilingüe español / inglés",
    ],
    description:
      "Más que un traslado: un bus turístico por la Ruta del Sol con paradas guiadas en Andahuaylillas, Raqchi y el abra La Raya, almuerzo incluido, hasta las orillas del Titicaca.",
    image: MEDIA_IMAGE,
  },
  {
    slug: "cusco-hidroelectrica",
    from: "Cusco",
    to: "Hidroeléctrica (Machu Picchu)",
    duration: "6 h 30 min",
    distance: "230 km",
    priceFrom: 45,
    departures: ["06:30", "07:30"],
    frequency: "Salidas diarias",
    vehicle: "Minivan turística · 19 asientos",
    stops: [
      { name: "Cusco (recojo de hotel)", time: "06:30" },
      { name: "Ollantaytambo", time: "08:30", note: "Parada para desayuno" },
      { name: "Abra Málaga (4 316 m)", time: "09:45" },
      { name: "Santa María", time: "11:30" },
      { name: "Hidroeléctrica", time: "13:00", note: "Caminata u tren a Aguas Calientes" },
    ],
    highlights: [
      "La forma más económica de llegar a Machu Picchu",
      "Recojo desde tu hotel en Cusco",
      "Retorno disponible el mismo día o al siguiente",
    ],
    description:
      "La alternativa económica para llegar a Machu Picchu: minivan hasta Hidroeléctrica y caminata de 2 h 30 junto a la vía férrea hasta Aguas Calientes. Incluye recojo de hotel.",
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "arequipa-puno",
    from: "Arequipa",
    to: "Puno",
    duration: "5 h 30 min",
    distance: "294 km",
    priceFrom: 40,
    departures: ["06:00", "14:00"],
    frequency: "Salidas diarias",
    vehicle: "Bus turístico · asientos reclinables",
    stops: [
      { name: "Terminal Arequipa", time: "06:00" },
      { name: "Reserva de Salinas y Aguada Blanca", time: "07:30", note: "Avistamiento de vicuñas" },
      { name: "Juliaca", time: "10:30" },
      { name: "Puno", time: "11:30" },
    ],
    highlights: [
      "Cruce por la reserva de vicuñas",
      "Conexión directa con tours al lago Titicaca",
      "Terminal céntrico en Puno",
    ],
    description:
      "Conexión directa entre Arequipa y el lago Titicaca atravesando la reserva de Salinas y Aguada Blanca, hogar de vicuñas y flamencos altoandinos.",
    image: IMG_TEMPLO,
  },
];

export const fleet = [
  {
    name: "Bus turístico 2 pisos",
    capacity: "50 pasajeros",
    features: "Asientos semicama 140°, baño, WiFi, USB, aire acondicionado, GPS monitoreado",
    image: MEDIA_IMAGE,
  },
  {
    name: "Sprinter turística",
    capacity: "19 pasajeros",
    features: "Asientos reclinables, aire acondicionado, oxígeno a bordo, chofer profesional",
    image: IMG_SAN_LAZARO,
  },
  {
    name: "Van privada",
    capacity: "10 pasajeros",
    features: "Servicio privado puerta a puerta, horario flexible, conductor bilingüe",
    image: IMG_TEMPLO,
  },
];

export const transportFaq = [
  {
    q: "¿Cómo reservo un pasaje?",
    a: "Puedes reservar por WhatsApp, por teléfono o desde la página de contacto. Confirmamos tu asiento con un adelanto del 50% y el saldo se paga al abordar.",
  },
  {
    q: "¿Cuánto equipaje puedo llevar?",
    a: "Cada pasajero puede llevar 1 maleta de bodega (hasta 20 kg) y 1 equipaje de mano. Equipos especiales (bicicletas, tablas) se coordinan al reservar.",
  },
  {
    q: "¿Recogen desde el hotel?",
    a: "En las rutas con minivan y sprinter (Colca, Hidroeléctrica) el recojo desde tu hotel está incluido. En rutas de bus el embarque es en terminal.",
  },
  {
    q: "¿Puedo cambiar la fecha de mi viaje?",
    a: "Sí, hasta 24 horas antes de la salida sin costo. Cambios el mismo día están sujetos a disponibilidad.",
  },
  {
    q: "¿Los buses son seguros para viajar de noche?",
    a: "Sí. Toda la flota tiene GPS monitoreado, dos conductores en rutas largas y velocidad controlada según normativa del MTC.",
  },
];

/* ---------- Traslados ---------- */

export type Transfer = {
  name: string;
  desc: string;
  duration: string;
  priceFrom: number;
  vehicle: string;
  capacity: string;
  includes: string[];
  availability: string;
  image: string;
};

export const transfers: Transfer[] = [
  {
    name: "Aeropuerto Cusco → Hotel",
    desc: "Recepción con cartel en el aeropuerto Alejandro Velasco Astete y traslado directo a tu hotel en el centro histórico.",
    duration: "20–30 min",
    priceFrom: 25,
    vehicle: "Auto o van privada",
    capacity: "1–10 pasajeros",
    includes: ["Recepción con cartel", "Monitoreo de vuelo", "Ayuda con equipaje", "Conductor bilingüe"],
    availability: "24/7, todos los días",
    image: MEDIA_IMAGE,
  },
  {
    name: "Aeropuerto Arequipa → Hotel",
    desc: "Traslado privado desde el aeropuerto Rodríguez Ballón hasta tu alojamiento en el centro de Arequipa.",
    duration: "25–35 min",
    priceFrom: 25,
    vehicle: "Auto o van privada",
    capacity: "1–10 pasajeros",
    includes: ["Recepción con cartel", "Monitoreo de vuelo", "Ayuda con equipaje"],
    availability: "24/7, todos los días",
    image: IMG_SAN_LAZARO,
  },
  {
    name: "Cusco → Ollantaytambo (estación de tren)",
    desc: "Traslado privado hasta la estación de tren para tu conexión a Machu Picchu, con horario coordinado a tu tren.",
    duration: "1 h 45 min",
    priceFrom: 80,
    vehicle: "Van privada",
    capacity: "1–10 pasajeros",
    includes: ["Horario coordinado a tu tren", "Recojo en tu hotel", "Paradas fotográficas a solicitud"],
    availability: "Todos los días, según horario de tren",
    image: IMG_TEMPLO,
  },
  {
    name: "Cusco → Valle Sagrado (hoteles)",
    desc: "Traslado privado a hoteles del Valle Sagrado: Urubamba, Yucay, Calca. Paradas fotográficas a solicitud.",
    duration: "1 h 30 min",
    priceFrom: 90,
    vehicle: "Van privada",
    capacity: "1–10 pasajeros",
    includes: ["Recojo en tu hotel", "Paradas fotográficas", "Conductor conocedor de la zona"],
    availability: "Todos los días, horario flexible",
    image: MEDIA_IMAGE,
  },
  {
    name: "Traslados nocturnos y madrugada",
    desc: "Servicio 24/7 para vuelos de madrugada, salidas de trek (Salkantay, Inca Trail) y conexiones tempranas.",
    duration: "Según destino",
    priceFrom: 35,
    vehicle: "Auto o van privada",
    capacity: "1–10 pasajeros",
    includes: ["Puntualidad garantizada", "Confirmación la noche anterior", "Experiencia en salidas de trek"],
    availability: "24/7, incluye feriados",
    image: IMG_SAN_LAZARO,
  },
  {
    name: "Servicio por horas / a disposición",
    desc: "Vehículo con conductor a tu disposición para reuniones, compras o rutas personalizadas dentro y fuera de la ciudad.",
    duration: "Mínimo 3 h",
    priceFrom: 120,
    vehicle: "Auto, van o sprinter",
    capacity: "1–19 pasajeros",
    includes: ["Itinerario a tu medida", "Combustible y peajes", "Espera incluida"],
    availability: "Previa reserva, 24 h de anticipación",
    image: IMG_TEMPLO,
  },
];

/* ---------- Tours ---------- */

export type Tour = {
  slug: string;
  name: string;
  location: string;
  duration: string;
  priceFrom: number;
  type: string;
  departure: string;
  difficulty: string;
  desc: string;
  includes: string[];
  image: string;
};

export const tours: Tour[] = [
  {
    slug: "valle-sagrado",
    name: "Valle Sagrado de los Incas",
    location: "Cusco",
    duration: "Full day",
    priceFrom: 120,
    type: "Cultural",
    departure: "Salida 08:00 · recojo en hotel",
    difficulty: "Fácil",
    desc: "Pisac, Ollantaytambo y Chinchero en un día: mercados andinos, fortalezas incas y paisajes del río Urubamba.",
    includes: ["Transporte turístico", "Guía bilingüe", "Almuerzo buffet en Urubamba"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "machu-picchu-full-day",
    name: "Machu Picchu Full Day",
    location: "Cusco",
    duration: "Full day",
    priceFrom: 890,
    type: "Imperdible",
    departure: "Salida 04:30 · estación Ollantaytambo",
    difficulty: "Moderada",
    desc: "Tren desde Ollantaytambo, bus de subida y visita guiada de la ciudadela. Todo coordinado en un solo día.",
    includes: ["Traslados y tren", "Ticket de ingreso", "Bus Consettur", "Guía profesional"],
    image: IMG_TEMPLO,
  },
  {
    slug: "montana-7-colores",
    name: "Montaña de 7 Colores (Vinicunca)",
    location: "Cusco",
    duration: "Full day",
    priceFrom: 110,
    type: "Aventura",
    departure: "Salida 04:30 · recojo en hotel",
    difficulty: "Exigente · 5 036 m",
    desc: "Caminata a 5 036 m hasta la montaña arcoíris, con desayuno y almuerzo en ruta. Salida 4:30 am.",
    includes: ["Transporte", "Desayuno y almuerzo", "Guía", "Bastones y oxígeno"],
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "city-tour-cusco",
    name: "City Tour Cusco",
    location: "Cusco",
    duration: "Medio día",
    priceFrom: 70,
    type: "Cultural",
    departure: "Salida 13:30 · Plaza Regocijo",
    difficulty: "Fácil",
    desc: "Qorikancha, Sacsayhuamán, Q'enqo, Puka Pukara y Tambomachay: la introducción perfecta a la capital inca.",
    includes: ["Transporte turístico", "Guía bilingüe"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "canon-del-colca-2d",
    name: "Cañón del Colca 2D/1N",
    location: "Arequipa",
    duration: "2 días",
    priceFrom: 250,
    type: "Naturaleza",
    departure: "Salida 08:00 · recojo en hotel",
    difficulty: "Moderada",
    desc: "Valle del Colca con noche en Chivay, aguas termales de La Calera y amanecer en la Cruz del Cóndor.",
    includes: ["Transporte", "Hotel en Chivay", "Guía", "Desayunos"],
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "city-tour-arequipa",
    name: "City Tour Arequipa + Monasterio",
    location: "Arequipa",
    duration: "Medio día",
    priceFrom: 60,
    type: "Cultural",
    departure: "Salida 09:00 y 14:00",
    difficulty: "Fácil",
    desc: "Centro histórico de sillar, monasterio de Santa Catalina, mirador de Yanahuara y barrio de San Lázaro.",
    includes: ["Transporte", "Guía bilingüe"],
    image: IMG_TEMPLO,
  },
  {
    slug: "laguna-humantay",
    name: "Laguna Humantay",
    location: "Cusco",
    duration: "Full day",
    priceFrom: 100,
    type: "Aventura",
    departure: "Salida 04:30 · recojo en hotel",
    difficulty: "Exigente · 4 200 m",
    desc: "Caminata hasta la laguna turquesa al pie del nevado Salkantay (4 200 m), con desayuno y almuerzo.",
    includes: ["Transporte", "Desayuno y almuerzo", "Guía", "Bastones"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "titicaca-uros-taquile",
    name: "Lago Titicaca: Uros y Taquile",
    location: "Puno",
    duration: "Full day",
    priceFrom: 130,
    type: "Cultural",
    departure: "Salida 06:40 · puerto de Puno",
    difficulty: "Fácil",
    desc: "Navegación por el lago navegable más alto del mundo: islas flotantes de los Uros y la isla textil de Taquile.",
    includes: ["Lancha turística", "Guía", "Almuerzo en Taquile"],
    image: IMG_SAN_LAZARO,
  },
];

/* ---------- Destinos ---------- */

export type Destination = {
  slug: string;
  name: string;
  region: string;
  altitude: string;
  desc: string;
  highlights: string[];
  image: string;
};

export const destinations: Destination[] = [
  {
    slug: "cusco",
    name: "Cusco",
    region: "Cusco",
    altitude: "3 399 m",
    desc: "Capital del imperio inca y puerta de entrada a Machu Picchu. Ciudad viva de piedra, mercados y montañas.",
    highlights: ["Machu Picchu", "Valle Sagrado", "Sacsayhuamán", "San Blas"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "arequipa",
    name: "Arequipa",
    region: "Arequipa",
    altitude: "2 335 m",
    desc: "La Ciudad Blanca al pie del Misti: arquitectura de sillar, la mejor gastronomía del sur y clima soleado todo el año.",
    highlights: ["Monasterio Santa Catalina", "Barrio San Lázaro", "Mirador Yanahuara", "Picanterías"],
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "valle-del-colca",
    name: "Valle del Colca",
    region: "Arequipa",
    altitude: "3 635 m (Chivay)",
    desc: "Uno de los cañones más profundos del mundo, hogar del cóndor andino, terrazas preincas y pueblos tradicionales.",
    highlights: ["Cruz del Cóndor", "Cabanaconde", "Oasis de Sangalle", "Aguas termales La Calera"],
    image: IMG_TEMPLO,
  },
  {
    slug: "puno",
    name: "Puno y Lago Titicaca",
    region: "Puno",
    altitude: "3 827 m",
    desc: "El lago navegable más alto del mundo, con islas flotantes de totora y comunidades que mantienen vivas sus tradiciones.",
    highlights: ["Islas Uros", "Taquile", "Amantaní", "Sillustani"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "machu-picchu",
    name: "Machu Picchu",
    region: "Cusco",
    altitude: "2 430 m",
    desc: "La ciudadela inca del siglo XV, maravilla del mundo moderno entre selva alta y montañas sagradas.",
    highlights: ["Ciudadela", "Huayna Picchu", "Montaña Machu Picchu", "Aguas Calientes"],
    image: IMG_TEMPLO,
  },
  {
    slug: "valle-sagrado",
    name: "Valle Sagrado",
    region: "Cusco",
    altitude: "2 871 m (Urubamba)",
    desc: "El valle del río Urubamba: fortalezas incas, mercados andinos, salineras y el mejor clima de la región Cusco.",
    highlights: ["Pisac", "Ollantaytambo", "Salineras de Maras", "Moray"],
    image: IMG_SAN_LAZARO,
  },
];
