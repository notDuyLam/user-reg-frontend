# User Registration Frontend

A modern user registration system built with Next.js 16, featuring React Hook Form validation, React Query for state management, and shadcn/ui components.

## Features

- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- ✅ **Form Validation**: React Hook Form with Zod schema validation
- 🔄 **API Integration**: React Query for efficient API state management
- 📱 **Responsive Design**: Mobile-first responsive layout
- 🚀 **Ready for Deployment**: Configured for Vercel deployment

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **API Client**: React Query + Axios
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see `API_DOCUMENTATION.md`)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Or create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx             # Home/landing page
│   ├── login/
│   │   └── page.tsx         # Login page
│   └── signup/
│       └── page.tsx         # Sign up page
├── components/
│   └── ui/                  # shadcn/ui components
├── config/
│   └── env.ts               # Environment configuration
├── lib/
│   ├── api.ts               # API client (Axios)
│   ├── utils.ts             # Utility functions
│   └── validations.ts       # Zod schemas
└── providers/
    └── query-provider.tsx   # React Query provider
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to a NestJS backend API. See `API_DOCUMENTATION.md` for complete API documentation.

### Environment Configuration

To change the API URL:

1. **Development**: Edit `.env.local`
2. **Production**: Set `NEXT_PUBLIC_API_URL` in Vercel environment variables

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your backend API URL
4. Deploy!

### Build for Production

```bash
npm run build
npm run start
```

## Features Overview

### Home Page

- Welcome landing page
- Navigation to Login and Sign Up

### Sign Up Page

- Email and password validation
- Real-time form validation
- API integration with React Query
- Success/error message handling
- Auto-redirect to login on success

### Login Page

- Email and password fields
- Form validation
- Mock success feedback
- Simulated login flow

## Form Validation

### Registration Requirements

- Email must be valid format
- Password must be:
  - At least 8 characters
  - Contain uppercase letter
  - Contain lowercase letter
  - Contain number (0-9)
  - Contain special character (@$!%\*?&#)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
