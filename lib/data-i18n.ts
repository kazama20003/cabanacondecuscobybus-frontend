"use client";

/**
 * Traducción del contenido semilla (lib/data.ts) que se renderiza en páginas
 * estáticas sin API: traslados, destinos y el fallback de tours en la home.
 *
 * Cada arreglo de override está en el MISMO orden y longitud que su base en
 * data.ts; se fusiona por índice sobre la versión española. El español es la
 * base (data.ts) y sirve de fallback cuando falta un idioma.
 *
 * Nota: transportRoutes no se traduce aquí porque las vistas de transporte
 * consumen el catálogo ya traducido del backend; la semilla es solo respaldo.
 */
import {
  transfers as transfersBase,
  destinations as destinationsBase,
  tours as toursBase,
  transportRoutes as transportRoutesBase,
  type Transfer,
  type Destination,
  type Tour,
  type TransportRoute,
} from "./data";
import { useIdioma, type LangCode } from "@/components/lang-provider";

type TransferTx = Pick<
  Transfer,
  "name" | "desc" | "duration" | "vehicle" | "capacity" | "availability" | "includes"
>;
type DestinationTx = Pick<Destination, "desc" | "highlights">;
type TourTx = Pick<
  Tour,
  "name" | "duration" | "type" | "departure" | "difficulty" | "desc" | "includes"
>;
type TransportRouteTx = Pick<
  TransportRoute,
  "duration" | "frequency" | "vehicle" | "description" | "highlights" | "stops"
>;

/* ============================ TRASLADOS ============================ */

const TRANSFERS_TX: Partial<Record<LangCode, TransferTx[]>> = {
  en: [
    {
      name: "Cusco Airport → Hotel",
      desc: "Meet-and-greet with a sign at Alejandro Velasco Astete airport and a direct transfer to your hotel in the historic centre.",
      duration: "20–30 min",
      vehicle: "Private car or van",
      capacity: "1–10 passengers",
      includes: ["Meet-and-greet with sign", "Flight monitoring", "Luggage assistance", "Bilingual driver"],
      availability: "24/7, every day",
    },
    {
      name: "Arequipa Airport → Hotel",
      desc: "Private transfer from Rodríguez Ballón airport to your accommodation in central Arequipa.",
      duration: "25–35 min",
      vehicle: "Private car or van",
      capacity: "1–10 passengers",
      includes: ["Meet-and-greet with sign", "Flight monitoring", "Luggage assistance"],
      availability: "24/7, every day",
    },
    {
      name: "Cusco → Ollantaytambo (train station)",
      desc: "Private transfer to the train station for your connection to Machu Picchu, timed to your train.",
      duration: "1 h 45 min",
      vehicle: "Private van",
      capacity: "1–10 passengers",
      includes: ["Timed to your train", "Pick-up at your hotel", "Photo stops on request"],
      availability: "Every day, according to train schedule",
    },
    {
      name: "Cusco → Sacred Valley (hotels)",
      desc: "Private transfer to Sacred Valley hotels: Urubamba, Yucay, Calca. Photo stops on request.",
      duration: "1 h 30 min",
      vehicle: "Private van",
      capacity: "1–10 passengers",
      includes: ["Pick-up at your hotel", "Photo stops", "Driver who knows the area"],
      availability: "Every day, flexible schedule",
    },
    {
      name: "Night and early-morning transfers",
      desc: "24/7 service for early-morning flights, trek departures (Salkantay, Inca Trail) and early connections.",
      duration: "Depends on destination",
      vehicle: "Private car or van",
      capacity: "1–10 passengers",
      includes: ["Guaranteed punctuality", "Confirmation the night before", "Experience with trek departures"],
      availability: "24/7, holidays included",
    },
    {
      name: "Hourly / on-call service",
      desc: "Vehicle with driver at your disposal for meetings, shopping or custom routes in and out of the city.",
      duration: "3 h minimum",
      vehicle: "Car, van or sprinter",
      capacity: "1–19 passengers",
      includes: ["Tailor-made itinerary", "Fuel and tolls", "Waiting time included"],
      availability: "By reservation, 24 h in advance",
    },
  ],
  fr: [
    {
      name: "Aéroport de Cusco → Hôtel",
      desc: "Accueil avec pancarte à l'aéroport Alejandro Velasco Astete et transfert direct vers ton hôtel dans le centre historique.",
      duration: "20–30 min",
      vehicle: "Voiture ou van privé",
      capacity: "1–10 passagers",
      includes: ["Accueil avec pancarte", "Suivi du vol", "Aide aux bagages", "Chauffeur bilingue"],
      availability: "24h/24, tous les jours",
    },
    {
      name: "Aéroport d'Arequipa → Hôtel",
      desc: "Transfert privé depuis l'aéroport Rodríguez Ballón jusqu'à ton hébergement dans le centre d'Arequipa.",
      duration: "25–35 min",
      vehicle: "Voiture ou van privé",
      capacity: "1–10 passagers",
      includes: ["Accueil avec pancarte", "Suivi du vol", "Aide aux bagages"],
      availability: "24h/24, tous les jours",
    },
    {
      name: "Cusco → Ollantaytambo (gare)",
      desc: "Transfert privé jusqu'à la gare pour ta correspondance vers Machu Picchu, à l'horaire de ton train.",
      duration: "1 h 45 min",
      vehicle: "Van privé",
      capacity: "1–10 passagers",
      includes: ["Horaire adapté à ton train", "Prise en charge à ton hôtel", "Arrêts photo sur demande"],
      availability: "Tous les jours, selon l'horaire du train",
    },
    {
      name: "Cusco → Vallée sacrée (hôtels)",
      desc: "Transfert privé vers les hôtels de la Vallée sacrée : Urubamba, Yucay, Calca. Arrêts photo sur demande.",
      duration: "1 h 30 min",
      vehicle: "Van privé",
      capacity: "1–10 passagers",
      includes: ["Prise en charge à ton hôtel", "Arrêts photo", "Chauffeur connaissant la région"],
      availability: "Tous les jours, horaire flexible",
    },
    {
      name: "Transferts de nuit et à l'aube",
      desc: "Service 24h/24 pour les vols à l'aube, les départs de trek (Salkantay, Inca Trail) et les correspondances matinales.",
      duration: "Selon la destination",
      vehicle: "Voiture ou van privé",
      capacity: "1–10 passagers",
      includes: ["Ponctualité garantie", "Confirmation la veille au soir", "Expérience des départs de trek"],
      availability: "24h/24, jours fériés inclus",
    },
    {
      name: "Service à l'heure / à disposition",
      desc: "Véhicule avec chauffeur à ta disposition pour réunions, achats ou itinéraires personnalisés en ville et alentours.",
      duration: "3 h minimum",
      vehicle: "Voiture, van ou sprinter",
      capacity: "1–19 passagers",
      includes: ["Itinéraire sur mesure", "Carburant et péages", "Temps d'attente inclus"],
      availability: "Sur réservation, 24 h à l'avance",
    },
  ],
  it: [
    {
      name: "Aeroporto di Cusco → Hotel",
      desc: "Accoglienza con cartello all'aeroporto Alejandro Velasco Astete e transfer diretto al tuo hotel nel centro storico.",
      duration: "20–30 min",
      vehicle: "Auto o van privato",
      capacity: "1–10 passeggeri",
      includes: ["Accoglienza con cartello", "Monitoraggio del volo", "Assistenza bagagli", "Autista bilingue"],
      availability: "24/7, tutti i giorni",
    },
    {
      name: "Aeroporto di Arequipa → Hotel",
      desc: "Transfer privato dall'aeroporto Rodríguez Ballón al tuo alloggio nel centro di Arequipa.",
      duration: "25–35 min",
      vehicle: "Auto o van privato",
      capacity: "1–10 passeggeri",
      includes: ["Accoglienza con cartello", "Monitoraggio del volo", "Assistenza bagagli"],
      availability: "24/7, tutti i giorni",
    },
    {
      name: "Cusco → Ollantaytambo (stazione dei treni)",
      desc: "Transfer privato alla stazione dei treni per la coincidenza verso Machu Picchu, con orario coordinato al tuo treno.",
      duration: "1 h 45 min",
      vehicle: "Van privato",
      capacity: "1–10 passeggeri",
      includes: ["Orario coordinato al tuo treno", "Prelievo in hotel", "Soste fotografiche su richiesta"],
      availability: "Tutti i giorni, secondo l'orario dei treni",
    },
    {
      name: "Cusco → Valle Sacra (hotel)",
      desc: "Transfer privato agli hotel della Valle Sacra: Urubamba, Yucay, Calca. Soste fotografiche su richiesta.",
      duration: "1 h 30 min",
      vehicle: "Van privato",
      capacity: "1–10 passeggeri",
      includes: ["Prelievo in hotel", "Soste fotografiche", "Autista esperto della zona"],
      availability: "Tutti i giorni, orario flessibile",
    },
    {
      name: "Transfer notturni e all'alba",
      desc: "Servizio 24/7 per voli all'alba, partenze di trek (Salkantay, Inca Trail) e coincidenze mattutine.",
      duration: "Secondo la destinazione",
      vehicle: "Auto o van privato",
      capacity: "1–10 passeggeri",
      includes: ["Puntualità garantita", "Conferma la sera prima", "Esperienza nelle partenze di trek"],
      availability: "24/7, festivi inclusi",
    },
    {
      name: "Servizio a ore / a disposizione",
      desc: "Veicolo con autista a tua disposizione per riunioni, acquisti o itinerari personalizzati dentro e fuori città.",
      duration: "Minimo 3 h",
      vehicle: "Auto, van o sprinter",
      capacity: "1–19 passeggeri",
      includes: ["Itinerario su misura", "Carburante e pedaggi", "Attesa inclusa"],
      availability: "Su prenotazione, 24 h di anticipo",
    },
  ],
  pt: [
    {
      name: "Aeroporto de Cusco → Hotel",
      desc: "Recepção com placa no aeroporto Alejandro Velasco Astete e traslado direto ao seu hotel no centro histórico.",
      duration: "20–30 min",
      vehicle: "Carro ou van privativa",
      capacity: "1–10 passageiros",
      includes: ["Recepção com placa", "Monitoramento do voo", "Ajuda com a bagagem", "Motorista bilíngue"],
      availability: "24/7, todos os dias",
    },
    {
      name: "Aeroporto de Arequipa → Hotel",
      desc: "Traslado privativo do aeroporto Rodríguez Ballón até sua hospedagem no centro de Arequipa.",
      duration: "25–35 min",
      vehicle: "Carro ou van privativa",
      capacity: "1–10 passageiros",
      includes: ["Recepção com placa", "Monitoramento do voo", "Ajuda com a bagagem"],
      availability: "24/7, todos os dias",
    },
    {
      name: "Cusco → Ollantaytambo (estação de trem)",
      desc: "Traslado privativo até a estação de trem para sua conexão a Machu Picchu, com horário coordenado ao seu trem.",
      duration: "1 h 45 min",
      vehicle: "Van privativa",
      capacity: "1–10 passageiros",
      includes: ["Horário coordenado ao seu trem", "Retirada no hotel", "Paradas para fotos sob solicitação"],
      availability: "Todos os dias, conforme o horário do trem",
    },
    {
      name: "Cusco → Vale Sagrado (hotéis)",
      desc: "Traslado privativo aos hotéis do Vale Sagrado: Urubamba, Yucay, Calca. Paradas para fotos sob solicitação.",
      duration: "1 h 30 min",
      vehicle: "Van privativa",
      capacity: "1–10 passageiros",
      includes: ["Retirada no hotel", "Paradas para fotos", "Motorista conhecedor da região"],
      availability: "Todos os dias, horário flexível",
    },
    {
      name: "Traslados noturnos e de madrugada",
      desc: "Serviço 24/7 para voos de madrugada, saídas de trekking (Salkantay, Inca Trail) e conexões cedo.",
      duration: "Conforme o destino",
      vehicle: "Carro ou van privativa",
      capacity: "1–10 passageiros",
      includes: ["Pontualidade garantida", "Confirmação na noite anterior", "Experiência em saídas de trekking"],
      availability: "24/7, inclui feriados",
    },
    {
      name: "Serviço por hora / à disposição",
      desc: "Veículo com motorista à sua disposição para reuniões, compras ou rotas personalizadas dentro e fora da cidade.",
      duration: "Mínimo 3 h",
      vehicle: "Carro, van ou sprinter",
      capacity: "1–19 passageiros",
      includes: ["Itinerário sob medida", "Combustível e pedágios", "Espera incluída"],
      availability: "Com reserva, 24 h de antecedência",
    },
  ],
  zh: [
    {
      name: "库斯科机场 → 酒店",
      desc: "在 Alejandro Velasco Astete 机场持牌接机，直接送往你在历史中心的酒店。",
      duration: "20–30 分钟",
      vehicle: "私家轿车或面包车",
      capacity: "1–10 名乘客",
      includes: ["持牌接机", "航班监控", "行李协助", "双语司机"],
      availability: "全天候，每天",
    },
    {
      name: "阿雷基帕机场 → 酒店",
      desc: "从 Rodríguez Ballón 机场私人接送至你在阿雷基帕市中心的住宿。",
      duration: "25–35 分钟",
      vehicle: "私家轿车或面包车",
      capacity: "1–10 名乘客",
      includes: ["持牌接机", "航班监控", "行李协助"],
      availability: "全天候，每天",
    },
    {
      name: "库斯科 → 奥扬泰坦博（火车站）",
      desc: "私人接送至火车站，衔接前往马丘比丘的列车，时间与你的车次协调。",
      duration: "1 小时 45 分钟",
      vehicle: "私人面包车",
      capacity: "1–10 名乘客",
      includes: ["与你的车次协调时间", "酒店接客", "可按需停车拍照"],
      availability: "每天，视火车时刻而定",
    },
    {
      name: "库斯科 → 圣谷（酒店）",
      desc: "私人接送至圣谷各酒店：乌鲁班巴、尤凯、卡尔卡。可按需停车拍照。",
      duration: "1 小时 30 分钟",
      vehicle: "私人面包车",
      capacity: "1–10 名乘客",
      includes: ["酒店接客", "停车拍照", "熟悉当地的司机"],
      availability: "每天，时间灵活",
    },
    {
      name: "夜间及清晨接送",
      desc: "全天候服务，适用于清晨航班、徒步出发（Salkantay、印加古道）及早班衔接。",
      duration: "视目的地而定",
      vehicle: "私家轿车或面包车",
      capacity: "1–10 名乘客",
      includes: ["准时保证", "前一晚确认", "熟悉徒步出发安排"],
      availability: "全天候，含节假日",
    },
    {
      name: "按小时 / 包车服务",
      desc: "配司机的车辆随你调度，用于会议、购物或市内外的定制路线。",
      duration: "最少 3 小时",
      vehicle: "轿车、面包车或 sprinter",
      capacity: "1–19 名乘客",
      includes: ["量身定制行程", "燃油与过路费", "含等候时间"],
      availability: "需预订，提前 24 小时",
    },
  ],
  ja: [
    {
      name: "クスコ空港 → ホテル",
      desc: "アレハンドロ・ベラスコ・アステテ空港でのお名前ボードでのお出迎えと、歴史地区のホテルへの直行送迎。",
      duration: "20〜30分",
      vehicle: "専用車またはバン",
      capacity: "1〜10名",
      includes: ["ボードでのお出迎え", "フライト監視", "荷物のお手伝い", "バイリンガルドライバー"],
      availability: "24時間・毎日",
    },
    {
      name: "アレキパ空港 → ホテル",
      desc: "ロドリゲス・バリョン空港から、アレキパ中心部の宿泊先までの専用送迎。",
      duration: "25〜35分",
      vehicle: "専用車またはバン",
      capacity: "1〜10名",
      includes: ["ボードでのお出迎え", "フライト監視", "荷物のお手伝い"],
      availability: "24時間・毎日",
    },
    {
      name: "クスコ → オリャンタイタンボ（鉄道駅）",
      desc: "マチュピチュへの乗り継ぎのため、列車の時刻に合わせて鉄道駅まで専用送迎。",
      duration: "1時間45分",
      vehicle: "専用バン",
      capacity: "1〜10名",
      includes: ["列車の時刻に合わせて調整", "ホテルお迎え", "ご希望で写真ストップ"],
      availability: "毎日・列車の時刻に応じて",
    },
    {
      name: "クスコ → 聖なる谷（ホテル）",
      desc: "聖なる谷のホテル（ウルバンバ、ユカイ、カルカ）への専用送迎。ご希望で写真ストップ。",
      duration: "1時間30分",
      vehicle: "専用バン",
      capacity: "1〜10名",
      includes: ["ホテルお迎え", "写真ストップ", "地域に詳しいドライバー"],
      availability: "毎日・時間は柔軟",
    },
    {
      name: "深夜・早朝の送迎",
      desc: "早朝便、トレック出発（サルカンタイ、インカ道）、早い乗り継ぎに対応する24時間サービス。",
      duration: "目的地による",
      vehicle: "専用車またはバン",
      capacity: "1〜10名",
      includes: ["時間厳守を保証", "前夜に確認", "トレック出発の経験あり"],
      availability: "24時間・祝日を含む",
    },
    {
      name: "時間貸し／貸切サービス",
      desc: "会議、買い物、市内外のカスタムルートに、ドライバー付き車両を貸切でご利用いただけます。",
      duration: "最低3時間",
      vehicle: "車・バン・スプリンター",
      capacity: "1〜19名",
      includes: ["オーダーメイドの行程", "燃料と通行料", "待機時間込み"],
      availability: "要予約・24時間前まで",
    },
  ],
  ru: [
    {
      name: "Аэропорт Куско → Отель",
      desc: "Встреча с табличкой в аэропорту Алехандро Веласко Астете и прямой трансфер в твой отель в историческом центре.",
      duration: "20–30 мин",
      vehicle: "Частный авто или вэн",
      capacity: "1–10 пассажиров",
      includes: ["Встреча с табличкой", "Отслеживание рейса", "Помощь с багажом", "Двуязычный водитель"],
      availability: "24/7, ежедневно",
    },
    {
      name: "Аэропорт Арекипы → Отель",
      desc: "Частный трансфер из аэропорта Родригес Бальон до твоего жилья в центре Арекипы.",
      duration: "25–35 мин",
      vehicle: "Частный авто или вэн",
      capacity: "1–10 пассажиров",
      includes: ["Встреча с табличкой", "Отслеживание рейса", "Помощь с багажом"],
      availability: "24/7, ежедневно",
    },
    {
      name: "Куско → Ольянтайтамбо (ж/д вокзал)",
      desc: "Частный трансфер до вокзала для пересадки на поезд к Мачу-Пикчу, согласованный с расписанием твоего поезда.",
      duration: "1 ч 45 мин",
      vehicle: "Частный вэн",
      capacity: "1–10 пассажиров",
      includes: ["Согласовано с твоим поездом", "Забор из отеля", "Остановки для фото по запросу"],
      availability: "Ежедневно, по расписанию поездов",
    },
    {
      name: "Куско → Священная долина (отели)",
      desc: "Частный трансфер в отели Священной долины: Урубамба, Юкай, Калька. Остановки для фото по запросу.",
      duration: "1 ч 30 мин",
      vehicle: "Частный вэн",
      capacity: "1–10 пассажиров",
      includes: ["Забор из отеля", "Остановки для фото", "Водитель, знающий регион"],
      availability: "Ежедневно, гибкий график",
    },
    {
      name: "Ночные и предрассветные трансферы",
      desc: "Сервис 24/7 для ранних рейсов, выходов на треки (Салкантай, Тропа инков) и ранних пересадок.",
      duration: "Зависит от направления",
      vehicle: "Частный авто или вэн",
      capacity: "1–10 пассажиров",
      includes: ["Гарантия пунктуальности", "Подтверждение накануне вечером", "Опыт выходов на треки"],
      availability: "24/7, включая праздники",
    },
    {
      name: "Почасовая аренда / в распоряжение",
      desc: "Автомобиль с водителем в твоём распоряжении для встреч, покупок или индивидуальных маршрутов в городе и за его пределами.",
      duration: "Минимум 3 ч",
      vehicle: "Авто, вэн или спринтер",
      capacity: "1–19 пассажиров",
      includes: ["Маршрут под тебя", "Топливо и пошлины", "Время ожидания включено"],
      availability: "По брони, за 24 ч",
    },
  ],
  de: [
    {
      name: "Flughafen Cusco → Hotel",
      desc: "Empfang mit Schild am Flughafen Alejandro Velasco Astete und direkter Transfer zu deinem Hotel in der Altstadt.",
      duration: "20–30 Min.",
      vehicle: "Privates Auto oder Van",
      capacity: "1–10 Reisende",
      includes: ["Empfang mit Schild", "Flugüberwachung", "Gepäckhilfe", "Zweisprachiger Fahrer"],
      availability: "24/7, täglich",
    },
    {
      name: "Flughafen Arequipa → Hotel",
      desc: "Privater Transfer vom Flughafen Rodríguez Ballón zu deiner Unterkunft im Zentrum von Arequipa.",
      duration: "25–35 Min.",
      vehicle: "Privates Auto oder Van",
      capacity: "1–10 Reisende",
      includes: ["Empfang mit Schild", "Flugüberwachung", "Gepäckhilfe"],
      availability: "24/7, täglich",
    },
    {
      name: "Cusco → Ollantaytambo (Bahnhof)",
      desc: "Privater Transfer zum Bahnhof für deinen Anschluss nach Machu Picchu, abgestimmt auf deinen Zug.",
      duration: "1 Std. 45 Min.",
      vehicle: "Privater Van",
      capacity: "1–10 Reisende",
      includes: ["Auf deinen Zug abgestimmt", "Abholung am Hotel", "Fotostopps auf Wunsch"],
      availability: "Täglich, je nach Zugfahrplan",
    },
    {
      name: "Cusco → Heiliges Tal (Hotels)",
      desc: "Privater Transfer zu den Hotels im Heiligen Tal: Urubamba, Yucay, Calca. Fotostopps auf Wunsch.",
      duration: "1 Std. 30 Min.",
      vehicle: "Privater Van",
      capacity: "1–10 Reisende",
      includes: ["Abholung am Hotel", "Fotostopps", "Ortskundiger Fahrer"],
      availability: "Täglich, flexible Zeiten",
    },
    {
      name: "Transfers nachts und am frühen Morgen",
      desc: "24/7-Service für Flüge am frühen Morgen, Trek-Abfahrten (Salkantay, Inka-Trail) und frühe Anschlüsse.",
      duration: "Je nach Ziel",
      vehicle: "Privates Auto oder Van",
      capacity: "1–10 Reisende",
      includes: ["Garantierte Pünktlichkeit", "Bestätigung am Vorabend", "Erfahrung mit Trek-Abfahrten"],
      availability: "24/7, inklusive Feiertage",
    },
    {
      name: "Stundenweise / auf Abruf",
      desc: "Fahrzeug mit Fahrer zu deiner Verfügung für Meetings, Einkäufe oder individuelle Routen in und um die Stadt.",
      duration: "Mindestens 3 Std.",
      vehicle: "Auto, Van oder Sprinter",
      capacity: "1–19 Reisende",
      includes: ["Maßgeschneiderte Route", "Kraftstoff und Maut", "Wartezeit inklusive"],
      availability: "Nach Reservierung, 24 Std. im Voraus",
    },
  ],
};

/* ============================ DESTINOS ============================ */

const DESTINATIONS_TX: Partial<Record<LangCode, DestinationTx[]>> = {
  en: [
    {
      desc: "Capital of the Inca empire and gateway to Machu Picchu. A living city of stone, markets and mountains.",
      highlights: ["Machu Picchu", "Sacred Valley", "Sacsayhuamán", "San Blas"],
    },
    {
      desc: "The White City at the foot of the Misti: sillar architecture, the finest cuisine in the south and sunshine all year round.",
      highlights: ["Santa Catalina Monastery", "San Lázaro district", "Yanahuara viewpoint", "Picanterías"],
    },
    {
      desc: "One of the deepest canyons in the world, home of the Andean condor, pre-Inca terraces and traditional villages.",
      highlights: ["Cruz del Cóndor", "Cabanaconde", "Sangalle oasis", "La Calera hot springs"],
    },
    {
      desc: "The highest navigable lake in the world, with floating reed islands and communities keeping their traditions alive.",
      highlights: ["Uros Islands", "Taquile", "Amantaní", "Sillustani"],
    },
    {
      desc: "The 15th-century Inca citadel, a wonder of the modern world between high jungle and sacred mountains.",
      highlights: ["Citadel", "Huayna Picchu", "Machu Picchu Mountain", "Aguas Calientes"],
    },
    {
      desc: "The Urubamba river valley: Inca fortresses, Andean markets, salt pans and the best climate in the Cusco region.",
      highlights: ["Pisac", "Ollantaytambo", "Maras salt pans", "Moray"],
    },
  ],
  fr: [
    {
      desc: "Capitale de l'empire inca et porte d'entrée du Machu Picchu. Une ville vivante de pierre, de marchés et de montagnes.",
      highlights: ["Machu Picchu", "Vallée sacrée", "Sacsayhuamán", "San Blas"],
    },
    {
      desc: "La Ville blanche au pied du Misti : architecture en sillar, la meilleure gastronomie du sud et du soleil toute l'année.",
      highlights: ["Monastère Santa Catalina", "Quartier San Lázaro", "Belvédère de Yanahuara", "Picanterías"],
    },
    {
      desc: "L'un des canyons les plus profonds du monde, refuge du condor des Andes, de terrasses préincas et de villages traditionnels.",
      highlights: ["Cruz del Cóndor", "Cabanaconde", "Oasis de Sangalle", "Sources chaudes de La Calera"],
    },
    {
      desc: "Le lac navigable le plus haut du monde, avec ses îles flottantes de roseaux et des communautés qui gardent leurs traditions vivantes.",
      highlights: ["Îles Uros", "Taquile", "Amantaní", "Sillustani"],
    },
    {
      desc: "La citadelle inca du XVᵉ siècle, merveille du monde moderne entre haute forêt et montagnes sacrées.",
      highlights: ["Citadelle", "Huayna Picchu", "Montagne Machu Picchu", "Aguas Calientes"],
    },
    {
      desc: "La vallée du rio Urubamba : forteresses incas, marchés andins, salines et le meilleur climat de la région de Cusco.",
      highlights: ["Pisac", "Ollantaytambo", "Salines de Maras", "Moray"],
    },
  ],
  it: [
    {
      desc: "Capitale dell'impero inca e porta d'accesso a Machu Picchu. Una città viva fatta di pietra, mercati e montagne.",
      highlights: ["Machu Picchu", "Valle Sacra", "Sacsayhuamán", "San Blas"],
    },
    {
      desc: "La Città Bianca ai piedi del Misti: architettura in sillar, la migliore gastronomia del sud e sole tutto l'anno.",
      highlights: ["Monastero di Santa Catalina", "Quartiere San Lázaro", "Belvedere di Yanahuara", "Picanterías"],
    },
    {
      desc: "Uno dei canyon più profondi del mondo, casa del condor andino, di terrazze preincaiche e villaggi tradizionali.",
      highlights: ["Cruz del Cóndor", "Cabanaconde", "Oasi di Sangalle", "Terme di La Calera"],
    },
    {
      desc: "Il lago navigabile più alto del mondo, con isole galleggianti di totora e comunità che mantengono vive le loro tradizioni.",
      highlights: ["Isole Uros", "Taquile", "Amantaní", "Sillustani"],
    },
    {
      desc: "La cittadella inca del XV secolo, meraviglia del mondo moderno tra alta foresta e montagne sacre.",
      highlights: ["Cittadella", "Huayna Picchu", "Montagna Machu Picchu", "Aguas Calientes"],
    },
    {
      desc: "La valle del fiume Urubamba: fortezze inca, mercati andini, saline e il clima migliore della regione di Cusco.",
      highlights: ["Pisac", "Ollantaytambo", "Saline di Maras", "Moray"],
    },
  ],
  pt: [
    {
      desc: "Capital do império inca e porta de entrada para Machu Picchu. Uma cidade viva de pedra, mercados e montanhas.",
      highlights: ["Machu Picchu", "Vale Sagrado", "Sacsayhuamán", "San Blas"],
    },
    {
      desc: "A Cidade Branca ao pé do Misti: arquitetura de sillar, a melhor gastronomia do sul e sol o ano todo.",
      highlights: ["Mosteiro de Santa Catalina", "Bairro San Lázaro", "Mirante de Yanahuara", "Picanterías"],
    },
    {
      desc: "Um dos cânions mais profundos do mundo, lar do condor andino, terraços pré-incas e vilarejos tradicionais.",
      highlights: ["Cruz del Cóndor", "Cabanaconde", "Oásis de Sangalle", "Águas termais La Calera"],
    },
    {
      desc: "O lago navegável mais alto do mundo, com ilhas flutuantes de totora e comunidades que mantêm vivas suas tradições.",
      highlights: ["Ilhas Uros", "Taquile", "Amantaní", "Sillustani"],
    },
    {
      desc: "A cidadela inca do século XV, maravilha do mundo moderno entre a selva alta e montanhas sagradas.",
      highlights: ["Cidadela", "Huayna Picchu", "Montanha Machu Picchu", "Aguas Calientes"],
    },
    {
      desc: "O vale do rio Urubamba: fortalezas incas, mercados andinos, salinas e o melhor clima da região de Cusco.",
      highlights: ["Pisac", "Ollantaytambo", "Salinas de Maras", "Moray"],
    },
  ],
  zh: [
    {
      desc: "印加帝国的首都，也是通往马丘比丘的门户。一座由石头、市场和群山构成的鲜活城市。",
      highlights: ["马丘比丘", "圣谷", "萨克塞瓦曼", "圣布拉斯"],
    },
    {
      desc: "米斯蒂火山脚下的白城：白火山岩建筑、秘鲁南部最佳美食，全年阳光明媚。",
      highlights: ["圣卡塔琳娜修道院", "圣拉萨罗街区", "亚纳瓦拉观景台", "传统辣味餐馆"],
    },
    {
      desc: "世界上最深的峡谷之一，安第斯神鹰的家园，拥有前印加梯田和传统村落。",
      highlights: ["神鹰十字架", "卡巴纳孔德", "桑加列绿洲", "拉卡莱拉温泉"],
    },
    {
      desc: "世界上海拔最高的可通航湖泊，拥有芦苇浮岛和世代守护传统的社区。",
      highlights: ["乌罗斯群岛", "塔基莱岛", "阿曼塔尼岛", "西留斯塔尼"],
    },
    {
      desc: "15 世纪的印加古城，坐落于高地丛林与圣山之间的现代世界奇迹。",
      highlights: ["古城遗址", "瓦伊纳比丘", "马丘比丘山", "阿瓜斯卡连特斯"],
    },
    {
      desc: "乌鲁班巴河谷：印加要塞、安第斯集市、盐田，以及库斯科地区最好的气候。",
      highlights: ["皮萨克", "奥扬泰坦博", "马拉斯盐田", "莫赖"],
    },
  ],
  ja: [
    {
      desc: "インカ帝国の首都であり、マチュピチュへの玄関口。石造りの街並み、市場、山々が息づく街。",
      highlights: ["マチュピチュ", "聖なる谷", "サクサイワマン", "サン・ブラス"],
    },
    {
      desc: "ミスティ山のふもとに広がる白い街。シジャール建築、南部随一の美食、そして一年中の陽光。",
      highlights: ["サンタ・カタリナ修道院", "サン・ラサロ地区", "ヤナワラ展望台", "ピカンテリア"],
    },
    {
      desc: "世界有数の深さを誇る渓谷。アンデスコンドルの生息地で、プレインカの段々畑や伝統的な村が点在。",
      highlights: ["コンドルの十字架", "カバナコンデ", "サンガリェのオアシス", "ラ・カレラ温泉"],
    },
    {
      desc: "世界で最も高い場所にある航行可能な湖。トトラ葦の浮島と、伝統を守り続ける人々が暮らす。",
      highlights: ["ウロス島", "タキーレ島", "アマンタニ島", "シユスタニ"],
    },
    {
      desc: "15世紀のインカの要塞都市。高地のジャングルと聖なる山々に囲まれた現代の世界遺産。",
      highlights: ["遺跡", "ワイナピチュ", "マチュピチュ山", "アグアス・カリエンテス"],
    },
    {
      desc: "ウルバンバ川の谷。インカの要塞、アンデスの市場、塩田、そしてクスコ地方随一の気候。",
      highlights: ["ピサック", "オリャンタイタンボ", "マラスの塩田", "モライ"],
    },
  ],
  ru: [
    {
      desc: "Столица империи инков и ворота к Мачу-Пикчу. Живой город камня, рынков и гор.",
      highlights: ["Мачу-Пикчу", "Священная долина", "Саксайуаман", "Сан-Блас"],
    },
    {
      desc: "Белый город у подножия Мисти: архитектура из сильяра, лучшая кухня юга и солнце круглый год.",
      highlights: ["Монастырь Санта-Каталина", "Район Сан-Ласаро", "Смотровая Янауара", "Пикантерии"],
    },
    {
      desc: "Один из глубочайших каньонов мира, дом андского кондора, доинкских террас и традиционных деревень.",
      highlights: ["Крус-дель-Кондор", "Кабанаконде", "Оазис Сангалье", "Термы Ла-Калера"],
    },
    {
      desc: "Самое высокогорное судоходное озеро в мире с плавучими тростниковыми островами и общинами, хранящими традиции.",
      highlights: ["Острова Урос", "Такиле", "Амантани", "Сильюстани"],
    },
    {
      desc: "Цитадель инков XV века, чудо современного мира между высокогорной сельвой и священными горами.",
      highlights: ["Цитадель", "Уайна-Пикчу", "Гора Мачу-Пикчу", "Агуас-Кальентес"],
    },
    {
      desc: "Долина реки Урубамба: крепости инков, андские рынки, солевые террасы и лучший климат региона Куско.",
      highlights: ["Писак", "Ольянтайтамбо", "Солевые террасы Марас", "Морай"],
    },
  ],
  de: [
    {
      desc: "Hauptstadt des Inkareichs und Tor nach Machu Picchu. Eine lebendige Stadt aus Stein, Märkten und Bergen.",
      highlights: ["Machu Picchu", "Heiliges Tal", "Sacsayhuamán", "San Blas"],
    },
    {
      desc: "Die Weiße Stadt am Fuße des Misti: Sillar-Architektur, die beste Küche des Südens und ganzjährig Sonne.",
      highlights: ["Kloster Santa Catalina", "Viertel San Lázaro", "Aussichtspunkt Yanahuara", "Picanterías"],
    },
    {
      desc: "Einer der tiefsten Canyons der Welt, Heimat des Andenkondors, präinkaischer Terrassen und traditioneller Dörfer.",
      highlights: ["Cruz del Cóndor", "Cabanaconde", "Oase von Sangalle", "Thermen von La Calera"],
    },
    {
      desc: "Der höchstgelegene schiffbare See der Welt, mit schwimmenden Schilfinseln und Gemeinschaften, die ihre Traditionen bewahren.",
      highlights: ["Uros-Inseln", "Taquile", "Amantaní", "Sillustani"],
    },
    {
      desc: "Die Inka-Zitadelle aus dem 15. Jahrhundert, ein Wunder der modernen Welt zwischen Bergnebelwald und heiligen Bergen.",
      highlights: ["Zitadelle", "Huayna Picchu", "Berg Machu Picchu", "Aguas Calientes"],
    },
    {
      desc: "Das Tal des Urubamba: Inka-Festungen, Andenmärkte, Salinen und das beste Klima der Region Cusco.",
      highlights: ["Pisac", "Ollantaytambo", "Salinen von Maras", "Moray"],
    },
  ],
};

/* ============================ TOURS (fallback) ============================ */

const TOURS_TX: Partial<Record<LangCode, TourTx[]>> = {
  en: [
    { name: "Sacred Valley of the Incas", duration: "Full day", type: "Cultural", departure: "Departs 08:00 · hotel pick-up", difficulty: "Easy", desc: "Pisac, Ollantaytambo and Chinchero in one day: Andean markets, Inca fortresses and Urubamba river scenery.", includes: ["Tourist transport", "Bilingual guide", "Buffet lunch in Urubamba"] },
    { name: "Machu Picchu Full Day", duration: "Full day", type: "Must-see", departure: "Departs 04:30 · Ollantaytambo station", difficulty: "Moderate", desc: "Train from Ollantaytambo, uphill bus and a guided tour of the citadel. All coordinated in a single day.", includes: ["Transfers and train", "Entrance ticket", "Consettur bus", "Professional guide"] },
    { name: "Rainbow Mountain (Vinicunca)", duration: "Full day", type: "Adventure", departure: "Departs 04:30 · hotel pick-up", difficulty: "Demanding · 5,036 m", desc: "Hike at 5,036 m up to the rainbow mountain, with breakfast and lunch en route. Departs 4:30 am.", includes: ["Transport", "Breakfast and lunch", "Guide", "Poles and oxygen"] },
    { name: "Cusco City Tour", duration: "Half day", type: "Cultural", departure: "Departs 13:30 · Plaza Regocijo", difficulty: "Easy", desc: "Qorikancha, Sacsayhuamán, Q'enqo, Puka Pukara and Tambomachay: the perfect introduction to the Inca capital.", includes: ["Tourist transport", "Bilingual guide"] },
    { name: "Colca Canyon 2D/1N", duration: "2 days", type: "Nature", departure: "Departs 08:00 · hotel pick-up", difficulty: "Moderate", desc: "Colca Valley with an overnight in Chivay, La Calera hot springs and sunrise at Cruz del Cóndor.", includes: ["Transport", "Hotel in Chivay", "Guide", "Breakfasts"] },
    { name: "Arequipa City Tour + Monastery", duration: "Half day", type: "Cultural", departure: "Departs 09:00 and 14:00", difficulty: "Easy", desc: "Sillar historic centre, Santa Catalina Monastery, Yanahuara viewpoint and San Lázaro district.", includes: ["Transport", "Bilingual guide"] },
    { name: "Humantay Lake", duration: "Full day", type: "Adventure", departure: "Departs 04:30 · hotel pick-up", difficulty: "Demanding · 4,200 m", desc: "Hike to the turquoise lake at the foot of the Salkantay peak (4,200 m), with breakfast and lunch.", includes: ["Transport", "Breakfast and lunch", "Guide", "Poles"] },
    { name: "Lake Titicaca: Uros and Taquile", duration: "Full day", type: "Cultural", departure: "Departs 06:40 · Puno port", difficulty: "Easy", desc: "Sailing the highest navigable lake in the world: the Uros floating islands and the textile island of Taquile.", includes: ["Tourist boat", "Guide", "Lunch on Taquile"] },
  ],
  fr: [
    { name: "Vallée sacrée des Incas", duration: "Journée complète", type: "Culturel", departure: "Départ 08:00 · prise en charge à l'hôtel", difficulty: "Facile", desc: "Pisac, Ollantaytambo et Chinchero en une journée : marchés andins, forteresses incas et paysages du rio Urubamba.", includes: ["Transport touristique", "Guide bilingue", "Déjeuner buffet à Urubamba"] },
    { name: "Machu Picchu journée complète", duration: "Journée complète", type: "Incontournable", departure: "Départ 04:30 · gare d'Ollantaytambo", difficulty: "Modéré", desc: "Train depuis Ollantaytambo, bus de montée et visite guidée de la citadelle. Tout coordonné en une seule journée.", includes: ["Transferts et train", "Billet d'entrée", "Bus Consettur", "Guide professionnel"] },
    { name: "Montagne aux 7 couleurs (Vinicunca)", duration: "Journée complète", type: "Aventure", departure: "Départ 04:30 · prise en charge à l'hôtel", difficulty: "Exigeant · 5 036 m", desc: "Randonnée à 5 036 m jusqu'à la montagne arc-en-ciel, avec petit-déjeuner et déjeuner en route. Départ 4h30.", includes: ["Transport", "Petit-déjeuner et déjeuner", "Guide", "Bâtons et oxygène"] },
    { name: "City tour de Cusco", duration: "Demi-journée", type: "Culturel", departure: "Départ 13:30 · Plaza Regocijo", difficulty: "Facile", desc: "Qorikancha, Sacsayhuamán, Q'enqo, Puka Pukara et Tambomachay : l'introduction parfaite à la capitale inca.", includes: ["Transport touristique", "Guide bilingue"] },
    { name: "Canyon de Colca 2J/1N", duration: "2 jours", type: "Nature", departure: "Départ 08:00 · prise en charge à l'hôtel", difficulty: "Modéré", desc: "Vallée de Colca avec nuit à Chivay, sources chaudes de La Calera et lever du soleil à la Cruz del Cóndor.", includes: ["Transport", "Hôtel à Chivay", "Guide", "Petits-déjeuners"] },
    { name: "City tour d'Arequipa + Monastère", duration: "Demi-journée", type: "Culturel", departure: "Départ 09:00 et 14:00", difficulty: "Facile", desc: "Centre historique en sillar, monastère de Santa Catalina, belvédère de Yanahuara et quartier de San Lázaro.", includes: ["Transport", "Guide bilingue"] },
    { name: "Lagune Humantay", duration: "Journée complète", type: "Aventure", departure: "Départ 04:30 · prise en charge à l'hôtel", difficulty: "Exigeant · 4 200 m", desc: "Randonnée jusqu'à la lagune turquoise au pied du sommet Salkantay (4 200 m), avec petit-déjeuner et déjeuner.", includes: ["Transport", "Petit-déjeuner et déjeuner", "Guide", "Bâtons"] },
    { name: "Lac Titicaca : Uros et Taquile", duration: "Journée complète", type: "Culturel", departure: "Départ 06:40 · port de Puno", difficulty: "Facile", desc: "Navigation sur le lac navigable le plus haut du monde : les îles flottantes des Uros et l'île textile de Taquile.", includes: ["Bateau touristique", "Guide", "Déjeuner à Taquile"] },
  ],
  it: [
    { name: "Valle Sacra degli Incas", duration: "Intera giornata", type: "Culturale", departure: "Partenza 08:00 · prelievo in hotel", difficulty: "Facile", desc: "Pisac, Ollantaytambo e Chinchero in un giorno: mercati andini, fortezze inca e paesaggi del fiume Urubamba.", includes: ["Trasporto turistico", "Guida bilingue", "Pranzo a buffet a Urubamba"] },
    { name: "Machu Picchu intera giornata", duration: "Intera giornata", type: "Imperdibile", departure: "Partenza 04:30 · stazione di Ollantaytambo", difficulty: "Moderata", desc: "Treno da Ollantaytambo, bus in salita e visita guidata della cittadella. Tutto coordinato in un solo giorno.", includes: ["Transfer e treno", "Biglietto d'ingresso", "Bus Consettur", "Guida professionale"] },
    { name: "Montagna dei 7 colori (Vinicunca)", duration: "Intera giornata", type: "Avventura", departure: "Partenza 04:30 · prelievo in hotel", difficulty: "Impegnativa · 5 036 m", desc: "Trekking a 5 036 m fino alla montagna arcobaleno, con colazione e pranzo lungo il percorso. Partenza 4:30.", includes: ["Trasporto", "Colazione e pranzo", "Guida", "Bastoncini e ossigeno"] },
    { name: "City tour di Cusco", duration: "Mezza giornata", type: "Culturale", departure: "Partenza 13:30 · Plaza Regocijo", difficulty: "Facile", desc: "Qorikancha, Sacsayhuamán, Q'enqo, Puka Pukara e Tambomachay: la perfetta introduzione alla capitale inca.", includes: ["Trasporto turistico", "Guida bilingue"] },
    { name: "Canyon del Colca 2G/1N", duration: "2 giorni", type: "Natura", departure: "Partenza 08:00 · prelievo in hotel", difficulty: "Moderata", desc: "Valle del Colca con pernottamento a Chivay, terme di La Calera e alba alla Cruz del Cóndor.", includes: ["Trasporto", "Hotel a Chivay", "Guida", "Colazioni"] },
    { name: "City tour di Arequipa + Monastero", duration: "Mezza giornata", type: "Culturale", departure: "Partenza 09:00 e 14:00", difficulty: "Facile", desc: "Centro storico in sillar, monastero di Santa Catalina, belvedere di Yanahuara e quartiere di San Lázaro.", includes: ["Trasporto", "Guida bilingue"] },
    { name: "Laguna Humantay", duration: "Intera giornata", type: "Avventura", departure: "Partenza 04:30 · prelievo in hotel", difficulty: "Impegnativa · 4 200 m", desc: "Trekking fino alla laguna turchese ai piedi del nevado Salkantay (4 200 m), con colazione e pranzo.", includes: ["Trasporto", "Colazione e pranzo", "Guida", "Bastoncini"] },
    { name: "Lago Titicaca: Uros e Taquile", duration: "Intera giornata", type: "Culturale", departure: "Partenza 06:40 · porto di Puno", difficulty: "Facile", desc: "Navigazione sul lago navigabile più alto del mondo: le isole galleggianti degli Uros e l'isola tessile di Taquile.", includes: ["Barca turistica", "Guida", "Pranzo a Taquile"] },
  ],
  pt: [
    { name: "Vale Sagrado dos Incas", duration: "Dia inteiro", type: "Cultural", departure: "Saída 08:00 · retirada no hotel", difficulty: "Fácil", desc: "Pisac, Ollantaytambo e Chinchero em um dia: mercados andinos, fortalezas incas e paisagens do rio Urubamba.", includes: ["Transporte turístico", "Guia bilíngue", "Almoço buffet em Urubamba"] },
    { name: "Machu Picchu dia inteiro", duration: "Dia inteiro", type: "Imperdível", departure: "Saída 04:30 · estação Ollantaytambo", difficulty: "Moderada", desc: "Trem de Ollantaytambo, ônibus de subida e visita guiada à cidadela. Tudo coordenado em um único dia.", includes: ["Traslados e trem", "Ingresso", "Ônibus Consettur", "Guia profissional"] },
    { name: "Montanha de 7 Cores (Vinicunca)", duration: "Dia inteiro", type: "Aventura", departure: "Saída 04:30 · retirada no hotel", difficulty: "Exigente · 5 036 m", desc: "Caminhada a 5 036 m até a montanha colorida, com café da manhã e almoço no percurso. Saída 4h30.", includes: ["Transporte", "Café da manhã e almoço", "Guia", "Bastões e oxigênio"] },
    { name: "City tour Cusco", duration: "Meio dia", type: "Cultural", departure: "Saída 13:30 · Plaza Regocijo", difficulty: "Fácil", desc: "Qorikancha, Sacsayhuamán, Q'enqo, Puka Pukara e Tambomachay: a introdução perfeita à capital inca.", includes: ["Transporte turístico", "Guia bilíngue"] },
    { name: "Cânion do Colca 2D/1N", duration: "2 dias", type: "Natureza", departure: "Saída 08:00 · retirada no hotel", difficulty: "Moderada", desc: "Vale do Colca com pernoite em Chivay, águas termais de La Calera e amanhecer na Cruz del Cóndor.", includes: ["Transporte", "Hotel em Chivay", "Guia", "Cafés da manhã"] },
    { name: "City tour Arequipa + Mosteiro", duration: "Meio dia", type: "Cultural", departure: "Saída 09:00 e 14:00", difficulty: "Fácil", desc: "Centro histórico de sillar, mosteiro de Santa Catalina, mirante de Yanahuara e bairro de San Lázaro.", includes: ["Transporte", "Guia bilíngue"] },
    { name: "Lagoa Humantay", duration: "Dia inteiro", type: "Aventura", departure: "Saída 04:30 · retirada no hotel", difficulty: "Exigente · 4 200 m", desc: "Caminhada até a lagoa turquesa ao pé do nevado Salkantay (4 200 m), com café da manhã e almoço.", includes: ["Transporte", "Café da manhã e almoço", "Guia", "Bastões"] },
    { name: "Lago Titicaca: Uros e Taquile", duration: "Dia inteiro", type: "Cultural", departure: "Saída 06:40 · porto de Puno", difficulty: "Fácil", desc: "Navegação pelo lago navegável mais alto do mundo: as ilhas flutuantes dos Uros e a ilha têxtil de Taquile.", includes: ["Lancha turística", "Guia", "Almoço em Taquile"] },
  ],
  zh: [
    { name: "印加圣谷", duration: "全天", type: "文化", departure: "08:00 出发 · 酒店接客", difficulty: "轻松", desc: "一天游览皮萨克、奥扬泰坦博和钦切罗：安第斯集市、印加要塞与乌鲁班巴河风光。", includes: ["旅游巴士", "双语向导", "乌鲁班巴自助午餐"] },
    { name: "马丘比丘一日游", duration: "全天", type: "必游", departure: "04:30 出发 · 奥扬泰坦博车站", difficulty: "中等", desc: "从奥扬泰坦博乘火车，上山巴士，古城导览。全部在一天内安排妥当。", includes: ["接送与火车", "门票", "Consettur 巴士", "专业向导"] },
    { name: "七彩山（维尼昆卡）", duration: "全天", type: "探险", departure: "04:30 出发 · 酒店接客", difficulty: "高强度 · 5 036 米", desc: "徒步登上海拔 5 036 米的彩虹山，途中含早餐和午餐。凌晨 4:30 出发。", includes: ["交通", "早餐和午餐", "向导", "登山杖和氧气"] },
    { name: "库斯科城市游", duration: "半天", type: "文化", departure: "13:30 出发 · Regocijo 广场", difficulty: "轻松", desc: "科里坎查、萨克塞瓦曼、肯科、普卡普卡拉与坦博马柴：认识印加首都的完美入门。", includes: ["旅游巴士", "双语向导"] },
    { name: "科尔卡峡谷 2 天 1 夜", duration: "2 天", type: "自然", departure: "08:00 出发 · 酒店接客", difficulty: "中等", desc: "科尔卡山谷，在奇瓦伊过夜，泡拉卡莱拉温泉，在神鹰十字架观日出。", includes: ["交通", "奇瓦伊住宿", "向导", "早餐"] },
    { name: "阿雷基帕城市游 + 修道院", duration: "半天", type: "文化", departure: "09:00 与 14:00 出发", difficulty: "轻松", desc: "白火山岩历史中心、圣卡塔琳娜修道院、亚纳瓦拉观景台与圣拉萨罗街区。", includes: ["交通", "双语向导"] },
    { name: "乌曼太湖", duration: "全天", type: "探险", departure: "04:30 出发 · 酒店接客", difficulty: "高强度 · 4 200 米", desc: "徒步前往萨尔坎泰雪山脚下的绿松石色湖泊（4 200 米），含早餐和午餐。", includes: ["交通", "早餐和午餐", "向导", "登山杖"] },
    { name: "的的喀喀湖：乌罗斯与塔基莱", duration: "全天", type: "文化", departure: "06:40 出发 · 普诺港", difficulty: "轻松", desc: "在世界海拔最高的可通航湖泊上航行：乌罗斯芦苇浮岛与塔基莱纺织之岛。", includes: ["旅游游船", "向导", "塔基莱午餐"] },
  ],
  ja: [
    { name: "インカの聖なる谷", duration: "終日", type: "文化", departure: "08:00 出発 · ホテルお迎え", difficulty: "やさしい", desc: "ピサック、オリャンタイタンボ、チンチェーロを1日で。アンデスの市場、インカの要塞、ウルバンバ川の風景。", includes: ["観光送迎", "バイリンガルガイド", "ウルバンバでのビュッフェ昼食"] },
    { name: "マチュピチュ終日", duration: "終日", type: "必見", departure: "04:30 出発 · オリャンタイタンボ駅", difficulty: "ふつう", desc: "オリャンタイタンボから列車、上りバス、遺跡のガイド付き見学。すべて1日で手配。", includes: ["送迎と列車", "入場券", "コンセットゥールバス", "プロのガイド"] },
    { name: "レインボーマウンテン（ビニクンカ）", duration: "終日", type: "アドベンチャー", departure: "04:30 出発 · ホテルお迎え", difficulty: "ハード · 5,036 m", desc: "標高5,036メートルの虹の山までのトレッキング。途中で朝食と昼食付き。午前4:30出発。", includes: ["交通", "朝食と昼食", "ガイド", "ポールと酸素"] },
    { name: "クスコ市内観光", duration: "半日", type: "文化", departure: "13:30 出発 · レゴシホ広場", difficulty: "やさしい", desc: "コリカンチャ、サクサイワマン、ケンコー、プカプカラ、タンボマチャイ。インカの都を知る絶好の入り口。", includes: ["観光送迎", "バイリンガルガイド"] },
    { name: "コルカ渓谷 2日1泊", duration: "2日間", type: "自然", departure: "08:00 出発 · ホテルお迎え", difficulty: "ふつう", desc: "コルカ渓谷。チバイで1泊、ラ・カレラ温泉、コンドルの十字架での日の出。", includes: ["交通", "チバイの宿泊", "ガイド", "朝食"] },
    { name: "アレキパ市内観光 + 修道院", duration: "半日", type: "文化", departure: "09:00 と 14:00 出発", difficulty: "やさしい", desc: "シジャールの歴史地区、サンタ・カタリナ修道院、ヤナワラ展望台、サン・ラサロ地区。", includes: ["交通", "バイリンガルガイド"] },
    { name: "ウマンタイ湖", duration: "終日", type: "アドベンチャー", departure: "04:30 出発 · ホテルお迎え", difficulty: "ハード · 4,200 m", desc: "サルカンタイ山のふもとにあるターコイズ色の湖（4,200 m）へのトレッキング。朝食と昼食付き。", includes: ["交通", "朝食と昼食", "ガイド", "ポール"] },
    { name: "チチカカ湖：ウロスとタキーレ", duration: "終日", type: "文化", departure: "06:40 出発 · プーノ港", difficulty: "やさしい", desc: "世界一高所の航行可能な湖をクルーズ。ウロスの浮島とタキーレの織物の島。", includes: ["観光ボート", "ガイド", "タキーレでの昼食"] },
  ],
  ru: [
    { name: "Священная долина инков", duration: "Целый день", type: "Культура", departure: "Отправление 08:00 · забор из отеля", difficulty: "Лёгкий", desc: "Писак, Ольянтайтамбо и Чинчеро за один день: андские рынки, крепости инков и пейзажи реки Урубамба.", includes: ["Туристический транспорт", "Двуязычный гид", "Обед-буфет в Урубамбе"] },
    { name: "Мачу-Пикчу целый день", duration: "Целый день", type: "Обязательно", departure: "Отправление 04:30 · станция Ольянтайтамбо", difficulty: "Средний", desc: "Поезд из Ольянтайтамбо, автобус наверх и экскурсия по цитадели. Всё за один день.", includes: ["Трансферы и поезд", "Входной билет", "Автобус Consettur", "Профессиональный гид"] },
    { name: "Радужная гора (Виникунка)", duration: "Целый день", type: "Приключение", departure: "Отправление 04:30 · забор из отеля", difficulty: "Сложный · 5 036 м", desc: "Поход на высоте 5 036 м к радужной горе, с завтраком и обедом в пути. Выезд в 4:30.", includes: ["Транспорт", "Завтрак и обед", "Гид", "Палки и кислород"] },
    { name: "Обзорный тур по Куско", duration: "Полдня", type: "Культура", departure: "Отправление 13:30 · площадь Регосихо", difficulty: "Лёгкий", desc: "Корикуанча, Саксайуаман, Кенко, Пука-Пукара и Тамбомачай: идеальное знакомство со столицей инков.", includes: ["Туристический транспорт", "Двуязычный гид"] },
    { name: "Каньон Колка 2 дня / 1 ночь", duration: "2 дня", type: "Природа", departure: "Отправление 08:00 · забор из отеля", difficulty: "Средний", desc: "Долина Колка с ночёвкой в Чивае, термы Ла-Калера и рассвет у Крус-дель-Кондор.", includes: ["Транспорт", "Отель в Чивае", "Гид", "Завтраки"] },
    { name: "Обзорный тур по Арекипе + монастырь", duration: "Полдня", type: "Культура", departure: "Отправление 09:00 и 14:00", difficulty: "Лёгкий", desc: "Исторический центр из сильяра, монастырь Санта-Каталина, смотровая Янауара и район Сан-Ласаро.", includes: ["Транспорт", "Двуязычный гид"] },
    { name: "Озеро Умантай", duration: "Целый день", type: "Приключение", departure: "Отправление 04:30 · забор из отеля", difficulty: "Сложный · 4 200 м", desc: "Поход к бирюзовому озеру у подножия вершины Салкантай (4 200 м), с завтраком и обедом.", includes: ["Транспорт", "Завтрак и обед", "Гид", "Палки"] },
    { name: "Озеро Титикака: Урос и Такиле", duration: "Целый день", type: "Культура", departure: "Отправление 06:40 · порт Пуно", difficulty: "Лёгкий", desc: "Плавание по самому высокогорному судоходному озеру мира: плавучие острова Урос и текстильный остров Такиле.", includes: ["Туристический катер", "Гид", "Обед на Такиле"] },
  ],
  de: [
    { name: "Heiliges Tal der Inka", duration: "Ganztägig", type: "Kultur", departure: "Abfahrt 08:00 · Abholung am Hotel", difficulty: "Leicht", desc: "Pisac, Ollantaytambo und Chinchero an einem Tag: Andenmärkte, Inka-Festungen und Landschaften des Urubamba.", includes: ["Touristischer Transport", "Zweisprachiger Guide", "Buffet-Mittagessen in Urubamba"] },
    { name: "Machu Picchu ganztägig", duration: "Ganztägig", type: "Höhepunkt", departure: "Abfahrt 04:30 · Bahnhof Ollantaytambo", difficulty: "Mittel", desc: "Zug ab Ollantaytambo, Bus bergauf und geführte Besichtigung der Zitadelle. Alles an einem Tag koordiniert.", includes: ["Transfers und Zug", "Eintrittskarte", "Consettur-Bus", "Professioneller Guide"] },
    { name: "Regenbogenberg (Vinicunca)", duration: "Ganztägig", type: "Abenteuer", departure: "Abfahrt 04:30 · Abholung am Hotel", difficulty: "Anspruchsvoll · 5.036 m", desc: "Wanderung auf 5.036 m hinauf zum Regenbogenberg, mit Frühstück und Mittagessen unterwegs. Abfahrt 4:30 Uhr.", includes: ["Transport", "Frühstück und Mittagessen", "Guide", "Stöcke und Sauerstoff"] },
    { name: "City-Tour Cusco", duration: "Halbtägig", type: "Kultur", departure: "Abfahrt 13:30 · Plaza Regocijo", difficulty: "Leicht", desc: "Qorikancha, Sacsayhuamán, Q'enqo, Puka Pukara und Tambomachay: der perfekte Einstieg in die Inka-Hauptstadt.", includes: ["Touristischer Transport", "Zweisprachiger Guide"] },
    { name: "Colca-Canyon 2T/1N", duration: "2 Tage", type: "Natur", departure: "Abfahrt 08:00 · Abholung am Hotel", difficulty: "Mittel", desc: "Colca-Tal mit Übernachtung in Chivay, Thermen von La Calera und Sonnenaufgang an der Cruz del Cóndor.", includes: ["Transport", "Hotel in Chivay", "Guide", "Frühstück"] },
    { name: "City-Tour Arequipa + Kloster", duration: "Halbtägig", type: "Kultur", departure: "Abfahrt 09:00 und 14:00", difficulty: "Leicht", desc: "Historisches Sillar-Zentrum, Kloster Santa Catalina, Aussichtspunkt Yanahuara und Viertel San Lázaro.", includes: ["Transport", "Zweisprachiger Guide"] },
    { name: "Humantay-See", duration: "Ganztägig", type: "Abenteuer", departure: "Abfahrt 04:30 · Abholung am Hotel", difficulty: "Anspruchsvoll · 4.200 m", desc: "Wanderung zum türkisfarbenen See am Fuße des Salkantay (4.200 m), mit Frühstück und Mittagessen.", includes: ["Transport", "Frühstück und Mittagessen", "Guide", "Stöcke"] },
    { name: "Titicacasee: Uros und Taquile", duration: "Ganztägig", type: "Kultur", departure: "Abfahrt 06:40 · Hafen von Puno", difficulty: "Leicht", desc: "Fahrt über den höchsten schiffbaren See der Welt: die schwimmenden Uros-Inseln und die Textilinsel Taquile.", includes: ["Touristenboot", "Guide", "Mittagessen auf Taquile"] },
  ],
};

/* ====================== TRANSPORTE (fallback) ====================== */

const TRANSPORTROUTES_TX: Partial<Record<LangCode, TransportRouteTx[]>> = {
  en: [
    {
      duration: "10 h approx.",
      frequency: "Daily departures",
      vehicle: "Double-decker tourist bus · semi-cama seats 140°",
      description: "Our flagship route connects the imperial capital with the White City across the altiplano. A direct trip with technical stops, modern buses and a bilingual crew.",
      highlights: ["Semi-cama seats reclining to 140°", "On-board WiFi and USB ports", "Snack and drink included", "On-board toilet and air conditioning"],
      stops: [
        { name: "Cusco terminal", time: "07:30", note: "Boarding 30 min before" },
        { name: "Sicuani", time: "09:45", note: "Technical stop" },
        { name: "Juliaca", time: "12:30" },
        { name: "Arequipa terminal", time: "17:30" },
      ],
    },
    {
      duration: "3 h 30 min",
      frequency: "Daily departures",
      vehicle: "Tourist sprinter · 19 seats",
      description: "Route into the heart of the Colca Valley, one of the deepest canyons in the world. Ideal for connecting with condor watching at Cruz del Cóndor.",
      highlights: ["Pick-up from your hotel in Arequipa", "Stop at the volcanoes viewpoint at 4,910 m", "Professional driver and on-board oxygen", "Connection to Cruz del Cóndor"],
      stops: [
        { name: "Arequipa (hotel pick-up)", time: "08:00" },
        { name: "Volcanoes viewpoint (Patapampa, 4,910 m)", time: "10:00", note: "Photo stop" },
        { name: "Chivay", time: "11:30" },
      ],
    },
    {
      duration: "2 h 15 min",
      frequency: "Daily departures",
      vehicle: "Tourist van · 15 seats",
      description: "The most scenic stretch of the Colca: from Chivay to Cabanaconde with a stop at Cruz del Cóndor during the condors' flight hours. Perfect for trekkers heading to the oasis.",
      highlights: ["40-min stop at Cruz del Cóndor", "Starting point of the trek to the Sangalle oasis", "Stops at traditional villages in the valley"],
      stops: [
        { name: "Chivay", time: "06:00" },
        { name: "Yanque", time: "06:25" },
        { name: "Cruz del Cóndor", time: "07:30", note: "40-min stop for condor watching" },
        { name: "Cabanaconde", time: "08:15" },
      ],
    },
    {
      duration: "7 h approx.",
      frequency: "Daily departures",
      vehicle: "Tourist bus with guide · Route of the Sun",
      description: "More than a transfer: a tourist bus along the Route of the Sun with guided stops at Andahuaylillas, Raqchi and the La Raya pass, lunch included, all the way to the shores of Titicaca.",
      highlights: ["Route of the Sun with guided visits included", "Buffet lunch in Sicuani", "Bilingual guide Spanish / English"],
      stops: [
        { name: "Cusco terminal", time: "07:00" },
        { name: "Andahuaylillas (Sistine Chapel of America)", time: "08:00", note: "Guided visit" },
        { name: "Raqchi (Temple of Wiracocha)", time: "09:30", note: "Guided visit" },
        { name: "La Raya (4,335 m)", time: "11:00", note: "Photo stop" },
        { name: "Puno", time: "14:00" },
      ],
    },
    {
      duration: "6 h 30 min",
      frequency: "Daily departures",
      vehicle: "Tourist minivan · 19 seats",
      description: "The budget alternative to reach Machu Picchu: minivan to Hidroeléctrica and a 2 h 30 walk alongside the railway to Aguas Calientes. Hotel pick-up included.",
      highlights: ["The cheapest way to reach Machu Picchu", "Pick-up from your hotel in Cusco", "Return available the same day or the next"],
      stops: [
        { name: "Cusco (hotel pick-up)", time: "06:30" },
        { name: "Ollantaytambo", time: "08:30", note: "Breakfast stop" },
        { name: "Abra Málaga (4,316 m)", time: "09:45" },
        { name: "Santa María", time: "11:30" },
        { name: "Hidroeléctrica", time: "13:00", note: "Walk or train to Aguas Calientes" },
      ],
    },
    {
      duration: "5 h 30 min",
      frequency: "Daily departures",
      vehicle: "Tourist bus · reclining seats",
      description: "Direct connection between Arequipa and Lake Titicaca crossing the Salinas and Aguada Blanca reserve, home to vicuñas and high-Andean flamingos.",
      highlights: ["Crossing the vicuña reserve", "Direct connection to Lake Titicaca tours", "Central terminal in Puno"],
      stops: [
        { name: "Arequipa terminal", time: "06:00" },
        { name: "Salinas and Aguada Blanca reserve", time: "07:30", note: "Vicuña watching" },
        { name: "Juliaca", time: "10:30" },
        { name: "Puno", time: "11:30" },
      ],
    },
  ],
  fr: [
    {
      duration: "10 h env.",
      frequency: "Départs quotidiens",
      vehicle: "Bus touristique à deux étages · sièges semi-cama 140°",
      description: "Notre itinéraire phare relie la capitale impériale à la Ville blanche en traversant l'altiplano. Voyage direct avec arrêts techniques, bus modernes et équipage bilingue.",
      highlights: ["Sièges semi-cama inclinables à 140°", "WiFi à bord et ports USB", "Snack et boisson inclus", "Toilettes à bord et climatisation"],
      stops: [
        { name: "Terminal de Cusco", time: "07:30", note: "Embarquement 30 min avant" },
        { name: "Sicuani", time: "09:45", note: "Arrêt technique" },
        { name: "Juliaca", time: "12:30" },
        { name: "Terminal d'Arequipa", time: "17:30" },
      ],
    },
    {
      duration: "3 h 30 min",
      frequency: "Départs quotidiens",
      vehicle: "Sprinter touristique · 19 places",
      description: "Itinéraire vers le cœur de la vallée de Colca, l'un des canyons les plus profonds du monde. Idéal pour rejoindre l'observation des condors à la Cruz del Cóndor.",
      highlights: ["Prise en charge à ton hôtel à Arequipa", "Arrêt au belvédère des volcans à 4 910 m", "Chauffeur professionnel et oxygène à bord", "Correspondance avec la Cruz del Cóndor"],
      stops: [
        { name: "Arequipa (prise en charge à l'hôtel)", time: "08:00" },
        { name: "Belvédère des volcans (Patapampa, 4 910 m)", time: "10:00", note: "Arrêt photo" },
        { name: "Chivay", time: "11:30" },
      ],
    },
    {
      duration: "2 h 15 min",
      frequency: "Départs quotidiens",
      vehicle: "Van touristique · 15 places",
      description: "Le tronçon le plus spectaculaire du Colca : de Chivay à Cabanaconde avec un arrêt à la Cruz del Cóndor aux heures de vol des condors. Parfait pour les trekkeurs vers l'oasis.",
      highlights: ["Arrêt de 40 min à la Cruz del Cóndor", "Point de départ du trek vers l'oasis de Sangalle", "Arrêts dans les villages traditionnels de la vallée"],
      stops: [
        { name: "Chivay", time: "06:00" },
        { name: "Yanque", time: "06:25" },
        { name: "Cruz del Cóndor", time: "07:30", note: "Arrêt de 40 min pour l'observation" },
        { name: "Cabanaconde", time: "08:15" },
      ],
    },
    {
      duration: "7 h env.",
      frequency: "Départs quotidiens",
      vehicle: "Bus touristique avec guide · route du soleil",
      description: "Plus qu'un transfert : un bus touristique sur la Route du Soleil avec des arrêts guidés à Andahuaylillas, Raqchi et le col de La Raya, déjeuner inclus, jusqu'aux rives du Titicaca.",
      highlights: ["Route du Soleil avec visites guidées incluses", "Déjeuner buffet à Sicuani", "Guide bilingue espagnol / anglais"],
      stops: [
        { name: "Terminal de Cusco", time: "07:00" },
        { name: "Andahuaylillas (Chapelle Sixtine d'Amérique)", time: "08:00", note: "Visite guidée" },
        { name: "Raqchi (Temple de Wiracocha)", time: "09:30", note: "Visite guidée" },
        { name: "La Raya (4 335 m)", time: "11:00", note: "Arrêt photo" },
        { name: "Puno", time: "14:00" },
      ],
    },
    {
      duration: "6 h 30 min",
      frequency: "Départs quotidiens",
      vehicle: "Minivan touristique · 19 places",
      description: "L'alternative économique pour rejoindre le Machu Picchu : minivan jusqu'à Hidroeléctrica puis 2 h 30 de marche le long de la voie ferrée jusqu'à Aguas Calientes. Prise en charge à l'hôtel incluse.",
      highlights: ["Le moyen le plus économique d'atteindre le Machu Picchu", "Prise en charge à ton hôtel à Cusco", "Retour disponible le jour même ou le lendemain"],
      stops: [
        { name: "Cusco (prise en charge à l'hôtel)", time: "06:30" },
        { name: "Ollantaytambo", time: "08:30", note: "Arrêt petit-déjeuner" },
        { name: "Abra Málaga (4 316 m)", time: "09:45" },
        { name: "Santa María", time: "11:30" },
        { name: "Hidroeléctrica", time: "13:00", note: "Marche ou train jusqu'à Aguas Calientes" },
      ],
    },
    {
      duration: "5 h 30 min",
      frequency: "Départs quotidiens",
      vehicle: "Bus touristique · sièges inclinables",
      description: "Liaison directe entre Arequipa et le lac Titicaca en traversant la réserve de Salinas et Aguada Blanca, refuge de vigognes et de flamants des hautes Andes.",
      highlights: ["Traversée de la réserve de vigognes", "Correspondance directe avec les tours du lac Titicaca", "Terminal central à Puno"],
      stops: [
        { name: "Terminal d'Arequipa", time: "06:00" },
        { name: "Réserve de Salinas et Aguada Blanca", time: "07:30", note: "Observation de vigognes" },
        { name: "Juliaca", time: "10:30" },
        { name: "Puno", time: "11:30" },
      ],
    },
  ],
  it: [
    {
      duration: "10 h circa",
      frequency: "Partenze giornaliere",
      vehicle: "Bus turistico a due piani · sedili semi-cama 140°",
      description: "Il nostro itinerario di punta collega la capitale imperiale con la Città Bianca attraversando l'altipiano. Viaggio diretto con soste tecniche, bus moderni ed equipaggio bilingue.",
      highlights: ["Sedili semi-cama reclinabili a 140°", "WiFi a bordo e porte USB", "Snack e bevanda inclusi", "Bagno a bordo e aria condizionata"],
      stops: [
        { name: "Terminal di Cusco", time: "07:30", note: "Imbarco 30 min prima" },
        { name: "Sicuani", time: "09:45", note: "Sosta tecnica" },
        { name: "Juliaca", time: "12:30" },
        { name: "Terminal di Arequipa", time: "17:30" },
      ],
    },
    {
      duration: "3 h 30 min",
      frequency: "Partenze giornaliere",
      vehicle: "Sprinter turistico · 19 posti",
      description: "Itinerario nel cuore della Valle del Colca, uno dei canyon più profondi del mondo. Ideale per collegarsi all'avvistamento dei condor alla Cruz del Cóndor.",
      highlights: ["Prelievo dal tuo hotel ad Arequipa", "Sosta al belvedere dei vulcani a 4 910 m", "Autista professionale e ossigeno a bordo", "Collegamento con la Cruz del Cóndor"],
      stops: [
        { name: "Arequipa (prelievo in hotel)", time: "08:00" },
        { name: "Belvedere dei vulcani (Patapampa, 4 910 m)", time: "10:00", note: "Sosta fotografica" },
        { name: "Chivay", time: "11:30" },
      ],
    },
    {
      duration: "2 h 15 min",
      frequency: "Partenze giornaliere",
      vehicle: "Van turistico · 15 posti",
      description: "Il tratto più scenografico del Colca: da Chivay a Cabanaconde con sosta alla Cruz del Cóndor nell'orario di volo dei condor. Perfetto per i trekker diretti all'oasi.",
      highlights: ["Sosta di 40 min alla Cruz del Cóndor", "Punto di partenza del trek all'oasi di Sangalle", "Soste nei villaggi tradizionali della valle"],
      stops: [
        { name: "Chivay", time: "06:00" },
        { name: "Yanque", time: "06:25" },
        { name: "Cruz del Cóndor", time: "07:30", note: "Sosta di 40 min per l'avvistamento" },
        { name: "Cabanaconde", time: "08:15" },
      ],
    },
    {
      duration: "7 h circa",
      frequency: "Partenze giornaliere",
      vehicle: "Bus turistico con guida · rotta del sole",
      description: "Più di un transfer: un bus turistico lungo la Rotta del Sole con soste guidate ad Andahuaylillas, Raqchi e il passo La Raya, pranzo incluso, fino alle rive del Titicaca.",
      highlights: ["Rotta del Sole con visite guidate incluse", "Pranzo a buffet a Sicuani", "Guida bilingue spagnolo / inglese"],
      stops: [
        { name: "Terminal di Cusco", time: "07:00" },
        { name: "Andahuaylillas (Cappella Sistina d'America)", time: "08:00", note: "Visita guidata" },
        { name: "Raqchi (Tempio di Wiracocha)", time: "09:30", note: "Visita guidata" },
        { name: "La Raya (4 335 m)", time: "11:00", note: "Sosta fotografica" },
        { name: "Puno", time: "14:00" },
      ],
    },
    {
      duration: "6 h 30 min",
      frequency: "Partenze giornaliere",
      vehicle: "Minivan turistico · 19 posti",
      description: "L'alternativa economica per raggiungere Machu Picchu: minivan fino a Hidroeléctrica e camminata di 2 h 30 lungo la ferrovia fino ad Aguas Calientes. Prelievo in hotel incluso.",
      highlights: ["Il modo più economico per raggiungere Machu Picchu", "Prelievo dal tuo hotel a Cusco", "Ritorno disponibile lo stesso giorno o il successivo"],
      stops: [
        { name: "Cusco (prelievo in hotel)", time: "06:30" },
        { name: "Ollantaytambo", time: "08:30", note: "Sosta per la colazione" },
        { name: "Abra Málaga (4 316 m)", time: "09:45" },
        { name: "Santa María", time: "11:30" },
        { name: "Hidroeléctrica", time: "13:00", note: "Camminata o treno per Aguas Calientes" },
      ],
    },
    {
      duration: "5 h 30 min",
      frequency: "Partenze giornaliere",
      vehicle: "Bus turistico · sedili reclinabili",
      description: "Collegamento diretto tra Arequipa e il lago Titicaca attraversando la riserva di Salinas e Aguada Blanca, casa di vigogne e fenicotteri delle alte Ande.",
      highlights: ["Attraversamento della riserva di vigogne", "Collegamento diretto con i tour del lago Titicaca", "Terminal centrale a Puno"],
      stops: [
        { name: "Terminal di Arequipa", time: "06:00" },
        { name: "Riserva di Salinas e Aguada Blanca", time: "07:30", note: "Avvistamento di vigogne" },
        { name: "Juliaca", time: "10:30" },
        { name: "Puno", time: "11:30" },
      ],
    },
  ],
  pt: [
    {
      duration: "10 h aprox.",
      frequency: "Saídas diárias",
      vehicle: "Ônibus turístico de 2 andares · poltronas semileito 140°",
      description: "Nossa rota principal conecta a capital imperial à Cidade Branca atravessando o altiplano. Viagem direta com paradas técnicas, ônibus modernos e tripulação bilíngue.",
      highlights: ["Poltronas semileito reclináveis a 140°", "WiFi a bordo e portas USB", "Lanche e bebida incluídos", "Banheiro a bordo e ar-condicionado"],
      stops: [
        { name: "Terminal de Cusco", time: "07:30", note: "Embarque 30 min antes" },
        { name: "Sicuani", time: "09:45", note: "Parada técnica" },
        { name: "Juliaca", time: "12:30" },
        { name: "Terminal de Arequipa", time: "17:30" },
      ],
    },
    {
      duration: "3 h 30 min",
      frequency: "Saídas diárias",
      vehicle: "Sprinter turística · 19 lugares",
      description: "Rota até o coração do Vale do Colca, um dos cânions mais profundos do mundo. Ideal para conectar com a observação de condores na Cruz del Cóndor.",
      highlights: ["Retirada no seu hotel em Arequipa", "Parada no mirante dos vulcões a 4 910 m", "Motorista profissional e oxigênio a bordo", "Conexão com a Cruz del Cóndor"],
      stops: [
        { name: "Arequipa (retirada no hotel)", time: "08:00" },
        { name: "Mirante dos vulcões (Patapampa, 4 910 m)", time: "10:00", note: "Parada para fotos" },
        { name: "Chivay", time: "11:30" },
      ],
    },
    {
      duration: "2 h 15 min",
      frequency: "Saídas diárias",
      vehicle: "Van turística · 15 lugares",
      description: "O trecho mais cênico do Colca: de Chivay a Cabanaconde com parada na Cruz del Cóndor no horário de voo dos condores. Perfeito para trekkers rumo ao oásis.",
      highlights: ["Parada de 40 min na Cruz del Cóndor", "Ponto de partida do trek ao oásis de Sangalle", "Paradas em vilarejos tradicionais do vale"],
      stops: [
        { name: "Chivay", time: "06:00" },
        { name: "Yanque", time: "06:25" },
        { name: "Cruz del Cóndor", time: "07:30", note: "Parada de 40 min para observação" },
        { name: "Cabanaconde", time: "08:15" },
      ],
    },
    {
      duration: "7 h aprox.",
      frequency: "Saídas diárias",
      vehicle: "Ônibus turístico com guia · rota do sol",
      description: "Mais que um traslado: um ônibus turístico pela Rota do Sol com paradas guiadas em Andahuaylillas, Raqchi e o passo La Raya, almoço incluído, até as margens do Titicaca.",
      highlights: ["Rota do Sol com visitas guiadas incluídas", "Almoço buffet em Sicuani", "Guia bilíngue espanhol / inglês"],
      stops: [
        { name: "Terminal de Cusco", time: "07:00" },
        { name: "Andahuaylillas (Capela Sistina da América)", time: "08:00", note: "Visita guiada" },
        { name: "Raqchi (Templo de Wiracocha)", time: "09:30", note: "Visita guiada" },
        { name: "La Raya (4 335 m)", time: "11:00", note: "Parada para fotos" },
        { name: "Puno", time: "14:00" },
      ],
    },
    {
      duration: "6 h 30 min",
      frequency: "Saídas diárias",
      vehicle: "Minivan turística · 19 lugares",
      description: "A alternativa econômica para chegar a Machu Picchu: minivan até Hidroeléctrica e caminhada de 2 h 30 ao longo da ferrovia até Aguas Calientes. Retirada no hotel incluída.",
      highlights: ["A forma mais econômica de chegar a Machu Picchu", "Retirada no seu hotel em Cusco", "Retorno disponível no mesmo dia ou no seguinte"],
      stops: [
        { name: "Cusco (retirada no hotel)", time: "06:30" },
        { name: "Ollantaytambo", time: "08:30", note: "Parada para café da manhã" },
        { name: "Abra Málaga (4 316 m)", time: "09:45" },
        { name: "Santa María", time: "11:30" },
        { name: "Hidroeléctrica", time: "13:00", note: "Caminhada ou trem até Aguas Calientes" },
      ],
    },
    {
      duration: "5 h 30 min",
      frequency: "Saídas diárias",
      vehicle: "Ônibus turístico · poltronas reclináveis",
      description: "Conexão direta entre Arequipa e o lago Titicaca atravessando a reserva de Salinas e Aguada Blanca, lar de vicunhas e flamingos altoandinos.",
      highlights: ["Travessia pela reserva de vicunhas", "Conexão direta com tours ao lago Titicaca", "Terminal central em Puno"],
      stops: [
        { name: "Terminal de Arequipa", time: "06:00" },
        { name: "Reserva de Salinas e Aguada Blanca", time: "07:30", note: "Observação de vicunhas" },
        { name: "Juliaca", time: "10:30" },
        { name: "Puno", time: "11:30" },
      ],
    },
  ],
  zh: [
    {
      duration: "约 10 小时",
      frequency: "每日发车",
      vehicle: "双层旅游巴士 · 140° 半躺座椅",
      description: "我们的招牌线路穿越高原，将帝国之都与白城相连。直达行程，含技术停靠，现代化巴士与双语乘务。",
      highlights: ["可倾斜至 140° 的半躺座椅", "车内 WiFi 与 USB 接口", "含小食和饮料", "车内卫生间与空调"],
      stops: [
        { name: "库斯科车站", time: "07:30", note: "提前 30 分钟登车" },
        { name: "西库阿尼", time: "09:45", note: "技术停靠" },
        { name: "胡利亚卡", time: "12:30" },
        { name: "阿雷基帕车站", time: "17:30" },
      ],
    },
    {
      duration: "3 小时 30 分钟",
      frequency: "每日发车",
      vehicle: "旅游 sprinter · 19 座",
      description: "通往科尔卡山谷腹地的线路，这里是世界上最深的峡谷之一。可衔接在神鹰十字架观赏神鹰。",
      highlights: ["在阿雷基帕的酒店接客", "在海拔 4 910 米的火山观景台停靠", "专业司机与车载氧气", "衔接神鹰十字架"],
      stops: [
        { name: "阿雷基帕（酒店接客）", time: "08:00" },
        { name: "火山观景台（帕塔潘帕，4 910 米）", time: "10:00", note: "停车拍照" },
        { name: "奇瓦伊", time: "11:30" },
      ],
    },
    {
      duration: "2 小时 15 分钟",
      frequency: "每日发车",
      vehicle: "旅游面包车 · 15 座",
      description: "科尔卡最壮丽的一段：从奇瓦伊到卡巴纳孔德，在神鹰飞行时段于神鹰十字架停靠。前往绿洲的徒步者的理想之选。",
      highlights: ["在神鹰十字架停靠 40 分钟", "前往桑加列绿洲徒步的起点", "在山谷传统村落停靠"],
      stops: [
        { name: "奇瓦伊", time: "06:00" },
        { name: "扬克", time: "06:25" },
        { name: "神鹰十字架", time: "07:30", note: "停靠 40 分钟观赏" },
        { name: "卡巴纳孔德", time: "08:15" },
      ],
    },
    {
      duration: "约 7 小时",
      frequency: "每日发车",
      vehicle: "带向导的旅游巴士 · 太阳之路",
      description: "不仅是接送：沿太阳之路的旅游巴士，在安达瓦伊利亚斯、拉克奇和拉拉亚山口有导览停靠，含午餐，直到的的喀喀湖畔。",
      highlights: ["太阳之路，含导览参观", "西库阿尼自助午餐", "西班牙语／英语双语向导"],
      stops: [
        { name: "库斯科车站", time: "07:00" },
        { name: "安达瓦伊利亚斯（美洲的西斯廷礼拜堂）", time: "08:00", note: "导览参观" },
        { name: "拉克奇（维拉科查神庙）", time: "09:30", note: "导览参观" },
        { name: "拉拉亚（4 335 米）", time: "11:00", note: "停车拍照" },
        { name: "普诺", time: "14:00" },
      ],
    },
    {
      duration: "6 小时 30 分钟",
      frequency: "每日发车",
      vehicle: "旅游 minivan · 19 座",
      description: "前往马丘比丘的经济之选：乘 minivan 到水电站，再沿铁路步行 2 小时 30 分到阿瓜斯卡连特斯。含酒店接客。",
      highlights: ["前往马丘比丘最经济的方式", "在库斯科的酒店接客", "可当天或次日返程"],
      stops: [
        { name: "库斯科（酒店接客）", time: "06:30" },
        { name: "奥扬泰坦博", time: "08:30", note: "早餐停靠" },
        { name: "马拉加山口（4 316 米）", time: "09:45" },
        { name: "圣玛丽亚", time: "11:30" },
        { name: "水电站", time: "13:00", note: "步行或乘火车前往阿瓜斯卡连特斯" },
      ],
    },
    {
      duration: "5 小时 30 分钟",
      frequency: "每日发车",
      vehicle: "旅游巴士 · 可调节座椅",
      description: "阿雷基帕与的的喀喀湖之间的直达线路，穿越萨利纳斯和阿瓜达布兰卡保护区，那里是骆马和高原火烈鸟的家园。",
      highlights: ["穿越骆马保护区", "直接衔接的的喀喀湖之旅", "普诺市中心车站"],
      stops: [
        { name: "阿雷基帕车站", time: "06:00" },
        { name: "萨利纳斯和阿瓜达布兰卡保护区", time: "07:30", note: "观赏骆马" },
        { name: "胡利亚卡", time: "10:30" },
        { name: "普诺", time: "11:30" },
      ],
    },
  ],
  ja: [
    {
      duration: "約10時間",
      frequency: "毎日出発",
      vehicle: "2階建て観光バス · セミカマシート140°",
      description: "旗艦ルートは、高原を越えて帝国の都と白い街を結びます。技術停車を挟む直行便、最新のバス、バイリンガル乗務員。",
      highlights: ["140°までリクライニングするセミカマシート", "車内WiFiとUSBポート", "軽食とドリンク付き", "車内トイレとエアコン"],
      stops: [
        { name: "クスコターミナル", time: "07:30", note: "30分前に乗車" },
        { name: "シクアニ", time: "09:45", note: "技術停車" },
        { name: "フリアカ", time: "12:30" },
        { name: "アレキパターミナル", time: "17:30" },
      ],
    },
    {
      duration: "3時間30分",
      frequency: "毎日出発",
      vehicle: "観光スプリンター · 19席",
      description: "世界有数の深さを誇るコルカ渓谷の中心へ向かうルート。コンドルの十字架でのコンドル観察への接続に最適。",
      highlights: ["アレキパのホテルお迎え", "標高4,910mの火山展望台で停車", "プロのドライバーと車内酸素", "コンドルの十字架への接続"],
      stops: [
        { name: "アレキパ（ホテルお迎え）", time: "08:00" },
        { name: "火山展望台（パタパンパ、4,910m）", time: "10:00", note: "写真ストップ" },
        { name: "チバイ", time: "11:30" },
      ],
    },
    {
      duration: "2時間15分",
      frequency: "毎日出発",
      vehicle: "観光バン · 15席",
      description: "コルカで最も景観の良い区間：チバイからカバナコンデへ、コンドルの飛翔時間帯にコンドルの十字架で停車。オアシスを目指すトレッカーに最適。",
      highlights: ["コンドルの十字架で40分停車", "サンガリェのオアシスへのトレック出発点", "渓谷の伝統的な村々で停車"],
      stops: [
        { name: "チバイ", time: "06:00" },
        { name: "ヤンケ", time: "06:25" },
        { name: "コンドルの十字架", time: "07:30", note: "観察のため40分停車" },
        { name: "カバナコンデ", time: "08:15" },
      ],
    },
    {
      duration: "約7時間",
      frequency: "毎日出発",
      vehicle: "ガイド付き観光バス · 太陽の道",
      description: "単なる移動ではありません。太陽の道を行く観光バスで、アンダワイリリャス、ラクチ、ラ・ラヤ峠でのガイド付き停車、昼食付き、チチカカ湖畔まで。",
      highlights: ["ガイド付き見学込みの太陽の道", "シクアニでのビュッフェ昼食", "スペイン語／英語のバイリンガルガイド"],
      stops: [
        { name: "クスコターミナル", time: "07:00" },
        { name: "アンダワイリリャス（アメリカのシスティーナ礼拝堂）", time: "08:00", note: "ガイド付き見学" },
        { name: "ラクチ（ウィラコチャ神殿）", time: "09:30", note: "ガイド付き見学" },
        { name: "ラ・ラヤ（4,335m）", time: "11:00", note: "写真ストップ" },
        { name: "プーノ", time: "14:00" },
      ],
    },
    {
      duration: "6時間30分",
      frequency: "毎日出発",
      vehicle: "観光ミニバン · 19席",
      description: "マチュピチュへ行く格安の選択肢：ミニバンで水力発電所まで、線路沿いに2時間30分歩いてアグアス・カリエンテスへ。ホテルお迎え込み。",
      highlights: ["マチュピチュへの最も安い行き方", "クスコのホテルお迎え", "当日または翌日の復路が可能"],
      stops: [
        { name: "クスコ（ホテルお迎え）", time: "06:30" },
        { name: "オリャンタイタンボ", time: "08:30", note: "朝食停車" },
        { name: "マラガ峠（4,316m）", time: "09:45" },
        { name: "サンタ・マリア", time: "11:30" },
        { name: "水力発電所", time: "13:00", note: "徒歩または列車でアグアス・カリエンテスへ" },
      ],
    },
    {
      duration: "5時間30分",
      frequency: "毎日出発",
      vehicle: "観光バス · リクライニングシート",
      description: "アレキパとチチカカ湖を結ぶ直行便。サリナス・イ・アグアダ・ブランカ保護区を横断し、ビクーニャや高地アンデスのフラミンゴの生息地を通ります。",
      highlights: ["ビクーニャ保護区の横断", "チチカカ湖ツアーへの直接接続", "プーノの中心部ターミナル"],
      stops: [
        { name: "アレキパターミナル", time: "06:00" },
        { name: "サリナス・イ・アグアダ・ブランカ保護区", time: "07:30", note: "ビクーニャ観察" },
        { name: "フリアカ", time: "10:30" },
        { name: "プーノ", time: "11:30" },
      ],
    },
  ],
  ru: [
    {
      duration: "около 10 ч",
      frequency: "Ежедневные отправления",
      vehicle: "Двухэтажный туристический автобус · сиденья полулёжа 140°",
      description: "Наш флагманский маршрут соединяет имперскую столицу с Белым городом через альтиплано. Прямая поездка с техническими остановками, современные автобусы и двуязычный экипаж.",
      highlights: ["Сиденья полулёжа с наклоном 140°", "WiFi на борту и USB-порты", "Снек и напиток включены", "Туалет на борту и кондиционер"],
      stops: [
        { name: "Терминал Куско", time: "07:30", note: "Посадка за 30 мин" },
        { name: "Сикуани", time: "09:45", note: "Техническая остановка" },
        { name: "Хульяка", time: "12:30" },
        { name: "Терминал Арекипы", time: "17:30" },
      ],
    },
    {
      duration: "3 ч 30 мин",
      frequency: "Ежедневные отправления",
      vehicle: "Туристический спринтер · 19 мест",
      description: "Маршрут в сердце долины Колка, одного из глубочайших каньонов мира. Идеален для стыковки с наблюдением за кондорами у Крус-дель-Кондор.",
      highlights: ["Забор из твоего отеля в Арекипе", "Остановка на смотровой вулканов на 4 910 м", "Профессиональный водитель и кислород на борту", "Стыковка с Крус-дель-Кондор"],
      stops: [
        { name: "Арекипа (забор из отеля)", time: "08:00" },
        { name: "Смотровая вулканов (Патапампа, 4 910 м)", time: "10:00", note: "Остановка для фото" },
        { name: "Чивай", time: "11:30" },
      ],
    },
    {
      duration: "2 ч 15 мин",
      frequency: "Ежедневные отправления",
      vehicle: "Туристический вэн · 15 мест",
      description: "Самый живописный участок Колки: от Чивая до Кабанаконде с остановкой у Крус-дель-Кондор в часы полёта кондоров. Отлично для треккеров, идущих к оазису.",
      highlights: ["Остановка 40 мин у Крус-дель-Кондор", "Точка старта трека к оазису Сангалье", "Остановки в традиционных деревнях долины"],
      stops: [
        { name: "Чивай", time: "06:00" },
        { name: "Янке", time: "06:25" },
        { name: "Крус-дель-Кондор", time: "07:30", note: "Остановка 40 мин для наблюдения" },
        { name: "Кабанаконде", time: "08:15" },
      ],
    },
    {
      duration: "около 7 ч",
      frequency: "Ежедневные отправления",
      vehicle: "Туристический автобус с гидом · Дорога Солнца",
      description: "Больше чем трансфер: туристический автобус по Дороге Солнца с экскурсионными остановками в Андауайлильясе, Ракчи и на перевале Ла-Райя, обед включён, до берегов Титикаки.",
      highlights: ["Дорога Солнца с экскурсиями включена", "Обед-буфет в Сикуани", "Двуязычный гид испанский / английский"],
      stops: [
        { name: "Терминал Куско", time: "07:00" },
        { name: "Андауайлильяс (Сикстинская капелла Америки)", time: "08:00", note: "Экскурсия с гидом" },
        { name: "Ракчи (Храм Виракочи)", time: "09:30", note: "Экскурсия с гидом" },
        { name: "Ла-Райя (4 335 м)", time: "11:00", note: "Остановка для фото" },
        { name: "Пуно", time: "14:00" },
      ],
    },
    {
      duration: "6 ч 30 мин",
      frequency: "Ежедневные отправления",
      vehicle: "Туристический минивэн · 19 мест",
      description: "Бюджетный вариант добраться до Мачу-Пикчу: минивэн до Идроэлектрики и пешая прогулка 2 ч 30 вдоль железной дороги до Агуас-Кальентес. Забор из отеля включён.",
      highlights: ["Самый дешёвый способ добраться до Мачу-Пикчу", "Забор из твоего отеля в Куско", "Возврат доступен в тот же или на следующий день"],
      stops: [
        { name: "Куско (забор из отеля)", time: "06:30" },
        { name: "Ольянтайтамбо", time: "08:30", note: "Остановка на завтрак" },
        { name: "Перевал Малага (4 316 м)", time: "09:45" },
        { name: "Санта-Мария", time: "11:30" },
        { name: "Идроэлектрика", time: "13:00", note: "Пешком или на поезде до Агуас-Кальентес" },
      ],
    },
    {
      duration: "5 ч 30 мин",
      frequency: "Ежедневные отправления",
      vehicle: "Туристический автобус · раскладные сиденья",
      description: "Прямое сообщение между Арекипой и озером Титикака через заповедник Салинас-и-Агуада-Бланка, дом викуний и высокогорных андских фламинго.",
      highlights: ["Проезд через заповедник викуний", "Прямая стыковка с турами на озеро Титикака", "Центральный терминал в Пуно"],
      stops: [
        { name: "Терминал Арекипы", time: "06:00" },
        { name: "Заповедник Салинас-и-Агуада-Бланка", time: "07:30", note: "Наблюдение за викуньями" },
        { name: "Хульяка", time: "10:30" },
        { name: "Пуно", time: "11:30" },
      ],
    },
  ],
  de: [
    {
      duration: "ca. 10 Std.",
      frequency: "Tägliche Abfahrten",
      vehicle: "Doppeldecker-Reisebus · Semi-Cama-Sitze 140°",
      description: "Unsere Vorzeigeroute verbindet die imperiale Hauptstadt mit der Weißen Stadt über das Altiplano. Direkte Fahrt mit technischen Stopps, modernen Bussen und zweisprachiger Crew.",
      highlights: ["Semi-Cama-Sitze bis 140° verstellbar", "WLAN an Bord und USB-Anschlüsse", "Snack und Getränk inklusive", "Bordtoilette und Klimaanlage"],
      stops: [
        { name: "Terminal Cusco", time: "07:30", note: "Einstieg 30 Min. vorher" },
        { name: "Sicuani", time: "09:45", note: "Technischer Halt" },
        { name: "Juliaca", time: "12:30" },
        { name: "Terminal Arequipa", time: "17:30" },
      ],
    },
    {
      duration: "3 Std. 30 Min.",
      frequency: "Tägliche Abfahrten",
      vehicle: "Touristischer Sprinter · 19 Sitze",
      description: "Route ins Herz des Colca-Tals, eines der tiefsten Canyons der Welt. Ideal für den Anschluss an die Kondorbeobachtung an der Cruz del Cóndor.",
      highlights: ["Abholung von deinem Hotel in Arequipa", "Halt am Vulkan-Aussichtspunkt auf 4.910 m", "Professioneller Fahrer und Sauerstoff an Bord", "Anschluss an die Cruz del Cóndor"],
      stops: [
        { name: "Arequipa (Hotelabholung)", time: "08:00" },
        { name: "Vulkan-Aussichtspunkt (Patapampa, 4.910 m)", time: "10:00", note: "Fotostopp" },
        { name: "Chivay", time: "11:30" },
      ],
    },
    {
      duration: "2 Std. 15 Min.",
      frequency: "Tägliche Abfahrten",
      vehicle: "Touristischer Van · 15 Sitze",
      description: "Der landschaftlich schönste Abschnitt des Colca: von Chivay nach Cabanaconde mit Halt an der Cruz del Cóndor während der Flugzeiten der Kondore. Perfekt für Trekker Richtung Oase.",
      highlights: ["40-min-Halt an der Cruz del Cóndor", "Ausgangspunkt des Treks zur Oase Sangalle", "Halte in traditionellen Dörfern des Tals"],
      stops: [
        { name: "Chivay", time: "06:00" },
        { name: "Yanque", time: "06:25" },
        { name: "Cruz del Cóndor", time: "07:30", note: "40-min-Halt zur Beobachtung" },
        { name: "Cabanaconde", time: "08:15" },
      ],
    },
    {
      duration: "ca. 7 Std.",
      frequency: "Tägliche Abfahrten",
      vehicle: "Reisebus mit Guide · Route der Sonne",
      description: "Mehr als ein Transfer: ein Reisebus auf der Route der Sonne mit geführten Stopps in Andahuaylillas, Raqchi und am Pass La Raya, Mittagessen inklusive, bis an die Ufer des Titicaca.",
      highlights: ["Route der Sonne mit geführten Besichtigungen inklusive", "Buffet-Mittagessen in Sicuani", "Zweisprachiger Guide Spanisch / Englisch"],
      stops: [
        { name: "Terminal Cusco", time: "07:00" },
        { name: "Andahuaylillas (Sixtinische Kapelle Amerikas)", time: "08:00", note: "Geführte Besichtigung" },
        { name: "Raqchi (Tempel des Wiracocha)", time: "09:30", note: "Geführte Besichtigung" },
        { name: "La Raya (4.335 m)", time: "11:00", note: "Fotostopp" },
        { name: "Puno", time: "14:00" },
      ],
    },
    {
      duration: "6 Std. 30 Min.",
      frequency: "Tägliche Abfahrten",
      vehicle: "Touristischer Minivan · 19 Sitze",
      description: "Die günstige Alternative nach Machu Picchu: Minivan bis Hidroeléctrica und 2 Std. 30 Fußmarsch entlang der Bahnstrecke bis Aguas Calientes. Hotelabholung inklusive.",
      highlights: ["Der günstigste Weg nach Machu Picchu", "Abholung von deinem Hotel in Cusco", "Rückfahrt am selben oder am nächsten Tag verfügbar"],
      stops: [
        { name: "Cusco (Hotelabholung)", time: "06:30" },
        { name: "Ollantaytambo", time: "08:30", note: "Frühstückspause" },
        { name: "Abra Málaga (4.316 m)", time: "09:45" },
        { name: "Santa María", time: "11:30" },
        { name: "Hidroeléctrica", time: "13:00", note: "Fußmarsch oder Zug nach Aguas Calientes" },
      ],
    },
    {
      duration: "5 Std. 30 Min.",
      frequency: "Tägliche Abfahrten",
      vehicle: "Reisebus · verstellbare Sitze",
      description: "Direktverbindung zwischen Arequipa und dem Titicacasee durch das Reservat Salinas y Aguada Blanca, Heimat von Vikunjas und hochandinen Flamingos.",
      highlights: ["Durchquerung des Vikunja-Reservats", "Direkter Anschluss an Touren zum Titicacasee", "Zentrales Terminal in Puno"],
      stops: [
        { name: "Terminal Arequipa", time: "06:00" },
        { name: "Reservat Salinas y Aguada Blanca", time: "07:30", note: "Vikunja-Beobachtung" },
        { name: "Juliaca", time: "10:30" },
        { name: "Puno", time: "11:30" },
      ],
    },
  ],
};

/* ============================ Hooks ============================ */

export function useTransfers(): Transfer[] {
  const { idioma } = useIdioma();
  const tx = TRANSFERS_TX[idioma];
  return transfersBase.map((t, i) => (tx?.[i] ? { ...t, ...tx[i] } : t));
}

export function useDestinations(): Destination[] {
  const { idioma } = useIdioma();
  const tx = DESTINATIONS_TX[idioma];
  return destinationsBase.map((d, i) => (tx?.[i] ? { ...d, ...tx[i] } : d));
}

export function useToursSeed(): Tour[] {
  const { idioma } = useIdioma();
  const tx = TOURS_TX[idioma];
  return toursBase.map((t, i) => (tx?.[i] ? { ...t, ...tx[i] } : t));
}

export function useTransportRoutes(): TransportRoute[] {
  const { idioma } = useIdioma();
  const tx = TRANSPORTROUTES_TX[idioma];
  return transportRoutesBase.map((r, i) => (tx?.[i] ? { ...r, ...tx[i] } : r));
}
