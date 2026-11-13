import React from 'react'

export const PREVISOES = {
  oportunidade: { caso: 'Ana herdou um terreno e precisa decidir o que fazer com ele neste ano. Ela pode abrir uma loja, com lucro de R$ 420 por mês já descontados os custos; alugá-lo para um vizinho por R$ 380 por mês; ou cedê-lo a uma horta comunitária, que paga R$ 240 por mês. O terreno só comporta um desses usos. Ana decide abrir a loja.', pergunta: 'Ao abrir a loja, de quanto dinheiro por mês Ana está abrindo mão?', opcoes: ['R$ 620 por mês', 'R$ 380 por mês', 'R$ 420 por mês', 'R$ 0: o terreno já é dela'], correta: 1, explicacao: 'Ana abre mão de R$ 380: o aluguel, a melhor alternativa que ficou de fora. Não se somam aluguel e horta, porque os dois não poderiam acontecer ao mesmo tempo. E o terreno ser dela não zera o custo: deixar de receber o aluguel também custa.' },
  consumidor: { caso: 'Marina adora café. O primeiro copo do dia vale muito para ela; o terceiro, bem menos: cada copo a mais acrescenta menos satisfação. Nesta semana o preço do copo caiu, e os gostos dela continuam os mesmos.', pergunta: 'O que você espera da quantidade comprada?', opcoes: ['Deve aumentar ou permanecer igual', 'Sempre cai', 'Depende apenas da oferta'], correta: 0, explicacao: 'Com preço menor, mais unidades podem valer a compra. No modelo discreto, a quantidade também pode permanecer igual até o próximo degrau.' },
  'demanda-oferta': { caso: 'Na cidade de Rafael, muita gente alterna entre café e chá. Neste mês, uma quebra de safra deixou o chá mais caro. O preço do café nas prateleiras continua igual.', pergunta: 'O que acontece com a demanda por café?', opcoes: ['Move-se um ponto na mesma curva', 'A curva de demanda se desloca para a direita', 'A oferta necessariamente diminui'], correta: 1, explicacao: 'O preço de outro bem altera a demanda inteira. O movimento ao longo da curva acontece quando muda o preço do próprio café.' },
  equilibrio: { caso: 'Uma rede de cafeterias decidiu vender café a um preço promocional. Na primeira semana, faltou café: àquele preço, os clientes queriam comprar mais do que os fornecedores conseguiam entregar.', pergunta: 'Qual pressão aparece sobre o preço?', opcoes: ['Alta', 'Baixa', 'Nenhuma, pois o mercado já está equilibrado'], correta: 0, explicacao: 'Há escassez: a quantidade demandada supera a ofertada. No modelo competitivo, isso pressiona o preço para cima.' },
  elasticidades: { caso: 'Uma cafeteria subiu o preço do cappuccino em 10% para faturar mais. No mês seguinte, vendeu 20% menos cappuccinos.', pergunta: 'O que acontece com a receita total?', opcoes: ['Sobe porque o preço subiu', 'Cai porque a quantidade responde mais', 'Fica igual'], correta: 1, explicacao: 'A receita passa a 1,10 × 0,80 = 0,88 do valor inicial: queda de 12%. A reação da quantidade supera a do preço.' },
  estruturas: { caso: 'Uma cidade tem uma única empresa que distribui gás encanado. Milhares de famílias compram dela, não há substituto próximo e a lei impede que outras empresas entrem nesse mercado.', pergunta: 'Como você classificaria esse mercado?', opcoes: ['Concorrência perfeita', 'Monopsônio', 'Monopólio'], correta: 2, explicacao: 'Uma única vendedora caracteriza monopólio. Uma única compradora caracterizaria monopsônio.' },
  publicos: { caso: 'Os moradores de uma rua querem instalar postes de iluminação e combinam uma vaquinha. Depois de instalada, a luz ilumina o caminho de todos que passam, inclusive de quem não contribuiu.', pergunta: 'Qual dificuldade pode surgir na contribuição voluntária?', opcoes: ['Todos deixam de ser beneficiados', 'Alguns esperam que os outros paguem', 'A luz só beneficia quem pagou'], correta: 1, explicacao: 'A dificuldade de excluir beneficiários cria incentivo a pegar carona. O retorno coletivo pode superar o incentivo individual a contribuir.' },
  tributacao: { caso: 'Carla ganha R$ 2.000 por mês; Bruno, R$ 10.000. Um tributo hipotético cobra R$ 200 de cada um: o mesmo valor para os dois.', pergunta: 'Em qual renda o tributo pesa mais proporcionalmente?', opcoes: ['Na renda de R$ 2.000', 'Na renda de R$ 10.000', 'O peso percentual é igual'], correta: 0, explicacao: 'R$ 200 representam 10% de R$ 2.000 e 2% de R$ 10.000. O valor absoluto igual tem peso relativo diferente.' },
  producao: { caso: 'Uma cafeteria tem um salão de 100 m² e as mesmas máquinas. Para atender mais clientes, a dona contrata atendentes, um de cada vez, sem aumentar o espaço.', pergunta: 'A produção adicional de cada contratação cresce para sempre?', opcoes: ['Sim, sempre na mesma proporção', 'Não: pode cair, zerar e até ficar negativa', 'A produção total cai desde a primeira contratação'], correta: 1, explicacao: 'Com fatores fixos, a produtividade marginal pode começar a cair antes de a produção total cair. Marginal menor ainda pode ser positiva.' },
  custos: { caso: 'Uma doceria vende muito: o caixa enche todo fim de semana. Mas ela paga aluguel, salários e ingredientes, e o dono quer saber se está ganhando dinheiro de verdade.', pergunta: 'Ter faturamento alto garante lucro?', opcoes: ['Sim, faturamento e lucro são iguais', 'Não: é preciso comparar receita e custo total', 'Sim, se vender todas as unidades'], correta: 1, explicacao: 'Lucro é receita total menos custo total. O ponto de equilíbrio da firma ocorre quando os dois se igualam.' },
}

// anotar: confirma a previsão assim que o aluno responde e anuncia o teste no
// laboratório, para a hipótese não ficar sem retorno até a etapa Entender.
export default function Previsao({ tema, resposta, onResponder, onContinuar, anotar = false }) {
  const p = PREVISOES[tema]
  return <section className="previsao-card">
    <p className="eyebrow">01 · ANTES DE MEXER NOS CONTROLES</p>
    <h3>O que você acha que vai acontecer?</h3>
    <p className="caso-abertura">{p.caso}</p>
    <fieldset className="previsao-opcoes"><legend>{p.pergunta}</legend>
      {p.opcoes.map((opcao, i) => <label key={opcao} className={resposta === i ? 'selecionada' : ''}>
        <input type="radio" name={`previsao-${tema}`} checked={resposta === i} onChange={() => onResponder(i)} />{opcao}
      </label>)}
    </fieldset>
    {anotar && resposta !== null && <p className="anotado" role="status">Anotado: você apostou em <b>{p.opcoes[resposta]}</b>. Vamos testar essa aposta no laboratório.</p>}
    <p className="tabela-ajuda">Sua previsão não vale nota. Você poderá compará-la com o resultado na etapa Entender.</p>
    <div className="jornada-acoes"><button className="button primary" disabled={resposta === null} onClick={onContinuar}>Testar minha previsão →</button>
      <button className="text-button" onClick={onContinuar}>Explorar livremente →</button></div>
  </section>
}

// Cartão que mantém a hipótese do aluno à vista durante as missões.
export function Aposta({ tema, resposta }) {
  const p = PREVISOES[tema]
  return <p className="aposta">
    {resposta === null
      ? 'Você não registrou uma previsão. Tudo bem: as missões mostram o caminho.'
      : <>Sua aposta para “{p.pergunta}”: <b>{p.opcoes[resposta]}</b>. As missões vão testar isso.</>}
  </p>
}

export function Reflexao({ tema, resposta }) {
  const p = PREVISOES[tema]
  return <aside className="reflexao" aria-label="Comparação com sua previsão">
    <p className="eyebrow">DA PREVISÃO À EXPLICAÇÃO</p>
    {resposta !== null && <p><b>Sua previsão:</b> {p.opcoes[resposta]} <span>{resposta === p.correta ? '✓ Confirmada neste caso.' : 'Vamos rever essa hipótese.'}</span></p>}
    <p>{p.explicacao}</p>
  </aside>
}
