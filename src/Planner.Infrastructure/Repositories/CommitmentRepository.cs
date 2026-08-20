using Microsoft.EntityFrameworkCore;
using Planner.Application.Interfaces;
using Planner.Domain.Entities;
using Planner.Infrastructure.Data;

namespace Planner.Infrastructure.Repositories;

public class CommitmentRepository : ICommitmentRepository
{
    private readonly PlannerDbContext _context;

    public CommitmentRepository(PlannerDbContext context)
    {
        _context = context;
    }

    public async Task<Commitment?> GetByIdAsync(Guid id)
    {
        return await _context.Commitments
            .Include(c => c.DailyRecords)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Commitment>> GetByPlanIdAsync(Guid planId)
    {
        return await _context.Commitments
            .Include(c => c.DailyRecords)
            .Where(c => c.PlanId == planId)
            .ToListAsync();
    }

    public async Task AddAsync(Commitment commitment)
    {
        await _context.Commitments.AddAsync(commitment);
        await _context.SaveChangesAsync();
    }

    public async Task AddRangeAsync(IEnumerable<Commitment> commitments)
    {
        await _context.Commitments.AddRangeAsync(commitments);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Commitment commitment)
    {
        _context.Commitments.Update(commitment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Commitment commitment)
    {
        _context.Commitments.Remove(commitment);
        await _context.SaveChangesAsync();
    }
}
