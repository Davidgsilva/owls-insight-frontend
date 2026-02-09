# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Owls Insight Frontend - Next.js 16 landing page for a real-time sports betting odds API service. Part of the WiseSportsServices multi-repo architecture (see parent `CLAUDE.md` for cross-repo data flow).

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build (outputs standalone)
npm run lint     # ESLint with Next.js config
npm run start    # Start production server
```

## Architecture

### Directory Structure
```
src/
├── app/              # Next.js App Router (layout.tsx, page.tsx, globals.css)
├── components/
│   ├── ui/           # shadcn/ui components (Radix primitives + Tailwind)
│   └── landing/      # Landing page sections (Header, Hero, Features, etc.)
└── lib/
    └── utils.ts      # cn() utility for Tailwind class merging
```

### Key Patterns

**Component Organization**: Landing page sections are barrel-exported from `src/components/landing/index.ts`. UI primitives use shadcn/ui pattern with Radix UI + class-variance-authority.

**Styling**: Tailwind CSS 4 with custom theme in `globals.css`. Brand colors use `#00FF88` (primary green) and `#06b6d4` (cyan). Custom animations defined: `animate-ticker`, `animate-fade-in-up`, `animate-float`, `animate-pulse-glow`. Staggered animations via `.stagger-1` through `.stagger-6`.

**Fonts**: JetBrains Mono for headings/code, IBM Plex Sans for body text (loaded via @font-face in globals.css).

**Path Alias**: `@/*` maps to `./src/*`

## Deployment

AWS EKS deployment configured:
- Dockerfile uses multi-stage build with `output: "standalone"`
- K8s manifests in `k8s/` (deployment, service, ingress)
- Namespace: `owls-insight-dev`
- ECR registry: `482566359918.dkr.ecr.us-east-1.amazonaws.com/owls-insight-frontend`
- Environment variable: `NEXT_PUBLIC_API_URL` points to `https://api.owlsinsight.com`

## Known Issues & Gotchas

### NEVER use `NextResponse.redirect()` in standalone mode

Next.js standalone mode rewrites the `Location` header in `NextResponse.redirect()` to the server's bind address (`0.0.0.0:3000`). This causes production redirects to go to `https://0.0.0.0:3000/...` instead of `https://owlsinsight.com/...`.

**Always use raw `Response` objects for redirects:**

```typescript
// WRONG - will redirect to 0.0.0.0:3000 in production
return NextResponse.redirect(new URL("/dashboard", origin));

// CORRECT - preserves the intended URL
return new Response(null, {
  status: 302,
  headers: { Location: new URL("/dashboard", origin).toString() },
});

// CORRECT with cookies - use NextResponse only for cookie-setting, then copy headers
const nr = new NextResponse(null);
nr.cookies.set('token', value, { httpOnly: true, secure: true, ... });
const headers = new Headers(nr.headers);
headers.set('Location', targetUrl);
return new Response(null, { status: 302, headers });
```

This applies to both middleware (`src/middleware.ts`) and route handlers (`src/app/api/...`).

## UI Component Library

Uses shadcn/ui pattern. Components in `src/components/ui/` are based on Radix UI primitives styled with Tailwind. The `cn()` utility from `@/lib/utils` merges Tailwind classes.

Available components: button, input, card, label, tabs, table, badge, avatar, dropdown-menu, dialog, separator, sheet, sonner (toast), form.
