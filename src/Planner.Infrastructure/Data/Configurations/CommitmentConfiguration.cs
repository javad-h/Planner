using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Planner.Domain.Entities;

namespace Planner.Infrastructure.Data.Configurations;

public class CommitmentConfiguration : IEntityTypeConfiguration<Commitment>
{
    public void Configure(EntityTypeBuilder<Commitment> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Type)
            .IsRequired();

        builder.Property(c => c.TargetValue)
            .HasPrecision(18, 2);

        builder.Property(c => c.Unit)
            .HasMaxLength(50);

        builder.HasOne(c => c.Plan)
            .WithMany(p => p.Commitments)
            .HasForeignKey(c => c.PlanId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.DailyRecords)
            .WithOne(d => d.Commitment)
            .HasForeignKey(d => d.CommitmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
