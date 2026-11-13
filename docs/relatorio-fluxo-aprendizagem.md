# Relatório — fluxo de aprendizagem do MicroLab

*12/11/2026 · análise após a apresentação ao professor*

Lente dupla: **professor de microeconomia** (o aluno sai sabendo o conceito?) e **UX** (o aluno
sabe, a cada tela, o que fazer e por quê?). Base: leitura do código (`shared/Previsao.jsx`,
`shared/Jornada.jsx`, `labs/oportunidade.jsx`, `labs/oportunidade.js`, `main.jsx`) e percurso real
do módulo 1 no navegador.

---

## 1. Resumo

O formato Prever → Experimentar → Entender → Aplicar é bom no papel, mas hoje cada etapa é uma
**ilha**: nenhuma delas prepara a seguinte. O aluno responde uma pergunta sem receber retorno,
cai num painel de controles sem tarefa, só depois lê o que significavam as métricas que já
manipulou, e no fim resolve exercícios com o laboratório antigo ainda aberto em cima. As quatro
críticas do professor têm a mesma raiz: **falta de fio condutor entre as etapas**.

A correção proposta não troca as quatro etapas — muda o que acontece **dentro** e **entre** elas:

| Hoje | Proposto |
|---|---|
| Pergunta solta, sem contexto | **Situação** narrada + previsão |
| "Testar minha previsão" leva a controles sem tarefa | **Missões guiadas** que testam exatamente a previsão |
| Explicação longa só no fim | **Micro-sínteses** logo após cada missão + síntese curta no fim |
| Aplicar com o lab antigo visível | Aplicar **sozinho**, com feedback ao conferir |

---

## 2. Diagnóstico do fluxo atual

### 2.1 Prever — "enunciados pouco claros"

- O caso é comprimido em uma frase (`shared/Previsao.jsx:4`): três usos, três valores e a decisão
  na mesma linha. Não há personagem, não há "por quê" — o aluno lê números, não uma situação.
- A pergunta usa o conceito antes de apresentá-lo: *"Qual retorno você sacrifica?"* pressupõe que
  o aluno já pense em "sacrifício" como custo.
- O valor "R$ 420/mês" da loja é ambíguo: é faturamento ou lucro? Uma loja tem custos; o aluguel
  não. Um aluno atento trava aqui — e está certo em travar.
- "Alugar" e "arrendar" são quase sinônimos para quem está começando; parece a mesma opção duas
  vezes.
- Ao clicar "Testar minha previsão" o aluno **não recebe retorno nenhum** (`Jornada.jsx:29`): a
  conferência só aparece na etapa Entender. Previsão sem confronto imediato vira um formulário
  qualquer.

### 2.2 Experimentar — "manipulação sem instrução"

- A única orientação do módulo 1 é *"Ajuste o retorno mensal de cada alternativa e veja a decisão
  mudar de lado"* (`oportunidade.jsx:170`). Não diz **o que procurar** nem **quando parar**.
- As métricas "Custo de oportunidade" e "Ganho líquido" aparecem **antes** de serem definidas —
  a definição está só na etapa seguinte.
- A etapa conta como concluída com **qualquer clique** (`oportunidade.jsx:167`), então o
  progresso mente: marca "feito" sem que nada tenha sido aprendido.
- O mesmo padrão aparece nos módulos novos: em `producao.jsx` há uma boa dica ("Compare 3 → 4,
  7 → 8 e 8 → 9") mas como texto de rodapé, não como tarefa verificável.

### 2.3 Entender — "a explicação vem tarde e quebra a imersão"

- A explicação do módulo 1 tem seis parágrafos e introduz **dois assuntos que o aluno não
  experimentou**: fronteira de possibilidades de produção e ganhos com a troca
  (`oportunidade.jsx:125-158`). O aluno sai do lab e cai num texto de livro sobre outra coisa.
- A retomada da previsão ("✓ Confirmada neste caso") é boa, mas chega duas telas depois da
  pergunta.

### 2.4 Aplicar

- No módulo 1 o laboratório inteiro continua visível acima dos exercícios
  (`oportunidade.jsx:166`) e a "Leitura do cenário" no rodapé descreve o **terreno do lab**, não os
  casos que o aluno está resolvendo. Dois cenários na mesma tela.

### 2.5 Navegação geral

- A aba inicial é **Produção (tema 9)**, não o tema 1 (`main.jsx:36`): quem rola a página a
  partir do topo abre o curso pelo meio.

---

## 3. Módulo 1 — "nenhuma das respostas sai certa"

**O cálculo está correto.** Os 57 testes passam, e no navegador uma rodada com três casos aceitou
as três respostas certas. Ou seja, o problema não é aritmética do código — é **o que o código
considera certo**, mais dois problemas de interação. Três causas prováveis:

1. **Casos economicamente incoerentes (causa mais provável).** O gerador sorteia usos de
   *recursos diferentes* no mesmo caso (`oportunidade.js:36-71`). Caso real gerado na verificação:

   > Opções: aplicar o dinheiro na poupança (R$ 120); alugar o terreno (R$ 200); arrendar a área
   > para plantio (R$ 300); trabalhar como freelancer no sábado (R$ 240). Escolheu poupança.

   O app responde R$ 300. Mas aplicar dinheiro não impede alugar o terreno nem trabalhar no
   sábado — não são alternativas excludentes. **O aluno que raciocina certo é marcado como
   errado**, e o professor, olhando de fora, vê respostas erradas. Isso contradiz a própria
   regra do modelo ("o recurso só pode ir para um uso", `oportunidade.js:3-4`).
2. **Feedback dispara a cada tecla** (`oportunidade.jsx:305-310`). Para responder 420, o aluno digita
   "4" e já vê "✗ Olhe só as alternativas…". Parece que tudo está errado antes de terminar.
3. **Campo `type="number"` recusa "R$ 380" e "380,00"** em parte dos navegadores: a resposta
   vira vazia e nada é avaliado.

Além disso, no lab, o "Ganho líquido" (que é o lucro econômico da escolha) com status "Vale a
pena" para R$ 40 confunde quem ainda não separou custo contábil de custo econômico — por isso as
respostas do lab "ficam confusas".

> **A confirmar com o professor:** qual tela ele viu dando respostas erradas — a previsão, o lab
> ou os casos sorteados? A hipótese 1 explica os casos sorteados; se foi outra tela, há outra
> causa a investigar.

---

## 4. Fluxo proposto

Princípio-guia: **cada etapa termina com uma pergunta que a próxima responde.** O aluno nunca
chega a uma tela sem saber por que está ali.

```
SITUAÇÃO ─► PREVER ─► INVESTIGAR (missões) ─► CONCLUIR ─► APLICAR ─► FECHAR
  história    hipótese    tarefa→feedback→       síntese      casos novos   o que levo
  com gente   registrada  micro-síntese (×2-3)   curta        sem o lab     + próximo tema
```

### 4.1 Situação + Prever

- **Situação em 3-4 linhas** com personagem e motivo: "Ana herdou um terreno e precisa decidir o
  que fazer com ele neste ano…". Números com significado explícito ("lucro mensal, já descontados
  os custos").
- **Pergunta em linguagem do dia a dia**, sem o termo técnico: "Se Ana abrir a loja, de quanto
  dinheiro ela está abrindo mão?".
- Depois de responder: **retorno imediato e neutro** — "Anotado. Você apostou em R$ 620. Vamos
  testar no laboratório." A hipótese fica visível num cartão fixo durante toda a investigação.

### 4.2 Investigar — missões guiadas

Substitui o "mexa à vontade" por **2 a 3 missões curtas**, cada uma com:

| Elemento | Exemplo (módulo 1) |
|---|---|
| Tarefa clara, um verbo | "Escolha o uso que dá mais dinheiro para Ana." |
| Verificação automática | predicado sobre o estado (padrão já usado em `metas-equilibrio.js`) |
| Dica se travar | aparece após 2 tentativas ou 30 s |
| Micro-síntese ao concluir | 1-2 frases que **nomeiam** o que o aluno acabou de ver, apresentando o termo técnico nesse momento |

Só depois das missões a **exploração livre** é sugerida ("Agora mexa à vontade"). Métricas cujo
conceito ainda não foi apresentado ficam ocultas ou com rótulo "?" até a missão que as introduz.

A etapa só conta como concluída quando as missões forem cumpridas — não com um clique.

### 4.3 Concluir

- Retoma a previsão **no topo**: "Você apostou em R$ 620. O laboratório mostrou R$ 380. Por quê?".
- Síntese de **no máximo 3 parágrafos**, cada um ligado a uma missão feita. Conteúdo que o aluno
  não experimentou (no módulo 1: fronteira de produção e troca) **sai daqui** — vira missão
  própria ou fica para outro momento.

### 4.4 Aplicar

- Tela própria, **sem o laboratório** acima.
- Feedback **ao conferir** (botão), não a cada tecla. Campo numérico aceita "380", "R$ 380" e
  "380,00" — já existe `respostaNumerica` em `labs/firma.js` usado pelos temas novos.
- Errou? O feedback aponta **qual raciocínio** falhou ("você somou as alternativas"), não só "✗".

### 4.5 Fechar

- Um cartão "O que você leva deste tema" (2-3 frases) e o link para o próximo tema, explicando a
  conexão ("O custo de oportunidade volta no tema 2: cada real gasto com café é um real a menos
  para outra coisa").

---

## 5. Módulo 1 redesenhado (roteiro concreto)

| Etapa | O aluno vê | O aluno faz | Feedback |
|---|---|---|---|
| Situação | Ana, terreno, três usos com **lucro mensal**: loja R$ 420, aluguel para vizinho R$ 380, horta comunitária R$ 240 | lê | — |
| Prever | "Se Ana abrir a loja, de quanto ela abre mão?" (R$ 620 / R$ 380 / R$ 420 / R$ 0) | escolhe | "Anotado — vamos testar." |
| Missão 1 | lab com três barras | "Escolha o uso mais lucrativo." | ✓ + "Escolher é abrir mão das outras opções." |
| Missão 2 | aparece a métrica *Custo de oportunidade* | "Ana quer a loja. Clique na opção da qual ela realmente abre mão." | ✓ + "É só a **melhor** das abandonadas: ela não poderia alugar **e** fazer a horta ao mesmo tempo." |
| Missão 3 | aparece *Ganho econômico* | "Aumente o aluguel até a loja deixar de valer a pena." | ✓ + "Com aluguel ≥ R$ 420, a loja dá lucro no caixa mas perde para a alternativa." |
| Livre | todos os controles | explora | leitura do cenário (já existe) |
| Concluir | previsão × resultado, 3 parágrafos | lê | — |
| Aplicar | 3 casos sorteados, **todos com o mesmo recurso** (só terreno, só sábado, só dinheiro) | digita e confere | por caso, com diagnóstico do erro |

---

## 6. Aplicação aos dez temas

O que foi verificado a fundo foi o módulo 1; o módulo 9 foi lido por amostragem. Os outros oito
precisam da mesma auditoria. Checklist por tema:

- [ ] A situação tem personagem, motivo e unidades explícitas?
- [ ] A pergunta de previsão evita o termo técnico que o tema vai ensinar?
- [ ] Toda métrica visível no lab já foi apresentada (ou entra numa missão)?
- [ ] Há 2-3 missões com predicado verificável e micro-síntese?
- [ ] A explicação só fala do que o aluno experimentou?
- [ ] O Aplicar fica em tela própria e dá feedback ao conferir?
- [ ] Os casos gerados são coerentes com a teoria (não só com a fórmula)?

Do lado do código, a estrutura comporta isso sem refatoração grande: missões entram como
predicados puros (mesmo padrão de `metas-equilibrio.js`, testáveis com `npm test`) e a moldura
das missões sobe para `shared/`, consumida pelos dez labs.

---

## 7. Prioridade sugerida

| P | Item | Por quê |
|---|---|---|
| **P0** | Módulo 1: gerador com um recurso por caso, feedback ao conferir, campo que aceita "R$"/vírgula, lab fora do Aplicar | é o erro que o professor viu; o aluno certo hoje é marcado errado |
| **P0** | Abrir o site no tema 1, não no 9 | uma linha; o percurso começa pelo meio |
| **P1** | Moldura de missões em `shared/` + retorno imediato da previsão | resolve "manipulação sem instrução" para todos os temas |
| **P1** | Módulo 1 completo no novo fluxo (seção 5) | serve de piloto para validar com o professor |
| **P2** | Auditoria e migração dos outros nove temas pelo checklist | depois do piloto aprovado |

---

## 8. Decisões em aberto (precisam de resposta antes de implementar)

1. **Qual resposta o professor viu errada** no módulo 1 — previsão, lab ou casos sorteados?
2. **Fronteira de possibilidades de produção e troca** continuam no módulo 1 (como missão
   própria) ou saem do tema?
3. **Bloqueio entre etapas:** hoje a navegação é livre por decisão anterior. As missões
   pressupõem ordem — manter livre (com recomendação visual) ou exigir as missões antes do
   Concluir?
4. **Piloto:** fazer o módulo 1 inteiro primeiro e validar com o professor antes de mexer nos
   outros nove?
