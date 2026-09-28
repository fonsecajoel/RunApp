export type Poi = {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  triggerRadiusM: number;
  storyTitle: string;
  story: string;
  era: string;
  imageGradient: string;
};

/** POIs along typical Lisbon running loops (Belém → riverside → Baixa). */
export const LISBON_POIS: Poi[] = [
  {
    id: "padrao-descobrimentos",
    name: "Padrão dos Descobrimentos",
    subtitle: "Belém",
    lat: 38.6936,
    lng: -9.2057,
    triggerRadiusM: 120,
    era: "1960",
    imageGradient: "from-amber-900/80 to-lisboa-night",
    storyTitle: "Onde o Tejo virou império",
    story:
      "Este monumento celebra a Era dos Descobrimentos. Inaugurado em 1960, evoca navegadores como Henry o Navegador, Vasco da Gama e Fernão de Magalhães. Enquanto corres, imagina caravelas a descer o rio — Lisboa era o centro do mundo conhecido.",
  },
  {
    id: "torre-belem",
    name: "Torre de Belém",
    subtitle: "Fortaleza Manuelina",
    lat: 38.6916,
    lng: -9.216,
    triggerRadiusM: 100,
    era: "1514–1520",
    imageGradient: "from-lisboa-river/90 to-lisboa-night",
    storyTitle: "Sentinela no Tejo",
    story:
      "Construída para defender a entrada do porto, a Torre é um ícone do estilo manuelino — cordas em pedra, escudos e o Cristo dos Navegantes. Era também prisão e ponto de embarque. Hoje, UNESCO e símbolo da cidade que abriu caminho aos oceanos.",
  },
  {
    id: "mosteiro-jeronimos",
    name: "Mosteiro dos Jerónimos",
    subtitle: "Património UNESCO",
    lat: 38.6979,
    lng: -9.2067,
    triggerRadiusM: 110,
    era: "1501",
    imageGradient: "from-stone-600/70 to-lisboa-night",
    storyTitle: "Pedra que agradece a Vasco da Gama",
    story:
      "D. Manuel I mandou erguer este mosteiro para celebrar a viagem de Vasco da Gama à Índia. O claustro e a igreja são um museu de pedra lavrada. Correr aqui é passar por séculos de fé, ciência e orgulho nacional num só quarteirão.",
  },
  {
    id: "maat",
    name: "MAAT",
    subtitle: "Arte e arquitetura",
    lat: 38.6962,
    lng: -9.1975,
    triggerRadiusM: 90,
    era: "2016",
    imageGradient: "from-cyan-900/60 to-lisboa-night",
    storyTitle: "O Tejo em ondas de cerâmica",
    story:
      "O Museu de Arte, Arquitetura e Tecnologia desenhou uma nova frente ribeirinha. A cobertura ondulada reflete o rio e o céu. É o contraste perfeito: monumentos do século XVI ao lado de Lisboa contemporânea — tudo no mesmo passeio de corrida.",
  },
  {
    id: "25-abril",
    name: "Ponte 25 de Abril",
    subtitle: "Ligação a Almada",
    lat: 38.6922,
    lng: -9.1775,
    triggerRadiusM: 150,
    era: "1966",
    imageGradient: "from-red-950/70 to-lisboa-night",
    storyTitle: "Vermelha como o Golden Gate",
    story:
      "Inspirada na ponte de São Francisco, esta estrutura transformou a mobilidade na região. Antes «Ponte Salazar», renomeada após a Revolução de 1974. Ao correres em baixo, ouves o trânsito numa harpa de aço sobre o Tejo.",
  },
  {
    id: "comercio",
    name: "Praça do Comércio",
    subtitle: "Baixa Pombalina",
    lat: 38.7075,
    lng: -9.1365,
    triggerRadiusM: 130,
    era: "1755 — reconstrução",
    imageGradient: "from-lisboa-gold/30 to-lisboa-night",
    storyTitle: "Depois do terramoto",
    story:
      "O grande terramoto de 1755 arrasou Lisboa. O Marquês de Pombal redesenhou a Baixa com grelha geométrica e esta praça aberta ao rio — o Terreiro do Paço. O arco triunfal homenageia a cidade que renasceu das ruínas.",
  },
  {
    id: "castelo",
    name: "Castelo de São Jorge",
    subtitle: "Vista sobre a cidade",
    lat: 38.7139,
    lng: -9.1335,
    triggerRadiusM: 140,
    era: "Séc. XI–XII",
    imageGradient: "from-orange-950/80 to-lisboa-night",
    storyTitle: "Muralhas sobre sete colinas",
    story:
      "Morros fortificados desde os mouros; os cruzados consolidaram o castelo que domina a Alfama. Daqui vês o labirinto de telhas, o Tejo e o Padrão ao longe. Correr até às muralhas é subir a camadas de história — literalmente.",
  },
  {
    id: "se",
    name: "Sé de Lisboa",
    subtitle: "Alfama",
    lat: 38.7098,
    lng: -9.133,
    triggerRadiusM: 80,
    era: "1147",
    imageGradient: "from-zinc-700/80 to-lisboa-night",
    storyTitle: "Catedral da reconquista",
    story:
      "Após a conquista de Lisboa, o primeiro templo foi erguido sobre uma mesquita. O estilo românico austero contrasta com o manuelino de Belém. Campanas e sombras na Alfama — um dos bairros mais antigos da Europa ocidental.",
  },
];

export type RoutePlan = {
  km: number;
  label: string;
  description: string;
  poiIds: string[];
  /** Waypoints for OSRM (lat, lng) */
  waypoints: [number, number][];
  estimatedMin: number;
};

export const ROUTE_PLANS: RoutePlan[] = [
  {
    km: 10,
    label: "10 km",
    description: "Belém clássico — rio, torre e descobrimentos",
    estimatedMin: 55,
    poiIds: ["padrao-descobrimentos", "torre-belem", "mosteiro-jeronimos", "maat"],
    waypoints: [
      [38.6936, -9.2057],
      [38.6916, -9.216],
      [38.6979, -9.2067],
      [38.6962, -9.1975],
      [38.6936, -9.2057],
    ],
  },
  {
    km: 15,
    label: "15 km",
    description: "Belém até à ponte — horizonte e Tejo",
    estimatedMin: 82,
    poiIds: [
      "padrao-descobrimentos",
      "torre-belem",
      "mosteiro-jeronimos",
      "maat",
      "25-abril",
    ],
    waypoints: [
      [38.6936, -9.2057],
      [38.6916, -9.216],
      [38.6979, -9.2067],
      [38.6962, -9.1975],
      [38.6922, -9.1775],
      [38.6962, -9.1975],
      [38.6936, -9.2057],
    ],
  },
  {
    km: 20,
    label: "20 km",
    description: "Grande loop — Belém, rio e colinas históricas",
    estimatedMin: 110,
    poiIds: [
      "padrao-descobrimentos",
      "torre-belem",
      "mosteiro-jeronimos",
      "maat",
      "25-abril",
      "comercio",
      "castelo",
      "se",
    ],
    waypoints: [
      [38.6936, -9.2057],
      [38.6916, -9.216],
      [38.6979, -9.2067],
      [38.6922, -9.1775],
      [38.7075, -9.1365],
      [38.7139, -9.1335],
      [38.7098, -9.133],
      [38.7075, -9.1365],
      [38.6922, -9.1775],
      [38.6936, -9.2057],
    ],
  },
];

export function getPoiById(id: string): Poi | undefined {
  return LISBON_POIS.find((p) => p.id === id);
}

export function haversineM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
