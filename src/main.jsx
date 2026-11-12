import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import LabOportunidade from './labs/oportunidade.jsx'
import LabConsumidor from './labs/consumidor.jsx'
import LabSubstitutos from './labs/substitutos.jsx'
import LabEquilibrio from './labs/equilibrio.jsx'
import LabElasticidades from './labs/elasticidades.jsx'
import LabEstruturas from './labs/estruturas.jsx'
import LabPublicos from './labs/publicos.jsx'
import LabTributacao from './labs/tributacao.jsx'
import LabProducao from './labs/producao.jsx'
import LabCustos from './labs/custos.jsx'

const TEMAS = [
  { id: 'oportunidade', titulo: 'Custo de oportunidade', grupo: 'Escolhas e mercados', verbo: 'Escolher', descricao: 'Compare alternativas e descubra o valor do que ficou para trás.', componente: LabOportunidade },
  { id: 'consumidor', titulo: 'Teoria do consumidor', grupo: 'Escolhas e mercados', verbo: 'Consumir', descricao: 'Da satisfação de cada unidade à decisão de quanto comprar.', componente: LabConsumidor },
  { id: 'demanda-oferta', titulo: 'Demanda e oferta', grupo: 'Escolhas e mercados', verbo: 'Relacionar', descricao: 'Distinga movimento na curva de deslocamento da curva inteira.', componente: LabSubstitutos },
  { id: 'equilibrio', titulo: 'Equilíbrio de mercado', grupo: 'Escolhas e mercados', verbo: 'Equilibrar', descricao: 'Provoque escassez ou excesso e acompanhe o ajuste do preço.', componente: LabEquilibrio },
  { id: 'elasticidades', titulo: 'Elasticidades', grupo: 'Escolhas e mercados', verbo: 'Comparar', descricao: 'Meça a intensidade da resposta e o efeito sobre a receita.', componente: LabElasticidades },
  { id: 'estruturas', titulo: 'Estruturas de mercado', grupo: 'Escolhas e mercados', verbo: 'Classificar', descricao: 'Investigue quem compra, quem vende e quem tem poder de mercado.', componente: LabEstruturas },
  { id: 'publicos', titulo: 'Bens públicos e riscos', grupo: 'Estado e sociedade', verbo: 'Cooperar', novo: true, descricao: 'Classifique bens, experimente contribuir e avalie um projeto arriscado.', componente: LabPublicos },
  { id: 'tributacao', titulo: 'Tributação', grupo: 'Estado e sociedade', verbo: 'Distribuir', novo: true, descricao: 'Compare o peso dos tributos, os preços relativos e a arrecadação.', componente: LabTributacao },
  { id: 'producao', titulo: 'Produção e rendimentos', grupo: 'Teoria da firma', verbo: 'Produzir', novo: true, descricao: 'Contrate trabalhadores e descubra quando o ganho adicional diminui.', componente: LabProducao },
  { id: 'custos', titulo: 'Custos, receitas e resultado', grupo: 'Teoria da firma', verbo: 'Decidir', novo: true, descricao: 'Encontre o ponto de equilíbrio e compare lucro e retorno do capital.', componente: LabCustos },
]

function lerProgresso() {
  return TEMAS.map((_, i) => {
    try { const p = JSON.parse(localStorage.getItem(`microlab:progresso:${i + 1}`)); return p && Number.isFinite(p.feitas) ? p : { feitas: 0, total: 4 } }
    catch { return { feitas: 0, total: 4 } }
  })
}

function App() {
  const [aba, setAba] = useState(() => TEMAS.some(t => t.id === location.hash.slice(1)) ? location.hash.slice(1) : 'producao')
  const [progresso, setProgresso] = useState(lerProgresso)
  const indice = TEMAS.findIndex(t => t.id === aba)
  const tema = TEMAS[indice]
  const passos = progresso.reduce((s, p) => s + p.feitas, 0)
  useEffect(() => {
    const atualizar = () => setProgresso(lerProgresso())
    const navegar = () => { const id = location.hash.slice(1); if (TEMAS.some(t => t.id === id)) setAba(id) }
    window.addEventListener('microlab:progresso', atualizar)
    window.addEventListener('storage', atualizar)
    window.addEventListener('hashchange', navegar)
    atualizar()
    return () => { window.removeEventListener('microlab:progresso', atualizar); window.removeEventListener('storage', atualizar); window.removeEventListener('hashchange', navegar) }
  }, [])
  function abrir(id) {
    setAba(id)
    history.replaceState(null, '', `#${id}`)
    document.getElementById('laboratorio').scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return <main className="microlab-jornada">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">µ</span> micro<span>lab</span></a><span className="course-pill">MICROECONOMIA · APRENDER FAZENDO</span><a className="atalho-mapa" href="#mapa">Mapa dos temas ↗</a></header>
    <section id="top" className="jornada-hero"><div><p className="eyebrow">MICROECONOMIA NA PRÁTICA</p><h1>Uma decisão.<br /><em>Muitas descobertas.</em></h1><p>Faça uma previsão, mude o cenário e descubra a economia por trás do resultado.</p><a className="button primary" href="#mapa">Escolher uma experiência <span>↓</span></a></div><aside className="hero-caderno"><span className="caderno-etiqueta">SEU PERCURSO</span><ol><li><b>01</b><span>Prever<small>O que você espera?</small></span></li><li><b>02</b><span>Experimentar<small>Mude uma condição.</small></span></li><li><b>03</b><span>Entender<small>Conecte resultado e teoria.</small></span></li><li><b>04</b><span>Aplicar<small>Resolva um novo caso.</small></span></li></ol><p>Exploração livre em todos os temas.</p></aside></section>
    <section className="mapa-section" id="mapa"><div className="mapa-heading"><div><p className="eyebrow">O MAPA DA DISCIPLINA</p><h2>Por onde você quer começar?</h2></div><div className="progresso-geral"><strong>{passos}<span> / 40 etapas</span></strong><p>Progresso salvo neste navegador</p><progress value={passos} max="40" aria-label="Progresso total" /></div></div>
      <div className="mapa-grid">{TEMAS.map((t, i) => <button key={t.id} className={`tema-card ${aba === t.id ? 'tema-ativo' : ''}`} onClick={() => abrir(t.id)} aria-pressed={aba === t.id}>
        <span className="tema-card-topo"><span>{String(i + 1).padStart(2, '0')} / {t.verbo}</span>{t.novo && <span className="selo-novo">NOVO</span>}</span><small>{t.grupo}</small><h3>{t.titulo}</h3><p>{t.descricao}</p><span className="tema-card-rodape"><span>{progresso[i].feitas === 4 ? '✓ Concluído' : `${progresso[i].feitas} de 4 etapas`}</span><span aria-hidden="true">↗</span></span><span className="tema-barra"><i style={{ width: `${progresso[i].feitas / 4 * 100}%` }} /></span>
      </button>)}</div>
    </section>
    <section className="lab-section jornada-lab" id="laboratorio"><div className="lab-heading"><div><p className="eyebrow">EXPERIÊNCIA {String(indice + 1).padStart(2, '0')} · {tema.grupo.toUpperCase()}</p><h2>{tema.titulo}</h2></div><p>{tema.descricao}</p></div>
      <nav className="troca-tema" aria-label="Escolher experiência"><label htmlFor="tema-atual">Tema atual</label><select id="tema-atual" value={aba} onChange={e => abrir(e.target.value)}>{TEMAS.map((t, i) => <option key={t.id} value={t.id}>{String(i + 1).padStart(2, '0')} · {t.titulo}</option>)}</select><a href="#mapa">Voltar ao mapa ↑</a></nav>
      {TEMAS.map(t => { const Lab = t.componente; return <div key={t.id} className={aba === t.id ? 'lab-painel' : 'lab-painel oculto'} hidden={aba !== t.id}><Lab /></div> })}
      <nav className="proximos-temas" aria-label="Navegar entre temas"><button className="text-button" disabled={indice === 0} onClick={() => abrir(TEMAS[indice - 1].id)}>← Tema anterior</button><button className="text-button" disabled={indice === TEMAS.length - 1} onClick={() => abrir(TEMAS[indice + 1].id)}>Próximo tema →</button></nav>
    </section><footer><span>MICROLAB <b>·</b> APRENDER FAZENDO</span><span>10 temas · Prever, experimentar, entender e aplicar</span></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
