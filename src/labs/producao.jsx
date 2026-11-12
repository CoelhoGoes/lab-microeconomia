import React, { useState } from 'react'
import Jornada, { Metricas, GraficoLinhas } from '../shared/Jornada.jsx'
import Slider from '../shared/Slider.jsx'
import { num } from '../shared/formato.js'
import { PRODUCAO_AULA, PRODUCAO_EXERCICIO, produtividade } from './firma.js'

const QUESTOES = [
  { pergunta: 'Em outro cenário, 3 trabalhadores produzem 26 unidades. Qual é a produtividade média? Arredonde para duas casas.', resposta: 26 / 3, unidade: 'un./trabalhador', explicacao: 'Produtividade média = produção total ÷ trabalhadores = 26 ÷ 3.' },
  { pergunta: 'Nesse cenário, 4 trabalhadores produzem 34 unidades e 5 produzem 40. Qual é a produtividade marginal do quinto?', resposta: 6, unidade: 'unidades adicionais', explicacao: 'A produção adicional é 40 − 34 = 6 unidades.' },
  { pergunta: 'Se a produtividade marginal cai de 10 para 8 e continua positiva, a produção total…', opcoes: ['Cresce mais lentamente', 'Já está caindo', 'Fica constante'], resposta: 'Cresce mais lentamente', explicacao: 'Marginal positiva ainda acrescenta produção. A queda da produção total exige marginal negativa.' },
  { pergunta: 'Na tabela do exercício, passar de 8 para 9 trabalhadores reduz a produção de 46 para 44. Qual é a produtividade marginal?', resposta: -2, unidade: 'unidades', explicacao: '44 − 46 = −2. O fator variável adicional passa a reduzir a produção total.' },
]

export default function LabProducao({ abrirDesafio }) {
  const [n, setN] = useState(3)
  const [base, setBase] = useState('aula')
  const tabela = base === 'aula' ? PRODUCAO_AULA : PRODUCAO_EXERCICIO
  const r = produtividade(tabela, n)
  return <Jornada tema="producao" numero="09" titulo="Produção e rendimentos" abrirDesafio={abrirDesafio}
    fonte="Base: aula 11, Lei dos Rendimentos Decrescentes. Tabelas da aula e do exercício; fatores fixos: 100 m². A linha de zero trabalhadores é a origem adotada no modelo."
    questoes={QUESTOES}
    experimento={interagir => <div className="lab-shell"><aside className="controls-panel">
      <p className="panel-title">A CAFETERIA PODE CRESCER?</p><p>O espaço permanece em 100 m². Altere apenas a mão de obra.</p>
      <label className="campo-select">Dados da experiência<select aria-label="Dados da experiência" value={base} onChange={e => { setBase(e.target.value); interagir() }}><option value="aula">Exemplo da aula</option><option value="exercicio">Exercício da aula</option></select></label>
      <Slider label="Trabalhadores" value={n} min={0} max={9} onChange={v => { setN(v); interagir() }} />
      <p className="tabela-ajuda">Compare 3 → 4, 7 → 8 e 8 → 9 trabalhadores. A produção total e a marginal contam histórias diferentes.</p>
    </aside><div className="market-panel"><p className="eyebrow">CURTO PRAZO · ESPAÇO FIXO</p><h3>Mais gente, quanto produto a mais?</h3>
      <GraficoLinhas series={[{ nome: 'Produção total', pontos: tabela.map((q, i) => [i, q]) }]} maxX={9} maxY={50} eixoX="TRABALHADORES" eixoY="PRODUÇÃO (UN.)" marcador={[n, r.total]} />
      <Metricas itens={[["Produção total", `${r.total} un.`], ['Produtividade média', r.media === null ? 'Não definida' : num(r.media, 2)], ['Produtividade marginal', r.marginal === null ? 'Não definida' : `${r.marginal > 0 ? '+' : ''}${r.marginal} un.`]]} />
      <p className="insight" aria-live="polite">{n === 0 ? 'Sem trabalhadores, a produção é zero. As produtividades média e marginal não são calculadas nesta linha.' : r.marginal < 0 ? 'A contratação adicional reduziu a produção total. A produtividade marginal é negativa.' : r.marginal === 0 ? 'A contratação não acrescentou produção. A produtividade marginal é zero.' : `O trabalhador adicional acrescenta ${r.marginal} unidades. ${n >= 4 ? 'Os rendimentos marginais já começaram a diminuir em relação ao pico.' : 'Compare com as próximas contratações.'}`}</p>
      <div className="tabela-scroll"><table className="dados-tabela"><caption>Produção e produtividade por trabalhador</caption><thead><tr><th>Mão de obra</th><th>Total</th><th>Média</th><th>Marginal</th></tr></thead><tbody>{tabela.slice(1).map((q, i) => { const p = produtividade(tabela, i + 1); return <tr key={i} className={n === i + 1 ? 'linha-ativa' : ''}><th scope="row">{i + 1}</th><td>{q}</td><td>{num(p.media, 2)}</td><td>{p.marginal}</td></tr> })}</tbody></table></div>
    </div></div>}
    explicacao={<><h3>O total pode subir enquanto o ganho adicional cai.</h3><p>Uma firma transforma fatores de produção em bens e serviços. Fatores primários vêm da natureza; fatores secundários são produzidos por outras firmas. No curto prazo, ao menos um fator permanece fixo; no longo prazo, todos podem variar.</p><p><b>Produtividade média = produção total ÷ trabalhadores.</b> A <b>produtividade marginal = variação da produção ÷ variação do fator variável</b>. Como cada linha acrescenta um trabalhador, basta subtrair os totais consecutivos.</p><p>Na tabela da aula, a marginal chega a 10 com o terceiro trabalhador e cai para 8 com o quarto. A produção total continua crescendo até o sétimo, fica em 44 no oitavo e cai para 42 no nono. Rendimentos marginais decrescentes começam antes da queda do total.</p><p>Gerir a contratação também exige comparar o valor da produção adicional com o custo adicional. A produtividade isolada não determina o número de trabalhadores que maximiza o lucro.</p></>} />
}
