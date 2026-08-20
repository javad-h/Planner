# Architecture

## Overview

Planner follows Clean Architecture with DDD principles. The solution is organized into four layers with strict dependency rules.

## Layers

### Planner.Domain (Core)

**Responsibility:** Core business logic, entities, domain rules, enums.

- Contains entity definitions (Plan, Commitment, DailyRecord)
- Contains domain behaviors and business rules
- Contains enums (CommitmentType, DailyRecordStatus)
- Has NO dependencies on other projects
- Pure .NET class library

### Planner.Application

**Responsibility:** Use cases, DTOs, repository interfaces, service interfaces.

- Contains DTOs for API request/response
- Contains repository interfaces (IPlanRepository, ICommitmentRepository, IDailyRecordRepository)
- Contains application service interfaces
- Depends ONLY on Planner.Domain
- No implementation details (no EF Core, no HTTP)

### Planner.Infrastructure

**Responsibility:** Data access, external service implementations.

- Contains PlannerDbContext
- Contains Entity Configurations (Fluent API)
- Contains Repository implementations
- Contains Migration logic
- Depends on Planner.Application (implements interfaces)
- Uses EF Core 8 with SQL Server

### Planner.Api

**Responsibility:** HTTP layer, controllers, middleware, configuration.

- Contains REST API Controllers
- Contains error handling middleware
- Contains Swagger/OpenAPI configuration
- Contains dependency injection setup
- Depends on Planner.Application and Planner.Infrastructure

## Dependency Graph

```
Planner.Domain
    ↑
Planner.Application
    ↑
Planner.Infrastructure
    ↑
Planner.Api
```

**Rule:** Dependencies flow inward. Domain never depends on outer layers.

## Project Files

```
src/
├── Planner.Domain/
│   ├── Entities/
│   │   ├── Plan.cs
│   │   ├── Commitment.cs
│   │   └── DailyRecord.cs
│   └── Enums/
│       ├── CommitmentType.cs
│       └── DailyRecordStatus.cs
├── Planner.Application/
│   ├── DTOs/
│   │   ├── Plans/
│   │   ├── Commitments/
│   │   └── DailyRecords/
│   └── Interfaces/
│       ├── IPlanRepository.cs
│       ├── ICommitmentRepository.cs
│       └── IDailyRecordRepository.cs
├── Planner.Infrastructure/
│   ├── Data/
│   │   ├── PlannerDbContext.cs
│   │   ├── Configurations/
│   │   └── Migrations/
│   └── Repositories/
│       ├── PlanRepository.cs
│       ├── CommitmentRepository.cs
│       └── DailyRecordRepository.cs
└── Planner.Api/
    ├── Controllers/
    ├── Middleware/
    └── Program.cs
```

## Database

- SQL Server (Local)
- Database: PlannerDb
- EF Core 8 Code-First with Migrations
- Fluent API for entity configurations
- Unique index on DailyRecord(CommitmentId, Date)

## API Design

RESTful endpoints following standard HTTP conventions:

- `POST /api/plans` - Create plan
- `GET /api/plans` - List plans
- `GET /api/plans/{id}` - Get plan
- `PUT /api/plans/{id}` - Update plan
- `DELETE /api/plans/{id}` - Delete plan
- `POST /api/plans/{planId}/commitments` - Add commitment
- `PUT /api/commitments/{id}` - Update commitment
- `DELETE /api/commitments/{id}` - Remove commitment
- `GET /api/plans/{planId}/daily-records` - Get daily records
- `GET /api/plans/{planId}/daily-records/{date}` - Get by date
- `PUT /api/daily-records/{id}` - Update daily record

## Error Handling

Structured error responses:

```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Bad Request",
  "status": 400,
  "errors": ["Title is required"]
}
```

## Testing

- Unit tests for Domain business rules
- Test project: Planner.Domain.Tests
- xUnit framework
