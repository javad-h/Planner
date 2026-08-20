# Planner Project - Agent Instructions

## Project Goal

Planner is a personal application for tracking daily commitments. Users create Plans for specific time periods and define Commitments (daily recurring tasks) within each Plan. The application tracks completion status via DailyRecords.

## Tech Stack

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core 8
- SQL Server (Local)
- REST API
- Swagger / OpenAPI
- DDD (Domain-Driven Design)
- Visual Studio 2022

## Architecture

The project follows Clean Architecture with DDD principles:

```
Planner.Domain       -> Core business logic, entities, domain rules
Planner.Application  -> Use cases, DTOs, interfaces (no implementation)
Planner.Infrastructure -> EF Core, DbContext, repository implementations
Planner.Api          -> REST API controllers, middleware, configuration
```

### Dependency Rules

- Domain has NO dependencies on other layers
- Application depends ONLY on Domain
- Infrastructure depends on Application (implements interfaces)
- Api depends on Application and Infrastructure

## Project Structure

```
Planner/
├── AGENTS.md
├── docs/
│   ├── domain.md
│   ├── architecture.md
│   └── decisions.md
├── src/
│   ├── Planner.Domain/
│   ├── Planner.Application/
│   ├── Planner.Infrastructure/
│   └── Planner.Api/
└── tests/
    └── Planner.Domain.Tests/
```

## Domain Rules

### Plan
- Title must not be empty
- StartDate must not be after EndDate
- Plan can be created without Commitments
- Commitments can be added after Plan creation

### Commitment
- Must belong to a Plan
- Has a Type: Boolean or Quantitative
- Quantitative Commitments must have TargetValue and Unit
- All Commitments are daily recurring (no complex recurrence yet)

### DailyRecord
- One DailyRecord per Commitment per day
- Unique constraint on CommitmentId + Date
- Initial Status is always Pending
- System must NOT automatically change past records to Skipped
- Status changes only through explicit domain behaviors: Complete, PartiallyComplete, Skip

### DailyRecord Creation Rule (IMPORTANT)
When a Commitment is added to a Plan, DailyRecords are created for the ENTIRE Plan period.
Example: Plan = 30 days, 5 Commitments = 150 DailyRecords created.

## DDD Rules

- Business rules live in the Domain layer
- Use domain behaviors (methods) to change state, not public setters
- No CQRS, MediatR, or Event Sourcing unless absolutely necessary
- Entities encapsulate state and enforce invariants
- Keep it simple - do not over-engineer with patterns

## Database Rules

- EF Core 8 with SQL Server
- DbContext in Infrastructure layer
- Entity Configurations use Fluent API
- Unique index on DailyRecord(CommitmentId, Date)
- Use appropriate Date type (no time component for DailyRecord.Date)

## Testing Rules

- Unit tests for important Domain business rules
- Minimum test coverage:
  - Plan with empty Title (should fail)
  - Plan with StartDate > EndDate (should fail)
  - Commitment creation
  - DailyRecord creation for entire Plan period
  - Initial Pending status of DailyRecords
  - DailyRecord status changes
  - Duplicate DailyRecord prevention

## Documentation Rules

- AGENTS.md: Permanent project instructions (this file)
- docs/domain.md: Domain model documentation (update when Domain changes)
- docs/architecture.md: Architecture documentation (update when Architecture changes)
- docs/decisions.md: Architecture Decision Records (add new ADRs for important decisions)

## Out of Scope (Phase 1)

The following are NOT to be implemented in this phase:

- React / TypeScript / Vite / Tailwind (Frontend - Phase 2)
- Authentication & Authorization
- User Management
- Notifications & Reminders
- Streaks
- Dashboard & Reports
- Charts & Export & PDF
- Docker & Microservices
- Advanced Recurrence
- Cloud Deployment
- Persian/Jalali Calendar logic (Backend must be calendar-agnostic)

## Working Protocol for Future Sessions

1. Before making changes, read AGENTS.md
2. Check relevant docs/ files
3. Review current codebase state
4. Do not change previous decisions without reason
5. Record new architectural decisions in docs/decisions.md
6. Update docs/domain.md when Domain changes
7. Update docs/architecture.md when Architecture changes
8. Do not add features outside current Scope
9. Build and test after significant changes
