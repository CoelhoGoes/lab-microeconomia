import React, { useEffect, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import SecoesDoModulo from '../shared/SecoesDoModulo.jsx'
import Previsao, { Reflexao, Aposta } from '../shared/Previsao.jsx'
import Missoes, { useMissoes } from '../shared/Missoes.jsx'
import { criarSecoes, PassoEntender, Fechamento } from '../shared/Jornada.jsx'
import { missoesConsumidor } from './missoes.js'
import {
  equilibrioConsumidor, respeitaDecrescente, gerarRodada,
} from './utilidade.js'
import { lerNumero, respostaNumerica } from './firma.js'

const UTILIDADES_PADRAO = [18, 15, 12, 9, 6, 3]
const PRECO_INICIAL = 9
const PRECO_MAX = 24

const SECOES = criarSecoes(2)

// Altura máxima de um degrau, em pixels. Escala fixa pelo mesmo motivo dos
// outros temas: com escala automática, tabelas diferentes desenhariam o mesmo.
const ALTURA_DEGRAU = 150
const UTILIDADE_MAX = 24

export default function LabConsumidor({ abrirDesafio = 0 }) {
  const [utilidades, setUtilidades] = useState(UTILIDADES_PADRAO)
  const [precoMercado, setPrecoMercado] = useState(PRECO_INICIAL)
  const [secao, setSecao] = useState('previsao')
  const [previsao, setPrevisao] = usePersistido('microlab:consumidor:previsao', null)
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:consumidor:conceito', false)
  // As missões só contam depois que o aluno mexe: o cenário inicial não cumpre nada sozinho.
  const [mexeu, setMexeu] = useState(false)
  const [respostaExcedente, setRespostaExcedente] = useState(null)
  const [rodadas, setRodadas] = usePersistido('microlab:consumidor:rodadas', 0)
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})
  const [conferidas, setConferidas] = useState({})

  const e = equilibrioConsumidor(utilidades, precoMercado)
  const decrescente = respeitaDecrescente(utilidades)

  const acertos = rodada.filter(caso =>
    respostaNumerica(conferidas[caso.id], equilibrioConsumidor(caso.utilidades, caso.precoMercado).excedente, 0)).length
  const rodadaCompleta = acertos === rodada.length

  useEffect(() => {
    if (rodadaCompleta) setRodadas(n => n + 1)
  }, [rodadaCompleta, setRodadas])

  const novaRodada = () => {
    setRodada(gerarRodada())
    setRespostas({})
    setConferidas({})
  }

  const editar = (i, valor) => {
    const limpo = Math.max(0, Math.min(UTILIDADE_MAX, Math.round(Number(valor) || 0)))
    setUtilidades(atuais => atuais.map((u, j) => (j === i ? limpo : u)))
  }

  const missoes = [
    {
      id: 'barato',
      texto: 'Baixe o preço de mercado até Marina comprar 5 unidades ou mais.',
      dica: 'Use o controle "Preço de mercado" no fim do painel da tabela.',
      sintese: 'Com o preço menor, mais unidades passam a valer a compra: ela compra enquanto a reserva de cada unidade cobre o preço. É daqui que vem a curva de demanda, que desce.',
    },
    {
      id: 'caro',
      texto: 'Agora suba o preço até ela comprar só 1 unidade.',
      dica: 'Leve o preço para perto da reserva da primeira unidade, R$ 18.',
      sintese: 'Com preço alto, só a primeira unidade, a de maior satisfação, ainda compensa. Mudar o preço do próprio bem move a decisão ao longo da demanda.',
    },
    {
      id: 'excedente',
      texto: 'Com preço de R$ 9, a 1ª unidade vale R$ 18 para Marina. Quanto ela ganha nessa unidade?',
      dica: 'Compare o que ela aceitaria pagar com o que de fato paga.',
      sintese: 'Esse ganho, reserva menos preço, é o excedente do consumidor. Somado nas unidades compradas, é a métrica destacada no painel.',
      conteudo: <>
        <div className="caso-opcoes">
          {[9, 18, 27].map(v => (
            <button key={v} className={`caso-op ${respostaExcedente === v ? 'escolhida' : ''}`}
                    onClick={() => { setMexeu(true); setRespostaExcedente(v) }}>R$ {v}</button>
          ))}
        </div>
        {respostaExcedente !== null && respostaExcedente !== 9 && (
          <p className="caso-feedback">
            ✗ {respostaExcedente === 18 ? 'R$ 18 é o quanto ela aceitaria pagar, não o que ganha.' : 'Ela não soma reserva e preço: paga R$ 9 por algo que vale R$ 18 para ela.'} O ganho é a diferença: 18 − 9.
          </p>
        )}
      </>,
    },
    {
      id: 'decrescente',
      texto: 'Edite a tabela para a 2ª unidade valer mais que a 1ª.',
      dica: 'Digite na coluna "U. marginal" da unidade 2 um valor acima do da unidade 1.',
      sintese: 'O laboratório avisa que isso contraria a lei da utilidade marginal decrescente. Na prática, cada unidade a mais satisfaz menos, e é por isso que a demanda desce.',
    },
  ]
  const missoesFeitas = useMissoes('consumidor', mexeu ? missoesConsumidor({ utilidades, preco: precoMercado, respostaExcedente }) : [])

  const secaoOk = { previsao: previsao !== null, conceito: conceitoLido, laboratorio: missoesFeitas.length === missoes.length, desafio: rodadas > 0 }

  const irPara = id => {
    setSecao(id)
  }

  // A faixa "Desafio rápido" da página pede a abertura desta seção. Vem como
  // número que só cresce, em vez de booleano, para um segundo clique também
  // valer — e zero significa "nenhum pedido", o que evita marcar como visitado
  // um módulo que o aluno nunca abriu.
  useEffect(() => {
    if (abrirDesafio > 0) irPara('desafio')
  }, [abrirDesafio])

  return (
    <>
    <SecoesDoModulo
      rotulo="MÓDULO 02 · TEORIA DO CONSUMIDOR"
      secoes={SECOES}
      ativa={secao}
      concluidas={secaoOk}
      contador={`${acertos}/${rodada.length}`}
      onIr={irPara}
    />

    {secao === 'previsao' && <Previsao tema="consumidor" anotar resposta={previsao} onResponder={setPrevisao} onContinuar={() => irPara('laboratorio')} />}
    {secao === 'conceito' && <Reflexao tema="consumidor" resposta={previsao} />}

    {secao === 'conceito' && (
      <div className="conceito">
        <p className="eyebrow">2.3 · ENTENDER</p>
        <h3>De onde vem a curva de demanda</h3>
        <p className="ponte-missoes">Nas missões, você baixou e subiu o preço e viu Marina comprar mais ou menos unidades, calculou o ganho em uma unidade e montou uma tabela que contraria a teoria. É isso que os conceitos abaixo explicam.</p>
        <p>
          A <b>utilidade marginal</b> é a satisfação que cada unidade adicional acrescenta. Ela
          <b> decresce</b>: o primeiro copo d'água de quem está com sede vale muito; o quinto,
          pouco. É a lei da utilidade marginal decrescente.
        </p>
        <p>
          O <b>preço marginal de reserva</b> é o máximo que o consumidor aceitaria pagar por cada
          unidade. Como acompanha a utilidade marginal, também cai — e é exatamente por isso que
          a curva de demanda desce.
        </p>
        <p>
          Ele compra até a unidade em que a reserva iguala o <b>preço de mercado</b>. A diferença
          entre o que aceitaria pagar e o que de fato paga é o <b>excedente do consumidor</b>: o
          ganho dele na troca.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('desafio') }}>
          {conceitoLido ? 'Ir para a aplicação' : 'Entendi, aplicar em outro caso'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'laboratorio' ? 'secao' : secao === 'desafio' ? 'secao modo-aplicar' : 'secao oculto'}>
      {secao === 'laboratorio' && <>
        <Aposta tema="consumidor" resposta={previsao} />
        <Missoes missoes={missoes} feitas={missoesFeitas} aoConcluirTodas={<p className="metas-fim">✦ Missões cumpridas. Explore os controles à vontade ou siga para entender o resultado.</p>} />
      </>}
      <div className="lab-shell" onChange={() => setMexeu(true)} onClick={e => { if (e.target.closest('button')) setMexeu(true) }}>
        <aside className="controls-panel">
          <div className="panel-title"><span className="pulse"></span> TABELA DE UTILIDADE</div>
          <p className="tabela-ajuda">
            Edite a satisfação que cada unidade acrescenta, em reais. O preço de reserva de cada
            unidade é esse mesmo valor.
          </p>
          <table className="tabela-utilidade">
            <thead>
              <tr><th>Un.</th><th>U. marginal</th><th>U. total</th></tr>
            </thead>
            <tbody>
              {e.linhas.map((linha, i) => (
                <tr key={linha.unidade} className={linha.precoReserva >= precoMercado ? 'compra' : ''}>
                  <td>{linha.unidade}</td>
                  <td>
                    <input
                      type="number" min="0" max={UTILIDADE_MAX} value={linha.uMarginal}
                      onChange={ev => editar(i, ev.target.value)}
                      aria-label={`Utilidade marginal da unidade ${linha.unidade}`}
                    />
                  </td>
                  <td>{linha.uTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!decrescente && (
            <p className="aviso">
              ⚠ Esta tabela não decresce. É possível montá-la assim, mas contraria a lei da
              utilidade marginal decrescente — e é por isso que a demanda deixa de fazer sentido.
            </p>
          )}
          <div className="divider"><span>MERCADO</span></div>
          <Slider
            label="Preço de mercado" value={precoMercado} min={1} max={PRECO_MAX}
            suffix=" R$" onChange={setPrecoMercado} hint="Onde a reserva encontra o preço"
          />
          <button className="reset" onClick={() => { setUtilidades(UTILIDADES_PADRAO); setPrecoMercado(PRECO_INICIAL) }}>
            ↺ Restaurar cenário
          </button>
        </aside>

        <div className="market-panel">
          <div className="market-header">
            <div>
              <span className="market-label">DECISÃO DO CONSUMIDOR</span>
              <h3>Até onde vale a pena comprar</h3>
            </div>
            <div className="market-status mint">
              <b>Compra {e.quantidade} un.</b>
              <span>Para de comprar quando a reserva fica abaixo do preço.</span>
            </div>
          </div>

          <div className="degraus" style={{ height: ALTURA_DEGRAU + 34 }}>
            {e.linhas.map(linha => {
              const altura = Math.min(linha.precoReserva, UTILIDADE_MAX) / UTILIDADE_MAX * ALTURA_DEGRAU
              const paga = Math.min(precoMercado, linha.precoReserva) / UTILIDADE_MAX * ALTURA_DEGRAU
              const comprada = linha.precoReserva >= precoMercado
              return (
                <div key={linha.unidade} className="degrau">
                  <div className={comprada ? 'degrau-barra comprada' : 'degrau-barra'} style={{ height: altura }}>
                    {comprada && <i className="degrau-pago" style={{ height: paga }} />}
                  </div>
                  <span>{linha.unidade}</span>
                </div>
              )
            })}
            <div className="linha-preco" style={{ bottom: 34 + precoMercado / UTILIDADE_MAX * ALTURA_DEGRAU }}>
              <span>preço R$ {precoMercado}</span>
            </div>
          </div>
          <p className="degraus-legenda">
            A parte clara de cada degrau é o que o consumidor paga; a escura acima dela é o que
            ele ganha de graça — o excedente.
          </p>

          <div className="metric-row">
            <div>
              <span>QUANTIDADE COMPRADA</span>
              <strong>{e.quantidade}<small> un.</small></strong>
            </div>
            <div>
              <span>GASTO TOTAL</span>
              <strong>R$ {num(e.gasto)}</strong>
            </div>
            <div className="highlight">
              <span>EXCEDENTE DO CONSUMIDOR</span>
              <strong>R$ {num(e.excedente)}</strong>
            </div>
          </div>
        </div>
      </div>

      {secao === 'laboratorio' && <PassoEntender onClick={() => irPara('conceito')} />}
      {secao === 'desafio' && (
        <Desafio rodada={rodada} respostas={respostas} setRespostas={setRespostas}
                 conferidas={conferidas} setConferidas={setConferidas}
                 acertos={acertos} rodadas={rodadas} completa={rodadaCompleta} onNovaRodada={novaRodada} />
      )}

      <div className="insight">
        <span className="spark">✦</span>
        <p>
          <b>Leitura do cenário:</b> A R$ {precoMercado}, o consumidor compra {e.quantidade} de{' '}
          {utilidades.length} unidades e gasta R$ {num(e.gasto)}. Estaria disposto a pagar R${' '}
          {num(e.utilidadeTotal)} por elas, então leva R$ {num(e.excedente)} de vantagem na troca.
          {' '}A próxima unidade vale menos para ele do que custa — por isso ele para.
        </p>
      </div>
    </div>
    </>
  )
}

// O cálculo completo de um caso, mostrado no erro e reforçado no acerto.
function raciocinio(caso, certo) {
  const p = caso.precoMercado
  const compradas = certo.linhas.filter(l => l.precoReserva >= p)
  const fora = certo.linhas.filter(l => l.precoReserva < p)
  if (compradas.length === 0) {
    return `Nenhuma reserva cobre o preço de R$ ${p}: ele não compra nada e o excedente é R$ 0.`
  }
  return `Ele compra enquanto a reserva cobre o preço de R$ ${p}: ${compradas.length} un. ` +
    `(reservas de R$ ${compradas.map(l => l.precoReserva).join(', ')})` +
    `${fora.length ? `; as de R$ ${fora.map(l => l.precoReserva).join(', ')} ficam de fora` : ''}. ` +
    `Em cada unidade comprada, o excedente é a reserva menos o preço: ` +
    `${compradas.map(l => `(${l.precoReserva} − ${p})`).join(' + ')} = R$ ${certo.excedente}.`
}

function Desafio({ rodada, respostas, setRespostas, conferidas, setConferidas, acertos, rodadas, completa, onNovaRodada }) {
  return (
    <div className="metas">
      <div className="metas-topo">
        <span className="market-label">2.4 · APLICAR</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        As tabelas são sorteadas a cada rodada. Descubra quantas unidades o consumidor compra e
        calcule o excedente — a soma, nas unidades compradas, do que ele deixou de pagar.
        Escreva os valores e clique em <b>Conferir</b>.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const certo = equilibrioConsumidor(caso.utilidades, caso.precoMercado)
          const resposta = respostas[caso.id]
          const conferida = conferidas[caso.id] !== undefined
          const numero = lerNumero(conferidas[caso.id])
          const acertou = numero === certo.excedente
          return (
            <li key={caso.id} className={conferida ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>
                Reservas de R$ {caso.utilidades.join(', ')} por unidade. Preço de mercado:
                {' '}R$ {caso.precoMercado}.
              </p>
              <div className="caso-opcoes">
                <label className="caso-numero">
                  Excedente R$
                  <input
                    inputMode="decimal" value={resposta ?? ''} disabled={acertou}
                    onChange={ev => {
                      setRespostas(r => ({ ...r, [caso.id]: ev.target.value }))
                      setConferidas(({ [caso.id]: _, ...resto }) => resto)
                    }}
                  />
                </label>
              </div>
              {conferida && (
                <p className="caso-feedback">
                  {acertou ? '✓ Isso. ' : '✗ Ainda não. '}
                  {numero === null && 'Escreva só o valor em reais, por exemplo 18. '}
                  {numero !== null && !acertou && numero === certo.gasto && 'Esse é o gasto com as unidades, não o que ele deixou de pagar. '}
                  {raciocinio(caso, certo)}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com tabelas novas.</p>
      )}
      <div className="jornada-acoes">
        <button className="button primary" onClick={() => setConferidas({ ...respostas })}>Conferir respostas →</button>
        <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
      </div>
    </div>
  )
}
