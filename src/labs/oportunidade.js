// Modelo do tema 1 — custo de oportunidade.
//
// Não há curva nem equilíbrio aqui: o tema é decisão sob restrição. O recurso é
// indivisível (um sábado, um terreno, uma quantia) e só pode ir para um uso.
//
// O custo de uma escolha é o valor da MELHOR alternativa abandonada. O ganho
// líquido é o que sobra depois de descontá-lo — e é ele que revela quando uma
// escolha aparentemente lucrativa apenas empata com o que se deixou de lado.

export function custoOportunidade(alternativas, escolhidaId) {
  const abandonadas = alternativas.filter(a => a.id !== escolhidaId)
  // Sem alternativa abandonada não há o que sacrificar: o custo é zero.
  return abandonadas.length === 0 ? 0 : Math.max(...abandonadas.map(a => a.valor))
}

export function avaliar(alternativas, escolhidaId) {
  const escolhida = alternativas.find(a => a.id === escolhidaId)
  if (!escolhida) return null

  const custo = custoOportunidade(alternativas, escolhidaId)
  const melhorValor = Math.max(...alternativas.map(a => a.valor))

  return {
    escolhida,
    custo,
    // Positivo: a escolha supera o que foi sacrificado. Zero: apenas empata.
    // Negativo: havia opção melhor, e escolher esta custou a diferença.
    ganhoLiquido: escolhida.valor - custo,
    ehMelhor: escolhida.valor === melhorValor,
  }
}

// --- Gerador do desafio -------------------------------------------------
// Sem banco de perguntas: cada rodada sorteia usos e valores novos.
//
// Todos os usos de um caso disputam o MESMO recurso. Misturar recursos
// (poupança × aluguel do terreno × trabalho no sábado) quebraria o conceito:
// aplicar dinheiro não impede alugar o terreno, então essas opções não seriam
// alternativas uma da outra, e o gabarito contradiria o raciocínio correto.

export const RECURSOS = [
  {
    id: 'terreno',
    descricao: 'um terreno livre — cada uso rende por mês',
    usos: [
      'alugar o terreno para um vizinho',
      'arrendar a área para plantio',
      'abrir uma barraca no terreno',
      'usar o terreno como estacionamento pago',
    ],
  },
  {
    id: 'sabado',
    descricao: 'um sábado livre — cada uso rende no dia',
    usos: [
      'trabalhar como freelancer',
      'dar aulas particulares',
      'revender mercadoria na feira',
      'fazer um bico como garçom',
    ],
  },
  {
    id: 'dinheiro',
    descricao: 'uma reserva de dinheiro — cada uso rende por mês',
    usos: [
      'aplicar na poupança',
      'comprar um título público',
      'comprar estoque para revender',
      'emprestar a juros para um parente',
    ],
  },
]

const VALORES = [80, 120, 150, 200, 240, 300, 360, 420, 500]

const sortear = (lista, rng) => lista[Math.floor(rng() * lista.length)]

// Sorteia `quantos` itens distintos de uma lista.
function sortearDistintos(lista, quantos, rng) {
  const restantes = [...lista]
  return Array.from({ length: quantos }, () => {
    const i = Math.floor(rng() * restantes.length)
    return restantes.splice(i, 1)[0]
  })
}

export function gerarCaso(rng = Math.random, recurso = sortear(RECURSOS, rng)) {
  const quantas = 3 + Math.floor(rng() * 2) // 3 ou 4 alternativas
  const usos = sortearDistintos(recurso.usos, quantas, rng)
  // Valores distintos: com empate no topo, "a melhor abandonada" teria duas
  // respostas igualmente defensáveis e o exercício ficaria ambíguo.
  const valores = sortearDistintos(VALORES, quantas, rng)

  const alternativas = usos.map((uso, i) => ({ id: `alt-${i}`, uso, valor: valores[i] }))
  const escolhida = sortear(alternativas, rng)

  return { id: `${recurso.id}-${valores.join('-')}-${escolhida.id}`, recurso, alternativas, escolhidaId: escolhida.id }
}

// Uma rodada passa por recursos diferentes (terreno, sábado, dinheiro), para o
// aluno ver o mesmo raciocínio valer em contextos distintos.
export function gerarRodada(rng = Math.random, quantos = 3) {
  const recursos = sortearDistintos(RECURSOS, Math.min(quantos, RECURSOS.length), rng)
  return Array.from({ length: quantos }, (_, i) => gerarCaso(rng, recursos[i % recursos.length]))
}

// Lê a resposta do aluno para um caso e diz qual raciocínio ela revela. Cada
// erro comum tem nome, para o feedback corrigir o raciocínio, não só o número.
export function diagnosticar(caso, valorDado) {
  const certo = custoOportunidade(caso.alternativas, caso.escolhidaId)
  if (valorDado === certo) return 'certo'
  const escolhida = caso.alternativas.find(a => a.id === caso.escolhidaId)
  const abandonadas = caso.alternativas.filter(a => a.id !== caso.escolhidaId)
  if (valorDado === abandonadas.reduce((s, a) => s + a.valor, 0)) return 'somou'
  if (valorDado === escolhida.valor) return 'escolhida'
  if (valorDado === escolhida.valor - certo) return 'ganho'
  if (abandonadas.some(a => a.valor === valorDado)) return 'nao-melhor'
  return 'outro'
}
