import type { LatLng } from "../lib/routing";

export type RunRoute = {
  id: string;
  title: string;
  subtitle: string;
  distanceKm: number;
  durationMin: number;
  difficulty: "fácil" | "médio" | "exigente";
  zone: string;
  description: string;
  poiIds: string[];
  waypoints: LatLng[];
  /** Para o utilizador escolher com contexto. */
  youWillLearn: string[];
};

export const RUN_ROUTES: RunRoute[] = [
  {
    id: "belem-classico-10",
    title: "Belém clássico",
    subtitle: "10 km · margem ribeirinha",
    distanceKm: 10,
    durationMin: 55,
    difficulty: "fácil",
    zone: "Belém",
    description:
      "Percurso plano junto ao Tejo. Quatro episódios sobre Descobrimentos, defesa do porto e Lisboa contemporânea.",
    poiIds: ["padrao-descobrimentos", "torre-belem", "mosteiro-jeronimos", "maat"],
    waypoints: [
      [38.6936, -9.2057],
      [38.6916, -9.216],
      [38.6979, -9.2067],
      [38.6962, -9.1975],
      [38.6936, -9.2057],
    ],
    youWillLearn: [
      "Porque o Padrão foi erguido em 1960 e não no século XV",
      "Como a Torre de Belém protegia o império comercial",
      "O papel do Mosteiro dos Jerónimos nas viagens marítimas",
    ],
  },
  {
    id: "tejo-ponte-15",
    title: "Tejo até à ponte",
    subtitle: "15 km · horizonte e rio",
    distanceKm: 15,
    durationMin: 82,
    difficulty: "médio",
    zone: "Belém · Alcântara",
    description:
      "Estende Belém até à Ponte 25 de Abril. Ideal para long run com narração espaçada.",
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
    youWillLearn: [
      "Engenharia da ponte e a mudança de nome em 1974",
      "Como o Tejo estruturou a expansão portuguesa",
    ],
  },
  {
    id: "lisboa-historica-20",
    title: "Grande loop histórico",
    subtitle: "20 km · Belém às colinas",
    distanceKm: 20,
    durationMin: 110,
    difficulty: "exigente",
    zone: "Belém · Baixa · Alfama",
    description:
      "O percurso completo: império, terramoto, castelo e Sé. Para quem quer uma aula de história a correr.",
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
    youWillLearn: [
      "Reconstrução pombalina após 1755",
      "Castelo de São Jorge e a conquista de Lisboa",
      "A Sé e a Alfama medieval",
    ],
  },
];

export function getRouteById(id: string): RunRoute | undefined {
  return RUN_ROUTES.find((r) => r.id === id);
}
