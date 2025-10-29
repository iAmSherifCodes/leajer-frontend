# Leajer

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://leajer.d3rgwmm3at09rc.amplifyapp.com/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, full-featured request management system that helps businesses efficiently track, organize, and manage requests with an intuitive interface and powerful features.

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - User registration, login, and session management
- 📋 **Request Management** - Full CRUD operations for request handling
- 📊 **Interactive Dashboard** - Real-time overview with advanced filtering and search
- 📈 **Analytics & Charts** - Visual insights with Recharts integration

### User Experience
- 📱 **Responsive Design** - Seamless experience across all devices
- 🎨 **Modern UI/UX** - Clean interface built with shadcn/ui components
- 🌙 **Dark/Light Mode** - Theme toggle for user preference
- ⚡ **Fast Performance** - Optimized with the latest Next.js 16 App Router

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Library** | shadcn/ui |
| **State Management** | React Context API |
| **Forms** | React Hook Form |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Deployment** | AWS Amplify |

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.0 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iAmSherifCodes/leajer-frontend.git
   cd leajer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **View the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
leajer-app/
├── app/                    # Next.js App Router directory
│   ├── dashboard/         # Dashboard pages and components
│   ├── owner-signup/     # Owner registration flow
│   ├── signup/           # User registration flow
│   ├── verify/           # Email verification pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Landing page or Sign in page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui base components
│   ├── forms/            # Form-specific components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── services/             # API service layer
├── types/                # TypeScript type definitions
├── public/               # Static assets (images, icons)
└── styles/               # Additional styling files
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript compiler check |

## 🌐 Deployment

The application is automatically deployed to **AWS Amplify** with continuous integration:

- **Live URL**: [https://leajer.d3rgwmm3at09rc.amplifyapp.com/](https://leajer.d3rgwmm3at09rc.amplifyapp.com/)
- **Auto-deploy**: Pushes to `leajer` branch trigger new deployments
- **Environment**: Production-ready with optimized builds

