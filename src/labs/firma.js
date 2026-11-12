// Dados discretos da aula 11: espaço fixo de 100 m², mão de obra de 1 a 9.
export const PRODUCAO_AULA = [0, 6, 14, 24, 32, 38, 42, 44, 44, 42]
export const PRODUCAO_EXERCICIO = [0, 8, 16, 26, 34, 40, 44, 46, 46, 44]
export function produtividade(tabela, trabalhadores) {
  const total = tabela[trabalhadores]
  return { total, media: trabalhadores === 0 ? null : total / trabalhadores,
    marginal: trabalhadores === 0 ? null : total - tabela[trabalhadores - 1] }
}

// Linhas da aba Custos - Exercício. O gabarito usa outra base, portanto os
// resultados são recalculados a partir destes dados, sem copiar as respostas.
export const CUSTOS_AULA = [10, 14, 21, 27, 29, 30].map((q, i) => ({
  q, fixo: 10, variavel: [20, 24, 30, 39, 50, 57][i],
}))
export function tabelaCustos(linhas = CUSTOS_AULA) {
  return linhas.map((r, i) => {
    const anterior = linhas[i - 1]
    return { ...r, total: r.fixo + r.variavel, medio: (r.fixo + r.variavel) / r.q,
      variavelMedio: r.variavel / r.q, fixoMedio: r.fixo / r.q,
      // A primeira linha não informa a produção anterior; não inventar Q=0.
      marginal: anterior ? (r.fixo + r.variavel - anterior.fixo - anterior.variavel) / (r.q - anterior.q) : null }
  })
}

export function resultadoFirma({ preco, quantidade, fixo, variavelUnitario, investimento }) {
  const receita = preco * quantidade
  const variavel = variavelUnitario * quantidade
  const custo = fixo + variavel
  const lucro = receita - custo
  const margem = preco - variavelUnitario
  const equilibrioTipo = margem > 0 ? 'unico' : fixo === 0 ? (margem === 0 ? 'todos' : 'origem') : 'nenhum'
  return { receita, variavel, custo, lucro, margem, equilibrioTipo,
    media: quantidade > 0 ? receita / quantidade : null,
    equilibrioQ: margem > 0 ? fixo / margem : equilibrioTipo === 'origem' ? 0 : null,
    equilibrioReceita: margem > 0 && preco > 0 ? fixo / (margem / preco) : equilibrioTipo === 'origem' ? 0 : null,
    lucratividade: receita > 0 ? lucro / receita * 100 : null,
    rentabilidade: investimento > 0 ? lucro / investimento * 100 : null,
    // Prazo simples da aula: lucro constante por período, sem desconto.
    retorno: investimento > 0 && lucro > 0 ? investimento / lucro : null }
}

// Contribuição coletiva: cinco pessoas, dotação de R$ 20 e multiplicador
// social de 1,6. Cada R$ 1 retorna R$ 0,32 ao indivíduo e R$ 1,60 ao grupo.
export function bemColetivo(contribuicao, outros) {
  const fundo = contribuicao + 4 * outros
  const beneficio = fundo * 1.6 / 5
  return { fundo, beneficio, saldo: 20 - contribuicao + beneficio, totalGrupo: 100 - fundo + fundo * 1.6 }
}

export function tributo(renda, sistema, aliquota) {
  if (sistema === 'fixo') return 200 // Mesmo valor absoluto para comparar peso relativo.
  if (sistema === 'proporcional') return renda * aliquota / 100
  // Faixas hipotéticas: primeira parcela até R$ 3.000 com metade da alíquota;
  // apenas o excedente recebe a alíquota cheia. Não é a tabela legal de IR.
  return Math.min(renda, 3000) * aliquota / 200 + Math.max(0, renda - 3000) * aliquota / 100
}

export function precoTributado(preco, aliquota) { return preco * (1 + aliquota / 100) }

// Ilustração de Laffer, sem estimativa empírica de uma alíquota ideal:
// base(t) = base inicial × (1-t)^sensibilidade; a sensibilidade é uma hipótese.
export function arrecadacao(aliquota, sensibilidade) {
  const t = aliquota / 100
  return 100000 * t * (1 - t) ** sensibilidade
}

export function projetoArriscado({ custo, chance, receita, subsidio }) {
  const esperado = chance / 100 * receita
  return { esperado, privado: esperado - custo + subsidio, publico: subsidio }
}

export function respostaNumerica(valor, esperado, tolerancia = 0.02) {
  if (valor === undefined || valor === null || String(valor).trim() === '') return false
  const numero = Number(String(valor).trim().replace(',', '.'))
  return Number.isFinite(numero) && Math.abs(numero - esperado) <= tolerancia
}
