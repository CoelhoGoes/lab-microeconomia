// Predicados das missões guiadas dos temas 2 a 10.
//
// Cada função recebe o estado que o aluno produziu no laboratório e devolve os
// ids das missões cumpridas AGORA. Ficam fora dos componentes, como as metas do
// tema 4, para serem verificáveis sem montar React. O texto de cada missão mora
// no componente do tema; aqui só o critério. (O tema 1 tem os seus em
// oportunidade.js, junto do modelo.)

import { equilibrioConsumidor, respeitaDecrescente } from './utilidade.js'
import { arrecadacao, bemColetivo, projetoArriscado } from './firma.js'

const quando = pares => pares.filter(([, ok]) => ok).map(([id]) => id)

// Tema 2. respostaExcedente: valor escolhido na pergunta da missão (R$).
export const EXCEDENTE_PERGUNTA = { reserva: 18, preco: 9 }
export function missoesConsumidor({ utilidades, preco, respostaExcedente }) {
  const q = equilibrioConsumidor(utilidades, preco).quantidade
  return quando([
    ['barato', q >= 5],
    ['caro', q === 1],
    ['excedente', respostaExcedente === EXCEDENTE_PERGUNTA.reserva - EXCEDENTE_PERGUNTA.preco],
    ['decrescente', !respeitaDecrescente(utilidades)],
  ])
}

// Tema 3. precoInicial: o preço do cenário padrão, para "mudou só o preço".
export function missoesDemandaOferta({ preco, precoInicial, renda, substituto, complementar, producao, tipoBem }) {
  const semDeslocamento = renda === 0 && substituto === 0 && complementar === 0 && producao === 0
  return quando([
    ['movimento', preco !== precoInicial && semDeslocamento],
    ['substituto', substituto > 0],
    ['complementar', complementar > 0],
    ['inferior', tipoBem === 'inferior' && renda > 0],
    ['oferta', producao > 0],
  ])
}

// Tema 4. tipo: situação do mercado; ajusteConcluido: o ajuste automático
// terminou no equilíbrio partindo de escassez; cenarioId: caso da aula aplicado.
export function missoesEquilibrio({ tipo, ajusteConcluido, cenarioId }) {
  return quando([
    ['escassez', tipo === 'escassez'],
    ['ajuste', ajusteConcluido],
    ['excesso', tipo === 'excesso'],
    ['cenario', cenarioId !== null],
  ])
}

// Tema 5. tipo/tipoRenda: classificações já calculadas pelo modelo.
export function missoesElasticidades({ medida, tipo, precoDe, precoPara, variacaoReceita, tipoRenda }) {
  const demanda = medida === 'preco'
  return quando([
    ['elastica', demanda && tipo === 'elastica'],
    ['inelastica', demanda && tipo === 'inelastica'],
    ['receita', demanda && precoPara > precoDe && variacaoReceita < 0],
    ['inferior', medida === 'renda' && tipoRenda === 'inferior'],
  ])
}

// Tema 6. estrutura: id devolvido por classificar().
export function missoesEstruturas({ estrutura }) {
  return quando([
    ['monopolio', estrutura === 'monopolio'],
    ['oligopolio', estrutura === 'oligopolio'],
    ['monopsonio', estrutura === 'monopsonio'],
    ['diferenciado', estrutura === 'concorrencia-monopolista'],
  ])
}

// Tema 7.
export function missoesPublicos({ rival, exclusivo, sua, outros, chance, subsidio }) {
  const carona = bemColetivo(sua, outros)
  const contribuinte = bemColetivo(outros, outros)
  return quando([
    ['classificar', rival && exclusivo],
    // Carona: não contribui, os outros sim, e termina com saldo maior que o deles.
    ['carona', sua === 0 && outros > 0 && carona.saldo > contribuinte.saldo],
    ['todos', sua === 20 && outros === 20],
    ['subsidio', chance === 30 && projetoArriscado({ custo: 100, chance, receita: 200, subsidio }).privado >= 0],
  ])
}

// Tema 8. Laffer: passou do topo quando subir 1 ponto de alíquota reduz a arrecadação.
export function missoesTributacao({ sistema, aliquota, taxaA, taxaB, t, sens }) {
  return quando([
    ['proporcional', sistema === 'proporcional'],
    ['progressivo', sistema === 'progressivo' && aliquota > 0],
    ['relativos', taxaA !== taxaB],
    ['laffer', t > 0 && arrecadacao(t, sens) < arrecadacao(t - 1, sens)],
  ])
}

// Tema 9. n: trabalhadores; marginal: produtividade marginal do último.
export function missoesProducao({ base, n, marginal }) {
  return quando([
    ['pico', base === 'aula' && n === 4],
    ['zero', marginal === 0],
    ['negativa', marginal !== null && marginal < 0],
  ])
}

// Tema 10.
export function missoesCustos({ lucro, preco, variavelUnitario, investimento, investimentoInicial }) {
  return quando([
    ['lucro', lucro >= 0],
    ['margem', variavelUnitario >= preco],
    ['investimento', investimento !== investimentoInicial],
  ])
}
