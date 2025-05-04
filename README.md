<p align="center">
  <img src="./src/assets/profile-header.webp">
</p>

<h1 align="center">Klea Merkuri</h1>
<p align="center"><a href="https://thehelpfultipper.com/kleamerkuri/">Web Developer Portfolio</a></p>
<br /><br />
<small>
 <em>
        Updated with AI Chatbot EVE on May 3, 2025. Click <a href="https://thehelpfultipper.com/how-to-build-a-smart-custom-ai-chatbot/">this link for blog post</a>.
    </em>
<br />
    <em>
        Updated with portfolio v2 on Dec 31, 2024. Click <a href="https://thehelpfultipper.com/portfolios/v1/kleamerkuri/">this link for portfolio v1</a>.
    </em>
</small>
<br /><br />
Welcome! This portfolio showcases my projects, skills, and experience in web development. It is built using Gatsby, a modern React-based framework for building fast and efficient websites, and Material UI, a popular React UI framework for creating beautiful and responsive user interfaces. A key recent addition is the interactive AI Chatbot (called EVE), designed to provide visitors with a more dynamic and personal way to learn about my work.
<br /><br />

_Looking for project walkthroughs, tips, and other fun coding things? Check out [The Helpful Tipper blog](https://www.gatsbyjs.com/docs/gatsby-starters/)._

## Featured Highlight: The AI Portfolio Chatbot!

I wanted to move beyond static portfolio pages and create a truly interactive experience. Inspired by a desire to integrate AI into my work, I built a custom AI chatbot directly into this site. The core goals were clear: build a chatbot that was **fast, efficient, affordable (ideally free), and intelligent**.

This chatbot allows you to **ask questions about my background, projects, skills, and experience** and receive meaningful, intelligent responses based on my actual portfolio content. It's a technical demonstration that also adds a genuine layer of personality and engagement.

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

## Portfolio Features

- **Projects Showcase:** View a curated selection of my projects, including web applications, websites, and prototypes.
- **Skills Highlight:** Explore my skills and expertise in various web development technologies, frameworks, and tools.
- **About Me:** Learn more about me, my background, interests, and passion for web development.
- **Contact:** Reach out to me easily through resume info or by connecting with me on social media.

## Technologies Used

- [Gatsby](https://www.gatsbyjs.com/): A modern React-based framework for building fast and efficient websites.
- [Material UI](https://material-ui.com/): A popular React UI framework for creating beautiful and responsive user interfaces.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [GraphQL](https://graphql.org/): A query language for APIs used to query data in Gatsby sites.
- Vector Embeddings / Semantic Search
- Supabase (for pgvector, Edge Functions, RPC Functions)
- Google Gemini API Integration
- Server-Sent Events (SSE)
- React Performance Optimizations (useCallback, useMemo, React.memo, Lazy Loading)
- JavaScript/TypeScript (full-stack or backend focus)

Thanks for stopping by 👋
