# 10 · Custos, receitas e resultado

Base principal: aula 12 (05/11/2026). A planilha Teoria da Firma_Custos_Receitas e Break-Even é complemento da mesma aula e não um módulo separado. Texto próprio e dados de exercício, sem redistribuição dos arquivos originais.

## Modelo mensal
CT = CF + CV; CV = CVu × Q; RT = P × Q; lucro = RT − CT.
Equilíbrio em quantidade: CF/(P − CVu), com margem positiva.
Equilíbrio em receita: CF/[(RT − CV)/RT], equivalente a CF/(margem unitária/preço) no modelo linear.
Lucratividade = lucro/receita × 100; rentabilidade = lucro/investimento × 100; prazo simples = investimento/lucro por período.

Preço e custo variável unitário constantes, todas as unidades produzidas são vendidas. Modelo simplificado com todos os custos incluídos no CT e resultado tratado como lucro líquido. Não há tributos separados nem desconto temporal. Todos os indicadores do simulador usam o mês; as questões anuais identificam explicitamente o ano.

## Complemento da planilha
Custos - Exercício: Q = 10,14,21,27,29,30; CF = 10; CV = 20,24,30,39,50,57. Calcular CT, custos médios e marginal pelo intervalo real de Q. A primeira marginal fica indefinida por falta de linha anterior. O gabarito original usa outros dados, portanto não foi copiado.

Receitas - Exercício: preços de 1 a 10 e Q = 20 − 2P. Receita média indefinida com Q=0; não reproduzir o erro DIV/0 do arquivo. Esta tabela é outro cenário e não determina a demanda do simulador linear.

## Cobertura
Simulação de resultado, gráfico de RT e CT, ponto de equilíbrio, margens, indicadores de retorno, tabela de custos preenchível com conferência por célula, tabela de receitas e casos de aplicação. Margem não positiva e ausência de lucro recebem mensagens explícitas, sem Infinity/NaN. O prazo simples não é uma projeção de fluxo de caixa real.

Sem custo fixo, margem unitária nula equilibra todos os volumes; margem negativa equilibra apenas a origem. Esses limites recebem mensagens próprias.
