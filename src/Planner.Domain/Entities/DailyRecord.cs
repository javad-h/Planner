using Planner.Domain.Enums;

namespace Planner.Domain.Entities;

public class DailyRecord
{
    public Guid Id { get; private set; }
    public DateTime Date { get; private set; }
    public DailyRecordStatus Status { get; private set; }
    public decimal? ActualValue { get; private set; }
    public string? Note { get; private set; }
    public Guid CommitmentId { get; private set; }
    public Commitment Commitment { get; private set; } = null!;

    private DailyRecord() { }

    public static DailyRecord Create(Guid commitmentId, DateTime date)
    {
        if (commitmentId == Guid.Empty)
            throw new ArgumentException("CommitmentId is required.", nameof(commitmentId));

        return new DailyRecord
        {
            Id = Guid.NewGuid(),
            Date = date.Date,
            Status = DailyRecordStatus.Pending,
            CommitmentId = commitmentId
        };
    }

    public void Complete(decimal? actualValue = null)
    {
        Status = DailyRecordStatus.Completed;
        ActualValue = actualValue;
    }

    public void PartiallyComplete(decimal actualValue)
    {
        if (actualValue < 0)
            throw new ArgumentException("ActualValue cannot be negative.", nameof(actualValue));

        Status = DailyRecordStatus.PartiallyCompleted;
        ActualValue = actualValue;
    }

    public void Skip()
    {
        Status = DailyRecordStatus.Skipped;
    }

    public void UpdateNote(string? note)
    {
        Note = note?.Trim();
    }
}
