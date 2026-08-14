/* Logo oficial — usar en header, panel y donde se pida el logo */
export const LOGO_URL =
  "https://res.cloudinary.com/demzflxgq/image/upload/v1781928558/uploads/abu4i78nwkquynyvmppd.png";

/* ---------- Datos del negocio: Inca Travel Peru ---------- */

export const CONTACT = {
  email: "reservas@incatravelperu.com",
  phone: "+51 984 123 456",
  whatsapp: "51984123456",
  address: "Portal de Panes 123, Plaza de Armas, Cusco",
  city: "Cusco, PerÃº",
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

/* ---------- Transporte turÃ­stico (producto principal) ---------- */

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
    vehicle: "Bus turÃ­stico 2 pisos Â· asientos semicama 140Â°",
    stops: [
      { name: "Terminal Cusco", time: "07:30", note: "Embarque 30 min antes" },
      { name: "Sicuani", time: "09:45", note: "Parada tÃ©cnica" },
      { name: "Juliaca", time: "12:30" },
      { name: "Terminal Arequipa", time: "17:30" },
    ],
    highlights: [
      "Asientos semicama con reclinaciÃ³n 140Â°",
      "WiFi a bordo y puertos USB",
      "Snack y bebida incluidos",
      "BaÃ±o a bordo y aire acondicionado",
    ],
    description:
      "Nuestra ruta insignia conecta la capital imperial con la Ciudad Blanca atravesando el altiplano. Viaje directo con paradas tÃ©cnicas, buses modernos y tripulaciÃ³n bilingÃ¼e.",
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
    vehicle: "Sprinter turÃ­stica Â· 19 asientos",
    stops: [
      { name: "Arequipa (recojo de hotel)", time: "08:00" },
      { name: "Mirador de los Volcanes (Patapampa, 4 910 m)", time: "10:00", note: "Parada fotogrÃ¡fica" },
      { name: "Chivay", time: "11:30" },
    ],
    highlights: [
      "Recojo desde tu hotel en Arequipa",
      "Parada en el mirador de volcanes a 4 910 m",
      "Chofer profesional y oxÃ­geno a bordo",
      "ConexiÃ³n con la Cruz del CÃ³ndor",
    ],
    description:
      "Ruta hacia el corazÃ³n del Valle del Colca, uno de los caÃ±ones mÃ¡s profundos del mundo. Ideal para conectar con el avistamiento de cÃ³ndores en la Cruz del CÃ³ndor.",
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
    vehicle: "Van turÃ­stica Â· 15 asientos",
    stops: [
      { name: "Chivay", time: "06:00" },
      { name: "Yanque", time: "06:25" },
      { name: "Cruz del CÃ³ndor", time: "07:30", note: "Parada 40 min para avistamiento" },
      { name: "Cabanaconde", time: "08:15" },
    ],
    highlights: [
      "Parada de 40 min en la Cruz del CÃ³ndor",
      "Punto de partida del trek al oasis de Sangalle",
      "Paradas en pueblos tradicionales del valle",
    ],
    description:
      "El tramo mÃ¡s escÃ©nico del Colca: de Chivay a Cabanaconde con parada en la Cruz del CÃ³ndor en horario de vuelo de los cÃ³ndores. Perfecto para trekkers rumbo al oasis.",
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
    vehicle: "Bus turÃ­stico con guÃ­a Â· ruta del sol",
    stops: [
      { name: "Terminal Cusco", time: "07:00" },
      { name: "Andahuaylillas (Capilla Sixtina de AmÃ©rica)", time: "08:00", note: "Visita guiada" },
      { name: "Raqchi (Templo de Wiracocha)", time: "09:30", note: "Visita guiada" },
      { name: "La Raya (4 335 m)", time: "11:00", note: "Parada fotogrÃ¡fica" },
      { name: "Puno", time: "14:00" },
    ],
    highlights: [
      "Ruta del Sol con visitas guiadas incluidas",
      "Almuerzo buffet en Sicuani",
      "GuÃ­a bilingÃ¼e espaÃ±ol / inglÃ©s",
    ],
    description:
      "MÃ¡s que un traslado: un bus turÃ­stico por la Ruta del Sol con paradas guiadas en Andahuaylillas, Raqchi y el abra La Raya, almuerzo incluido, hasta las orillas del Titicaca.",
    image: MEDIA_IMAGE,
  },
  {
    slug: "cusco-hidroelectrica",
    from: "Cusco",
    to: "HidroelÃ©ctrica (Machu Picchu)",
    duration: "6 h 30 min",
    distance: "230 km",
    priceFrom: 45,
    departures: ["06:30", "07:30"],
    frequency: "Salidas diarias",
    vehicle: "Minivan turÃ­stica Â· 19 asientos",
    stops: [
      { name: "Cusco (recojo de hotel)", time: "06:30" },
      { name: "Ollantaytambo", time: "08:30", note: "Parada para desayuno" },
      { name: "Abra MÃ¡laga (4 316 m)", time: "09:45" },
      { name: "Santa MarÃ­a", time: "11:30" },
      { name: "HidroelÃ©ctrica", time: "13:00", note: "Caminata u tren a Aguas Calientes" },
    ],
    highlights: [
      "La forma mÃ¡s econÃ³mica de llegar a Machu Picchu",
      "Recojo desde tu hotel en Cusco",
      "Retorno disponible el mismo dÃ­a o al siguiente",
    ],
    description:
      "La alternativa econÃ³mica para llegar a Machu Picchu: minivan hasta HidroelÃ©ctrica y caminata de 2 h 30 junto a la vÃ­a fÃ©rrea hasta Aguas Calientes. Incluye recojo de hotel.",
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
    vehicle: "Bus turÃ­stico Â· asientos reclinables",
    stops: [
      { name: "Terminal Arequipa", time: "06:00" },
      { name: "Reserva de Salinas y Aguada Blanca", time: "07:30", note: "Avistamiento de vicuÃ±as" },
      { name: "Juliaca", time: "10:30" },
      { name: "Puno", time: "11:30" },
    ],
    highlights: [
      "Cruce por la reserva de vicuÃ±as",
      "ConexiÃ³n directa con tours al lago Titicaca",
      "Terminal cÃ©ntrico en Puno",
    ],
    description:
      "ConexiÃ³n directa entre Arequipa y el lago Titicaca atravesando la reserva de Salinas y Aguada Blanca, hogar de vicuÃ±as y flamencos altoandinos.",
    image: IMG_TEMPLO,
  },
];

export const fleet = [
  {
    name: "Bus turÃ­stico 2 pisos",
    capacity: "50 pasajeros",
    features: "Asientos semicama 140Â°, baÃ±o, WiFi, USB, aire acondicionado, GPS monitoreado",
    image: MEDIA_IMAGE,
  },
  {
    name: "Sprinter turÃ­stica",
    capacity: "19 pasajeros",
    features: "Asientos reclinables, aire acondicionado, oxÃ­geno a bordo, chofer profesional",
    image: IMG_SAN_LAZARO,
  },
  {
    name: "Van privada",
    capacity: "10 pasajeros",
    features: "Servicio privado puerta a puerta, horario flexible, conductor bilingÃ¼e",
    image: IMG_TEMPLO,
  },
];

export const transportFaq = [
  {
    q: "Â¿CÃ³mo reservo un pasaje?",
    a: "Puedes reservar por WhatsApp, por telÃ©fono o desde la pÃ¡gina de contacto. Confirmamos tu asiento con un adelanto del 50% y el saldo se paga al abordar.",
  },
  {
    q: "Â¿CuÃ¡nto equipaje puedo llevar?",
    a: "Cada pasajero puede llevar 1 maleta de bodega (hasta 20 kg) y 1 equipaje de mano. Equipos especiales (bicicletas, tablas) se coordinan al reservar.",
  },
  {
    q: "Â¿Recogen desde el hotel?",
    a: "En las rutas con minivan y sprinter (Colca, HidroelÃ©ctrica) el recojo desde tu hotel estÃ¡ incluido. En rutas de bus el embarque es en terminal.",
  },
  {
    q: "Â¿Puedo cambiar la fecha de mi viaje?",
    a: "SÃ­, hasta 24 horas antes de la salida sin costo. Cambios el mismo dÃ­a estÃ¡n sujetos a disponibilidad.",
  },
  {
    q: "Â¿Los buses son seguros para viajar de noche?",
    a: "SÃ­. Toda la flota tiene GPS monitoreado, dos conductores en rutas largas y velocidad controlada segÃºn normativa del MTC.",
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
    name: "Aeropuerto Cusco â†’ Hotel",
    desc: "RecepciÃ³n con cartel en el aeropuerto Alejandro Velasco Astete y traslado directo a tu hotel en el centro histÃ³rico.",
    duration: "20â€“30 min",
    priceFrom: 25,
    vehicle: "Auto o van privada",
    capacity: "1â€“10 pasajeros",
    includes: ["RecepciÃ³n con cartel", "Monitoreo de vuelo", "Ayuda con equipaje", "Conductor bilingÃ¼e"],
    availability: "24/7, todos los dÃ­as",
    image: MEDIA_IMAGE,
  },
  {
    name: "Aeropuerto Arequipa â†’ Hotel",
    desc: "Traslado privado desde el aeropuerto RodrÃ­guez BallÃ³n hasta tu alojamiento en el centro de Arequipa.",
    duration: "25â€“35 min",
    priceFrom: 25,
    vehicle: "Auto o van privada",
    capacity: "1â€“10 pasajeros",
    includes: ["RecepciÃ³n con cartel", "Monitoreo de vuelo", "Ayuda con equipaje"],
    availability: "24/7, todos los dÃ­as",
    image: IMG_SAN_LAZARO,
  },
  {
    name: "Cusco â†’ Ollantaytambo (estaciÃ³n de tren)",
    desc: "Traslado privado hasta la estaciÃ³n de tren para tu conexiÃ³n a Machu Picchu, con horario coordinado a tu tren.",
    duration: "1 h 45 min",
    priceFrom: 80,
    vehicle: "Van privada",
    capacity: "1â€“10 pasajeros",
    includes: ["Horario coordinado a tu tren", "Recojo en tu hotel", "Paradas fotogrÃ¡ficas a solicitud"],
    availability: "Todos los dÃ­as, segÃºn horario de tren",
    image: IMG_TEMPLO,
  },
  {
    name: "Cusco â†’ Valle Sagrado (hoteles)",
    desc: "Traslado privado a hoteles del Valle Sagrado: Urubamba, Yucay, Calca. Paradas fotogrÃ¡ficas a solicitud.",
    duration: "1 h 30 min",
    priceFrom: 90,
    vehicle: "Van privada",
    capacity: "1â€“10 pasajeros",
    includes: ["Recojo en tu hotel", "Paradas fotogrÃ¡ficas", "Conductor conocedor de la zona"],
    availability: "Todos los dÃ­as, horario flexible",
    image: MEDIA_IMAGE,
  },
  {
    name: "Traslados nocturnos y madrugada",
    desc: "Servicio 24/7 para vuelos de madrugada, salidas de trek (Salkantay, Inca Trail) y conexiones tempranas.",
    duration: "SegÃºn destino",
    priceFrom: 35,
    vehicle: "Auto o van privada",
    capacity: "1â€“10 pasajeros",
    includes: ["Puntualidad garantizada", "ConfirmaciÃ³n la noche anterior", "Experiencia en salidas de trek"],
    availability: "24/7, incluye feriados",
    image: IMG_SAN_LAZARO,
  },
  {
    name: "Servicio por horas / a disposiciÃ³n",
    desc: "VehÃ­culo con conductor a tu disposiciÃ³n para reuniones, compras o rutas personalizadas dentro y fuera de la ciudad.",
    duration: "MÃ­nimo 3 h",
    priceFrom: 120,
    vehicle: "Auto, van o sprinter",
    capacity: "1â€“19 pasajeros",
    includes: ["Itinerario a tu medida", "Combustible y peajes", "Espera incluida"],
    availability: "Previa reserva, 24 h de anticipaciÃ³n",
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
    departure: "Salida 08:00 Â· recojo en hotel",
    difficulty: "FÃ¡cil",
    desc: "Pisac, Ollantaytambo y Chinchero en un dÃ­a: mercados andinos, fortalezas incas y paisajes del rÃ­o Urubamba.",
    includes: ["Transporte turÃ­stico", "GuÃ­a bilingÃ¼e", "Almuerzo buffet en Urubamba"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "machu-picchu-full-day",
    name: "Machu Picchu Full Day",
    location: "Cusco",
    duration: "Full day",
    priceFrom: 890,
    type: "Imperdible",
    departure: "Salida 04:30 Â· estaciÃ³n Ollantaytambo",
    difficulty: "Moderada",
    desc: "Tren desde Ollantaytambo, bus de subida y visita guiada de la ciudadela. Todo coordinado en un solo dÃ­a.",
    includes: ["Traslados y tren", "Ticket de ingreso", "Bus Consettur", "GuÃ­a profesional"],
    image: IMG_TEMPLO,
  },
  {
    slug: "montana-7-colores",
    name: "MontaÃ±a de 7 Colores (Vinicunca)",
    location: "Cusco",
    duration: "Full day",
    priceFrom: 110,
    type: "Aventura",
    departure: "Salida 04:30 Â· recojo en hotel",
    difficulty: "Exigente Â· 5 036 m",
    desc: "Caminata a 5 036 m hasta la montaÃ±a arcoÃ­ris, con desayuno y almuerzo en ruta. Salida 4:30 am.",
    includes: ["Transporte", "Desayuno y almuerzo", "GuÃ­a", "Bastones y oxÃ­geno"],
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "city-tour-cusco",
    name: "City Tour Cusco",
    location: "Cusco",
    duration: "Medio dÃ­a",
    priceFrom: 70,
    type: "Cultural",
    departure: "Salida 13:30 Â· Plaza Regocijo",
    difficulty: "FÃ¡cil",
    desc: "Qorikancha, SacsayhuamÃ¡n, Q'enqo, Puka Pukara y Tambomachay: la introducciÃ³n perfecta a la capital inca.",
    includes: ["Transporte turÃ­stico", "GuÃ­a bilingÃ¼e"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "canon-del-colca-2d",
    name: "CaÃ±Ã³n del Colca 2D/1N",
    location: "Arequipa",
    duration: "2 dÃ­as",
    priceFrom: 250,
    type: "Naturaleza",
    departure: "Salida 08:00 Â· recojo en hotel",
    difficulty: "Moderada",
    desc: "Valle del Colca con noche en Chivay, aguas termales de La Calera y amanecer en la Cruz del CÃ³ndor.",
    includes: ["Transporte", "Hotel en Chivay", "GuÃ­a", "Desayunos"],
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "city-tour-arequipa",
    name: "City Tour Arequipa + Monasterio",
    location: "Arequipa",
    duration: "Medio dÃ­a",
    priceFrom: 60,
    type: "Cultural",
    departure: "Salida 09:00 y 14:00",
    difficulty: "FÃ¡cil",
    desc: "Centro histÃ³rico de sillar, monasterio de Santa Catalina, mirador de Yanahuara y barrio de San LÃ¡zaro.",
    includes: ["Transporte", "GuÃ­a bilingÃ¼e"],
    image: IMG_TEMPLO,
  },
  {
    slug: "laguna-humantay",
    name: "Laguna Humantay",
    location: "Cusco",
    duration: "Full day",
    priceFrom: 100,
    type: "Aventura",
    departure: "Salida 04:30 Â· recojo en hotel",
    difficulty: "Exigente Â· 4 200 m",
    desc: "Caminata hasta la laguna turquesa al pie del nevado Salkantay (4 200 m), con desayuno y almuerzo.",
    includes: ["Transporte", "Desayuno y almuerzo", "GuÃ­a", "Bastones"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "titicaca-uros-taquile",
    name: "Lago Titicaca: Uros y Taquile",
    location: "Puno",
    duration: "Full day",
    priceFrom: 130,
    type: "Cultural",
    departure: "Salida 06:40 Â· puerto de Puno",
    difficulty: "FÃ¡cil",
    desc: "NavegaciÃ³n por el lago navegable mÃ¡s alto del mundo: islas flotantes de los Uros y la isla textil de Taquile.",
    includes: ["Lancha turÃ­stica", "GuÃ­a", "Almuerzo en Taquile"],
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
    desc: "Capital del imperio inca y puerta de entrada a Machu Picchu. Ciudad viva de piedra, mercados y montaÃ±as.",
    highlights: ["Machu Picchu", "Valle Sagrado", "SacsayhuamÃ¡n", "San Blas"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "arequipa",
    name: "Arequipa",
    region: "Arequipa",
    altitude: "2 335 m",
    desc: "La Ciudad Blanca al pie del Misti: arquitectura de sillar, la mejor gastronomÃ­a del sur y clima soleado todo el aÃ±o.",
    highlights: ["Monasterio Santa Catalina", "Barrio San LÃ¡zaro", "Mirador Yanahuara", "PicanterÃ­as"],
    image: IMG_SAN_LAZARO,
  },
  {
    slug: "valle-del-colca",
    name: "Valle del Colca",
    region: "Arequipa",
    altitude: "3 635 m (Chivay)",
    desc: "Uno de los caÃ±ones mÃ¡s profundos del mundo, hogar del cÃ³ndor andino, terrazas preincas y pueblos tradicionales.",
    highlights: ["Cruz del CÃ³ndor", "Cabanaconde", "Oasis de Sangalle", "Aguas termales La Calera"],
    image: IMG_TEMPLO,
  },
  {
    slug: "puno",
    name: "Puno y Lago Titicaca",
    region: "Puno",
    altitude: "3 827 m",
    desc: "El lago navegable mÃ¡s alto del mundo, con islas flotantes de totora y comunidades que mantienen vivas sus tradiciones.",
    highlights: ["Islas Uros", "Taquile", "AmantanÃ­", "Sillustani"],
    image: MEDIA_IMAGE,
  },
  {
    slug: "machu-picchu",
    name: "Machu Picchu",
    region: "Cusco",
    altitude: "2 430 m",
    desc: "La ciudadela inca del siglo XV, maravilla del mundo moderno entre selva alta y montaÃ±as sagradas.",
    highlights: ["Ciudadela", "Huayna Picchu", "MontaÃ±a Machu Picchu", "Aguas Calientes"],
    image: IMG_TEMPLO,
  },
  {
    slug: "valle-sagrado",
    name: "Valle Sagrado",
    region: "Cusco",
    altitude: "2 871 m (Urubamba)",
    desc: "El valle del rÃ­o Urubamba: fortalezas incas, mercados andinos, salineras y el mejor clima de la regiÃ³n Cusco.",
    highlights: ["Pisac", "Ollantaytambo", "Salineras de Maras", "Moray"],
    image: IMG_SAN_LAZARO,
  },
];

