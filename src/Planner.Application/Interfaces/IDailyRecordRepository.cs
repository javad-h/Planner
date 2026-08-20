using Planner.Domain.Entities;

namespace Planner.Application.Interfaces;

public interface IDailyRecordRepository
{
    Task<DailyRecord?> GetByIdAsync(Guid id);
    Task<List<DailyRecord>> GetByCommitmentIdAsync(Guid commitmentId);
    Task<List<DailyRecord>> GetByPlanIdAsync(Guid planId);
    Task<List<DailyRecord>> GetByPlanIdAndDateAsync(Guid planId, DateTime date);
    Task<DailyRecord?> GetByCommitmentIdAndDateAsync(Guid commitmentId, DateTime date);
    Task AddAsync(DailyRecord dailyRecord);
    Task AddRangeAsync(IEnumerable<DailyRecord> dailyRecords);
    Task UpdateAsync(DailyRecord dailyRecord);
}
