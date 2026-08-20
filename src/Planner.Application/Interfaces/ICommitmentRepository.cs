using Planner.Domain.Entities;

namespace Planner.Application.Interfaces;

public interface ICommitmentRepository
{
    Task<Commitment?> GetByIdAsync(Guid id);
    Task<List<Commitment>> GetByPlanIdAsync(Guid planId);
    Task AddAsync(Commitment commitment);
    Task AddRangeAsync(IEnumerable<Commitment> commitments);
    Task UpdateAsync(Commitment commitment);
    Task DeleteAsync(Commitment commitment);
}
