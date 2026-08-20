using Microsoft.EntityFrameworkCore;
using Planner.Application.Interfaces;
using Planner.Domain.Entities;
using Planner.Infrastructure.Data;

namespace Planner.Infrastructure.Repositories;

public class PlanRepository : IPlanRepository
{
    private readonly PlannerDbContext _context;

    public PlanRepository(PlannerDbContext context)
    {
        _context = context;
    }

    public async Task<Plan?> GetByIdAsync(Guid id)
    {
        return await _context.Plans
            .Include(p => p.Commitments)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Plan>> GetAllAsync()
    {
        return await _context.Plans
            .Include(p => p.Commitments)
            .OrderByDescending(p => p.StartDate)
            .ToListAsync();
    }

    public async Task AddAsync(Plan plan)
    {
        await _context.Plans.AddAsync(plan);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Plan plan)
    {
        _context.Plans.Update(plan);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Plan plan)
    {
        _context.Plans.Remove(plan);
        await _context.SaveChangesAsync();
    }
}
