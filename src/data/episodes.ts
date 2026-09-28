import type { Poi } from "./pois";

export type Episode = {
  poiId: string;
  series: string;
  /** Texto completo para narração (estilo podcast curto). */
  narrationScript: string;
  /** Factos que aparecem no ecrã enquanto ouves. */
  learnPoints: string[];
  sourceNote: string;
};

export const EPISODES: Record<string, Episode> = {
  "padrao-descobrimentos": {
    poiId: "padrao-descobrimentos",
    series: "Belém · Império",
    narrationScript:
      "Estás no Padrão dos Descobrimentos. Este monumento não é medieval: foi inaugurado em 1960, no século de Vasco da Gama. A figura que lidera a escultura é Henry o Navegador, infante que financiou expedições desde Sagres. À tua volta estão 33 personalidades da expansão — navegadores, cartógrafos, missionários. O rio que vês era a autoestrada do século XV: sem ele, Lisboa não teria sido capital de um império que ia até ao Japão.",
    learnPoints: [
      "Inaugurado em 1960 para comemorar 500 anos de Vasco da Gama.",
      "Henry o Navegador abre a composição — não foi rei, mas mudou a história naval.",
      "33 figuras históricas representam ciência, fé e comércio marítimo.",
    ],
    sourceNote: "Parques de Sintra–Monte da Lua / arquivo municipal de Lisboa.",
  },
  "torre-belem": {
    poiId: "torre-belem",
    series: "Belém · Defesa",
    narrationScript:
      "Torre de Belém. Construída entre 1514 e 1520, não era só monumento: era fortaleza na margem do Tejo. O estilo manuelino mistura elementos náuticos em pedra — cordas, esferas armilares — com a necessidade militar. Serviu de prisão para opositores políticos e de posto alfandegário. Em 1983 tornou-se Património Mundial da UNESCO, símbolo de uma Lisboa que olhava para o oceano.",
    learnPoints: [
      "Fortaleza manuelina ligada à proteção da entrada do porto.",
      "Funções reais: defesa, prisão e controlo aduaneiro.",
      "UNESCO desde 1983 — um dos ícones mais reproduzidos de Portugal.",
    ],
    sourceNote: "DGPC / UNESCO World Heritage Centre.",
  },
  "mosteiro-jeronimos": {
    poiId: "mosteiro-jeronimos",
    series: "Belém · Fé e poder",
    narrationScript:
      "Mosteiro dos Jerónimos. D. Manuel I mandou construir este mosteiro para agradecer a Vasco da Gama pela viagem à Índia. A ordem dos Jerónimos rezava aqui por navegadores que partiam sem garantia de regresso. O claustro é um manual de pedra do estilo manuelino: cada coluna conta uma viagem. Vasco da Gama está enterrado na igreja — não é mitologia turística, é o centro simbólico da Era dos Descobrimentos.",
    learnPoints: [
      "Pedido real após a viagem de Vasco da Gama à Índia (1498).",
      "Mosteiro da ordem de São Jerónimo — orações pelos navegadores.",
      "Túmulo de Vasco da Gama na igreja principal.",
    ],
    sourceNote: "Mosteiro dos Jerónimos / DGPC.",
  },
  maat: {
    poiId: "maat",
    series: "Tejo · Hoje",
    narrationScript:
      "MAAT — Museu de Arte, Arquitetura e Tecnologia. Aberto em 2016, este edifício ondulado devolve o Tejo à frente cultural de Lisboa. A arquitetura de Amanda Levete foi pensada para ser caminhada: a cobertura é um miradouro público. É o contraste perfeito com Belém histórico: a mesma margem, séculos diferentes. Arte contemporânea aqui não substitui a história — mostra como Lisboa ainda se reinventa.",
    learnPoints: [
      "Inaugurado em 2016 na frente ribeirinha de Belém.",
      "Foco em arte, arquitetura e relação com o rio.",
      "Cobertura acessível como miradouro sobre o Tejo.",
    ],
    sourceNote: "Fundação EDP / MAAT.",
  },
  "25-abril": {
    poiId: "25-abril",
    series: "Tejo · Pontes",
    narrationScript:
      "Ponte 25 de Abril. Com mais de dois quilómetros, foi a maior ponte suspensa da Europa quando abriu em 1966. O desenho lembra o Golden Gate — engenheiros americanos participaram no projeto. Chamava-se Ponte Salazar até 1974; o novo nome celebra a revolução que restaurou a democracia. Correr por baixo é ouvir o Tejo e o metal: Lisboa e Almada ligadas por aço.",
    learnPoints: [
      "Aberta em 1966; uma das maiores pontes suspensas da Europa na época.",
      "Renomeada após a Revolução de 25 de Abril de 1974.",
      "Liga o centro de Lisboa a Almada na margem sul.",
    ],
    sourceNote: "Lusoponte / arquivo RTP.",
  },
  comercio: {
    poiId: "comercio",
    series: "Baixa · Reconstrução",
    narrationScript:
      "Praça do Comércio — o antigo Terreiro do Paço. O terramoto de 1755 destruiu quase toda a Baixa. O Marquês de Pombal redesenhou a cidade com grelha geométrica e edifícios à prova de sismo — uma inovação urbanística europeia. Esta praça aberta ao Tejo era o coração político e económico do Império. O arco triunfal homenageia a cidade que renasceu das ruínas em poucos anos.",
    learnPoints: [
      "Epicentro da reconstrução pombalina após o terramoto de 1755.",
      "Terreiro do Paço: palácio real até ao século XIX.",
      "Grelha baixa: urbanismo racional raro na Europa do século XVIII.",
    ],
    sourceNote: "CML / Museu de Lisboa.",
  },
  castelo: {
    poiId: "castelo",
    series: "Colinas · Castelo",
    narrationScript:
      "Castelo de São Jorge. Os mouros fortificaram este monte no século XI; após 1147 os cruzados tornaram-no castelo real. As muralhas que vês são camadas de séculos — cada reconstrução guarda um conflito ou um rei. Daqui a vista abrange Alfama, o Tejo e Belém. Lisboa nasceu entre estas colinas; correr até ao castelo é subir a história política da cidade.",
    learnPoints: [
      "Fortificação islâmica adaptada após a conquista de 1147.",
      "Residência real medieval e ponto de controlo da cidade.",
      "Miradouro sobre sete colinas e o estuário do Tejo.",
    ],
    sourceNote: "Castelo de São Jorge / CML.",
  },
  se: {
    poiId: "se",
    series: "Alfama · Sé",
    narrationScript:
      "Sé de Lisboa. Após a conquista cristã em 1147, ergueram-se aqui as primeiras grandes igrejas sobre uma mesquita. O românico austero — grossas colunas, poucas janelas — contrasta com o manuelino de Belém. As campanas da Sé marcaram fogo, terramoto e festa durante oito séculos. Alfama à volta é um dos bairros mais antigos da Europa ocidental ainda habitados.",
    learnPoints: [
      "Catedral desde a reconquista; edifício românico sobre estruturas mais antigas.",
      "Campanário testemunhou terramoto de 1755 e reconstruções.",
      "Alfama: tecido urbano medieval preservado.",
    ],
    sourceNote: "Patriarcado de Lisboa / DGPC.",
  },
};

export function getEpisode(poi: Poi): Episode {
  return (
    EPISODES[poi.id] ?? {
      poiId: poi.id,
      series: poi.subtitle,
      narrationScript: `${poi.name}. ${poi.storyTitle}. ${poi.story}`,
      learnPoints: [poi.story],
      sourceNote: "RunApp · Lisboa",
    }
  );
}
