import React from 'react'

export const PREVISOES = {
  oportunidade: { caso: 'Você pode usar um terreno para abrir uma loja (R$ 420/mês), alugar (R$ 380) ou arrendar (R$ 240). Decide abrir a loja.', pergunta: 'Qual retorno você sacrifica ao escolher a loja?', opcoes: ['R$ 620: a soma das alternativas', 'R$ 380: a melhor alternativa abandonada', 'R$ 420: o retorno escolhido'], correta: 1, explicacao: 'O custo de oportunidade é a melhor alternativa abandonada: R$ 380. Não se somam usos que não poderiam acontecer ao mesmo tempo.' },
  consumidor: { caso: 'A satisfação adicional de cada unidade de café diminui. O preço de mercado cai, mantendo as preferências.', pergunta: 'O que você espera da quantidade comprada?', opcoes: ['Deve aumentar ou permanecer igual', 'Sempre cai', 'Depende apenas da oferta'], correta: 0, explicacao: 'Com preço menor, mais unidades podem valer a compra. No modelo discreto, a quantidade também pode permanecer igual até o próximo degrau.' },
  'demanda-oferta': { caso: 'O chá, substituto do café, ficou mais caro. O preço do café continua igual.', pergunta: 'O que acontece com a demanda por café?', opcoes: ['Move-se um ponto na mesma curva', 'A curva de demanda se desloca para a direita', 'A oferta necessariamente diminui'], correta: 1, explicacao: 'O preço de outro bem altera a demanda inteira. O movimento ao longo da curva acontece quando muda o preço do próprio café.' },
  equilibrio: { caso: 'Ao preço praticado, os consumidores querem comprar mais café do que as empresas oferecem.', pergunta: 'Qual pressão aparece sobre o preço?', opcoes: ['Alta', 'Baixa', 'Nenhuma, pois o mercado já está equilibrado'], correta: 0, explicacao: 'Há escassez: a quantidade demandada supera a ofertada. No modelo competitivo, isso pressiona o preço para cima.' },
  elasticidades: { caso: 'O preço sobe 10% e a quantidade vendida cai 20%.', pergunta: 'O que acontece com a receita total?', opcoes: ['Sobe porque o preço subiu', 'Cai porque a quantidade responde mais', 'Fica igual'], correta: 1, explicacao: 'A receita passa a 1,10 × 0,80 = 0,88 do valor inicial: queda de 12%. A reação da quantidade supera a do preço.' },
  estruturas: { caso: 'Há muitos compradores e apenas uma empresa oferecendo um produto sem substituto próximo, com barreiras à entrada.', pergunta: 'Como você classificaria esse mercado?', opcoes: ['Concorrência perfeita', 'Monopsônio', 'Monopólio'], correta: 2, explicacao: 'Uma única vendedora caracteriza monopólio. Uma única compradora caracterizaria monopsônio.' },
  publicos: { caso: 'A iluminação de uma rua beneficia também quem não contribuiu para financiá-la.', pergunta: 'Qual dificuldade pode surgir na contribuição voluntária?', opcoes: ['Todos deixam de ser beneficiados', 'Alguns esperam que os outros paguem', 'A luz só beneficia quem pagou'], correta: 1, explicacao: 'A dificuldade de excluir beneficiários cria incentivo a pegar carona. O retorno coletivo pode superar o incentivo individual a contribuir.' },
  tributacao: { caso: 'Duas pessoas ganham R$ 2.000 e R$ 10.000. Cada uma paga R$ 200 de um tributo hipotético.', pergunta: 'Em qual renda o tributo pesa mais proporcionalmente?', opcoes: ['Na renda de R$ 2.000', 'Na renda de R$ 10.000', 'O peso percentual é igual'], correta: 0, explicacao: 'R$ 200 representam 10% de R$ 2.000 e 2% de R$ 10.000. O valor absoluto igual tem peso relativo diferente.' },
  producao: { caso: 'Uma cafeteria mantém o espaço e os equipamentos fixos e contrata mais trabalhadores.', pergunta: 'A produção adicional de cada contratação cresce para sempre?', opcoes: ['Sim, sempre na mesma proporção', 'Não: pode cair, zerar e até ficar negativa', 'A produção total cai desde a primeira contratação'], correta: 1, explicacao: 'Com fatores fixos, a produtividade marginal pode começar a cair antes de a produção total cair. Marginal menor ainda pode ser positiva.' },
  custos: { caso: 'Uma empresa vende muito, mas também tem despesas fixas e variáveis.', pergunta: 'Ter faturamento alto garante lucro?', opcoes: ['Sim, faturamento e lucro são iguais', 'Não: é preciso comparar receita e custo total', 'Sim, se vender todas as unidades'], correta: 1, explicacao: 'Lucro é receita total menos custo total. O ponto de equilíbrio da firma ocorre quando os dois se igualam.' },
}

export default function Previsao({ tema, resposta, onResponder, onContinuar }) {
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
    <p className="tabela-ajuda">Sua previsão não vale nota. Você poderá compará-la com o resultado na etapa Entender.</p>
    <div className="jornada-acoes"><button className="button primary" disabled={resposta === null} onClick={onContinuar}>Testar minha previsão →</button>
      <button className="text-button" onClick={onContinuar}>Explorar livremente →</button></div>
  </section>
}

export function Reflexao({ tema, resposta }) {
  const p = PREVISOES[tema]
  return <aside className="reflexao" aria-label="Comparação com sua previsão">
    <p className="eyebrow">DA PREVISÃO À EXPLICAÇÃO</p>
    {resposta !== null && <p><b>Sua previsão:</b> {p.opcoes[resposta]} <span>{resposta === p.correta ? '✓ Confirmada neste caso.' : 'Vamos rever essa hipótese.'}</span></p>}
    <p>{p.explicacao}</p>
  </aside>
}
