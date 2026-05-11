# Student Performance Tracker 🎓

A modern, responsive web application designed for tracking student assignments, performance, and grades. Built with a React (Vite) frontend and an Express.js backend, featuring a premium UI with glassmorphism and smooth animations.

## 🌟 Features

- **Modern UI/UX**: Premium, responsive design utilizing Tailwind CSS v4 with glassmorphism effects, modern typography, and interactive hover animations.
- **Role-Based Workflows**:
  - **Teachers**: Can create new assignments, view all student submissions, grade assignments with feedback notes, and track overall student performance.
  - **Students**: Can view their pending tasks, submit homework with personal notes, and track their scores.
- **Interactive Dashboards**: Real-time data visualization using Recharts to display student performance metrics and progress.
- **RESTful API**: Custom backend built with Node.js and Express.js for managing the assignment lifecycle (Create, Submit, Grade, Delete).

## 🛠️ Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Recharts (Data Visualization)
- Axios & React Hot Toast

**Backend**
- Node.js
- Express.js
- CORS

**Deployment & Infrastructure**
- Vercel (Static Frontend + Serverless API Functions)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chogunlnwza/student-performance-tracker.git
   cd student-performance-tracker
   ```

2. **Start the Backend API**
   ```bash
   # Open a new terminal
   npm install   # (Run this in the root directory if dependencies are there, or inside backend folder)
   npm start     # Starts the Express server on port 3000
   ```

3. **Start the Frontend Application**
   ```bash
   # Open another terminal
   cd frontend
   npm install
   npm run dev   # Starts the Vite development server
   ```

## 🌐 Deployment on Vercel

This project is pre-configured for seamless deployment on **Vercel**. 
The included `vercel.json` handles the routing, ensuring that the React SPA (Single Page Application) works perfectly alongside the Express API.

- The frontend is built using `@vercel/static-build`.
- The backend API (`api/index.js`) is automatically deployed as Vercel Serverless Functions and accessible via the `/api/*` endpoint.
- All routing and fallback rules are handled automatically for React Router.

---
*Developed by Chogunlnwza*
