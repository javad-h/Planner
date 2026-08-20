# Frontend Architecture

## Overview

Planner Frontend is a single-page application (SPA) built with React, TypeScript, and Vite. It consumes a .NET 8 Backend API and follows a clean, modular architecture.

## Directory Structure

```
src/
├── app/
│   ├── index.tsx          # Root App component (providers, router)
│   └── router.tsx         # Route definitions
├── pages/
│   ├── TodayPage.tsx      # Daily commitment view
│   ├── PlansPage.tsx      # List of plans
│   ├── PlanDetailsPage.tsx # Single plan with commitments
│   └── DayDetailsPage.tsx  # Daily record details
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx   # Main layout with sidebar + header
│   │   ├── Sidebar.tsx     # Desktop collapsible sidebar
│   │   ├── Header.tsx      # Top bar with theme toggle
│   │   └── MobileDrawer.tsx # Mobile navigation drawer
│   ├── ui/                 # shadcn/ui components
│   └── EmptyState.tsx      # Reusable empty state
├── features/               # Feature modules (reserved)
├── services/api/
│   ├── client.ts           # Axios instance
│   ├── plans.ts            # Plans API service
│   ├── commitments.ts      # Commitments API service
│   └── dailyRecords.ts     # Daily Records API service
├── hooks/
│   └── useTheme.tsx        # Theme hook + provider
├── types/
│   └── api.ts              # API request/response types
├── lib/
│   ├── utils.ts            # cn() utility
│   └── jalali.ts           # Persian date helpers
└── index.css               # Tailwind + theme CSS variables
```

## Routing

Single `createBrowserRouter` with nested routes:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | TodayPage | Daily commitment view |
| `/plans` | PlansPage | List of all plans |
| `/plans/:id` | PlanDetailsPage | Plan details + commitments |
| `/day/:date` | DayDetailsPage | Day details + records |
| `/settings` | Placeholder | Settings (future) |

## Layout

- **Desktop**: Sidebar (collapsible) + Header + Main content
- **Mobile**: Header with hamburger menu → Sheet/Drawer for navigation

## Data Flow

1. Pages use TanStack Query hooks to fetch data
2. Query hooks call API service functions
3. API services use Axios client
4. Mutations invalidate related queries automatically

## Theme System

- CSS variables define colors for light and dark modes
- `useTheme()` hook toggles `.light` / `.dark` class on `<html>`
- Theme persisted in `localStorage` under `planner-theme`
- shadcn/ui components consume CSS variables automatically

## Date Handling

- API sends dates in ISO/Gregorian format
- `jalali.ts` converts to Persian for display
- Date pickers use native HTML `<input type="date">` (Jalali picker reserved for future)
