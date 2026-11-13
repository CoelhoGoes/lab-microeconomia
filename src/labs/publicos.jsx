import React, { useState } from 'react'
import Jornada, { Metricas } from '../shared/Jornada.jsx'
import { Oculta } from '../shared/Missoes.jsx'
import Slider from '../shared/Slider.jsx'
import { num } from '../shared/formato.js'
import { bemColetivo, projetoArriscado } from './firma.js'
import { missoesPublicos } from './missoes.js'

const BENS = [
  ['Rival e exclusivo', 'Café comprado na cafeteria: a unidade consumida não está disponível para outra pessoa.'],
  ['Rival e não exclusivo', 'Pesca em lago de acesso aberto: o peixe capturado deixa de estar disponível aos demais.'],
  ['Não rival e exclusivo', 'Conteúdo digital por assinatura, sem congestionamento: é possível limitar o acesso.'],
  ['Não rival e não exclusivo', 'Iluminação de uma rua: beneficiar mais um pedestre não reduz a luz para os demais.'],
]
const MISSOES = [
  {
    id: 'classificar',
    texto: 'No primeiro painel, marque os atributos de um café comprado na cafeteria.',
    dica: 'Quem toma o café não deixa para outro, e quem não paga não leva: marque as duas caixas.',
    sintese: 'Rival e exclusivo: um bem privado comum. O bem público puro fica no canto oposto da matriz, não rival e não exclusivo, como a iluminação da rua.',
  },
  {
    id: 'carona',
    texto: 'No jogo de contribuição, deixe sua contribuição em zero enquanto os outros contribuem.',
    dica: 'Zere "Sua contribuição" e deixe a dos outros acima de zero.',
    sintese: 'Seu saldo ficou maior que o de quem contribuiu: você recebe sua parte do fundo sem pagar. Esse é o carona.',
  },
  {
    id: 'todos',
    texto: 'Agora faça todos contribuírem o máximo, R$ 20.',
    dica: 'Leve os dois controles do jogo até R$ 20.',
    sintese: 'Cada pessoa termina com R$ 32, mais do que os R$ 20 de quando ninguém contribui. O melhor para o grupo não é o que o incentivo individual sugere.',
  },
  {
    id: 'subsidio',
    texto: 'No projeto arriscado, com 30% de chance de sucesso, encontre um subsídio que deixe o resultado privado esperado em zero ou mais.',
    dica: 'Com 30% de chance, a receita esperada é R$ 60 mi para um custo de R$ 100 mi. Quanto falta?',
    sintese: 'O subsídio cobre os R$ 40 mi que faltavam, mas não muda a chance de sucesso, e o custo passa para a sociedade.',
  },
]

const QUESTOES = [
  { pergunta: 'A iluminação de uma rua aberta a todos, sem congestionamento, é…', opcoes: BENS.map(b => b[0]), resposta: BENS[3][0], explicacao: 'Seu uso não reduz a disponibilidade para os outros e é difícil excluir quem não pagou.' },
  { pergunta: 'A pesca em um lago de acesso aberto, com estoque limitado, é…', opcoes: BENS.map(b => b[0]), resposta: BENS[1][0], explicacao: 'Há rivalidade pelo estoque de peixes e ausência de exclusão no acesso descrito.' },
  { pergunta: 'Um serviço é produzido pelo governo. Isso basta para classificá-lo como bem público puro?', opcoes: ['Sim', 'Não: é preciso avaliar rivalidade e exclusividade'], resposta: 'Não: é preciso avaliar rivalidade e exclusividade', explicacao: 'A classificação depende dos atributos do consumo, e não de quem oferece o bem.' },
  { pergunta: 'Qual situação descreve o carona?', opcoes: ['Receber o benefício coletivo sem contribuir', 'Pagar mais por um bem exclusivo', 'Consumir um bem que ninguém mais pode usar'], resposta: 'Receber o benefício coletivo sem contribuir', explicacao: 'A dificuldade de excluir beneficiários pode enfraquecer o financiamento voluntário.' },
  { pergunta: 'Um projeto tem retorno privado esperado negativo, mas benefícios sociais relevantes. O subsídio…', opcoes: ['Garante que o projeto terá sucesso', 'Pode viabilizar o investimento privado, mas exige recursos e avaliação pública'], resposta: 'Pode viabilizar o investimento privado, mas exige recursos e avaliação pública', explicacao: 'O apoio muda o incentivo financeiro; não elimina o risco tecnológico nem comprova que o benefício social supera o custo.' },
]

export default function LabPublicos({ abrirDesafio }) {
  const [sua, setSua] = useState(8)
  const [outros, setOutros] = useState(8)
  const [rival, setRival] = useState(false)
  const [exclusivo, setExclusivo] = useState(false)
  const [chance, setChance] = useState(30)
  const [subsidio, setSubsidio] = useState(0)
  const r = bemColetivo(sua, outros)
  const projeto = projetoArriscado({ custo: 100, chance, receita: 200, subsidio })
  const indice = (rival ? 0 : 2) + (exclusivo ? 0 : 1)
  const cumpridas = missoesPublicos({ rival, exclusivo, sua, outros, chance, subsidio })
  return <Jornada tema="publicos" numero="07" titulo="Bens públicos e riscos" abrirDesafio={abrirDesafio} questoes={QUESTOES}
    missoes={MISSOES} cumpridas={cumpridas}
    fechamento={{ texto: 'Quando não dá para excluir quem não paga, o incentivo ao carona pode deixar um bem útil sem financiamento. O tema 8 trata de uma forma de financiar o que é coletivo: os tributos.', proximo: { id: 'tributacao', titulo: 'Tributação' } }}
    fonte="Base: aula 9, Falhas de Mercado, Bens Públicos e Riscos Pesados. O jogo de contribuição e o projeto de pesquisa são cenários didáticos hipotéticos."
    experimento={(interagir, rev) => <>
      <div className="lab-shell"><aside className="controls-panel"><p className="panel-title">COMO ESSE BEM É CONSUMIDO?</p><p>Classifique pelos atributos, independentemente de quem produz.</p>
        <label className="check-controle"><input type="checkbox" checked={rival} onChange={e => { setRival(e.target.checked); interagir() }} /> O consumo de uma pessoa reduz o disponível para outra</label>
        <label className="check-controle"><input type="checkbox" checked={exclusivo} onChange={e => { setExclusivo(e.target.checked); interagir() }} /> É possível impedir o acesso de quem não paga</label>
      </aside><div className="market-panel"><h3>Rivalidade × exclusividade</h3><div className="matriz-bens">{BENS.map(([nome, exemplo], i) => <article key={nome} className={i === indice ? 'bem-ativo' : ''}><b>{nome}</b><p>{exemplo}</p>{i === indice && <span>✓ Sua combinação</span>}</article>)}</div></div></div>
      <div className="lab-shell"><aside className="controls-panel"><p className="panel-title">FINANCIAR UM BEM COLETIVO</p><p>Cinco pessoas recebem R$ 20 cada. O fundo conjunto é multiplicado por 1,6 e dividido igualmente entre todos.</p>
        <Slider label="Sua contribuição" value={sua} min={0} max={20} suffix=" R$" onChange={v => { setSua(v); interagir() }} />
        <Slider label="Contribuição de cada outra pessoa" value={outros} min={0} max={20} suffix=" R$" onChange={v => { setOutros(v); interagir() }} />
      </aside><div className="market-panel"><h3>O incentivo individual encontra o resultado coletivo.</h3>
        <Metricas itens={[["Fundo coletivo", `R$ ${num(r.fundo, 2)}`], ['Benefício por pessoa', `R$ ${num(r.beneficio, 2)}`], ['Seu saldo final', <Oculta {...rev('carona', { naVez: true })}>R$ {num(r.saldo, 2)}</Oculta>], ['Saldo total do grupo', <Oculta {...rev('todos', { naVez: true })}>R$ {num(r.totalGrupo, 2)}</Oculta>]]} />
        <p className="insight" aria-live="polite">Você guarda R$ {20 - sua} e recebe R$ {num(r.beneficio, 2)} do fundo. Cada R$ 1 contribuído acrescenta R$ 1,60 ao benefício coletivo, mas só R$ 0,32 volta diretamente a quem contribui. Compare sua contribuição zero com a contribuição máxima, mantendo os outros fixos.</p>
      </div></div>
      <div className="lab-shell"><aside className="controls-panel"><p className="panel-title">UM PROJETO DE ALTO RISCO</p><p>Pesquisa de longo prazo: investimento de R$ 100 milhões e receita de R$ 200 milhões se houver sucesso, zero se falhar. Benefícios sociais não estão monetizados.</p>
        <Slider label="Probabilidade de sucesso" value={chance} min={0} max={100} suffix="%" onChange={v => { setChance(v); interagir() }} />
        <Slider label="Subsídio público" value={subsidio} min={0} max={100} suffix=" milhões R$" onChange={v => { setSubsidio(v); interagir() }} />
      </aside><div className="market-panel"><h3>Quem assume o risco e quem financia?</h3><Metricas itens={[["Receita privada esperada", `R$ ${num(projeto.esperado, 1)} mi`], ['Resultado privado esperado', <Oculta {...rev('subsidio', { naVez: true })}>R$ {num(projeto.privado, 1)} mi</Oculta>], ['Custo público do apoio', <Oculta {...rev('subsidio')}>R$ {subsidio} mi</Oculta>]]} /><p className="tabela-ajuda">Nesta simulação, a média ponderada mostra a visão do mercado sobre a viabilidade do projeto: com {chance}% de chance de sucesso, a receita esperada é R$ {num(projeto.esperado, 1)} mi.<br /><strong>{chance}% × R$ 200 mi + {100 - chance}% × R$ 0 = R$ {num(projeto.esperado, 1)} mi</strong></p><p className="insight">Receita média de R$ {num(projeto.esperado, 1)} mi − custo de R$ 100 mi + subsídio de R$ {subsidio} mi = resultado privado esperado de R$ {num(projeto.privado, 1)} mi. O subsídio muda quem paga parte do custo, mas não a chance de sucesso. Para avaliar o apoio, também é preciso considerar os benefícios sociais e o custo público.</p></div></div>
    </>}
    explicacao={<><h3>O benefício pode chegar a quem não consegue ser cobrado.</h3><p className="ponte-missoes">Nas missões, você classificou um bem pelos atributos, foi carona no jogo de contribuição, viu o grupo ganhar quando todos contribuem e usou um subsídio para viabilizar um projeto arriscado. Os conceitos abaixo explicam cada passo.</p><p>Um bem público puro é <b>não rival e não exclusivo</b>. O consumo adicional não reduz a disponibilidade para os demais, e excluir usuários é inviável ou muito difícil. Ser oferecido pelo governo não basta para um bem ter esses atributos.</p><p>O incentivo ao <b>carona</b> pode levar à contribuição voluntária insuficiente, mesmo quando financiar o bem beneficiaria o grupo. No jogo, uma contribuição individual tem retorno privado de 0,32 por real e retorno social de 1,60; esses números são hipóteses, não uma estimativa de um serviço público real.</p><p>Bens meritórios, como saúde e educação, podem ter rivalidade ou exclusão e ainda assim receber provisão pública por razões sociais. A classificação por atributos é diferente da escolha de política pública.</p><p><b>Poder de mercado</b> pode limitar a concorrência; <b>mercados incompletos</b> deixam demandas sem oferta por falta de financiamento, incerteza ou risco elevado. Projetos de longo prazo podem gerar benefícios que o investidor não consegue capturar.</p><p>Subsídios, incentivos ou provisão pública podem mudar os incentivos. O resultado esperado usa probabilidade × receita e não promete o resultado de uma realização concreta. A análise deve considerar também o custo para a sociedade e o tempo até o retorno.</p></>} />
}
