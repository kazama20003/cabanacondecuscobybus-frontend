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
  type Transfer,
  type Destination,
  type Tour,
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
