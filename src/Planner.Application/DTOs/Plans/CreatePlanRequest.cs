namespace Planner.Application.DTOs.Plans;

public class CreatePlanRequest
{
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
