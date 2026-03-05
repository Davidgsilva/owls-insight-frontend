# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Commit Rules

Do NOT include "Co-Authored-By" lines in commit messages.

## Project Overview

Owls Insight Frontend — Next.js 16 App Router application serving as both a marketing landing page and authenticated user dashboard for a real-time sports betting odds API. Part of the WiseSportsServices multi-repo architecture (see parent `CLAUDE.md` for cross-repo data flow).

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build (outputs standalone)
npm run lint     # ESLint with Next.js config
npm run start    # Start production server
```

## Architecture

### BFF Proxy Pattern

The central design: **every API route in `src/app/api/` is a pure proxy** to the internal `owls-insight-api-server` (K8s cluster DNS). The frontend never exposes the backend directly.

All proxy route handlers:
- Add `X-Internal-Auth` header (shared secret from `INTERNAL_AUTH_SECRET` env var) for service-to-service auth
- Forward the browser's `Cookie` header so the backend identifies users via the httpOnly `token` cookie
- Return backend responses verbatim (including status codes)

Exception: `/api/odds` and `/api/scores` use a Bearer token via `OWLS_INSIGHT_API_KEY` (consumer-facing API auth) for the landing page.

### Route Organization

**Public pages** (server-rendered): `/`, `/docs`, `/contact`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/privacy`, `/terms`

**Dashboard pages** (all `"use client"`, auth-protected): `/dashboard`, `/dashboard/keys`, `/dashboard/usage`, `/dashboard/billing`, `/dashboard/account`

The landing page (`/`) assembles sections from `src/components/landing/` barrel export: `Header → Hero → LiveGames → OddsShowcase → Features → Coverage → Pricing → Footer`.

The dashboard uses a shared layout (`src/app/dashboard/layout.tsx`) rendering `<Sidebar>` + `<Header>` + `<EmailVerificationBanner>` + `{children}`.

### Three-Layer Auth System

1. **Middleware** (`src/middleware.ts`): Edge runtime, checks `token` cookie. Redirects unauthenticated users from `/dashboard/*` to `/login?redirect=...`. Redirects authenticated users from `/login` to `/dashboard`. Only matches `/dashboard/:path*` and `/login`. Origin validated against an allowlist to prevent open redirects.

2. **Dashboard layout guard** (`src/app/dashboard/layout.tsx`): Client-side `useEffect` — catches expired sessions where the cookie exists but `AuthContext` validation fails.

3. **AuthContext** (`src/contexts/AuthContext.tsx`): Central auth state. Hydrates from `localStorage` (`owls_user`) for instant UI, then validates against `/api/auth/me`. On 401, clears cookie and localStorage. Logout sequence is carefully ordered: clear cookie first → clear client state → navigate.

Auth methods: email/password and Discord OAuth. Discord flow preserves a `?tier=` param through the OAuth round-trip via an httpOnly cookie, enabling direct-to-checkout flows from pricing CTAs.

### Payment Integrations

Three providers, all proxied through Next.js route handlers:

- **Stripe** (primary): `/api/stripe/checkout`, `/api/stripe/portal`, `/api/stripe/sync`
- **PayPal**: `/api/paypal/checkout`, `/api/paypal/sync`, `/api/paypal/cancel` — stores `subscriptionId` in `sessionStorage` to survive redirect
- **NOWPayments (Crypto)**: `/api/nowpayments/checkout`, `/api/nowpayments/sync`, `/api/nowpayments/cancel`

The billing page (`/dashboard/billing`) detects provider via `subscription.paymentProvider` and shows provider-specific management UI.

Subscription tiers: `free`, `bench` ($9.99), `rookie` ($24.99), `mvp` ($49.99), `hall_of_fame` ($200). MVP has a 3-day free trial for eligible users.

### State Management

No global state library. Only:
- **`AuthContext`** for user/subscription/auth methods (wrapped at root layout)
- **Local `useState`** per dashboard page with `useEffect` + `fetch` + `setInterval` polling (30s overview, 15s usage stats, 10s logs)
- **`sonner` toast** for user feedback (configured globally in root layout)

### Key Patterns

**`hasSynced` ref pattern**: Payment sync `useEffect`s use `useRef(false)` to fire exactly once, preventing duplicate API calls when `searchParams` changes reference.

**Suspense wrapping**: All pages using `useSearchParams()` wrap content in `<Suspense>` (required by Next.js for static rendering compatibility).

**Polling with cleanup**: Dashboard pages use `AbortController` + `clearInterval` + `cancelled` flag to prevent state updates after unmount.

### Styling

Tailwind CSS 4 with custom theme in `globals.css`. Brand colors: `#00FF88` (primary green), `#06b6d4` (cyan). Fonts: JetBrains Mono (headings/code), IBM Plex Sans (body). Custom animations: `animate-ticker`, `animate-fade-in-up`, `animate-float`, `animate-pulse-glow`. Staggered animations via `.stagger-1` through `.stagger-6`.

**Path Alias**: `@/*` maps to `./src/*`

### Environment Variables

| Variable | Purpose |
|---|---|
| `API_SERVER_URL` | Internal API server URL (default: `http://owls-insight-api-server`) |
| `INTERNAL_AUTH_SECRET` | Shared secret for `X-Internal-Auth` header on all backend calls |
| `OWLS_INSIGHT_API_KEY` | Bearer token for `/api/odds` proxy (landing page live ticker) |
| `DISCORD_CLIENT_ID` | Discord OAuth app ID |
| `DISCORD_REDIRECT_URI` | Discord OAuth callback URL |
| `NEXT_PUBLIC_API_URL` | Public API URL (referenced in K8s manifests, not in source — frontend always proxies through its own API routes) |

#### Build-Time Variables (Docker `--build-arg`)

These are **inlined by Next.js during `next build`** and baked into the JS bundle. They are NOT runtime env vars — they must be passed as Docker build args.

| Variable | Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | `G-8EFB3XE6WB` | Google Analytics measurement ID (added Feb 2026) |

**CRITICAL:** If you add new `NEXT_PUBLIC_*` vars, you MUST:
1. Add `ARG` + `ENV` lines to the Dockerfile
2. Pass `--build-arg NEXT_PUBLIC_X=value` during `docker build`
3. Setting them via `kubectl set env` does NOT work — Next.js has already inlined the value (or empty string) at build time

## UI Component Library

Uses shadcn/ui pattern. Components in `src/components/ui/` are Radix UI primitives styled with Tailwind. The `cn()` utility from `@/lib/utils` merges Tailwind classes via `clsx` + `tailwind-merge`.

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

### `/register` is intentionally unprotected

Excluded from auth redirect routes — a stale token cookie would cause `/register → /dashboard → /login` redirect chain, breaking "Start Free Trial" CTA buttons that link to `/register?tier=mvp`.

## Deployment

AWS EKS deployment configured:
- Dockerfile uses multi-stage build with `output: "standalone"`
- K8s manifests in `k8s/` (deployment, service, ingress)
- Namespace: `owls-insight-prod`
- ECR registry: `482566359918.dkr.ecr.us-east-1.amazonaws.com/owls-insight-frontend`

### CRITICAL: Deploying the Frontend

**ALWAYS use `--profile wisesports` for ALL AWS CLI commands.** Account `482566359918`.

**Before building a Docker image, ALWAYS verify you are building from the correct commit:**

```bash
# 1. Check for uncommitted changes — commit or stash them first
git status
git log --oneline -5

# 2. Confirm HEAD is what you expect to deploy
# If the user has been making changes in this session, ALL changes must be
# committed before building. Docker builds from the working directory — any
# uncommitted files WILL be included, but any changes in other worktrees or
# sessions that were committed but not pulled will be MISSING.

# 3. Check what version is currently running
kubectl get deployment owls-insight-frontend -n owls-insight-prod -o jsonpath='{.spec.template.spec.containers[0].image}'

# 4. Bump the version tag (never reuse an existing tag)
# Look at the current running tag and increment it

# 5. Build, push, deploy
aws ecr get-login-password --region us-east-1 --profile wisesports | docker login --username AWS --password-stdin 482566359918.dkr.ecr.us-east-1.amazonaws.com
docker build --no-cache --build-arg NEXT_PUBLIC_GA_ID=G-8EFB3XE6WB -t 482566359918.dkr.ecr.us-east-1.amazonaws.com/owls-insight-frontend:v1.X.X .
docker push 482566359918.dkr.ecr.us-east-1.amazonaws.com/owls-insight-frontend:v1.X.X
kubectl set image deployment/owls-insight-frontend -n owls-insight-prod frontend=482566359918.dkr.ecr.us-east-1.amazonaws.com/owls-insight-frontend:v1.X.X
kubectl rollout status deployment/owls-insight-frontend -n owls-insight-prod --timeout=90s

# 6. POST-DEPLOY VERIFICATION — MANDATORY
# After deployment, verify the live site reflects your changes.
# Pick a specific text string or element you changed and confirm it appears:
curl -s https://owlsinsight.com | grep -o "expected text snippet"
# If the old content still appears, the build used stale cache — rebuild with --no-cache
```

**MANDATORY: ALWAYS use `--no-cache` when building Docker images.** Docker's build cache can silently serve stale `COPY . .` and `npm run build` layers even when source files have changed, resulting in old code being deployed. This has caused production incidents. There is NO safe scenario to skip `--no-cache` for this project.

**NEVER:**
- Build without `--no-cache` — Docker cache WILL serve stale code
- Build and deploy without checking `git status` and `git log` first
- Reuse an existing image tag — always increment the version
- Deploy from a stale working directory without pulling latest changes
- Skip `kubectl rollout status` — always verify the rollout succeeded
- Skip post-deploy verification — always confirm the live site has your changes

**Incidents (Feb 2026):**
1. A Claude Code session built and deployed the frontend from an older commit, overwriting a newer production version with stale code. This rolled back features and bug fixes that were already live. **Fix:** Always verify HEAD contains all expected changes before building.
2. A Docker build used cached layers (`COPY . .` and `npm run build` both showed CACHED) despite source code having changed. The deployed image contained old code ("7 sportsbooks" instead of "6 sportsbooks"). **Fix:** Always use `docker build --no-cache`.
