import test from 'node:test'
import assert from 'node:assert/strict'
import { PRODUCAO_AULA, PRODUCAO_EXERCICIO, produtividade, tabelaCustos, resultadoFirma, bemColetivo, tributo, arrecadacao, projetoArriscado, respostaNumerica } from './firma.js'

test('rendimentos decrescentes não significam queda imediata no total', () => {
  assert.deepEqual(produtividade(PRODUCAO_AULA, 3), { total: 24, media: 8, marginal: 10 })
  assert.equal(produtividade(PRODUCAO_AULA, 4).marginal, 8)
  assert.equal(produtividade(PRODUCAO_AULA, 8).marginal, 0)
  assert.equal(produtividade(PRODUCAO_AULA, 9).marginal, -2)
  assert.equal(produtividade(PRODUCAO_AULA, 0).media, null)
  assert.equal(produtividade(PRODUCAO_EXERCICIO, 5).marginal, 6)
})
test('custo marginal usa ΔQ real e não presume uma linha anterior ausente', () => {
  const t = tabelaCustos()
  assert.equal(t[0].marginal, null)
  assert.equal(t[1].marginal, 1)
  assert.equal(t[2].marginal, 6 / 7)
  assert.equal(t[5].marginal, 7)
  for (const r of t) assert.ok(Math.abs(r.medio - r.variavelMedio - r.fixoMedio) < 1e-10)
})
test('break-even cobre o custo e os indicadores usam bases e períodos distintos', () => {
  const r = resultadoFirma({ preco: 10, quantidade: 2500, fixo: 15000, variavelUnitario: 4, investimento: 60000 })
  assert.equal(r.equilibrioQ, 2500)
  assert.equal(r.equilibrioReceita, 25000)
  assert.equal(r.lucro, 0)
  assert.equal(r.retorno, null)
  const lucro = resultadoFirma({ preco: 48, quantidade: 1000, fixo: 8000, variavelUnitario: 22, investimento: 60000 })
  assert.equal(lucro.lucro, 18000)
  assert.equal(lucro.rentabilidade, 30)
  assert.equal(lucro.lucratividade, 37.5)
  assert.equal(lucro.retorno, 60000 / 18000)
})
test('zero vendas e margem não positiva não geram divisão por zero ou equilíbrio falso', () => {
  for (const preco of [0, 4]) {
    const r = resultadoFirma({ preco, quantidade: 0, fixo: 15000, variavelUnitario: 4, investimento: 60000 })
    assert.equal(r.media, null)
    assert.equal(r.lucratividade, null)
    assert.equal(r.equilibrioQ, null)
    assert.equal(r.equilibrioReceita, null)
    assert.equal(r.retorno, null)
  }
})
test('contribuição beneficia o grupo apesar do incentivo privado ao carona', () => {
  const zero = bemColetivo(0, 8), um = bemColetivo(1, 8)
  assert.ok(um.totalGrupo > zero.totalGrupo)
  assert.ok(um.saldo < zero.saldo)
  assert.equal(bemColetivo(20, 20).totalGrupo, 160)
})
test('sem custo fixo, margem nula equilibra todos os volumes e margem negativa só a origem', () => {
  const base = { preco: 4, quantidade: 100, fixo: 0, variavelUnitario: 4, investimento: 60000 }
  assert.equal(resultadoFirma(base).equilibrioTipo, 'todos')
  assert.equal(resultadoFirma(base).lucro, 0)
  const perda = resultadoFirma({ ...base, preco: 3 })
  assert.equal(perda.equilibrioTipo, 'origem')
  assert.equal(perda.equilibrioQ, 0)
  assert.equal(perda.equilibrioReceita, 0)
})
test('faixas marginais são contínuas e o mesmo valor tem peso regressivo', () => {
  assert.equal(tributo(2000, 'fixo', 20) / 2000, 0.1)
  assert.equal(tributo(10000, 'fixo', 20) / 10000, 0.02)
  assert.equal(tributo(5000, 'proporcional', 20), 1000)
  assert.equal(tributo(3000, 'progressivo', 20), 300)
  assert.ok(Math.abs(tributo(3001, 'progressivo', 20) - 300.2) < 1e-9)
  assert.equal(tributo(10000, 'progressivo', 20), 1700)
})
test('Laffer depende da hipótese de resposta e subsídio não altera chance de sucesso', () => {
  assert.equal(arrecadacao(0, 1), 0)
  assert.equal(arrecadacao(100, 1), 0)
  assert.ok(arrecadacao(50, 1) > arrecadacao(50, 2))
  const p = { custo: 100, chance: 30, receita: 200, subsidio: 0 }
  assert.equal(projetoArriscado(p).privado, -40)
  assert.equal(projetoArriscado({ ...p, subsidio: 40 }).privado, 0)
  assert.equal(projetoArriscado({ ...p, subsidio: 40 }).esperado, 60)
})
test('avaliação aceita decimal brasileiro e não confunde vazio com zero', () => {
  assert.equal(respostaNumerica('', 0), false)
  assert.equal(respostaNumerica('   ', 0), false)
  assert.equal(respostaNumerica('8,67', 26 / 3), true)
  assert.equal(respostaNumerica('-2', -2), true)
  assert.equal(respostaNumerica('abc', 0), false)
  assert.equal(respostaNumerica('R$ 380', 380, 0), true)
  assert.equal(respostaNumerica('380,00', 380, 0), true)
})
