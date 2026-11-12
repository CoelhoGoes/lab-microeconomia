# Preparação da apresentação

O roteiro atualizado cobre dez temas, quatro apresentadores e 20 minutos de fala, mais até 3 minutos de perguntas. A versão de 17 minutos está no roteiro.

## Antes de apresentar

- Execute `npm run build` e `npm test` na máquina da apresentação.
- Execute `npm run dev` e use o endereço informado pelo terminal; a porta pode variar.
- Abra uma janela anônima nova quando quiser iniciar sem o progresso do ensaio.
- Deixe o mapa dos temas aberto. A navegação atual usa Prever, Experimentar, Entender e Aplicar.
- Defina quem pilota o computador e faça um ensaio completo com cronômetro.
- Salve um print de cada comparação antes e depois. São o plano de reserva.
- Evite completar todos os desafios ou todas as células da tabela ao vivo.

## Distribuição

Pessoa 1: abertura e temas 1, 2 e 6. Pessoa 2: temas 3, 4 e 5. Pessoa 3: temas 7 e 8. Pessoa 4: temas 9 e 10 e fechamento. Cada uma tem 5 minutos. A quantidade de temas varia para compensar densidade conceitual, contas e operações na tela.

## Conferência dos exemplos

| Responsável | Configuração | Resultado esperado |
|---|---|---|
| 1 | Terreno, loja escolhida | custo de oportunidade R$ 380; ganho R$ 40 |
| 1 | Consumidor, preço R$ 9 e utilidades iniciais | 4 unidades; gasto R$ 36; excedente R$ 18 |
| 2 | Equilíbrio, preço inicial R$ 34 | excesso de oferta; ajuste em direção a aproximadamente R$ 24,86 |
| 2 | Demanda, preço R$ 20 para R$ 30 | elasticidade aproximadamente -0,63; receita de R$ 1.280 mil para R$ 1.320 mil |
| 3 | Sua contribuição R$ 8 e outras quatro em R$ 8 | saldo individual R$ 24,80; grupo R$ 124 |
| 3 | Sua contribuição zero e outras quatro em R$ 8 | saldo individual R$ 30,24; grupo R$ 119,20 |
| 4 | Produção, 3 para 4 trabalhadores | total 24 para 32; marginal 10 para 8 |
| 4 | Preço 10, CV unitário 4, CF 15.000 | equilíbrio em 2.500 unidades por mês |

Restaure os cenários ou recarregue a página antes do ensaio para retornar aos controles iniciais. O ajuste de mercado usa uma tolerância: o controle pode parar em R$ 25,0 enquanto a métrica mostra aproximadamente R$ 24,86.

## Se a demonstração falhar

Continue com os prints; outra pessoa verifica o servidor. Se necessário, use `npm run build` e `npm run preview` para servir a versão de produção. A ausência das fontes online muda a tipografia, mas não os cálculos. Não pare a apresentação para reinstalar dependências.

## Material

O [roteiro completo](roteiro.md) contém tempos, falas, demonstrações e cuidados de cada pessoa. O [PDF para compartilhar](material-quatro-pessoas.pdf) apresenta o mesmo conteúdo. Consulte também as [perguntas](perguntas.md).
