namespace Planner.Domain.Entities;

public class Plan
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public List<Commitment> Commitments { get; private set; } = new();

    private Plan() { }

    public static Plan Create(string title, DateTime startDate, DateTime endDate)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));

        if (startDate > endDate)
            throw new ArgumentException("StartDate cannot be after EndDate.", nameof(endDate));

        return new Plan
        {
            Id = Guid.NewGuid(),
            Title = title.Trim(),
            StartDate = startDate.Date,
            EndDate = endDate.Date
        };
    }

    public void Update(string title, DateTime startDate, DateTime endDate)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));

        if (startDate > endDate)
            throw new ArgumentException("StartDate cannot be after EndDate.", nameof(endDate));

        Title = title.Trim();
        StartDate = startDate.Date;
        EndDate = endDate.Date;
    }

    public int TotalDays => (EndDate - StartDate).Days + 1;
}
