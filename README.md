# Leajer Application

A modern request management system built with Next.js, TypeScript, and Tailwind CSS. Leajer helps teams track and manage requests with an intuitive interface and powerful features.

## Features

- 🔐 **Authentication System** - Secure user login and registration
- 📋 **Request Management** - Create, view, edit, and delete requests
- 📊 **Dashboard** - Overview of all requests with filtering and search
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark Mode** - Toggle between light and dark themes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iAmSherifCodes/leajer-frontend.git
   cd leajer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
leajer-app/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── signup/           # Registration page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── ...               # Other components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API service layer
├── styles/               # Global styles
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Deployment

The application is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.

**Live Demo**: [https://vercel.com/iamsherifcodes-projects/v0-leajer-application-build](https://vercel.com/iamsherifcodes-projects/v0-leajer-application-build)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
