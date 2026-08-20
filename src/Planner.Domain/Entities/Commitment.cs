using Planner.Domain.Enums;

namespace Planner.Domain.Entities;

public class Commitment
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public CommitmentType Type { get; private set; }
    public decimal? TargetValue { get; private set; }
    public string? Unit { get; private set; }
    public Guid PlanId { get; private set; }
    public Plan Plan { get; private set; } = null!;
    public List<DailyRecord> DailyRecords { get; private set; } = new();

    private Commitment() { }

    public static Commitment Create(Guid planId, string title, CommitmentType type, decimal? targetValue = null, string? unit = null)
    {
        if (planId == Guid.Empty)
            throw new ArgumentException("PlanId is required.", nameof(planId));

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));

        if (type == CommitmentType.Quantitative)
        {
            if (!targetValue.HasValue || targetValue <= 0)
                throw new ArgumentException("TargetValue must be provided and greater than 0 for Quantitative commitments.", nameof(targetValue));

            if (string.IsNullOrWhiteSpace(unit))
                throw new ArgumentException("Unit must be provided for Quantitative commitments.", nameof(unit));
        }

        return new Commitment
        {
            Id = Guid.NewGuid(),
            Title = title.Trim(),
            Type = type,
            TargetValue = type == CommitmentType.Quantitative ? targetValue : null,
            Unit = type == CommitmentType.Quantitative ? unit?.Trim() : null,
            PlanId = planId
        };
    }

    public void Update(string title, CommitmentType type, decimal? targetValue = null, string? unit = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));

        if (type == CommitmentType.Quantitative)
        {
            if (!targetValue.HasValue || targetValue <= 0)
                throw new ArgumentException("TargetValue must be provided and greater than 0 for Quantitative commitments.", nameof(targetValue));

            if (string.IsNullOrWhiteSpace(unit))
                throw new ArgumentException("Unit must be provided for Quantitative commitments.", nameof(unit));
        }

        Title = title.Trim();
        Type = type;
        TargetValue = type == CommitmentType.Quantitative ? targetValue : null;
        Unit = type == CommitmentType.Quantitative ? unit?.Trim() : null;
    }

    public List<DailyRecord> GenerateDailyRecords(DateTime planStartDate, DateTime planEndDate)
    {
        var records = new List<DailyRecord>();
        var currentDate = planStartDate.Date;
        var endDate = planEndDate.Date;

        while (currentDate <= endDate)
        {
            records.Add(DailyRecord.Create(Id, currentDate));
            currentDate = currentDate.AddDays(1);
        }

        return records;
    }
}
