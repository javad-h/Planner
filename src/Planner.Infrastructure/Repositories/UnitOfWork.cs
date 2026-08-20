using Planner.Application.Interfaces;
using Planner.Infrastructure.Data;

namespace Planner.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly PlannerDbContext _context;

    public UnitOfWork(PlannerDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
