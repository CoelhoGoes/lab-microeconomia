import React, { useEffect, useState } from 'react'
import { usePersistido } from './persistencia.js'
import SecoesDoModulo from './SecoesDoModulo.jsx'
import Previsao, { Reflexao } from './Previsao.jsx'
import { respostaNumerica } from '../labs/firma.js'

export const criarSecoes = numero => [
  { id: 'previsao', numero: `${numero}.1`, titulo: 'Prever' },
  { id: 'laboratorio', numero: `${numero}.2`, titulo: 'Experimentar' },
  { id: 'conceito', numero: `${numero}.3`, titulo: 'Entender' },
  { id: 'desafio', numero: `${numero}.4`, titulo: 'Aplicar' },
]

export function PassoEntender({ onClick }) {
  return <div className="passo-entender"><p>O que mudou no seu cenário? Compare o resultado com sua previsão.</p>
    <button className="button primary" onClick={onClick}>Entender o resultado →</button></div>
}

export default function Jornada({ tema, numero, titulo, experimento, explicacao, questoes, fonte, abrirDesafio = 0 }) {
  const [secao, setSecao] = useState('previsao')
  const [previsao, setPrevisao] = usePersistido(`microlab:${tema}:previsao`, null)
  const [interagiu, setInteragiu] = usePersistido(`microlab:${tema}:experimento-v2`, false)
  const [entendeu, setEntendeu] = usePersistido(`microlab:${tema}:conceito`, false)
  const [aplicou, setAplicou] = usePersistido(`microlab:${tema}:aplicou`, false)
  useEffect(() => { if (abrirDesafio > 0) setSecao('desafio') }, [abrirDesafio])
  return <>
    <SecoesDoModulo rotulo={`MÓDULO ${numero} · ${titulo.toUpperCase()}`} secoes={criarSecoes(numero)} ativa={secao}
      concluidas={{ previsao: previsao !== null, laboratorio: interagiu, conceito: entendeu, desafio: aplicou }} onIr={setSecao} />
    {secao === 'previsao' && <Previsao tema={tema} resposta={previsao} onResponder={setPrevisao} onContinuar={() => setSecao('laboratorio')} />}
    <div className={secao === 'laboratorio' ? 'secao' : 'secao oculto'}>
      {experimento(() => setInteragiu(true))}
      <PassoEntender onClick={() => setSecao('conceito')} />
    </div>
    {secao === 'conceito' && <section className="conceito"><Reflexao tema={tema} resposta={previsao} />{explicacao}
      <button className="button primary" onClick={() => { setEntendeu(true); setSecao('desafio') }}>Entendi, aplicar em outro caso →</button></section>}
    {secao === 'desafio' && <Atividade id={tema} questoes={questoes} onCompleta={() => setAplicou(true)} />}
    <p className="fonte-aula">{fonte}</p>
  </>
}

export function Atividade({ id, questoes, onCompleta }) {
  const [respostas, setRespostas] = useState({})
  const [tentou, setTentou] = useState(false)
  const certas = questoes.map((q, i) => q.opcoes ? respostas[i] === q.resposta : respostaNumerica(respostas[i], q.resposta, q.tolerancia))
  const completas = certas.every(Boolean)
  function conferir(e) {
    e.preventDefault()
    setTentou(true)
    if (completas) onCompleta()
  }
  return <form className="atividade" onSubmit={conferir}>
    <p className="eyebrow">04 · APLICAR EM UM NOVO CASO</p><h3>Agora a decisão é sua.</h3>
    <p>Resolva os casos e confira seu raciocínio. Nos números, use vírgula ou ponto para os decimais, sem separador de milhar.</p>
    {questoes.map((q, i) => <div className="atividade-questao" key={q.pergunta}>
      <label htmlFor={`${id}-q-${i}`}><b>{i + 1}.</b> {q.pergunta}</label>
      {q.opcoes ? <select id={`${id}-q-${i}`} value={respostas[i] ?? ''} onChange={e => { setRespostas(r => ({ ...r, [i]: e.target.value })); setTentou(false) }}>
        <option value="">Escolha uma resposta</option>{q.opcoes.map(o => <option key={o}>{o}</option>)}
      </select> : <div className="resposta-numero"><input id={`${id}-q-${i}`} inputMode="decimal" value={respostas[i] ?? ''} onChange={e => { setRespostas(r => ({ ...r, [i]: e.target.value })); setTentou(false) }} /><span>{q.unidade}</span></div>}
      {tentou && <p className={certas[i] ? 'feedback certo' : 'feedback rever'}>{certas[i] ? '✓ Correto. ' : '↻ Reveja. '}{q.explicacao}</p>}
    </div>)}
    <button className="button primary" type="submit">Conferir respostas →</button>
    <p role="status" className="atividade-status">{tentou ? `${certas.filter(Boolean).length} de ${questoes.length} respostas corretas.${completas ? ' Aplicação concluída!' : ' Ajuste as respostas e tente novamente.'}` : 'Seu progresso é salvo ao resolver todos os casos.'}</p>
  </form>
}

export function Metricas({ itens }) {
  return <dl className="novas-metricas">{itens.map(([rotulo, valor]) => <div key={rotulo}><dt>{rotulo}</dt><dd>{valor}</dd></div>)}</dl>
}

export function GraficoLinhas({ series, maxX, maxY, eixoX, eixoY, marcador }) {
  const x = v => 54 + v / maxX * 500
  const y = v => 230 - v / maxY * 200
  return <figure className="grafico-novo"><svg viewBox="0 0 600 290" role="img" aria-label={`${eixoY} em função de ${eixoX}. ${series.map(s => s.nome).join(', ')}`}>
    {[0, 1, 2, 3, 4].map(i => <g key={i}><line x1="54" y1={y(maxY * i / 4)} x2="554" y2={y(maxY * i / 4)} className="gridline" /><text x="45" y={y(maxY * i / 4) + 4} textAnchor="end" className="tick-text">{Math.round(maxY * i / 4).toLocaleString('pt-BR')}</text><text x={x(maxX * i / 4)} y="250" textAnchor="middle" className="tick-text">{Math.round(maxX * i / 4).toLocaleString('pt-BR')}</text></g>)}
    <path d="M54 30 V230 H554" className="axis" />
    {series.map((s, i) => <polyline key={s.nome} points={s.pontos.map(([a, b]) => `${x(a)},${y(b)}`).join(' ')} fill="none" stroke={['var(--teal)', 'var(--coral)', 'var(--blue)'][i]} strokeWidth="3" />)}
    {marcador && <circle cx={x(marcador[0])} cy={y(marcador[1])} r="6" fill="var(--ink)" />}
    <text x="54" y="17" className="tick-text">{eixoY}</text><text x="554" y="276" textAnchor="end" className="tick-text">{eixoX}</text>
  </svg><figcaption>{series.map((s, i) => <span key={s.nome}><i style={{ background: ['var(--teal)', 'var(--coral)', 'var(--blue)'][i] }} />{s.nome}</span>)}</figcaption></figure>
}
