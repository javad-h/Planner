# Planner Frontend - Agent Instructions

## Project Goal

Planner is a personal daily commitment tracking app. Users create Plans for time periods and define daily Commitments (e.g., reading, exercise). The app tracks daily adherence to these commitments.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui (base-nova style)
- React Router v7
- TanStack Query v5
- Axios
- jalaali-js (Persian date conversion)

## Project Structure

```
src/
├── app/              # Router config and root App component
├── pages/            # Route-level page components
├── components/       # Shared components
│   ├── layout/       # AppLayout, Sidebar, Header, MobileDrawer
│   ├── ui/           # shadcn/ui components
│   └── EmptyState.tsx
├── features/         # Feature-specific logic (reserved for future)
├── services/api/     # Axios client and API service modules
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── lib/              # Utility functions (cn, jalali, etc.)
└── index.css         # Tailwind + CSS variables (theme)
```

## Architecture Decisions

- **Server State**: TanStack Query for all server data. No Redux, no Zustand.
- **Routing**: React Router v7 with a single `createBrowserRouter`.
- **Styling**: Tailwind CSS with shadcn/ui semantic tokens. No custom CSS.
- **RTL**: Persian RTL layout with `<html dir="rtl" lang="fa">`.
- **Theme**: Light/Dark via CSS class toggle, persisted in localStorage.
- **Dates**: All dates converted to Jalali only in the presentation layer. API uses ISO/Gregorian.

## UI Rules

1. Use shadcn/ui components before custom markup.
2. Use `cn()` for conditional classes, never manual template literals.
3. Use semantic color tokens (`bg-primary`, `text-muted-foreground`), never raw colors.
4. Use `gap-*` instead of `space-y-*` / `space-x-*`.
5. Use `size-*` when width and height are equal.
6. Use `truncate` shorthand.
7. No manual `dark:` overrides — CSS variables handle theme switching.
8. No manual `z-index` on overlay components.
9. All UI text is in Persian (Farsi). Variable/component names are in English.
10. Responsive: Desktop sidebar, mobile drawer/sheet.

## API Integration Rules

1. **Swagger is the source of truth**: `https://localhost:7216/swagger/v1/swagger.json`
2. Never guess API endpoints, request shapes, or response shapes.
3. Never create fake/mock API integration.
4. If API doesn't support a feature, don't implement it in frontend.
5. Base URL from `VITE_API_BASE_URL` env variable.
6. After mutation success, invalidate related queries.
7. Show loading, error, and empty states for all data-fetching UI.

## State Management Rules

- Server state: TanStack Query only.
- UI state: React `useState` / `useContext`.
- No Redux, no Zustand, no global client state library.
- Theme state: `useTheme()` hook with localStorage persistence.

## TypeScript Rules

- Strict mode.
- No `any` types.
- API types from Swagger, separate from UI types.
- String literal unions matching backend API enum values (not numeric enums).

## RTL Rules

- `<html lang="fa" dir="rtl">` set in index.html.
- Use shadcn RTL-compatible components.
- Date pickers must support Jalali/RTL.

## Responsive Design Rules

- Desktop: Collapsible sidebar + main content.
- Mobile: Drawer/sheet sidebar, touch-friendly targets.
- All pages must work on 320px+ width.

## Documentation

- `AGENTS.md` — This file. Agent instructions for the project.
- `docs/architecture.md` — Frontend architecture details.
- `docs/api-integration.md` — API integration guide (based on real Swagger).
- `docs/decisions.md` — Architecture Decision Records (ADRs).

Update documentation when significant decisions change.

## Out of Scope (Phase 2)

- Authentication / Authorization
- User Management
- Notifications / Reminders
- Streak tracking
- Advanced Reports / Charts
- Export / PDF
- PWA / Offline Mode
- Push Notifications
- Redux, Zustand, Next.js

## Build Validation

After changes, run:
```bash
npm install
npm run build
```

Ensure: zero TypeScript errors, successful Vite build, correct RTL, working theme toggle.
