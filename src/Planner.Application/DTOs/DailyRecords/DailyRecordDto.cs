using Planner.Domain.Enums;

namespace Planner.Application.DTOs.DailyRecords;

public class DailyRecordDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public DailyRecordStatus Status { get; set; }
    public decimal? ActualValue { get; set; }
    public string? Note { get; set; }
    public Guid CommitmentId { get; set; }
    public string CommitmentTitle { get; set; } = string.Empty;
}
