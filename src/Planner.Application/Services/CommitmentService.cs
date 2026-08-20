using Planner.Application.DTOs.Commitments;
using Planner.Application.Interfaces;
using Planner.Domain.Entities;

namespace Planner.Application.Services;

public class CommitmentService : ICommitmentService
{
    private readonly IPlanRepository _planRepository;
    private readonly ICommitmentRepository _commitmentRepository;
    private readonly IDailyRecordRepository _dailyRecordRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CommitmentService(
        IPlanRepository planRepository,
        ICommitmentRepository commitmentRepository,
        IDailyRecordRepository dailyRecordRepository,
        IUnitOfWork unitOfWork)
    {
        _planRepository = planRepository;
        _commitmentRepository = commitmentRepository;
        _dailyRecordRepository = dailyRecordRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<CommitmentDto> AddCommitmentAsync(Guid planId, CreateCommitmentRequest request)
    {
        var plan = await _planRepository.GetByIdAsync(planId);
        if (plan is null)
            throw new KeyNotFoundException($"Plan with id '{planId}' not found.");

        var commitment = Commitment.Create(planId, request.Title, request.Type, request.TargetValue, request.Unit);
        await _commitmentRepository.AddAsync(commitment);

        var dailyRecords = commitment.GenerateDailyRecords(plan.StartDate, plan.EndDate);
        await _dailyRecordRepository.AddRangeAsync(dailyRecords);

        await _unitOfWork.SaveChangesAsync();

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
}
