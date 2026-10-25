# ✨ Rahman Shishir - Full Stack Developer Portfolio

Welcome to the source code of **Rahman Shishir's personal developer portfolio**! This is a modern, unified full-stack application built to showcase projects, skills, and experience. It uses an "Aurora glass" design (drifting aurora light, frosted glass cards, dark and light themes) that works from phones to wide screens, built with React and Tailwind CSS and paired with a backend powered by Express and MongoDB.

## 🚀 About the Project

This portfolio is meant to provide a smooth, immersive user experience. It serves as both a central hub for my work and a testament to modern web development practices.

The application has been unified for deployment on **Vercel**, migrating from a traditional PostgreSQL setup into a serverless **MongoDB** infrastructure. This ensures high availability, security, and extremely fast response times globally.

## 🛠 Tech Stack

### Frontend (`/portfolio-web`)
- **React (v19)** powered by **Vite** for incredibly fast local development and optimized production builds.
- **Tailwind CSS** for responsive, utility-first styling. Colors are CSS variables (design tokens) defined in `src/index.css`, together with shared UI classes (`.btn-primary`, `.chip`, `.input`, `.glass`, `.gradient-border`, ...).
- **Fonts**: Sora (headings), Inter (body) and JetBrains Mono (labels), loaded from Google Fonts in `index.html`.
- **Framer Motion** and CSS keyframes for subtle motion (aurora drift, entrance fades), all turned off for visitors who prefer reduced motion.
- **Project illustrations**: each work card gets an animated SVG illustration (`src/components/ProjectArt.jsx`), matched to the project's tag, title and description by `src/utils/projectArt.js`. There are 10 illustrations, and none repeats within each group of 10 cards (cards 1-10, 11-20, ...).
- **Mobile layout**: on phones each work card is a short row with a square illustration; tablets show 2 cards per row, laptops 3 and wide screens 4.
- **Lucide React** for UI icons.

### Editing content
All portfolio text (profile, about, skills, experience, education, services, contact details) lives in
`portfolio-web/src/data/profile.js`, so you can update content without touching components.
Projects and blog posts come from the API and are managed in the admin dashboard (`/#admin`).

### Backend (`/portfolio-backend`)
- **Node.js** & **Express** as the core web framework.
- **MongoDB** & **Mongoose** for NoSQL data storage and schema modeling.
- **JWT (JSON Web Tokens)** for stateless authentication.
- **Resend** for handling reliable contact form email delivery.
- Security and optimization middleware using **Helmet**, **Bcryptjs**, and **Express-rate-limit**.

---

## 💻 Getting Started Locally

To run this application locally, you will need Node.js and an active MongoDB database URI.

### Prerequisites

- Node.js (>=18.x recommended)
- MongoDB Cluster or Local Server instance

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Setup environment variables:**
   - Copy `.env.example` to `portfolio-backend/.env` (the server loads `.env` from its own folder).
   - Fill in your `MONGODB_URI`, `JWT_SECRET`, `ADMIN_KEY` and `RESEND_API_KEY`.
   - `SEED_ADMIN_PASSWORD` is only needed when running `scripts/seed_mongo.js` to create the `admin` account.
   - Never commit `.env` files; in production set these values in your hosting provider's environment settings.

3. **Install Dependencies:**
   Install dependencies for both workspaces:
   ```bash
   # Install frontend dependencies
   cd portfolio-web
   npm install

   # Install backend dependencies
   cd ../portfolio-backend
   npm install
   ```
---

## ☁️ Deployment

This project is fully optimized for **Vercel**. Instead of running a traditional long-lived server, the backend handles API calls as **Vercel Serverless Functions**. The `vercel.json` configuration natively manages all routes and redirects.

Simply import the repository into your Vercel dashboard and the platform will handle the rest!

## 📄 License & Contact

This project was built to demonstrate full-stack capabilities, architecture decisions, and modern interactive UI choices. Feel free to explore the code, experiment with it, and borrow concepts.

