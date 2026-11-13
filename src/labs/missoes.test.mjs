import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  missoesConsumidor, missoesDemandaOferta, missoesEquilibrio, missoesElasticidades,
  missoesEstruturas, missoesPublicos, missoesTributacao, missoesProducao, missoesCustos,
} from './missoes.js'
import { PRODUCAO_AULA, produtividade, resultadoFirma } from './firma.js'
import { elasticidadePreco, classificarElasticidade } from '../shared/modelo.js'

// O cenário padrão de cada laboratório não pode cumprir missão nenhuma sozinho:
// a missão existe para o aluno fazer algo.
test('cenários iniciais não cumprem missões', () => {
  const u = [18, 15, 12, 9, 6, 3]
  assert.deepEqual(missoesConsumidor({ utilidades: u, preco: 9, respostaExcedente: null }), [])
  assert.deepEqual(missoesDemandaOferta({ preco: 28, precoInicial: 28, renda: 0, substituto: 0, complementar: 0, producao: 0, tipoBem: 'normal' }), [])
  assert.deepEqual(missoesEquilibrio({ tipo: 'excesso', ajusteConcluido: false, cenarioId: null }), ['excesso']) // por isso o tema 4 só avalia após interação
  assert.deepEqual(missoesEstruturas({ estrutura: 'concorrencia-perfeita' }), [])
  assert.deepEqual(missoesPublicos({ rival: false, exclusivo: false, sua: 8, outros: 8, chance: 30, subsidio: 0 }), [])
  assert.deepEqual(missoesTributacao({ sistema: 'fixo', aliquota: 20, taxaA: 20, taxaB: 20, t: 30, sens: 1 }), [])
  const p = produtividade(PRODUCAO_AULA, 3)
  assert.deepEqual(missoesProducao({ base: 'aula', n: 3, marginal: p.marginal }), [])
  const r = resultadoFirma({ preco: 10, quantidade: 2000, fixo: 15000, variavelUnitario: 4, investimento: 60000 })
  assert.deepEqual(missoesCustos({ lucro: r.lucro, preco: 10, variavelUnitario: 4, investimento: 60000, investimentoInicial: 60000 }), [])
})

test('tema 2: preço baixo, alto, excedente e tabela crescente', () => {
  const u = [18, 15, 12, 9, 6, 3]
  assert.deepEqual(missoesConsumidor({ utilidades: u, preco: 6, respostaExcedente: null }), ['barato'])
  assert.deepEqual(missoesConsumidor({ utilidades: u, preco: 17, respostaExcedente: 9 }), ['caro', 'excedente'])
  assert.deepEqual(missoesConsumidor({ utilidades: [18, 20, 12, 9, 6, 3], preco: 9, respostaExcedente: 18 }), ['decrescente'])
})

test('tema 3: mexer em outro controle impede a missão de movimento', () => {
  const base = { preco: 28, precoInicial: 28, renda: 0, substituto: 0, complementar: 0, producao: 0, tipoBem: 'normal' }
  assert.deepEqual(missoesDemandaOferta({ ...base, preco: 20 }), ['movimento'])
  assert.deepEqual(missoesDemandaOferta({ ...base, preco: 20, substituto: 10 }), ['substituto'])
  assert.deepEqual(missoesDemandaOferta({ ...base, tipoBem: 'inferior', renda: 10, producao: 5 }), ['inferior', 'oferta'])
  assert.deepEqual(missoesDemandaOferta({ ...base, tipoBem: 'normal', renda: 10, complementar: 5 }), ['complementar'])
})

test('tema 5: aumento de preço com demanda elástica derruba a receita', () => {
  const e = elasticidadePreco(40, 45)
  const tipo = classificarElasticidade(e.valor)
  assert.equal(tipo, 'elastica')
  const feitas = missoesElasticidades({ medida: 'preco', tipo, precoDe: 40, precoPara: 45, variacaoReceita: e.receitaPara - e.receitaDe, tipoRenda: 'normal' })
  assert.deepEqual(feitas, ['elastica', 'receita'])
  assert.deepEqual(missoesElasticidades({ medida: 'renda', tipo, precoDe: 40, precoPara: 45, variacaoReceita: -1, tipoRenda: 'inferior' }), ['inferior'])
})

test('tema 7: carona, todos contribuindo e subsídio mínimo de R$ 40 mi', () => {
  const base = { rival: false, exclusivo: false, sua: 8, outros: 8, chance: 30, subsidio: 0 }
  assert.deepEqual(missoesPublicos({ ...base, sua: 0 }), ['carona'])
  assert.deepEqual(missoesPublicos({ ...base, sua: 20, outros: 20 }), ['todos'])
  assert.deepEqual(missoesPublicos({ ...base, subsidio: 39 }), [])
  assert.deepEqual(missoesPublicos({ ...base, subsidio: 40 }), ['subsidio'])
})

test('tema 8: Laffer só depois do topo (50% com sensibilidade 1)', () => {
  const base = { sistema: 'fixo', aliquota: 20, taxaA: 20, taxaB: 20, sens: 1 }
  assert.deepEqual(missoesTributacao({ ...base, t: 50 }), [])
  assert.deepEqual(missoesTributacao({ ...base, t: 52 }), ['laffer'])
  assert.deepEqual(missoesTributacao({ ...base, sistema: 'progressivo', aliquota: 0, t: 30 }), [])
})

test('tema 9: marginal cai no 4º, zera no 8º e fica negativa no 9º', () => {
  const m = n => produtividade(PRODUCAO_AULA, n).marginal
  assert.deepEqual(missoesProducao({ base: 'aula', n: 4, marginal: m(4) }), ['pico'])
  assert.deepEqual(missoesProducao({ base: 'aula', n: 8, marginal: m(8) }), ['zero'])
  assert.deepEqual(missoesProducao({ base: 'aula', n: 9, marginal: m(9) }), ['negativa'])
})

test('tema 10: sai do prejuízo a partir de 2.500 unidades', () => {
  const lucro = q => resultadoFirma({ preco: 10, quantidade: q, fixo: 15000, variavelUnitario: 4, investimento: 60000 }).lucro
  const caso = q => missoesCustos({ lucro: lucro(q), preco: 10, variavelUnitario: 4, investimento: 60000, investimentoInicial: 60000 })
  assert.deepEqual(caso(2400), [])
  assert.deepEqual(caso(2500), ['lucro'])
})
