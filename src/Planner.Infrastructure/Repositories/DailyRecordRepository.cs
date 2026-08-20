using Microsoft.EntityFrameworkCore;
using Planner.Application.Interfaces;
using Planner.Domain.Entities;
using Planner.Infrastructure.Data;

namespace Planner.Infrastructure.Repositories;

public class DailyRecordRepository : IDailyRecordRepository
{
    private readonly PlannerDbContext _context;

    public DailyRecordRepository(PlannerDbContext context)
    {
        _context = context;
    }

    public async Task<DailyRecord?> GetByIdAsync(Guid id)
    {
        return await _context.DailyRecords
            .Include(d => d.Commitment)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<List<DailyRecord>> GetByCommitmentIdAsync(Guid commitmentId)
    {
        return await _context.DailyRecords
            .Include(d => d.Commitment)
            .Where(d => d.CommitmentId == commitmentId)
            .OrderBy(d => d.Date)
            .ToListAsync();
    }

    public async Task<List<DailyRecord>> GetByPlanIdAsync(Guid planId)
    {
        return await _context.DailyRecords
            .Include(d => d.Commitment)
            .Where(d => d.Commitment.PlanId == planId)
            .OrderBy(d => d.Date)
            .ThenBy(d => d.Commitment!.Title)
            .ToListAsync();
    }

    public async Task<List<DailyRecord>> GetByPlanIdAndDateAsync(Guid planId, DateTime date)
    {
        return await _context.DailyRecords
            .Include(d => d.Commitment)
            .Where(d => d.Commitment!.PlanId == planId && d.Date == date.Date)
            .OrderBy(d => d.Commitment!.Title)
            .ToListAsync();
    }

    public async Task<DailyRecord?> GetByCommitmentIdAndDateAsync(Guid commitmentId, DateTime date)
    {
        return await _context.DailyRecords
            .Include(d => d.Commitment)
            .FirstOrDefaultAsync(d => d.CommitmentId == commitmentId && d.Date == date.Date);
    }

    public async Task AddAsync(DailyRecord dailyRecord)
    {
        await _context.DailyRecords.AddAsync(dailyRecord);
    }

    public async Task AddRangeAsync(IEnumerable<DailyRecord> dailyRecords)
    {
        await _context.DailyRecords.AddRangeAsync(dailyRecords);
    }

    public async Task UpdateAsync(DailyRecord dailyRecord)
    {
        _context.DailyRecords.Update(dailyRecord);
        await _context.SaveChangesAsync();
    }
}
