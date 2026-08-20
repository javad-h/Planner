# Architecture Decision Records

## ADR-001: DailyRecord Creation Strategy

**Title:** DailyRecord creation strategy

**Decision:**
DailyRecord records are created for the entire Plan period when a Commitment is added.

**Reason:**
The application needs explicit records for historical reporting and tracking. Pre-creating records ensures:
1. No gaps in tracking history
2. Simple queries for daily/weekly/monthly views
3. Clear visibility of what was planned vs what was completed

**Status:** Accepted

---

## ADR-002: Pending Status for Past Records

**Title:** Pending status for past records

**Decision:**
Past DailyRecords remain Pending until the user explicitly changes their status.

**Reason:**
The system must not automatically judge whether the user skipped a commitment. Only the user should decide if a past record was:
- Completed (they did it but forgot to log)
- PartiallyCompleted (they did some of it)
- Skipped (they intentionally skipped it)

Automatic status changes would be opinionated and potentially incorrect.

**Status:** Accepted

---

## ADR-003: No CQRS/MediatR in Phase 1

**Title:** Keep it simple without CQRS or MediatR

**Decision:**
Do not use CQRS, MediatR, or Event Sourcing patterns in Phase 1.

**Reason:**
The application is a simple personal tool with basic CRUD-like operations. The complexity of CQRS/MediatR is not justified. Business rules will live in Domain entities and be called directly from API controllers through application services.

If the application grows significantly in complexity, these patterns can be introduced in a future phase.

**Status:** Accepted

---

## ADR-004: Calendar-Agnostic Backend

**Title:** Backend is calendar-agnostic

**Decision:**
The backend uses standard DateTime and does not contain Persian/Jalali calendar logic.

**Reason:**
The backend should be independent of how dates are displayed in the Frontend. The React frontend (Phase 2) will handle calendar conversion for display purposes. This keeps the Domain clean and the API reusable.

**Status:** Accepted

---

## ADR-005: Unique Constraint on DailyRecord

**Title:** Unique constraint on DailyRecord(CommitmentId, Date)

**Decision:**
Apply a unique index/constraint on the combination of CommitmentId and Date in the DailyRecord table.

**Reason:**
Business rule: There can only be one DailyRecord per Commitment per day. Enforcing this at the database level prevents data corruption and duplicate records.

**Status:** Accepted
