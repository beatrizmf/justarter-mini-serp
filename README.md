# mini-SERP · Justarter 2026

Uma mini cópia de uma página de resultados de busca, feita para exercitar os conteúdos das aulas de front-end:
**TypeScript 7, React 19 e Next.js 16 (Pages Router)**, e testes com **Jest e React Testing Library**.

O "banco de dados" é um JSON com **90 documentos fictícios** (`data/documents.json`) de cinco tipos: jurisprudência,
legislação, notícias, modelos de peças e doutrina. A busca ainda não mostra doutrina: esse é o exercício da aula 1.

Aqui não tem nenhuma solução. Os exercícios e o desafio são feitos neste projeto, e cada um tem um comando que confere
se você terminou.

## Como rodar

### GitHub Codespaces (recomendado)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/beatrizmf/justarter-mini-serp)

Clique no botão (ou, no repositório, **Code › Codespaces › Create codespace on main**). O ambiente sobe com Node 22 e já
roda o `npm install`. Depois, no terminal, rode `npm run dev` e clique em **Open in Browser** no aviso da porta 3000.

Quer guardar o que fez no seu GitHub? Faça commit e `git push`: o Codespace oferece criar um fork na sua conta.

### Na sua máquina

Precisa de **Git** e **Node 22** com npm.

```bash
git clone https://github.com/beatrizmf/justarter-mini-serp.git
cd justarter-mini-serp
npm install
npm run dev               # http://localhost:3000
```

### Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | sobe o projeto em modo de desenvolvimento |
| `npm run typecheck` | roda só o compilador do TypeScript |
| `npm test` / `npm run test:watch` | roda os testes (o `watch` roda de novo a cada mudança) |
| `npm run build` | build de produção: mostra quais páginas são estáticas (○), SSG (●) e SSR (ƒ) |
| `npm run verify:class-1` | confere o exercício da aula 1 |
| `npm run verify:class-2` | confere o exercício da aula 2 |
| `npm run verify:challenge` | confere o desafio do autocomplete |

A busca tem uma latência artificial de 400 ms para dar para ver a diferença entre SSR e CSR
(`SEARCH_LATENCY_MS=0 npm run dev` desliga).

## Onde está cada conceito

| Conceito | Onde ver |
|---|---|
| União discriminada, `Record`, tipo derivado | `src/types/document.ts` |
| Narrowing e `never` (checagem exaustiva) | `src/components/ResultCard.tsx`, `src/lib/assert-never.ts` |
| `unknown` e type guards (dado de fora) | `src/search/validate.ts` |
| `string \| string[] \| undefined` da query do Next | `src/search/params.ts` |
| Generics | `src/search/pagination.ts` (`pageItems<T>`) |
| Componente, props e composição | `src/components/cards/` (`CardShell` + um card por tipo) |
| Estado e input controlado | `src/components/SearchBar.tsx` |
| Rotas: o arquivo é a URL | `pages/` |
| SSR (`getServerSideProps`) | `src/serp/server.ts`, usado em `pages/busca.tsx` e `pages/<tipo>/busca.tsx` |
| SSG (`getStaticProps` + `getStaticPaths`) | `pages/documento/[id].tsx` |
| CSR (`useEffect` + `fetch`) | `pages/csr/busca.tsx` e `pages/api/search.ts` |
| Teste de unidade | `src/search/engine.test.ts`, `src/search/params.test.ts` |
| Teste de componente | `src/components/cards/JurisprudenceCard.test.tsx` |
| Mock e teste de integração | `src/serp/server.test.ts`, `tests/pages/csr-search.test.tsx` |
| Fábricas de dados para teste | `src/test/factories.ts` |

```
pages/                         rotas: o caminho do arquivo é a URL
  index.tsx                    /                          estática (gerada no build)
  busca.tsx                    /busca                     SSR, todos os tipos
  jurisprudencia/busca.tsx     /jurisprudencia/busca      SSR, só jurisprudência (idem legislacao, noticias, modelos-pecas)
  csr/busca.tsx                /csr/busca                 a mesma busca, renderizada no navegador (CSR)
  documento/[id].tsx           /documento/news-0005       rota dinâmica, uma página estática por documento (SSG)
  api/search.ts                /api/search                JSON, usado pela versão CSR
  api/suggestions.ts           /api/suggestions           JSON, para o desafio do autocomplete
src/
  types/document.ts            o modelo de dados: a união discriminada SearchDocument
  search/                      database (só no servidor), engine, pagination, params (URL ↔ tipos), validate, highlight
  serp/                        server.ts (getServerSideProps de cada SERP) e SerpPage.tsx
  components/                  SearchBar, KindFilter, SortSelect, ResultList, ResultCard, cards/...
verification/                  o que os comandos verify:* rodam (não precisa mexer)
data/documents.json            os documentos fictícios
```

## Exercício da aula 1: doutrina na busca

O banco tem 16 documentos de doutrina, e a busca descarta todos, porque o tipo não existe. Deixe o `npm run typecheck`
aberto num terminal: ele guia os passos.

1. **O tipo.** Em `src/types/document.ts`, crie a interface `Doctrine` (`kind: 'doctrine'`, mais `author`, `work`,
   `publisher` e `edition`, que é número) e inclua na união `SearchDocument`. O compilador passa a apontar 4 erros.
2. **Siga o compilador.** Em `src/types/document.ts`, o rótulo (`'Doutrina'`) e a rota (`'/doutrina/busca'`). Em
   `src/search/validate.ts`, o `case` da validação: quais campos uma doutrina válida precisa ter?
3. **O card.** Crie `src/components/cards/DoctrineCard.tsx`, usando o `CardShell` como os outros cards, e trate o caso
   `'doctrine'` no `ResultCard`. Mostre a obra, o autor, a editora e a edição no formato `3ª ed.`.
4. **A rota com SSR.** Crie `pages/doutrina/busca.tsx`, como as outras rotas de tipo. Abra
   `/doutrina/busca?q=usucapiao` e o "Exibir código-fonte": os resultados estão no HTML.

Pronto quando `npm run verify:class-1` mostrar tudo com ✓.

## Exercício da aula 2: testes

Os testes estão em `it.todo`, com dicas nos comentários. Troque cada `it.todo('...')` por `it('...', () => { ... })`.

1. **Unidade:** `src/search/pagination.test.ts`. Para ver o teste falhar, troque `Math.ceil` por `Math.floor` em
   `src/search/pagination.ts`, rode `npm test` e desfaça.
2. **Componente:** `src/components/KindFilter.test.tsx`. Procure pelo papel: `getByRole('link', { name })`.
3. **Mock:** `src/components/SortSelect.test.tsx`. O mock do `next/router` já está pronto.

Pronto quando `npm run verify:class-2` mostrar tudo com ✓. Além de rodar os seus testes, ele troca o código por versões
com bug (mutantes) e confere se os seus testes percebem.

## Desafio para quem quer se aprofundar: autocomplete

A barra de busca ainda não sugere nada. A rota `/api/suggestions?q=...` já existe e devolve `{ "suggestions": string[] }`.
Faça a `SearchBar` mostrar sugestões enquanto a pessoa digita:

- um hook `useSuggestions(query)` em `src/hooks/`, que chama a API **no navegador**;
- **debounce** de 300 ms, para não chamar a API a cada tecla, e nada com menos de 2 letras;
- descartar a resposta de uma busca antiga: flag `ignore` na limpeza do `useEffect`, como recomenda a
  [documentação do React](https://react.dev/learn/you-might-not-need-an-effect#fetching-data);
- uma lista (`role="listbox"`, com itens `role="option"`) abaixo do campo; clicar numa sugestão faz a busca;
- bônus: ↑ ↓ e Enter, um `useDebouncedValue<T>` genérico e testes com relógio falso (`jest.useFakeTimers`).

Pense: por que o autocomplete é CSR, se a SERP é SSR?

Pronto quando `npm run verify:challenge` mostrar tudo com ✓.

## Referências

- **TypeScript:** [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) · [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) · [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) · [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- **React:** [Your First Component](https://react.dev/learn/your-first-component) · [State](https://react.dev/learn/state-a-components-memory) · [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- **Next.js (Pages Router):** [Pages Router](https://nextjs.org/docs/pages) · [Rendering](https://nextjs.org/docs/pages/building-your-application/rendering) · [`getServerSideProps`](https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props) · [`getStaticPaths`](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths) · [Testes com Jest](https://nextjs.org/docs/pages/guides/testing/jest)
- **Testes:** [Jest](https://jestjs.io/docs/getting-started) · [Testing Library: queries](https://testing-library.com/docs/queries/about) · [user-event](https://testing-library.com/docs/user-event/intro) · [The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
