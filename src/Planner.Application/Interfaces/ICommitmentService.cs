using Planner.Application.DTOs.Commitments;

namespace Planner.Application.Interfaces;

public interface ICommitmentService
{
    Task<CommitmentDto> AddCommitmentAsync(Guid planId, CreateCommitmentRequest request);
}
