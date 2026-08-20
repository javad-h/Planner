using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Planner.Domain.Entities;

namespace Planner.Infrastructure.Data.Configurations;

public class DailyRecordConfiguration : IEntityTypeConfiguration<DailyRecord>
{
    public void Configure(EntityTypeBuilder<DailyRecord> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Date)
            .IsRequired();

        builder.Property(d => d.Status)
            .IsRequired();

        builder.Property(d => d.ActualValue)
            .HasPrecision(18, 2);

        builder.Property(d => d.Note)
            .HasMaxLength(500);

        builder.HasOne(d => d.Commitment)
            .WithMany(c => c.DailyRecords)
            .HasForeignKey(d => d.CommitmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(d => new { d.CommitmentId, d.Date })
            .IsUnique();
    }
}
