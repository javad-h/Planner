using Planner.Domain.Enums;

namespace Planner.Application.DTOs.DailyRecords;

public class UpdateDailyRecordRequest
{
    public DailyRecordStatus Status { get; set; }
    public decimal? ActualValue { get; set; }
    public string? Note { get; set; }
}
