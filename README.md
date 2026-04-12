# ✨ Rahman Shishir - Full Stack Developer Portfolio

Welcome to the source code of **Rahman Shishir's personal developer portfolio**! This is a modern, unified full-stack application built to showcase projects, skills, and interactive experiences. It features a highly animated 3D interface using Three.js and Framer Motion, paired with a robust and scalable backend architecture powered by Express and MongoDB.

## 🚀 About the Project

This portfolio is meant to provide a smooth, immersive user experience. It serves as both a central hub for my work and a testament to modern web development practices.

The application has been unified for deployment on **Vercel**, migrating from a traditional PostgreSQL setup into a serverless **MongoDB** infrastructure. This ensures high availability, security, and extremely fast response times globally.

## 🛠 Tech Stack

### Frontend (`/portfolio-web`)
- **React (v19)** powered by **Vite** for incredibly fast local development and optimized production builds.
- **Three.js** (`@react-three/fiber`, `@react-three/drei`) for engaging, performant 3D experiences.
- **Framer Motion** for smooth, complex micro-animations and seamless page transitions.
- **Tailwind CSS** for responsive, utility-first styling.
- **Lucide React** for beautiful UI icons.

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
   - Copy `.env.example` to `.env` in the root folder.
   - Fill in your `MONGODB_URI`, `JWT_SECRET`, and `RESEND_API_KEY`.

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

