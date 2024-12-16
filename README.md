# Matilda - Teacher Management Application

A comprehensive application for teachers to manage their classrooms, students, and create lesson plans using AI assistance.

## Features

- Teacher registration and profile management
- Classroom creation and management
- Student information management
- AI-powered lesson plan generation
- JSON Schema-based forms for structured data collection

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- Next.js 14 (Pages Router)
- Supabase (Authentication & Database)
- TypeScript
- Tailwind CSS
- React JSON Schema Form (@rjsf/core)
- OpenAI API (for lesson planning)

## Project Structure

```
matilda-2-app/
├── components/     # Reusable React components
├── pages/         # Next.js pages
├── styles/        # CSS and Tailwind styles
├── lib/          # Utility functions and configurations
├── types/        # TypeScript type definitions
└── public/       # Static assets
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```
