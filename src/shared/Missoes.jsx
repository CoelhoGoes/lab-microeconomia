import React, { useEffect, useState } from 'react'
import { usePersistido } from './persistencia.js'

// Missões cumpridas ficam cumpridas: o aluno segue mexendo nos controles depois,
// e desfazer o estado não deve apagar o que ele já descobriu.
// `cumpridas`: ids cujo predicado vale AGORA, calculados pelo tema.
export function useMissoes(tema, cumpridas) {
  const [feitas, setFeitas] = usePersistido(`microlab:${tema}:missoes`, [])
  const novas = cumpridas.filter(id => !feitas.includes(id))
  useEffect(() => {
    if (novas.length) setFeitas(atuais => [...new Set([...atuais, ...novas])])
  }, [novas.join(), setFeitas])
  return feitas
}

// Missões guiadas da etapa Experimentar. Em vez de "mexa à vontade", o aluno
// recebe tarefas curtas; cada uma é reconhecida por um predicado sobre o estado
// do laboratório (calculado fora daqui, no módulo de modelo do tema) e, ao ser
// cumprida, revela uma síntese que dá nome ao que ele acabou de ver.
//
// A navegação é livre: todas as missões ficam visíveis e a próxima é destacada.
// Só a próxima abre seus controles; as outras abrem com um clique, para o painel
// não empurrar o laboratório para fora da tela.
//
// missoes: [{ id, texto, dica, sintese, conteudo? }]
//   conteudo — controle próprio da missão (pergunta, gráfico), mostrado enquanto
//              ela não foi cumprida.
// feitas:  ids das missões cumpridas.
export default function Missoes({ missoes, feitas, aoConcluirTodas }) {
  const [dicas, setDicas] = useState({})
  const [abertas, setAbertas] = useState({})
  const proxima = missoes.find(m => !feitas.includes(m.id))?.id
  return (
    <div className="metas missoes">
      <div className="metas-topo">
        <span className="market-label">MISSÕES</span>
        <span className="metas-contador">{feitas.length} de {missoes.length}</span>
      </div>
      <p className="metas-intro">
        Cumpra as missões usando o laboratório. Cada uma mostra uma parte do conceito.
      </p>
      <ul>
        {missoes.map((m, i) => {
          const feita = feitas.includes(m.id)
          return (
            <li key={m.id} className={`meta ${feita ? 'feita' : ''} ${m.id === proxima ? 'atual' : ''}`}>
              <span className="meta-check" aria-hidden="true">{feita ? '✓' : i + 1}</span>
              <div>
                {m.id === proxima && <span className="missao-proxima">PRÓXIMA</span>}
                <b>{m.texto}</b>
                {feita
                  ? <p className="missao-sintese">{m.sintese}</p>
                  : m.id !== proxima && !abertas[m.id]
                    ? <button className="text-button missao-dica" onClick={() => setAbertas(a => ({ ...a, [m.id]: true }))}>Fazer esta agora</button>
                    : <>
                      {m.conteudo}
                      {dicas[m.id]
                        ? <small>Dica: {m.dica}</small>
                        : <button className="text-button missao-dica" onClick={() => setDicas(d => ({ ...d, [m.id]: true }))}>Preciso de uma dica</button>}
                    </>}
              </div>
            </li>
          )
        })}
      </ul>
      {feitas.length === missoes.length && aoConcluirTodas}
    </div>
  )
}
