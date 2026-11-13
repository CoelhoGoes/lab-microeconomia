import { test } from 'node:test'
import assert from 'node:assert/strict'
import { custoOportunidade, avaliar, gerarCaso, gerarRodada, diagnosticar, RECURSOS, missoesCumpridas, PRODUTORES, custoCafeEmCacau } from './oportunidade.js'

function rngSemente(semente) {
  let estado = semente
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296
    return estado / 4294967296
  }
}

const OPCOES = [
  { id: 'a', uso: 'freelance', valor: 200 },
  { id: 'b', uso: 'curso', valor: 120 },
  { id: 'c', uso: 'feira', valor: 300 },
]

test('o custo é a melhor abandonada, não a soma das abandonadas', () => {
  assert.equal(custoOportunidade(OPCOES, 'a'), 300)  // sobra b=120 e c=300
  assert.equal(custoOportunidade(OPCOES, 'c'), 200)  // sobra a=200 e b=120
})

test('escolher a melhor dá ganho líquido positivo; escolher outra, negativo', () => {
  const melhor = avaliar(OPCOES, 'c')
  assert.ok(melhor.ehMelhor)
  assert.equal(melhor.ganhoLiquido, 100)   // 300 - 200

  const pior = avaliar(OPCOES, 'b')
  assert.ok(!pior.ehMelhor)
  assert.equal(pior.ganhoLiquido, -180)    // 120 - 300: escolher custou a diferença
})

test('empate com a melhor abandonada zera o ganho líquido', () => {
  const empate = [{ id: 'a', uso: 'loja', valor: 500 }, { id: 'b', uso: 'aluguel', valor: 500 }]
  assert.equal(avaliar(empate, 'a').ganhoLiquido, 0)
})

test('sem alternativa abandonada o custo é zero', () => {
  const unica = [{ id: 'a', uso: 'única opção', valor: 90 }]
  assert.equal(custoOportunidade(unica, 'a'), 0)
  assert.equal(avaliar(unica, 'a').ganhoLiquido, 90)
})

test('escolha inexistente não quebra', () => {
  assert.equal(avaliar(OPCOES, 'nao-existe'), null)
})

// O gerador substitui a revisão humana de cada enunciado.
test('todo caso gerado é resolvível e sem ambiguidade', () => {
  for (let i = 0; i < 600; i++) {
    const caso = gerarCaso(rngSemente(i + 1))
    const valores = caso.alternativas.map(a => a.valor)
    const usos = caso.alternativas.map(a => a.uso)

    assert.ok(caso.alternativas.length >= 3, 'com menos de 3 não há "melhor abandonada" interessante')
    assert.equal(new Set(valores).size, valores.length, `valores repetidos tornam a resposta ambígua: ${valores}`)
    assert.equal(new Set(usos).size, usos.length, `usos repetidos: ${usos}`)
    assert.ok(caso.alternativas.some(a => a.id === caso.escolhidaId), 'a escolhida precisa estar na lista')

    const r = avaliar(caso.alternativas, caso.escolhidaId)
    assert.ok(r.custo > 0 && Number.isInteger(r.custo), `custo inválido: ${r.custo}`)
    assert.notEqual(r.ganhoLiquido, undefined)
  }
})

test('uma rodada traz três casos', () => {
  assert.equal(gerarRodada().length, 3)
  const recursos = gerarRodada(rngSemente(7)).map(c => c.recurso.id)
  assert.equal(new Set(recursos).size, 3, 'a rodada deve variar o recurso')
})

test('todos os usos de um caso disputam o mesmo recurso', () => {
  for (let i = 0; i < 600; i++) {
    const caso = gerarCaso(rngSemente(i + 1))
    const recurso = RECURSOS.find(r => r.id === caso.recurso.id)
    for (const a of caso.alternativas) assert.ok(recurso.usos.includes(a.uso), `${a.uso} não é uso de ${recurso.id}`)
  }
})

test('o diagnóstico nomeia cada erro comum', () => {
  const caso = { alternativas: OPCOES, escolhidaId: 'a' }  // a=200; sobram b=120 e c=300
  assert.equal(diagnosticar(caso, 300), 'certo')
  assert.equal(diagnosticar(caso, 420), 'somou')
  assert.equal(diagnosticar(caso, 200), 'escolhida')
  assert.equal(diagnosticar(caso, -100), 'ganho')
  assert.equal(diagnosticar(caso, 120), 'nao-melhor')
  assert.equal(diagnosticar(caso, 7), 'outro')
})

test('missões: cada uma reconhece só o estado que pede', () => {
  const base = [
    { id: 'loja', uso: 'loja', valor: 420 },
    { id: 'aluguel', uso: 'aluguel', valor: 380 },
    { id: 'horta', uso: 'horta', valor: 240 },
  ]
  assert.deepEqual(missoesCumpridas({ alternativas: base, escolhidaId: null }), [])
  assert.deepEqual(missoesCumpridas({ alternativas: base, escolhidaId: 'aluguel' }), [])
  assert.deepEqual(missoesCumpridas({ alternativas: base, escolhidaId: 'loja' }), ['escolher'])
  assert.deepEqual(missoesCumpridas({ alternativas: base, escolhidaId: null, sacrificio: 'horta' }), [])
  assert.deepEqual(missoesCumpridas({ alternativas: base, escolhidaId: null, sacrificio: 'aluguel' }), ['sacrificio'])

  const empate = base.map(a => (a.id === 'aluguel' ? { ...a, valor: 420 } : a))
  assert.ok(missoesCumpridas({ alternativas: empate, escolhidaId: null }).includes('empate'))

  assert.deepEqual(missoesCumpridas({ alternativas: base, escolhidaId: null, custosFpp: { Ana: 2, Bruno: 1 } }), ['fronteira'])
  assert.deepEqual(missoesCumpridas({ alternativas: base, escolhidaId: null, custosFpp: { Ana: 0.5, Bruno: 1 } }), [])
})

test('custo do café em cacau: 2 para Ana, 1 para Bruno', () => {
  assert.deepEqual(PRODUTORES.map(custoCafeEmCacau), [2, 1])
})
