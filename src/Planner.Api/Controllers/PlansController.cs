using Microsoft.AspNetCore.Mvc;
using Planner.Application.DTOs.Commitments;
using Planner.Application.DTOs.Plans;
using Planner.Application.DTOs.DailyRecords;
using Planner.Application.Interfaces;
using Planner.Domain.Entities;
using Planner.Domain.Enums;

namespace Planner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlansController : ControllerBase
{
    private readonly IPlanRepository _planRepository;
    private readonly ICommitmentRepository _commitmentRepository;
    private readonly IDailyRecordRepository _dailyRecordRepository;
    private readonly ICommitmentService _commitmentService;

    public PlansController(
        IPlanRepository planRepository,
        ICommitmentRepository commitmentRepository,
        IDailyRecordRepository dailyRecordRepository,
        ICommitmentService commitmentService)
    {
        _planRepository = planRepository;
        _commitmentRepository = commitmentRepository;
        _dailyRecordRepository = dailyRecordRepository;
        _commitmentService = commitmentService;
    }

    [HttpPost]
    public async Task<ActionResult<PlanDto>> CreatePlan([FromBody] CreatePlanRequest request)
    {
        var plan = Plan.Create(request.Title, request.StartDate, request.EndDate);
        await _planRepository.AddAsync(plan);

        return CreatedAtAction(nameof(GetPlan), new { id = plan.Id }, MapToDto(plan));
    }

    [HttpGet]
    public async Task<ActionResult<List<PlanDto>>> GetPlans()
    {
        var plans = await _planRepository.GetAllAsync();
        return Ok(plans.Select(MapToDto).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PlanDto>> GetPlan(Guid id)
    {
        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null)
            return NotFound();

        return Ok(MapToDto(plan));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PlanDto>> UpdatePlan(Guid id, [FromBody] UpdatePlanRequest request)
    {
        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null)
            return NotFound();

        plan.Update(request.Title, request.StartDate, request.EndDate);
        await _planRepository.UpdateAsync(plan);

        return Ok(MapToDto(plan));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeletePlan(Guid id)
    {
        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null)
            return NotFound();

        await _planRepository.DeleteAsync(plan);
        return NoContent();
    }

    [HttpPost("{planId:guid}/commitments")]
    public async Task<ActionResult<CommitmentDto>> AddCommitment(Guid planId, [FromBody] CreateCommitmentRequest request)
    {
        try
        {
            var commitmentDto = await _commitmentService.AddCommitmentAsync(planId, request);
            return CreatedAtAction(
                nameof(GetPlan),
                new { id = planId },
                commitmentDto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPut("commitments/{id:guid}")]
    public async Task<ActionResult<CommitmentDto>> UpdateCommitment(Guid id, [FromBody] UpdateCommitmentRequest request)
    {
        var commitment = await _commitmentRepository.GetByIdAsync(id);
        if (commitment == null)
            return NotFound();

        commitment.Update(request.Title, request.Type, request.TargetValue, request.Unit);
        await _commitmentRepository.UpdateAsync(commitment);

        return Ok(MapToDto(commitment));
    }

    [HttpDelete("commitments/{id:guid}")]
    public async Task<ActionResult> RemoveCommitment(Guid id)
    {
        var commitment = await _commitmentRepository.GetByIdAsync(id);
        if (commitment == null)
            return NotFound();

        await _commitmentRepository.DeleteAsync(commitment);
        return NoContent();
    }

    [HttpGet("{planId:guid}/daily-records")]
    public async Task<ActionResult<List<DailyRecordDto>>> GetDailyRecords(Guid planId)
    {
        var plan = await _planRepository.GetByIdAsync(planId);
        if (plan == null)
            return NotFound();

        var records = await _dailyRecordRepository.GetByPlanIdAsync(planId);
        return Ok(records.Select(MapToDto).ToList());
    }

    [HttpGet("{planId:guid}/daily-records/{date}")]
    public async Task<ActionResult<List<DailyRecordDto>>> GetDailyRecordsByDate(Guid planId, DateTime date)
    {
        var plan = await _planRepository.GetByIdAsync(planId);
        if (plan == null)
            return NotFound();

        var records = await _dailyRecordRepository.GetByPlanIdAndDateAsync(planId, date);
        return Ok(records.Select(MapToDto).ToList());
    }

    [HttpPut("daily-records/{id:guid}")]
    public async Task<ActionResult<DailyRecordDto>> UpdateDailyRecord(Guid id, [FromBody] UpdateDailyRecordRequest request)
    {
        var record = await _dailyRecordRepository.GetByIdAsync(id);
        if (record == null)
            return NotFound();

        switch (request.Status)
        {
            case DailyRecordStatus.Completed:
                record.Complete(request.ActualValue);
                break;
            case DailyRecordStatus.PartiallyCompleted:
                record.PartiallyComplete(request.ActualValue ?? 0);
                break;
            case DailyRecordStatus.Skipped:
                record.Skip();
                break;
            case DailyRecordStatus.Pending:
                break;
            default:
                return BadRequest("Invalid status");
        }

        if (request.Note != null)
            record.UpdateNote(request.Note);

        await _dailyRecordRepository.UpdateAsync(record);

        return Ok(MapToDto(record));
    }

    private static PlanDto MapToDto(Plan plan)
    {
        return new PlanDto
        {
            Id = plan.Id,
            Title = plan.Title,
            StartDate = plan.StartDate,
            EndDate = plan.EndDate,
            TotalDays = plan.TotalDays,
            CommitmentCount = plan.Commitments.Count
        };
    }

    private static CommitmentDto MapToDto(Commitment commitment)
    {
        return new CommitmentDto
        {
            Id = commitment.Id,
            Title = commitment.Title,
            Type = commitment.Type,
            TargetValue = commitment.TargetValue,
            Unit = commitment.Unit,
            PlanId = commitment.PlanId
        };
    }

    private static DailyRecordDto MapToDto(DailyRecord record)
    {
        return new DailyRecordDto
        {
            Id = record.Id,
            Date = record.Date,
            Status = record.Status,
            ActualValue = record.ActualValue,
            Note = record.Note,
            CommitmentId = record.CommitmentId,
            CommitmentTitle = record.Commitment?.Title ?? string.Empty
        };
    }
}
