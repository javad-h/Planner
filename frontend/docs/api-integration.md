# API Integration Guide

## Backend Base URL

```
VITE_API_BASE_URL=https://localhost:7216
```

Configured via `.env` and `.env.development` files.

## Swagger

Source of truth: `https://localhost:7216/swagger/v1/swagger.json`

## Endpoints

### Plans

- `GET /api/Plans` — List all plans → `PlanDto[]`
- `GET /api/Plans/{id}` — Get plan by ID → `PlanDto`
- `POST /api/Plans` — Create plan → `PlanDto` (body: `CreatePlanRequest`)
- `PUT /api/Plans/{id}` — Update plan → `PlanDto` (body: `UpdatePlanRequest`)
- `DELETE /api/Plans/{id}` — Delete plan

### Commitments

- `POST /api/Plans/{planId}/commitments` — Create commitment → `CommitmentDto` (body: `CreateCommitmentRequest`)
- `PUT /api/Plans/commitments/{id}` — Update commitment → `CommitmentDto` (body: `UpdateCommitmentRequest`)
- `DELETE /api/Plans/commitments/{id}` — Delete commitment

### Daily Records

- `GET /api/Plans/{planId}/daily-records` — List all records for a plan → `DailyRecordDto[]`
- `GET /api/Plans/{planId}/daily-records/{date}` — Records for a specific date → `DailyRecordDto[]`
- `PUT /api/Plans/daily-records/{id}` — Update a record → `DailyRecordDto` (body: `UpdateDailyRecordRequest`)

## TypeScript Types

All types in `src/types/api.ts`, matching Swagger schemas exactly.

- `PlanDto` — id, title, startDate, endDate, totalDays, commitmentCount
- `CommitmentDto` — id, title, type (Boolean|Quantitative), targetValue, unit, planId
- `DailyRecordDto` — id, date, status, actualValue, note, commitmentId, commitmentTitle
- `CreatePlanRequest` — title, startDate, endDate
- `UpdatePlanRequest` — title, startDate, endDate
- `CreateCommitmentRequest` — title, type, targetValue, unit
- `UpdateCommitmentRequest` — title, type, targetValue, unit
- `UpdateDailyRecordRequest` — status, actualValue, note

## TanStack Query Usage

- Query hooks in page components using `useQuery`
- Mutations using `useMutation` with `onSuccess` invalidation
- `staleTime: 5min`, `retry: 1`, `refetchOnWindowFocus: false`

## API Limitations (No Frontend Workaround)

- No `GET /api/Plans/{planId}/commitments` — cannot list commitments for a plan
- `DailyRecordDto` has `commitmentTitle` but no `type`, `targetValue`, or `unit`
- No endpoint for today's records across all plans
- No progress/adherence calculation endpoint

## Next Steps

1. Backend: Add `GET /api/Plans/{planId}/commitments` endpoint
2. Backend: Add commitment type/target to `DailyRecordDto`
3. Backend: Add daily record creation endpoint
