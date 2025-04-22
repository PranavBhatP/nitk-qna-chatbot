# NITK Q&A Chatbot

An AI-powered Q&A assistant for National Institute of Technology Karnataka (NITK) that provides instant answers to queries about the institution using advanced language models and vector search.

## Features

- 🤖 AI-powered responses using LangChain and OpenRouter API
- 🔍 Vector search using Pinecone
- 👤 User authentication with JWT
- 💾 PostgreSQL database for user data and query history
- ⚡ Real-time search suggestions
- 📱 Responsive UI built with Next.js and Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Pinecone account
- OpenRouter API key
- HuggingFace API key

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd nitk-qna-chatbot
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
SITE_URL=http://localhost:3000
SITE_NAME=NITK-QA-Bot
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nitk_qna"
JWT_SECRET=your_jwt_secret_key
```

Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

Start the frontend development server:

```bash
npm run dev
```

## Project Structure

```
frontend/          # Next.js frontend application
  ├── app/        # App router pages and API routes
  ├── components/ # React components
  ├── lib/        # Utility functions and configurations
  └── prisma/     # Database schema and migrations

server/           # Express.js backend server
  ├── utils/      # Utility functions
  └── data/       # PDF and other data files
```

## Environment Variables

### Backend (server/.env)
- `PORT`: Server port (default: 5000)
- `PINECONE_API_KEY`: Pinecone API key
- `PINECONE_INDEX`: Pinecone index name
- `HUGGINGFACE_API_KEY`: HuggingFace API key
- `OPENROUTER_API_KEY`: OpenRouter API key
- `SITE_URL`: Frontend URL
- `SITE_NAME`: Application name

### Frontend (frontend/.env)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication

## Available Scripts

### Backend
- `npm run build`: Build the TypeScript code
- `npm run start`: Start the production server
- `npm run dev`: Start the development server
- `npm run clean`: Remove build artifacts

### Frontend
- `npm run dev`: Start the development server
- `npm run build`: Build the production application
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma ORM
- AI/ML: LangChain, OpenRouter, HuggingFace
- Vector Storage: Pinecone