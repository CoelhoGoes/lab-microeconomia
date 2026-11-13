import React, { useEffect, useState } from 'react'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import SecoesDoModulo from '../shared/SecoesDoModulo.jsx'
import Previsao, { Reflexao, Aposta } from '../shared/Previsao.jsx'
import Missoes, { useMissoes } from '../shared/Missoes.jsx'
import { criarSecoes, PassoEntender, Fechamento } from '../shared/Jornada.jsx'
import {
  avaliar, custoOportunidade, diagnosticar, gerarRodada,
  missoesCumpridas, melhorAbandonadaDaLoja, PRODUTORES, custoCafeEmCacau,
} from './oportunidade.js'
import { lerNumero, respostaNumerica } from './firma.js'

const VALOR_MAX = 600

// Lucro mensal de cada uso, já descontados os custos — o mesmo cenário da previsão.
const ALTERNATIVAS_PADRAO = [
  { id: 'loja', uso: 'Abrir uma loja no terreno', valor: 420 },
  { id: 'aluguel', uso: 'Alugar para um vizinho', valor: 380 },
  { id: 'horta', uso: 'Ceder a uma horta comunitária', valor: 240 },
]

// Escala fixa da figura: café na horizontal até 70 sacas, cacau na vertical até 140.
const FPP = { largura: 320, altura: 220, esq: 40, dir: 16, topo: 14, base: 30, cafe: 70, cacau: 140 }
const xCafe = c => FPP.esq + c / FPP.cafe * (FPP.largura - FPP.esq - FPP.dir)
const yCacau = c => FPP.altura - FPP.base - c / FPP.cacau * (FPP.altura - FPP.topo - FPP.base)

function FronteiraDeProducao() {
  return (
    <figure className="fpp">
      <svg viewBox={`0 0 ${FPP.largura} ${FPP.altura}`} role="img"
           aria-label="Fronteiras de possibilidades de produção de Ana e Bruno">
        {[40, 80, 120].map(c => (
          <text key={c} x={FPP.esq - 7} y={yCacau(c) + 3} className="tick-text" textAnchor="end">{c}</text>
        ))}
        {[20, 40, 60].map(c => (
          <text key={c} x={xCafe(c)} y={FPP.altura - FPP.base + 14} className="tick-text" textAnchor="middle">{c}</text>
        ))}
        <path d={`M ${FPP.esq} ${FPP.topo} V ${FPP.altura - FPP.base} H ${FPP.largura - FPP.dir}`} className="axis" />
        <text x={FPP.esq + 8} y={FPP.topo + 6} className="tick-text">CACAU</text>
        <text x={FPP.largura - FPP.dir} y={FPP.altura - FPP.base - 8} className="tick-text" textAnchor="end">CAFÉ</text>
        {PRODUTORES.map(p => (
          <g key={p.nome}>
            <line x1={xCafe(0)} y1={yCacau(p.cacauMax)} x2={xCafe(p.cafeMax)} y2={yCacau(0)} className={`fpp-linha ${p.cor}`} />
            <text x={xCafe(p.cafeMax / 2) + 6} y={yCacau(p.cacauMax / 2) - 6} className={`fpp-nome ${p.cor}`}>
              {p.nome.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>Sacas que cada um consegue produzir com os próprios recursos.</figcaption>
    </figure>
  )
}

// Missão 2: o aluno aponta do que Ana abre mão ao ficar com a loja.
function PerguntaSacrificio({ alternativas, resposta, onResponder }) {
  const abandonadas = alternativas.filter(a => a.id !== 'loja')
  const melhor = melhorAbandonadaDaLoja(alternativas)
  const soma = abandonadas.reduce((s, a) => s + a.valor, 0)
  return (
    <>
      <div className="caso-opcoes">
        {abandonadas.map(a => (
          <button key={a.id} className={`caso-op ${resposta === a.id ? 'escolhida' : ''}`} onClick={() => onResponder(a.id)}>
            {a.uso} (R$ {a.valor})
          </button>
        ))}
        <button className={`caso-op ${resposta === 'soma' ? 'escolhida' : ''}`} onClick={() => onResponder('soma')}>
          Os dois juntos (R$ {soma})
        </button>
      </div>
      {resposta && resposta !== melhor.id && (
        <p className="caso-feedback">
          ✗ {resposta === 'soma'
            ? 'Os dois não aconteceriam juntos: o terreno só comporta um uso. No lugar da loja, Ana faria apenas uma das outras coisas.'
            : 'Essa opção também fica de fora, mas rende menos. No lugar da loja, Ana escolheria a melhor das que sobraram.'}
        </p>
      )}
    </>
  )
}

// Missão 4: o custo de 1 saca de café em sacas de cacau, para cada produtor.
const OPCOES_CUSTO_FPP = [0.5, 1, 2]

function PerguntaFronteira({ custos, onResponder }) {
  return (
    <div className="missao-fpp">
      <FronteiraDeProducao />
      <div>
        {PRODUTORES.map(p => {
          const certo = custoCafeEmCacau(p)
          const dado = custos[p.nome]
          return (
            <div key={p.nome}>
              <p>Para <b>{p.nome}</b>, 1 saca de café custa quantas sacas de cacau?</p>
              <div className="caso-opcoes">
                {OPCOES_CUSTO_FPP.map(v => (
                  <button key={v} className={`caso-op ${dado === v ? 'escolhida' : ''}`} onClick={() => onResponder(p.nome, v)}>
                    {num(v, v % 1 ? 1 : 0)}
                  </button>
                ))}
              </div>
              {dado !== undefined && (
                <p className="caso-feedback">
                  {dado === certo ? '✓ ' : '✗ '}
                  {p.nome} produz {p.cafeMax} sacas de café ou {p.cacauMax} de cacau: cada saca de café
                  custa {p.cacauMax} ÷ {p.cafeMax} = {num(certo, 0)} {certo === 1 ? 'saca' : 'sacas'} de cacau.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SECOES = criarSecoes(1)

export default function LabOportunidade({ abrirDesafio = 0 }) {
  const [alternativas, setAlternativas] = useState(ALTERNATIVAS_PADRAO)
  // Começa sem escolha: a primeira missão é justamente escolher.
  const [escolhidaId, setEscolhidaId] = useState(null)
  const [sacrificio, setSacrificio] = useState(null)
  const [custosFpp, setCustosFpp] = useState({})
  const [secao, setSecao] = useState('previsao')
  const [previsao, setPrevisao] = usePersistido('microlab:oportunidade:previsao', null)
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:oportunidade:conceito', false)
  const [rodadas, setRodadas] = usePersistido('microlab:oportunidade:rodadas', 0)
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})
  const [conferidas, setConferidas] = useState({})

  const r = avaliar(alternativas, escolhidaId)
  const missoesFeitas = useMissoes('oportunidade', missoesCumpridas({ alternativas, escolhidaId, sacrificio, custosFpp }))

  // Métricas aparecem só depois da missão que apresenta o conceito.
  const verCusto = missoesFeitas.includes('sacrificio')
  const verGanho = missoesFeitas.includes('empate')

  const acertos = rodada.filter(caso =>
    respostaNumerica(conferidas[caso.id], custoOportunidade(caso.alternativas, caso.escolhidaId), 0)).length
  const rodadaCompleta = acertos === rodada.length

  useEffect(() => {
    if (rodadaCompleta) setRodadas(n => n + 1)
  }, [rodadaCompleta, setRodadas])

  const novaRodada = () => {
    setRodada(gerarRodada())
    setRespostas({})
    setConferidas({})
  }

  const ajustar = (id, valor) => {
    const limpo = Math.max(0, Math.min(VALOR_MAX, Math.round(Number(valor) || 0)))
    setAlternativas(atuais => atuais.map(a => (a.id === id ? { ...a, valor: limpo } : a)))
  }

  const missoes = [
    {
      id: 'escolher',
      texto: 'No painel da decisão, escolha o uso que dá mais lucro para Ana.',
      dica: 'Compare as barras e clique na alternativa de maior valor.',
      sintese: 'Escolher é abrir mão: o terreno só comporta um uso, então ficar com a loja significa deixar o aluguel e a horta de lado.',
    },
    {
      id: 'sacrificio',
      texto: 'Ana ficou com a loja. Do que ela está abrindo mão de verdade?',
      dica: 'No lugar da loja, Ana poderia ter feito UMA das outras coisas. Qual ela escolheria?',
      sintese: `Esse é o custo de oportunidade: o valor da melhor alternativa abandonada (R$ ${melhorAbandonadaDaLoja(alternativas).valor}), não a soma delas. A métrica agora aparece no painel.`,
      conteudo: <PerguntaSacrificio alternativas={alternativas} resposta={sacrificio} onResponder={setSacrificio} />,
    },
    {
      id: 'empate',
      texto: 'Aumente o lucro do aluguel até a loja deixar de valer a pena.',
      dica: 'Arraste o controle "Alugar para um vizinho" até ele chegar ao lucro da loja.',
      sintese: 'A loja ainda dá lucro no caixa, mas já não supera o aluguel. O ganho econômico (lucro da escolha menos o custo de oportunidade) chegou a zero ou ficou negativo. Ele agora aparece no painel.',
    },
    {
      id: 'fronteira',
      texto: 'O mesmo raciocínio vale na produção. Ana e Bruno dividem seus recursos entre café e cacau: quanto cacau cada um deixa de produzir para fazer 1 saca de café?',
      dica: 'Divida o máximo de cacau pelo máximo de café: Ana faz 60 sacas de café ou 120 de cacau.',
      sintese: 'Ana abre mão de 2 sacas de cacau por saca de café; Bruno, de só 1. Com custos diferentes, a troca compensa: se Bruno vende café a Ana por 1,5 saca de cacau, ele recebe mais do que o café lhe custa e ela paga menos do que custaria produzir.',
      conteudo: <PerguntaFronteira custos={custosFpp} onResponder={(nome, v) => setCustosFpp(c => ({ ...c, [nome]: v }))} />,
    },
  ]
  const labConcluido = missoesFeitas.length === missoes.length

  const secaoOk = { previsao: previsao !== null, conceito: conceitoLido, laboratorio: labConcluido, desafio: rodadas > 0 }

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
      rotulo="MÓDULO 01 · CUSTO DE OPORTUNIDADE"
      secoes={SECOES}
      ativa={secao}
      concluidas={secaoOk}
      contador={`${acertos}/${rodada.length}`}
      onIr={irPara}
    />

    {secao === 'previsao' && <Previsao tema="oportunidade" anotar resposta={previsao} onResponder={setPrevisao} onContinuar={() => irPara('laboratorio')} />}
    {secao === 'conceito' && <Reflexao tema="oportunidade" resposta={previsao} />}

    {secao === 'conceito' && (
      <div className="conceito">
        <p className="eyebrow">1.3 · ENTENDER</p>
        <h3>O que a escolha custou não está na nota fiscal</h3>
        <p>
          Nas missões 1 e 2, o terreno só podia ir para um uso: ficar com a loja é abrir mão do
          aluguel e da horta. O <b>custo de oportunidade</b> é o valor da <b>melhor alternativa
          abandonada</b> — os R$ 380 do aluguel. Não é a soma das abandonadas, porque elas não
          aconteceriam juntas. E não é zero só porque o terreno é de Ana: deixar de receber o
          aluguel também custa.
        </p>
        <p>
          Na missão 3, a loja continuava dando lucro no caixa, mas deixou de valer a pena quando o
          aluguel a alcançou. O que decide é o <b>ganho econômico</b>: o lucro da escolha menos o
          custo de oportunidade. Se ele for negativo, a decisão custou a diferença, mesmo com
          dinheiro entrando.
        </p>
        <p>
          Na missão 4, o mesmo raciocínio apareceu na produção, como um <b>trade-off</b>: para Ana,
          cada saca de café custa 2 de cacau; para Bruno, só 1. Ligando as combinações possíveis de
          cada um, obtém-se a <b>fronteira de possibilidades de produção</b>. Como os custos
          diferem, a <b>troca</b> compensa para os dois sempre que o preço combinado fica entre
          esses custos.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('desafio') }}>
          {conceitoLido ? 'Ir para a aplicação' : 'Entendi, aplicar em outro caso'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'laboratorio' ? 'secao' : 'secao oculto'}>
      <Aposta tema="oportunidade" resposta={previsao} />

      <Missoes
        missoes={missoes}
        feitas={missoesFeitas}
        aoConcluirTodas={<p className="metas-fim">✦ Missões cumpridas. Explore os controles à vontade ou siga para entender o resultado.</p>}
      />

      <div className="lab-shell">
        <aside className="controls-panel">
          <div className="panel-title"><span className="pulse"></span> LUCRO MENSAL DE CADA USO</div>
          <p className="tabela-ajuda">
            Um terreno, um uso só. Os valores são o lucro por mês, já descontados os custos. Use
            estes controles quando uma missão pedir.
          </p>
          {alternativas.map(alt => (
            <div className="control" key={alt.id}>
              <div className="control-top">
                <label htmlFor={`v-${alt.id}`}>{alt.uso}</label>
                <output>R$ {alt.valor}</output>
              </div>
              <input
                id={`v-${alt.id}`} type="range" min="0" max={VALOR_MAX} step="10"
                value={alt.valor} onChange={ev => ajustar(alt.id, ev.target.value)}
              />
            </div>
          ))}
          <button className="reset" onClick={() => { setAlternativas(ALTERNATIVAS_PADRAO); setEscolhidaId(null) }}>
            ↺ Restaurar cenário
          </button>
        </aside>

        <div className="market-panel">
          <div className="market-header">
            <div>
              <span className="market-label">DECISÃO</span>
              <h3>Escolha um uso para o terreno</h3>
            </div>
            {r && verGanho && (
              <div className={`market-status ${r.ganhoLiquido > 0 ? 'mint' : r.ganhoLiquido < 0 ? 'coral' : 'blue'}`}>
                <b>
                  {r.ganhoLiquido > 0 ? 'Vale a pena' : r.ganhoLiquido < 0 ? 'Havia opção melhor' : 'Apenas empata'}
                </b>
                <span>
                  {r.ganhoLiquido > 0
                    ? 'A escolha supera o que foi sacrificado.'
                    : r.ganhoLiquido < 0
                      ? 'A melhor abandonada rendia mais que esta.'
                      : 'O lucro é igual ao da melhor abandonada.'}
                </span>
              </div>
            )}
          </div>

          <ul className="alternativas">
            {alternativas.map(alt => {
              const escolhida = alt.id === escolhidaId
              const sacrificada = verCusto && r && !escolhida && alt.valor === r.custo
              return (
                <li key={alt.id} className={escolhida ? 'alternativa escolhida' : sacrificada ? 'alternativa sacrificada' : 'alternativa'}>
                  <button onClick={() => setEscolhidaId(alt.id)} aria-pressed={escolhida}>
                    <span className="alt-marca" aria-hidden="true">{escolhida ? '●' : '○'}</span>
                    <span className="alt-uso">{alt.uso}</span>
                    <span className="alt-valor">R$ {alt.valor}</span>
                  </button>
                  <div className="alt-barra"><i style={{ width: `${(alt.valor / VALOR_MAX) * 100}%` }} /></div>
                  {escolhida && <span className="alt-tag">escolhida</span>}
                  {sacrificada && <span className="alt-tag sacrificio">melhor abandonada</span>}
                </li>
              )
            })}
          </ul>

          <div className="metric-row">
            <div>
              <span>LUCRO DA ESCOLHA</span>
              <strong>{r ? `R$ ${num(r.escolhida.valor)}` : '—'}</strong>
            </div>
            <div>
              <span>CUSTO DE OPORTUNIDADE</span>
              <strong>{verCusto ? (r ? `R$ ${num(r.custo)}` : '—') : <small>aparece na missão 2</small>}</strong>
            </div>
            <div className="highlight">
              <span>GANHO ECONÔMICO</span>
              <strong>{verGanho ? (r ? `R$ ${num(r.ganhoLiquido)}` : '—') : <small>aparece na missão 3</small>}</strong>
            </div>
          </div>
        </div>
      </div>

      <PassoEntender onClick={() => irPara('conceito')} />

      {r && verGanho && (
        <div className="insight">
          <span className="spark">✦</span>
          <p>
            <b>Leitura do cenário:</b> Escolhendo {r.escolhida.uso.toLowerCase()}, entram R${' '}
            {num(r.escolhida.valor)} por mês. Mas abre-se mão de R$ {num(r.custo)} da melhor
            alternativa, então o ganho econômico é R$ {num(r.ganhoLiquido)}.
            {r.ganhoLiquido < 0 && ' O caixa fica positivo, mas a decisão custou essa diferença.'}
            {r.ganhoLiquido === 0 && ' Contabilmente entra dinheiro, mas economicamente é indiferente.'}
          </p>
        </div>
      )}
    </div>

    {secao === 'desafio' && (
      <Desafio rodada={rodada} respostas={respostas} setRespostas={setRespostas}
               conferidas={conferidas} setConferidas={setConferidas}
               acertos={acertos} rodadas={rodadas} completa={rodadaCompleta} onNovaRodada={novaRodada} />
    )}
    </>
  )
}

// O raciocínio completo de um caso. Aparece no erro, para corrigir o caminho, e
// no acerto, para o aluno confirmar que acertou pelo motivo certo.
function raciocinio(caso) {
  const escolhida = caso.alternativas.find(a => a.id === caso.escolhidaId)
  const abandonadas = caso.alternativas.filter(a => a.id !== caso.escolhidaId)
  const melhor = abandonadas.reduce((m, a) => (a.valor > m.valor ? a : m))
  return `O recurso só pode ir para um uso. Escolhendo ${escolhida.uso}, ficam de fora: ` +
    `${abandonadas.map(a => `${a.uso} (R$ ${a.valor})`).join(', ')}. ` +
    `Como só uma delas poderia acontecer no lugar da escolhida, o que se perde é a melhor: ` +
    `${melhor.uso}, R$ ${melhor.valor}.`
}

const ERROS = {
  somou: 'Você somou as alternativas abandonadas, mas elas não aconteceriam juntas.',
  escolhida: 'Esse é o retorno da opção escolhida: o que se ganha, não o que se perde.',
  ganho: 'Esse é o ganho líquido (escolhida menos a melhor abandonada), não o custo.',
  'nao-melhor': 'Essa alternativa ficou de fora, mas não é a melhor delas.',
  outro: 'Esse valor não corresponde a nenhuma das alternativas.',
}

function Desafio({ rodada, respostas, setRespostas, conferidas, setConferidas, acertos, rodadas, completa, onNovaRodada }) {
  return (
    <div className="metas">
      <div className="metas-topo">
        <span className="market-label">1.4 · APLICAR</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        Os cenários são sorteados a cada rodada. Dada a alternativa escolhida, diga qual foi o
        custo de oportunidade — lembrando que ele é o valor da melhor abandonada, não a soma
        delas. Escreva os valores e clique em <b>Conferir</b>.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const escolhida = caso.alternativas.find(a => a.id === caso.escolhidaId)
          const resposta = respostas[caso.id]
          const conferida = conferidas[caso.id] !== undefined
          const numero = lerNumero(conferidas[caso.id])
          const diagnostico = numero === null ? null : diagnosticar(caso, numero)
          const acertou = diagnostico === 'certo'
          return (
            <li key={caso.id} className={conferida ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>
                Recurso: {caso.recurso.descricao}. Opções:{' '}
                {caso.alternativas.map(a => `${a.uso} (R$ ${a.valor})`).join('; ')}.
                {' '}Escolheu <b>{escolhida.uso}</b>.
              </p>
              <div className="caso-opcoes">
                <label className="caso-numero">
                  Custo de oportunidade R$
                  <input
                    inputMode="decimal" value={resposta ?? ''} disabled={acertou}
                    onChange={ev => {
                      setRespostas(x => ({ ...x, [caso.id]: ev.target.value }))
                      // Mudou a resposta: o retorno anterior não vale mais para ela.
                      setConferidas(({ [caso.id]: _, ...resto }) => resto)
                    }}
                  />
                </label>
              </div>
              {conferida && (
                <p className="caso-feedback">
                  {acertou ? '✓ Isso. ' : '✗ Ainda não. '}
                  {diagnostico === null ? 'Escreva só o valor em reais, por exemplo 380. ' : !acertou && `${ERROS[diagnostico]} `}
                  {raciocinio(caso)}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com cenários novos.</p>
      )}
      {(completa || rodadas > 0) && (
        <Fechamento
          texto="Toda escolha tem um custo: o valor da melhor alternativa deixada de lado, mesmo quando nenhum dinheiro sai do bolso. Uma escolha só vale a pena se render mais que esse custo. No tema 2 o raciocínio volta: cada real gasto com café é um real a menos para outra coisa."
          proximo={{ id: 'consumidor', titulo: 'Teoria do consumidor' }}
        />
      )}
      <div className="jornada-acoes">
        <button className="button primary" onClick={() => setConferidas({ ...respostas })}>Conferir respostas →</button>
        <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
      </div>
    </div>
  )
}
