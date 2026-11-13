import React, { useEffect, useMemo, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import Chart from '../shared/Chart.jsx'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import SecoesDoModulo from '../shared/SecoesDoModulo.jsx'
import Previsao, { Reflexao, Aposta } from '../shared/Previsao.jsx'
import Missoes, { useMissoes } from '../shared/Missoes.jsx'
import { criarSecoes, PassoEntender, Fechamento } from '../shared/Jornada.jsx'
import { missoesDemandaOferta } from './missoes.js'
import { gerarRodada, resolver, enunciado, RELACOES } from './pares-demanda.js'
import {
  situacao,
  EFEITO_SUBSTITUTO,
  EFEITO_COMPLEMENTAR,
  EFEITO_PRODUCAO,
  PRECO_MIN,
  PRECO_MAX,
  TIPOS_DE_BEM,
  TIPOS_DE_BEM_IDS,
  efeitoDaRenda,
} from '../shared/modelo.js'

const SECOES = criarSecoes(3)

const ROTULO_RELACAO = { substituto: 'Substitutos', complementar: 'Complementares' }

const CENARIO_PADRAO = { preco: 28, renda: 0, substituto: 0, complementar: 0, producao: 0, tipoBem: 'normal' }

const LEITURA = {
  escassez: { rotulo: 'Escassez', texto: 'Consumidores querem mais do que empresas oferecem.', cor: 'coral' },
  excesso: { rotulo: 'Excesso de oferta', texto: 'Empresas oferecem mais do que consumidores desejam.', cor: 'blue' },
  equilibrio: { rotulo: 'Equilíbrio', texto: 'Oferta e demanda estão praticamente alinhadas.', cor: 'mint' },
}

export default function LabSubstitutos({ abrirDesafio = 0 }) {
  const [preco, setPreco] = useState(CENARIO_PADRAO.preco)
  const [renda, setRenda] = useState(CENARIO_PADRAO.renda)
  const [substituto, setSubstituto] = useState(CENARIO_PADRAO.substituto)
  const [complementar, setComplementar] = useState(CENARIO_PADRAO.complementar)
  const [producao, setProducao] = useState(CENARIO_PADRAO.producao)
  const [tipoBem, setTipoBem] = useState(CENARIO_PADRAO.tipoBem)
  const [secao, setSecao] = useState('previsao')
  const [previsao, setPrevisao] = usePersistido('microlab:demanda-oferta:previsao', null)
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:demanda-oferta:conceito', false)
  // As missões só contam depois que o aluno mexe: o cenário inicial não cumpre nada sozinho.
  const [mexeu, setMexeu] = useState(false)
  const [rodadas, setRodadas] = usePersistido('microlab:demanda-oferta:rodadas', 0)
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})

  // Um substituto mais caro empurra consumidores para cá (desloca a demanda à
  // direita); um complementar mais caro derruba o consumo conjunto (à esquerda).
  // O efeito da renda depende do TIPO do bem: sobe com ela num bem normal, não
  // se move num saciado, e cai num inferior.
  const deslocDemanda =
    efeitoDaRenda(tipoBem, renda) + substituto * EFEITO_SUBSTITUTO - complementar * EFEITO_COMPLEMENTAR
  const deslocOferta = producao * EFEITO_PRODUCAO

  const mercado = useMemo(
    () => situacao(preco, deslocDemanda, deslocOferta),
    [preco, deslocDemanda, deslocOferta],
  )

  const restaurar = () => {
    setPreco(CENARIO_PADRAO.preco)
    setRenda(CENARIO_PADRAO.renda)
    setSubstituto(CENARIO_PADRAO.substituto)
    setComplementar(CENARIO_PADRAO.complementar)
    setProducao(CENARIO_PADRAO.producao)
    setTipoBem(CENARIO_PADRAO.tipoBem)
  }

  const acertos = rodada.filter(caso => respostas[caso.id] === resolver(caso).relacao).length
  const rodadaCompleta = acertos === rodada.length

  useEffect(() => {
    if (rodadaCompleta) setRodadas(n => n + 1)
  }, [rodadaCompleta, setRodadas])

  const novaRodada = () => {
    setRodada(gerarRodada())
    setRespostas({})
  }

  const missoes = [
    {
      id: 'movimento',
      texto: 'Mude só o preço do café, sem mexer nos outros controles. A curva de demanda se move, ou só o ponto?',
      dica: 'Use apenas o controle "Preço do produto", no topo do painel.',
      sintese: 'Só o ponto andou: mudar o preço do próprio bem é movimento AO LONGO da curva. As curvas continuam no lugar.',
    },
    {
      id: 'substituto',
      texto: 'Encareça o substituto do café (o chá) e veja o que acontece com a demanda.',
      dica: 'Aumente o controle "Preço do substituto".',
      sintese: 'A curva de demanda inteira foi para a direita: a qualquer preço, mais gente quer café. Isso é DESLOCAMENTO da curva.',
    },
    {
      id: 'complementar',
      texto: 'Agora encareça um bem complementar, consumido junto com o café.',
      dica: 'Aumente o controle "Preço do complementar".',
      sintese: 'Desta vez a demanda vai para a esquerda: o que é consumido junto ficou mais caro, e o café perde interesse.',
    },
    {
      id: 'inferior',
      texto: 'Escolha "bem inferior" e aumente a renda dos consumidores.',
      dica: 'Clique no tipo de bem "Inferior" e depois aumente "Variação na renda".',
      sintese: 'Com mais renda, a demanda por um bem inferior CAI: o consumidor troca por algo melhor. O efeito da renda depende do tipo de bem.',
    },
    {
      id: 'oferta',
      texto: 'Melhore as condições de produção. Qual curva se desloca agora?',
      dica: 'Aumente o controle "Condições de produção".',
      sintese: 'Agora é a oferta que vai para a direita: tecnologia e custos mudam quem vende, não quem compra.',
    },
  ]
  const missoesFeitas = useMissoes('demanda-oferta', mexeu ? missoesDemandaOferta({ preco, precoInicial: CENARIO_PADRAO.preco, renda, substituto, complementar, producao, tipoBem }) : [])

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

  const leitura = LEITURA[mercado.tipo]

  return (
    <>
    <SecoesDoModulo
      rotulo="MÓDULO 03 · DEMANDA E OFERTA"
      secoes={SECOES}
      ativa={secao}
      concluidas={secaoOk}
      contador={`${acertos}/${rodada.length}`}
      onIr={irPara}
    />

    {secao === 'previsao' && <Previsao tema="demanda-oferta" anotar resposta={previsao} onResponder={setPrevisao} onContinuar={() => irPara('laboratorio')} />}
    {secao === 'conceito' && <Reflexao tema="demanda-oferta" resposta={previsao} />}

    {secao === 'conceito' && (
      <div className="conceito">
        <p className="eyebrow">3.3 · ENTENDER</p>
        <h3>O que move a curva, e o que move o ponto</h3>
        <p className="ponte-missoes">Nas missões, você mudou só o preço e viu o ponto andar; depois mexeu no substituto, no complementar, na renda e na produção e viu as curvas inteiras saírem do lugar. Essa é a distinção que o tema inteiro trabalha.</p>
        <p>
          Mudar o <b>preço do próprio bem</b> desliza o ponto <b>ao longo</b> da curva. Qualquer
          outro fator — renda, preço de bens relacionados, gosto, tecnologia — <b>desloca a curva
          inteira</b> para o lado. É a distinção que mais confunde no tema, e a que o laboratório
          existe para tornar visível.
        </p>
        <p>
          Com todo o resto constante — <i>coeteris paribus</i> —, por que a quantidade demandada
          responde ao preço? Há duas razões. O <b>efeito renda</b>: um preço menor aumenta o poder de
          compra, e com a mesma renda o consumidor leva mais unidades; um preço maior faz o
          contrário. O <b>efeito substituição</b>: o bem que encarece perde espaço para um substituto
          mais barato, e vice-versa. No laboratório, os dois agem juntos quando você move o preço
          do produto.
        </p>
        <p>
          Dois bens são <b>substitutos</b> quando competem: se um encarece, o consumidor migra
          para o outro, e a demanda do outro sobe. São <b>complementares</b> quando se consomem
          juntos: se um encarece, o consumo do par cai junto.
        </p>
        <p>
          Quanto à renda, a regra é direta — mais renda, mais demanda. Há duas exceções: <b>bens
          saciados</b>, em que o consumidor já está satisfeito, e <b>bens inferiores</b>, cuja
          demanda cai quando a renda sobe, porque ele troca por algo melhor.
        </p>
        <p>
          Do outro lado está a <b>oferta</b>: a quantidade que os produtores desejam vender num
          período. Ela depende do preço do bem, que move o ponto ao longo da curva, e dos preços dos
          demais bens e dos <b>fatores de produção</b> — terra, trabalho, tecnologia —, que deslocam
          a curva inteira. No laboratório, esse deslocamento está nas condições de produção.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('desafio') }}>
          {conceitoLido ? 'Ir para a aplicação' : 'Entendi, aplicar em outro caso'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'laboratorio' ? 'secao' : secao === 'desafio' ? 'secao modo-aplicar' : 'secao oculto'}>
      {secao === 'laboratorio' && <>
        <Aposta tema="demanda-oferta" resposta={previsao} />
        <Missoes missoes={missoes} feitas={missoesFeitas} aoConcluirTodas={<p className="metas-fim">✦ Missões cumpridas. Explore os controles à vontade ou siga para entender o resultado.</p>} />
      </>}
    <div className="lab-shell" onChange={() => setMexeu(true)} onClick={e => { if (e.target.closest('button')) setMexeu(true) }}>
      <aside className="controls-panel">
        <div className="panel-title"><span className="pulse"></span> CONTROLES DO CENÁRIO</div>

        <Slider label="Preço do produto" value={preco} min={PRECO_MIN} max={PRECO_MAX} suffix=" R$"
                onChange={setPreco} hint="Movimento ao longo das curvas" />

        <div className="divider"><span>DESLOCAMENTOS DE CURVA</span></div>

        <div className="escolha-grupo">
          <span className="escolha-rotulo">Tipo do bem</span>
          <div className="escolha-botoes">
            {TIPOS_DE_BEM_IDS.map(id => (
              <button key={id} className={tipoBem === id ? 'escolha ativa' : 'escolha'}
                      onClick={() => setTipoBem(id)} aria-pressed={tipoBem === id}>
                {TIPOS_DE_BEM[id].rotulo}
              </button>
            ))}
          </div>
          <small>{TIPOS_DE_BEM[tipoBem].resumo}</small>
        </div>

        <Slider label="Variação na renda" value={renda} min={-30} max={30} suffix="%"
                onChange={setRenda} hint={`Desloca a demanda em ${num(efeitoDaRenda(tipoBem, renda), 1)} mil un.`} />
        <Slider label="Preço do substituto" value={substituto} min={-30} max={30} suffix="%"
                onChange={setSubstituto} hint="Ex.: café e chá" />
        <Slider label="Preço do complementar" value={complementar} min={-30} max={30} suffix="%"
                onChange={setComplementar} hint="Ex.: carros e combustível" />
        <Slider label="Condições de produção" value={producao} min={-30} max={30} suffix="%"
                onChange={setProducao} hint="Tecnologia, custos, clima…" />

        <button className="reset" onClick={restaurar}>↺ Restaurar cenário</button>
      </aside>

      <div className="market-panel">
        <div className="market-header">
          <div>
            <span className="market-label">MERCADO DE CAFÉ</span>
            <h3>Oferta x Demanda</h3>
          </div>
          <div className={`market-status ${leitura.cor}`}>
            <b>{leitura.rotulo}</b>
            <span>{leitura.texto}</span>
          </div>
        </div>

        <div className="chart-wrap">
          <div className="axis-y">PREÇO (R$)</div>
          <div className="axis-x">QUANTIDADE (MIL UNIDADES)</div>
          <Chart deslocDemanda={deslocDemanda} deslocOferta={deslocOferta} preco={preco} situacao={mercado} />
        </div>

        <div className="metric-row">
          <div>
            <span>QUANTIDADE DEMANDADA</span>
            <strong>{num(mercado.qd)}<small> mil un.</small></strong>
          </div>
          <div>
            <span>QUANTIDADE OFERTADA</span>
            <strong>{num(mercado.qs)}<small> mil un.</small></strong>
          </div>
          <div className="highlight">
            <span>EQUILÍBRIO ESTIMADO</span>
            <strong>R$ {num(mercado.equilibrio.preco, 2)}<small> · {num(mercado.equilibrio.quantidade)} mil un.</small></strong>
          </div>
        </div>
      </div>
    </div>

    {secao === 'laboratorio' && <PassoEntender onClick={() => irPara('conceito')} />}
      {secao === 'desafio' && (
      <Desafio rodada={rodada} respostas={respostas} setRespostas={setRespostas}
               acertos={acertos} rodadas={rodadas} completa={rodadaCompleta} onNovaRodada={novaRodada} />
    )}

    <div className="insight">
      <span className="spark">✦</span>
      <p>
        <b>Leitura do cenário:</b> {leitura.texto}
        {renda !== 0 && tipoBem === 'normal' &&
          ` Sendo um bem normal, a renda ${renda > 0 ? 'em alta empurrou a demanda para a direita' : 'em baixa puxou a demanda para a esquerda'}.`}
        {renda !== 0 && tipoBem === 'saciado' &&
          ' Num bem saciado a renda não muda nada: o consumidor já está satisfeito.'}
        {renda !== 0 && tipoBem === 'inferior' &&
          ` Sendo um bem inferior, a renda ${renda > 0 ? 'em alta REDUZIU a demanda — o consumidor trocou por algo melhor' : 'em baixa AUMENTOU a demanda — o consumidor desceu de alternativa'}.`}
        {substituto > 0 && ' Um substituto mais caro torna o café relativamente mais atraente.'}
        {complementar > 0 && ' Um complementar mais caro reduz o interesse pelo produto.'}
        {producao > 0 && ' Melhores condições de produção expandem a oferta.'}
      </p>
    </div>
    </div>
    </>
  )
}

function Desafio({ rodada, respostas, setRespostas, acertos, rodadas, completa, onNovaRodada }) {
  return (
    <div className="metas">
      <div className="metas-topo">
        <span className="market-label">3.4 · APLICAR</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        Os choques são sorteados a cada rodada. Pela direção em que a demanda reagiu, diga se os
        dois bens competem entre si ou são consumidos juntos.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const certo = resolver(caso)
          const escolha = respostas[caso.id]
          const acertou = escolha === certo.relacao
          return (
            <li key={caso.id} className={escolha ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>{enunciado(caso)}</p>
              <div className="caso-opcoes">
                {RELACOES.map(op => (
                  <button
                    key={op}
                    className={`caso-op ${escolha === op ? 'escolhida' : ''}`}
                    onClick={() => setRespostas(r => ({ ...r, [caso.id]: op }))}
                    disabled={acertou}
                  >
                    {ROTULO_RELACAO[op]}
                  </button>
                ))}
              </div>
              {escolha && (
                <p className="caso-feedback">
                  {acertou ? '✓ ' : '✗ '}
                  A demanda por {caso.par.b} {certo.varDemanda > 0 ? 'subiu' : 'caiu'}{' '}
                  {Math.abs(certo.varDemanda)}% — {certo.varPreco > 0 ? 'com o preço em alta' : 'com o preço em baixa'},
                  os dois se moveram {Math.sign(certo.varPreco) === Math.sign(certo.varDemanda) ? 'no mesmo sentido' : 'em sentidos opostos'}.
                  {' '}Mesmo sentido indica substitutos (um toma o lugar do outro); sentidos opostos
                  indicam complementares (são consumidos juntos).
                  {acertou ? ` Por isso são ${ROTULO_RELACAO[certo.relacao].toLowerCase()}.` : ' Releia a direção dos dois movimentos e tente de novo.'}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com choques novos.</p>
      )}
      <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
    </div>
  )
}
