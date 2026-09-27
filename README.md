<p align="center">
  <img src="./src/assets/profile-header.webp" alt="Klea Merkuri Portfolio Header">
</p>

<br />

<h1 align="center">Klea Merkuri — Product Engineer Portfolio</h1>
<p align="center">
  A Gatsby site for design systems, interactive web, and applied AI — with Eve, a RAG copilot that opens matching work from the portfolio.
</p>
<p align="center">
  <a href="https://thehelpfultipper.com/kleamerkuri/" target="_blank">
    <strong>View Live Demo »</strong>
  </a>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/Gatsby-5-663399?logo=gatsby&logoColor=white" alt="Gatsby">
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white" alt="Bootstrap 5">
    <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white" alt="Google Gemini">
    <img src="https://img.shields.io/github/license/thehelpfultipper/kleamerkuri" alt="License">
</p>

<br />

This is the source for my personal site. I'm a software engineer in Los Angeles at Finance of America, working where product, design, and systems meet — design-system infrastructure, polished interfaces, and the tooling behind them. Before that, at Experian, I led a headless Gatsby migration across 5,000+ blog articles (about 20% faster load times) and built interactive WebGL/Canvas work.

The site is organized around that focus: public web, design systems, interactive experiences, and applied AI. Selected work, shipped tools (including VersoID on iOS and Android), writing on [The Helpful Tipper](https://thehelpfultipper.com/), and experience live on the homepage. Eve sits with them as a first-class way to ask one question and get the matching case study, demo, or write-up.

<br />

## ✨ Key Features

- **Ask Eve (Portfolio Copilot)**: A homepage discovery experience. Starter prompts cover recent work, frontend, design systems, AI tooling, role fit, and contact. Eve retrieves from portfolio embeddings and opens the matching project plus demo or write-up links.
- **Selected Work**: Featured case studies with impact lines, stack, and detail modals — from interactive visual storytelling to RAG and local-AI products.
- **Shipped Tools**: Products I actually use, including VersoID, Chrome extensions, and developer utilities.
- **Writing**: Recent posts from The Helpful Tipper on AI workflows, performance, and developer tooling.
- **Experience & About**: Current FOA frontend/design-system ownership, Experian Gatsby/WebGL work, and UCLA Economics background.
- **Light & Dark Mode**: A user-configurable theme that respects the system preference.
- **Fully Responsive**: Built with Bootstrap 5 for a consistent layout from mobile to desktop.
- **Performance**: Lazy-loaded chat, memoized message rendering, and static generation via Gatsby.

## 🤖 Featured Highlight: Eve

Eve is built into the homepage as a portfolio-native discovery surface, not a floating widget. You ask one thing — a starter prompt or your own question — and Eve opens the matching work from this site. Role fit accepts a job description first, then compares it against the same portfolio data.

Under the hood it is still a RAG assistant over structured professional content:

- **Structured Content:** Portfolio information is organized as JSON and grouped into relational chunks. AI models perform better with concise, organized input.
- **Supabase Backend:** **`pgvector`** stores embeddings for similarity search. **Edge Functions** run the serverless chat path. An **RPC (`match_portfolio_content`)** finds content relevant to the query from its vector embedding.
- **Vector Embeddings:** Content and queries become numerical embeddings so similar meanings sit close together. That enables **semantic search** instead of keyword matching. The vector dimension must **exactly match** the model output and what Supabase expects.
- **Google Gemini:** Gemini writes the response from the query plus retrieved context, and uses **function calling** to query structured professional data (projects, experience, links).
- **Server-Sent Events (SSE):** Responses **stream** to the frontend so answers appear incrementally.
- **Frontend (React/Gatsby):** The Ask Eve section presents matching work cards and action links. Message rendering uses `React.memo`, `useCallback`, and `useMemo`. The floating chat path stays lazy-loaded.

The result is **fast, accurate, and cost-effective** (free-tier friendly) without a separate CMS.

## 🛠️ Tech Stack

- [Gatsby](https://www.gatsbyjs.com/) — static React site with GraphQL data layer
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap 5](https://getbootstrap.com/) + Sass
- [GraphQL](https://graphql.org/) — Gatsby page and component queries
- Supabase — `pgvector`, Edge Functions, RPC
- Google Gemini — generation and function calling
- Server-Sent Events (SSE) — streamed replies

## 👋 Contact

- **LinkedIn**: [linkedin.com/in/kmerkuri97](https://www.linkedin.com/in/kmerkuri97)
- **Blog**: [The Helpful Tipper](https://thehelpfultipper.com/)
