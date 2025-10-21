# Next.js + Inngest Realtime Chat

A real-time AI chat application built with Next.js 15 and Inngest, featuring streaming AI responses powered by OpenAI.

## Features

- Real-time streaming AI chat interface
- Inngest for background job processing and real-time updates
- Built with Next.js 15, React 19, and TypeScript
- Tailwind CSS v4 for styling
- OpenAI GPT-4o Mini integration

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=your_openai_api_key
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to start chatting!

## How It Works

- User sends a message through the UI
- Message triggers an Inngest function via server action
- Inngest function streams responses from OpenAI
- Real-time updates are pushed to the client using Inngest Realtime
- Chat interface updates as the AI generates the response

## Project Structure

- `src/app/` - Next.js pages and API routes
- `src/inngest/` - Inngest client and function definitions
- `src/app/actions.ts` - Server actions for sending events

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Inngest Documentation](https://www.inngest.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
