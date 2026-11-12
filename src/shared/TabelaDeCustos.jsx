import React, { useState } from 'react'
import { tabelaCustos, respostaNumerica } from '../labs/firma.js'
import { num } from './formato.js'

// O exercício da planilha complementa a aula de custos. O aluno calcula antes
// de revelar o gabarito; resultados sempre vêm da base do exercício.
export default function TabelaDeCustos({ onInteragir }) {
  const [respostas, setRespostas] = useState({})
  const [conferiu, setConferiu] = useState(false)
  const [gabarito, setGabarito] = useState(false)
  const linhas = tabelaCustos()
  const campos = [['total', 'CT'], ['medio', 'CT médio'], ['variavelMedio', 'CV médio'], ['fixoMedio', 'CF médio'], ['marginal', 'Marginal']]
  const total = linhas.length * campos.length - 1
  const acertos = linhas.reduce((n, l) => n + campos.filter(([campo]) => l[campo] !== null && respostaNumerica(respostas[`${l.q}:${campo}`], l[campo])).length, 0)
  return <details className="complemento" open><summary>Complemento da aula: custos totais, médios e marginais</summary>
    <p>Preencha as células do exercício. Use até duas casas decimais. CT = CF + CV; custo médio = custo ÷ Q; marginal = ΔCT ÷ ΔQ. A primeira linha não informa o intervalo anterior.</p>
    <div className="tabela-scroll"><table className="dados-tabela tabela-preencher"><caption>Custos do exercício · valores em R$</caption><thead><tr><th>Q</th><th>CF</th><th>CV</th>{campos.map(([c, nome]) => <th key={c}>{nome}</th>)}</tr></thead><tbody>{linhas.map(l => <tr key={l.q}><th scope="row">{l.q}</th><td>{l.fixo}</td><td>{l.variavel}</td>{campos.map(([c, nome]) => {
      const chave = `${l.q}:${c}`
      return <td key={c}>{l[c] === null ? '—' : gabarito ? num(l[c], 2) : <input aria-label={`${nome} para Q igual a ${l.q}`} aria-invalid={conferiu && !respostaNumerica(respostas[chave], l[c])} inputMode="decimal" value={respostas[chave] ?? ''} onChange={e => { setRespostas(r => ({ ...r, [chave]: e.target.value })); setConferiu(false); onInteragir() }} />}</td>
    })}</tr>)}</tbody></table></div>
    <div className="jornada-acoes"><button className="button primary" disabled={gabarito} onClick={() => { setConferiu(true); onInteragir() }}>Conferir tabela</button><button className="text-button" onClick={() => setGabarito(v => !v)}>{gabarito ? 'Voltar às minhas respostas' : 'Consultar gabarito'}</button></div>
    {conferiu && !gabarito && <p role="status">{acertos} de {total} células corretas. {acertos === total ? 'Tabela resolvida!' : 'As células a rever estão destacadas. Confira a fórmula e o intervalo entre as quantidades.'}</p>}
  </details>
}
