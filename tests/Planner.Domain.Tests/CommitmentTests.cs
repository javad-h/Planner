using Planner.Domain.Entities;
using Planner.Domain.Enums;
using Xunit;

namespace Planner.Domain.Tests;

public class CommitmentTests
{
    private readonly Plan _plan;

    public CommitmentTests()
    {
        _plan = Plan.Create("Test Plan", DateTime.Today, DateTime.Today.AddDays(29));
    }

    [Fact]
    public void Create_BooleanCommitment_ReturnsCommitment()
    {
        var commitment = Commitment.Create(_plan.Id, "Room Cleaning", CommitmentType.Boolean);

        Assert.NotEqual(Guid.Empty, commitment.Id);
        Assert.Equal("Room Cleaning", commitment.Title);
        Assert.Equal(CommitmentType.Boolean, commitment.Type);
        Assert.Null(commitment.TargetValue);
        Assert.Null(commitment.Unit);
        Assert.Equal(_plan.Id, commitment.PlanId);
    }

    [Fact]
    public void Create_QuantitativeCommitment_ReturnsCommitment()
    {
        var commitment = Commitment.Create(
            _plan.Id,
            "Reading",
            CommitmentType.Quantitative,
            30,
            "Minute");

        Assert.NotEqual(Guid.Empty, commitment.Id);
        Assert.Equal("Reading", commitment.Title);
        Assert.Equal(CommitmentType.Quantitative, commitment.Type);
        Assert.Equal(30, commitment.TargetValue);
        Assert.Equal("Minute", commitment.Unit);
        Assert.Equal(_plan.Id, commitment.PlanId);
    }

    [Fact]
    public void Create_CommitmentWithEmptyTitle_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            Commitment.Create(_plan.Id, "", CommitmentType.Boolean));
    }

    [Fact]
    public void Create_CommitmentWithEmptyPlanId_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            Commitment.Create(Guid.Empty, "Reading", CommitmentType.Boolean));
    }

    [Fact]
    public void Create_QuantitativeWithoutTargetValue_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            Commitment.Create(_plan.Id, "Reading", CommitmentType.Quantitative, null, "Minute"));
    }

    [Fact]
    public void Create_QuantitativeWithZeroTargetValue_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            Commitment.Create(_plan.Id, "Reading", CommitmentType.Quantitative, 0, "Minute"));
    }

    [Fact]
    public void Create_QuantitativeWithoutUnit_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            Commitment.Create(_plan.Id, "Reading", CommitmentType.Quantitative, 30, null));
    }

    [Fact]
    public void Create_QuantitativeWithEmptyUnit_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            Commitment.Create(_plan.Id, "Reading", CommitmentType.Quantitative, 30, "  "));
    }

    [Fact]
    public void Update_ValidCommitment_UpdatesProperties()
    {
        var commitment = Commitment.Create(_plan.Id, "Original", CommitmentType.Boolean);

        commitment.Update("Updated", CommitmentType.Quantitative, 30, "Minute");

        Assert.Equal("Updated", commitment.Title);
        Assert.Equal(CommitmentType.Quantitative, commitment.Type);
        Assert.Equal(30, commitment.TargetValue);
        Assert.Equal("Minute", commitment.Unit);
    }

    [Fact]
    public void GenerateDailyRecords_CreatesCorrectNumberOfRecords()
    {
        var commitment = Commitment.Create(_plan.Id, "Reading", CommitmentType.Boolean);

        var records = commitment.GenerateDailyRecords(_plan.StartDate, _plan.EndDate);

        Assert.Equal(30, records.Count);
        Assert.All(records, r => Assert.Equal(DailyRecordStatus.Pending, r.Status));
    }

    [Fact]
    public void GenerateDailyRecords_EachRecordHasCorrectDate()
    {
        var commitment = Commitment.Create(_plan.Id, "Reading", CommitmentType.Boolean);
        var startDate = new DateTime(2025, 1, 1);
        var endDate = new DateTime(2025, 1, 5);
        var plan = Plan.Create("Short Plan", startDate, endDate);

        var records = commitment.GenerateDailyRecords(plan.StartDate, plan.EndDate);

        Assert.Equal(5, records.Count);
        for (int i = 0; i < 5; i++)
        {
            Assert.Equal(startDate.AddDays(i).Date, records[i].Date);
        }
    }
}
