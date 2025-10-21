# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application integrated with Inngest for serverless background job processing. The project uses TypeScript, Tailwind CSS v4, and React 19.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start
```

The dev server runs at http://localhost:3000

## Architecture

### Inngest Integration

The project uses Inngest for background job processing with a specific architectural pattern:

1. **Inngest Client** (`src/inngest/client.ts`): Contains the singleton Inngest client instance configured with app ID "my-app"

2. **Inngest Functions** (`src/inngest/functions.ts`): All Inngest background functions are defined here. Functions follow the pattern:
   - Created using `inngest.createFunction()`
   - Include an ID, event trigger, and async handler
   - Can use step utilities like `step.sleep()` for workflow control

3. **Inngest API Route** (`src/app/api/inngest/route.ts`): Serves as the webhook endpoint for Inngest. All functions must be registered in the `functions` array passed to `serve()`. This is the central registration point - new Inngest functions must be added to this array.

### Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/app/api/` - API routes (includes Inngest webhook endpoint)
- `src/inngest/` - Inngest client and function definitions
- TypeScript path alias: `@/*` maps to `src/*`

### Key Configuration

- Uses Next.js App Router (not Pages Router)
- Turbopack enabled for dev and build
- Tailwind CSS v4 with PostCSS
- TypeScript strict mode enabled
- Environment variables: Check `.env.example` for required API keys (OPENAI_API_KEY)

## Adding New Inngest Functions

When creating new Inngest background functions:

1. Define the function in `src/inngest/functions.ts`
2. Export it and import it in `src/app/api/inngest/route.ts`
3. Add the function to the `functions` array in the `serve()` call
4. Functions are triggered by events matching the pattern specified in their configuration
