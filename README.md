# MicroLab

Laboratório interativo de **microeconomia**. Cada conceito vira um experimento manipulável:
o aluno move controles, vê as curvas e as métricas responderem na hora, e lê uma
interpretação em texto do cenário que acabou de criar.

Acompanha dez temas, de custo de oportunidade à teoria da firma. O mapa inicial mostra o progresso de cada experiência.

Cada tema segue **Prever → Experimentar → Entender → Aplicar**, com opção de exploração livre. Os seis laboratórios anteriores foram preservados e adaptados ao novo percurso.

Novos temas: bens públicos e riscos, tributação, produção e rendimentos, custos/receitas e resultado. A planilha da aula 12 complementa apenas o último tema.

O progresso fica no navegador (localStorage), sem conta ou servidor de dados. Uma interação real é necessária para registrar a etapa de experimentação; as aplicações exigem resolver os casos.

---

## Requisitos

- **Node.js 20.19+** ou **22.12+** (exigência do Vite 8)
- npm

Verifique o que você tem:

```bash
node -v
```

## Rodando localmente

```bash
npm install
```

```bash
npm run dev
```

O Vite sobe em `http://localhost:5173` e abre com Fast Refresh: ao editar um componente, o
estado dos sliders é preservado em vez de a página recarregar inteira.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Testes dos modelos e avaliadores com o runner nativo do Node |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build gerado |

## Estrutura

```
src/
  main.jsx        casca da página e navegação por abas entre os eixos
  labs/           um módulo por eixo
  shared/         modelo econômico, gráfico e controles reutilizados pelos labs
  styles.css      folha de estilo única
```

O modelo econômico (curvas, equilíbrio, elasticidades) vive em `src/shared/modelo.js`,
separado dos componentes que o desenham. Nenhum lab reimplementa o que já está em `shared/`.

## Se o build falhar

Sintomas: `sh: 1: vite: Permission denied`, ou erro ao carregar binding nativo de `rolldown`
ou `lightningcss`.

Causa: um `node_modules/` trazido de outra plataforma (o repositório já carregou binários
win32 versionados por engano). Correção:

```bash
rm -rf node_modules && npm install
```

## Mais

- **[CLAUDE.md](CLAUDE.md)** — convenções de código, modelagem econômica e commits
- **[TODO.md](TODO.md)** — pendências abertas
