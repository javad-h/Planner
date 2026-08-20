# Architecture Decision Records

## ADR-001: Server State Management

**Title:** Server state management

**Decision:** TanStack Query is used for server state management.

**Reason:** The application primarily consumes REST API data. TanStack Query provides caching, background refetching, and mutation handling without the complexity of a global state library. No real-time features are needed.

**Status:** Accepted

---

## ADR-002: Client State Management

**Title:** Client state management

**Decision:** No global client state library (Redux, Zustand) is used. Local component state (`useState`, `useContext`) is sufficient.

**Reason:** The app has minimal client-side state (theme, sidebar collapse, form inputs). All significant data comes from the API and is managed by TanStack Query.

**Status:** Accepted

---

## ADR-003: UI Component Library

**Title:** UI component library

**Decision:** shadcn/ui (base-nova style) with Tailwind CSS v4.

**Reason:** shadcn/ui provides accessible, customizable components as source code. No runtime bundle overhead. Tailwind CSS v4 with CSS variables enables clean light/dark theming.

**Status:** Accepted

---

## ADR-004: RTL and Persian UI

**Title:** RTL and Persian UI

**Decision:** Full RTL layout with Persian (Farsi) text. `<html lang="fa" dir="rtl">`. Component/variable names remain in English.

**Reason:** Target audience is Persian-speaking. RTL is required for proper text rendering and layout direction.

**Status:** Accepted

---

## ADR-005: Date Handling

**Title:** Persian date handling

**Decision:** Dates are stored and transmitted in ISO/Gregorian format by the API. Jalali conversion happens only in the presentation layer using `jalaali-js`.

**Reason:** Backend API contract uses standard ISO dates. Converting at the presentation layer keeps the API contract clean and avoids timezone issues.

**Status:** Accepted

---

## ADR-006: Routing

**Title:** Client-side routing

**Decision:** React Router v7 with `createBrowserRouter`.

**Reason:** Simple SPA routing is sufficient. No server-side rendering needed. React Router provides clean nested routing and layout support.

**Status:** Accepted

---

## ADR-007: Theme Persistence

**Title:** Theme persistence

**Decision:** Theme (light/dark) stored in `localStorage` under key `planner-theme`. Applied via CSS class on `<html>` element.

**Reason:** Simple, reliable persistence without external dependencies. CSS variables handle the visual switch.

**Status:** Accepted

---

## ADR-008: API Integration Approach

**Title:** API integration approach

**Decision:** Service-based architecture with Axios. Each domain (plans, commitments, daily-records) has its own service file. Swagger is the source of truth for API contracts.

**Reason:** Clean separation of concerns. Easy to mock or replace. Swagger-first approach ensures frontend matches backend exactly.

**Status:** Accepted

---

## ADR-009: API-Driven UI Scope

**Title:** API-driven UI scope

**Decision:** Frontend UI is limited to what the real API supports. No mock data or fake endpoints.

**Reason:** The Swagger contract defines the API surface. Key limitations: no GET commitments endpoint, no commitment type/target in daily records, no daily record creation. UI adapts to show available data only.

**Status:** Accepted

---

## ADR-010: String Enums for API Types

**Title:** String enums for API types

**Decision:** `CommitmentType` and `DailyRecordStatus` are TypeScript string literal unions (not numeric enums) to match the API's string enum format.

**Reason:** Swagger defines these as string enums ("Boolean", "Quantitative", "Pending", etc.). Using string literals avoids numeric mapping and matches the API contract directly.

**Status:** Accepted
