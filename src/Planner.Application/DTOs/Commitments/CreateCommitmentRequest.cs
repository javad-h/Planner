using Planner.Domain.Enums;

namespace Planner.Application.DTOs.Commitments;

public class CreateCommitmentRequest
{
    public string Title { get; set; } = string.Empty;
    public CommitmentType Type { get; set; }
    public decimal? TargetValue { get; set; }
    public string? Unit { get; set; }
}
