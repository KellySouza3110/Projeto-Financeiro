# AGENTS

## Sobre o projeto
Aplicativo de controle financeiro simples com backend em Python + Flask e banco SQLite, e frontend em HTML/CSS/JavaScript puro.

## Principais tecnologias
- Python 3
- Flask
- SQLite
- HTML5
- CSS3
- JavaScript (vanilla)
- PT-BR para rótulos, mensagens e comentários

## Estrutura
- `backend/app.py` — API REST principal com endpoints para:
  - `/receitas`
  - `/gastos`
  - `/cartao`
  - `/investimentos`
  - `/metas`
  - `/dashboard`
- `backend/database.py` — logica de conexão SQLite e criação de tabelas
- `frontend/index.html` — interface estática principal
- `frontend/script.css.js` — contém o JavaScript do frontend
- `frontend/style.js.css` — contém o CSS do frontend

## Como executar
1. Inicie o backend:
   - `python backend/app.py`
2. Abra `frontend/index.html` no navegador
3. O frontend espera o backend em `http://localhost:5000`

## Observações importantes para agentes
- O projeto usa nomes, mensagens e comentários em português.
- O frontend não é servido pelo Flask; é um conjunto de arquivos estáticos abertos diretamente no navegador.
- A aplicação espera JSON no corpo de POSTs e retorna JSON nas respostas.
- O banco de dados é `backend/financeiro.db` e as tabelas são criadas em `database.py`.

## Potenciais armadilhas
- `index.html` referencia `style.css` e `script.js`, mas os arquivos no repositório têm nomes reais `style.js.css` e `script.css.js`.
- Mantenha a API consistente com os nomes de campos usados pelo frontend (`data`, `fonte`, `valor`, `observacao`, `categoria`, `descricao`, etc.).
- A regra de formatação de moeda é `pt-BR` com `BRL`.

## Quando estender o código
- Adicione rotas no backend em `backend/app.py` com cuidado para manter a lógica de conexão em `database.py`.
- Em mudanças no frontend, preserve a navegação via `mostrarSecao(...)` e os IDs de elementos usados pelo JavaScript.
- Se precisar corrigir o frontend, alinhe os nomes dos arquivos estáticos entre `index.html` e os arquivos reais.
