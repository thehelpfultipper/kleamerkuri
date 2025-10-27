<p align="center">
  <img src="./src/assets/profile-header.webp" alt="Klea Merkuri Portfolio Header">
</p>

<br />

<h1 align="center">Klea Merkuri - Modern React Developer Portfolio</h1>
<p align="center">
  A professional, performant, and SEO-optimized portfolio featuring a custom AI assistant powered by the Google Gemini API.
</p>
<p align="center">
  <a href="https://thehelpfultipper.com/kleamerkuri/" target="_blank">
    <strong>View Live Demo »</strong>
  </a>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white" alt="Bootstrap 5">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white" alt="Google Gemini">
    <img src="https://img.shields.io/github/license/thehelpfultipper/kleamerkuri" alt="License">
</p>

<br />

This repository contains the source code for my personal portfolio website. It's designed to showcase my skills in modern frontend development, from creating pixel-perfect, responsive UIs to integrating advanced features like a real-time AI chatbot. The entire project is built with a focus on clean code, performance, and an exceptional user experience.

<br />

## ✨ Key Features

- **Interactive AI Assistant**: Engage with a custom-trained chatbot (powered by Google Gemini) that can answer questions about my skills, projects, and experience.
- **Dynamic Project Showcase**: Projects are displayed in a clean grid and feature detailed modals with key achievements, tech stacks, and live links.
- **Light & Dark Mode**: A sleek, user-configurable theme toggle for comfortable viewing in any lighting condition.
- **Fully Responsive Design**: Meticulously crafted with Bootstrap 5 to ensure a seamless experience on all devices, from mobile phones to desktops.
- **Performance Optimized**: Lazy loading for components like the chatbot and efficient state management ensure fast load times and a smooth user experience.
- **Clean, Modern UI/UX**: A professional and aesthetically pleasing design with subtle animations and a focus on readability.

## 🤖 Featured Highlight: The AI Chatbot

To create a more engaging and interactive experience beyond a static portfolio, I developed a custom AI assistant directly integrated into the site. The goal was to build a tool that was fast, intelligent, and could provide real value to visitors like recruiters and fellow developers.

This chatbot allows you to **ask questions about my background, projects, and skills** and receive meaningful, context-aware responses based on my portfolio's content.

### How It Works (Key Technologies):

Getting this working involved several modern web development and AI concepts:

- **Structured Content:** My portfolio information was organized into a uniform JSON structure and grouped into relational chunks for efficient processing. AI models perform better with concise, organized input.
- **Supabase Backend:** I used Supabase for its **`pgvector` extension** to store vector embeddings and perform fast similarity searches, and its **Edge Functions** for serverless backend logic.
  - An **RPC function (`match_portfolio_content`)** in the database handles similarity search, finding content relevant to your query based on its vector embedding. This significantly speeds up retrieval.
- **Vector Embeddings:** Portfolio content and user queries are converted into numerical "embeddings" where similar meanings are close together. This enables **semantic search**, allowing the chatbot to understand different ways of asking the same question, moving beyond simple keyword matching. The vector dimension must **exactly match** what the AI model outputs and what Supabase expects.
- **Google Gemini:** After encountering issues with Hugging Face (availability, rate limits), I switched to Google Gemini, which was stable and developer-friendly. Gemini generates the final responses based on your query and relevant content found via the similarity search.
- **Server-Sent Events (SSE):** To make the experience feel fast and responsive, Gemini's responses are **streamed back to the frontend in real-time** using SSE. This creates a "typing" effect.
- **Frontend (React/Gatsby):** Built with React, the chatbot incorporates performance optimizations like `React.memo` for individual messages, `useCallback` for event handlers, and `useMemo` for the message list to ensure smooth performance. The entire component is also lazy-loaded.

This approach resulted in a solution that is **fast, accurate, cost-effective** (running within free tiers), and low-maintenance.

## 🛠️ Tech Stack

This project was built using a modern, scalable, and maintainable technology stack.

- [Gatsby](https://www.gatsbyjs.com/): A modern React-based framework for building fast and efficient websites.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [GraphQL](https://graphql.org/): A query language for APIs used to query data in Gatsby sites.
- Vector Embeddings / Semantic Search
- Supabase (for pgvector, Edge Functions, RPC Functions)
- Google Gemini API Integration
- Server-Sent Events (SSE)
- React Performance Optimizations (useCallback, useMemo, React.memo, Lazy Loading)
- JavaScript/TypeScript (full-stack or backend focus)

## 👋 Contact

Thanks for stopping by! Feel free to connect with me:

- **LinkedIn**: [linkedin.com/in/kmerkuri97](https://www.linkedin.com/in/kmerkuri97)
- **GitHub**: [@thehelpfultipper](https://github.com/thehelpfultipper/)
- **Blog**: [The Helpful Tipper](https://thehelpfultipper.com/)

Thanks for stopping by!
