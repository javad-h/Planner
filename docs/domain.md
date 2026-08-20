# Domain Model

## Entities

### Plan

A plan for a specific time period.

**Properties:**
- `Id` (Guid) - Unique identifier
- `Title` (string) - Plan title, required
- `StartDate` (DateTime) - Start date of the plan
- `EndDate` (DateTime) - End date of the plan
- `Commitments` (List<Commitment>) - Commitments in this plan

**Rules:**
- Title must not be empty or whitespace
- StartDate must not be after EndDate
- Plan can be created without Commitments
- Commitments can be added after Plan creation

---

### Commitment

A daily task that the user commits to during the Plan period.

**Properties:**
- `Id` (Guid) - Unique identifier
- `Title` (string) - Commitment title, required
- `Type` (CommitmentType) - Boolean or Quantitative
- `TargetValue` (decimal?) - Target value for Quantitative type
- `Unit` (string?) - Unit for Quantitative type (e.g., "Minute", "Page", "Km")
- `PlanId` (Guid) - Foreign key to Plan
- `DailyRecords` (List<DailyRecord>) - Daily records for this commitment

**Rules:**
- Must belong to a Plan
- Title must not be empty
- For Quantitative type: TargetValue must be provided and > 0
- For Quantitative type: Unit must not be empty
- For Boolean type: TargetValue and Unit should be null

---

### DailyRecord

Tracks the completion status of a Commitment for a specific day.

**Properties:**
- `Id` (Guid) - Unique identifier
- `Date` (DateTime) - The date (no time component)
- `Status` (DailyRecordStatus) - Current status
- `ActualValue` (decimal?) - Actual value achieved (for Quantitative)
- `Note` (string?) - Optional note
- `CommitmentId` (Guid) - Foreign key to Commitment

**Rules:**
- One DailyRecord per Commitment per day (unique constraint)
- Initial Status is always Pending
- System must NOT automatically change past records to Skipped
- Status changes only through explicit domain behaviors

---

## Enums

### CommitmentType

```csharp
public enum CommitmentType
{
    Boolean = 0,
    Quantitative = 1
}
```

### DailyRecordStatus

```csharp
public enum DailyRecordStatus
{
    Pending = 0,
    Completed = 1,
    PartiallyCompleted = 2,
    Skipped = 3
}
```

---

## Relationships

```
Plan (1) ──── (*) Commitment
Commitment (1) ──── (*) DailyRecord
```

---

## Domain Behaviors

### DailyRecord Status Changes

- `Complete()` - Marks as Completed. For Quantitative, sets ActualValue.
- `PartiallyComplete(actualValue)` - Marks as PartiallyCompleted with actual value.
- `Skip()` - Marks as Skipped.

### Creation Rules

When a Commitment is added to a Plan:
1. Calculate total days = (EndDate - StartDate).Days + 1
2. Create one DailyRecord per day for the entire Plan period
3. All DailyRecords start with Status = Pending

---

## Value Objects

None in Phase 1. May be added in future phases.

---

## Invariants

- DailyRecord.Date must be within the parent Plan's StartDate..EndDate range
- DailyRecord for same Commitment+Date cannot be duplicated
- Quantitative DailyRecord.ActualValue should be >= 0
