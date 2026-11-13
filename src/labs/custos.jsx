import React, { useState } from 'react'
import Jornada, { Metricas, GraficoLinhas } from '../shared/Jornada.jsx'
import Slider from '../shared/Slider.jsx'
import { num } from '../shared/formato.js'
import { resultadoFirma } from './firma.js'
import { Oculta } from '../shared/Missoes.jsx'
import { missoesCustos } from './missoes.js'
import TabelaDeCustos from '../shared/TabelaDeCustos.jsx'

const DINHEIRO = v => v === null ? 'Não definido' : `R$ ${num(v, 2)}`
const INVESTIMENTO_INICIAL = 60000

const MISSOES = [
  {
    id: 'lucro',
    texto: 'A doceria começa no prejuízo. Aumente a quantidade vendida até ela sair do prejuízo.',
    dica: 'Mova "Quantidade vendida no mês" e acompanhe a métrica "Lucro mensal".',
    sintese: 'A partir de 2.500 unidades, a margem de R$ 6 de cada uma já pagou o custo fixo de R$ 15.000: esse é o ponto de equilíbrio da firma.',
  },
  {
    id: 'margem',
    texto: 'Deixe o custo variável por unidade igual ou maior que o preço.',
    dica: 'Aumente "Custo variável unitário" até alcançar o "Preço por unidade".',
    sintese: 'Sem margem por unidade, vender mais não ajuda a cobrir o custo fixo: não existe ponto de equilíbrio.',
  },
  {
    id: 'investimento',
    texto: 'Mude o capital investido e compare o lucro com a rentabilidade.',
    dica: 'Mova "Capital investido" e observe as métricas de lucro, rentabilidade e prazo de retorno.',
    sintese: 'O lucro não mudou, mas a rentabilidade e o prazo de retorno sim: rentabilidade compara o lucro ao investimento; lucratividade, à receita.',
  },
]

const QUESTOES = [
  { pergunta: 'A empresa vende 1.000 unidades a R$ 48, tem custo fixo de R$ 8.000 e variável total de R$ 22.000. Qual o lucro?', resposta: 18000, unidade: 'R$', explicacao: 'Receita = 48 × 1.000 = 48.000; custo = 8.000 + 22.000 = 30.000; lucro = 18.000.' },
  { pergunta: 'Com custo fixo de R$ 15.000, preço de R$ 10 e custo variável unitário de R$ 4, quantas unidades cobrem os custos?', resposta: 2500, unidade: 'unidades', explicacao: 'A contribuição de cada unidade é 10 − 4 = R$ 6. Logo, 15.000 ÷ 6 = 2.500 unidades.' },
  { pergunta: 'Receita de R$ 100.000, variável total de R$ 70.000 e fixo de R$ 19.500: qual o faturamento de equilíbrio?', resposta: 65000, unidade: 'R$', explicacao: 'A margem de contribuição representa 30% das vendas. 19.500 ÷ 0,30 = R$ 65.000.' },
  { pergunta: 'Desafio da aula: investimento de R$ 600.000 e lucro anual de R$ 120.000. Qual a rentabilidade anual?', resposta: 20, unidade: '% ao ano', explicacao: '120.000 ÷ 600.000 × 100 = 20% ao ano.' },
  { pergunta: 'No mesmo desafio, a receita anual é R$ 1.200.000. Qual a lucratividade?', resposta: 10, unidade: '%', explicacao: '120.000 ÷ 1.200.000 × 100 = 10%: a base é a receita, e não o investimento.' },
  { pergunta: 'Com investimento de R$ 600.000 e lucro constante de R$ 120.000 por ano, qual o prazo simples de retorno?', resposta: 5, unidade: 'anos', explicacao: '600.000 ÷ 120.000 = 5 anos, na simplificação da aula sem desconto e com lucro constante.' },
]

export default function LabCustos({ abrirDesafio }) {
  const [preco, setPreco] = useState(10)
  const [quantidade, setQuantidade] = useState(2000)
  const [fixo, setFixo] = useState(15000)
  const [variavelUnitario, setVariavel] = useState(4)
  const [investimento, setInvestimento] = useState(INVESTIMENTO_INICIAL)
  const r = resultadoFirma({ preco, quantidade, fixo, variavelUnitario, investimento })
  const cumpridas = missoesCustos({ lucro: r.lucro, preco, variavelUnitario, investimento, investimentoInicial: INVESTIMENTO_INICIAL })
  return <Jornada tema="custos" numero="10" titulo="Custos, receitas e resultado" abrirDesafio={abrirDesafio} questoes={QUESTOES}
    missoes={MISSOES} cumpridas={cumpridas}
    fechamento={{ texto: 'Lucro é receita menos custo total, e o ponto de equilíbrio é onde a margem de cada unidade paga o custo fixo. Este é o último tema da disciplina.', proximo: null }}
    fonte="Base: aula 12, Custos, Receitas, Break-Even, Lucratividade e Rentabilidade. A planilha da aula complementa o conteúdo com tabelas e exercícios. Valores do simulador por mês."
    experimento={(interagir, rev) => {
      const controle = setter => v => { setter(v); interagir() }
      return <><div className="lab-shell"><aside className="controls-panel"><p className="panel-title">O NEGÓCIO SE PAGA?</p><p>Cenário mensal com preço e custo variável por unidade constantes. Tudo o que é produzido é vendido.</p>
        <Slider label="Preço por unidade" value={preco} min={0} max={30} suffix=" R$" onChange={controle(setPreco)} />
        <Slider label="Quantidade vendida no mês" value={quantidade} min={0} max={6000} step={100} onChange={controle(setQuantidade)} />
        <Slider label="Custo fixo mensal" value={fixo} min={0} max={30000} step={500} suffix=" R$" onChange={controle(setFixo)} />
        <Slider label="Custo variável unitário" value={variavelUnitario} min={0} max={20} suffix=" R$" onChange={controle(setVariavel)} />
        <Slider label="Capital investido" value={investimento} min={10000} max={200000} step={5000} suffix=" R$" onChange={controle(setInvestimento)} />
      </aside><div className="market-panel"><p className="eyebrow">RECEITA − CUSTO = RESULTADO</p><h3>{r.lucro > 0 ? 'A operação gera lucro.' : r.lucro < 0 ? 'A operação tem prejuízo.' : 'Receita e custo se encontram.'}</h3>
        <GraficoLinhas series={[{ nome: 'Receita total', pontos: [[0, 0], [6000, preco * 6000]] }, { nome: 'Custo total', pontos: [[0, fixo], [6000, fixo + variavelUnitario * 6000]] }]} maxX={6000} maxY={180000} eixoX="QUANTIDADE / MÊS" eixoY="R$ / MÊS" marcador={[quantidade, r.receita]} />
        <Metricas itens={[["Receita mensal", DINHEIRO(r.receita)], ['Custo mensal', DINHEIRO(r.custo)], ['Lucro mensal', DINHEIRO(r.lucro)], ['Equilíbrio em unidades', !rev('lucro').visivel ? <Oculta {...rev('lucro')} /> : r.equilibrioQ === null ? (r.equilibrioTipo === 'todos' ? 'Qualquer volume' : 'Sem ponto finito') : num(r.equilibrioQ, 2)], ['Faturamento de equilíbrio', !rev('lucro').visivel ? <Oculta {...rev('lucro')} /> : r.equilibrioReceita === null ? (r.equilibrioTipo === 'todos' ? 'Qualquer receita' : 'Sem ponto finito') : DINHEIRO(r.equilibrioReceita)], ['Margem por unidade', <Oculta {...rev('margem', { naVez: true })}>{DINHEIRO(r.margem)}</Oculta>], ['Lucratividade', <Oculta {...rev('investimento', { naVez: true })}>{r.lucratividade === null ? 'Não definida' : `${num(r.lucratividade, 2)}%`}</Oculta>], ['Rentabilidade mensal', <Oculta {...rev('investimento', { naVez: true })}>{`${num(r.rentabilidade, 2)}%`}</Oculta>], ['Prazo simples de retorno', <Oculta {...rev('investimento', { naVez: true })}>{r.retorno === null ? 'Sem retorno positivo' : `${num(r.retorno, 2)} meses`}</Oculta>]]} />
        <p className="insight" aria-live="polite">{r.equilibrioTipo === 'todos' ? 'Sem custo fixo e com preço igual ao custo variável unitário, receita e custo são iguais em qualquer volume: o lucro é sempre zero.' : r.equilibrioTipo === 'origem' ? 'Sem custo fixo e com margem negativa, a empresa só empata com zero vendas. Cada venda adicional gera prejuízo.' : r.margem <= 0 ? 'O preço não supera o custo variável unitário. Vender mais não gera contribuição positiva para cobrir o custo fixo; a fórmula usual de break-even não tem solução finita positiva.' : `Cada unidade contribui com ${DINHEIRO(r.margem)} para os custos fixos. ${!rev('lucro').visivel ? 'Quantas vendas pagam esse custo? A missão 1 responde.' : r.equilibrioQ > 6000 ? 'O ponto de equilíbrio está além da faixa de quantidade deste gráfico.' : `Para unidades inteiras, são necessárias ${Math.ceil(r.equilibrioQ).toLocaleString('pt-BR')} vendas para cobrir os custos.`}`}</p>
      </div></div>
      <TabelaDeCustos onInteragir={interagir} />
      <details className="complemento"><summary>Complemento da aula: preço, quantidade e receita</summary><p>Na tabela da planilha, Q = 20 − 2P. Aqui a quantidade reage ao preço; é outro cenário, separado da simulação de volume com preço constante acima.</p><div className="tabela-scroll"><table className="dados-tabela"><caption>Receitas do exercício</caption><thead><tr><th>Preço (R$)</th><th>Quantidade</th><th>Receita total (R$)</th><th>Receita média (R$)</th></tr></thead><tbody>{Array.from({ length: 10 }, (_, i) => i + 1).map(p => { const q = 20 - 2 * p; return <tr key={p}><th scope="row">{p}</th><td>{q}</td><td>{p * q}</td><td>{q === 0 ? 'Não definida (Q = 0)' : p}</td></tr> })}</tbody></table></div></details></>
    }}
    explicacao={<><h3>Vender, empatar e remunerar o investimento são perguntas diferentes.</h3><p className="ponte-missoes">Nas missões, você tirou a doceria do prejuízo, eliminou a margem por unidade e viu o investimento mudar a rentabilidade sem mudar o lucro. As fórmulas abaixo organizam essas três ideias.</p><p><b>CT = CF + CV.</b> O custo fixo não muda com a produção no intervalo analisado; o variável muda. Dividindo cada custo por Q, obtemos seus custos médios. O custo marginal é ΔCT ÷ ΔQ, usando a variação efetiva de quantidade entre linhas.</p><p><b>RT = preço × quantidade; receita média = RT ÷ Q; lucro = RT − CT.</b> Com Q = 0, a receita média não é definida. Receita máxima e lucro máximo não são necessariamente o mesmo ponto.</p><p><b>Equilíbrio da firma: Q = CF ÷ (preço − CV unitário).</b> Para o faturamento: CF ÷ [(RT − CV) ÷ RT]. Essas expressões supõem margem positiva e custos e preço compatíveis com o cenário. O ponto de equilíbrio de uma firma é diferente do equilíbrio entre oferta e demanda de um mercado.</p><p><b>Lucratividade = lucro líquido ÷ receita × 100.</b> <b>Rentabilidade = lucro líquido ÷ investimento × 100.</b> Neste modelo simplificado, todos os custos do período estão incluídos no CT e o resultado é usado como lucro líquido. O prazo simples é investimento ÷ lucro por período, supondo lucro positivo e constante, sem descontar o valor do dinheiro no tempo.</p><p>Na simulação atual, o lucro é de <b>{DINHEIRO(r.lucro)} por mês</b>. Alterar o investimento muda a rentabilidade e o prazo de retorno, mas não muda a margem operacional. As tabelas complementares apresentam os dados da planilha como exercícios distintos.</p></>} />
}
