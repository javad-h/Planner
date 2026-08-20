using Planner.Domain.Entities;
using Planner.Domain.Enums;
using Xunit;

namespace Planner.Domain.Tests;

public class DailyRecordTests
{
    private readonly Plan _plan;
    private readonly Commitment _commitment;

    public DailyRecordTests()
    {
        _plan = Plan.Create("Test Plan", DateTime.Today, DateTime.Today.AddDays(29));
        _commitment = Commitment.Create(_plan.Id, "Reading", CommitmentType.Boolean);
    }

    [Fact]
    public void Create_DailyRecord_ReturnsPendingStatus()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);

        Assert.NotEqual(Guid.Empty, record.Id);
        Assert.Equal(DateTime.Today.Date, record.Date);
        Assert.Equal(DailyRecordStatus.Pending, record.Status);
        Assert.Null(record.ActualValue);
        Assert.Null(record.Note);
        Assert.Equal(_commitment.Id, record.CommitmentId);
    }

    [Fact]
    public void Create_DailyRecordWithEmptyCommitmentId_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            DailyRecord.Create(Guid.Empty, DateTime.Today));
    }

    [Fact]
    public void Complete_BooleanRecord_StatusChangesToCompleted()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);

        record.Complete();

        Assert.Equal(DailyRecordStatus.Completed, record.Status);
        Assert.Null(record.ActualValue);
    }

    [Fact]
    public void Complete_QuantitativeRecord_StatusChangesToCompletedWithValue()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);

        record.Complete(30);

        Assert.Equal(DailyRecordStatus.Completed, record.Status);
        Assert.Equal(30, record.ActualValue);
    }

    [Fact]
    public void PartiallyComplete_Record_StatusChangesToPartiallyCompleted()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);

        record.PartiallyComplete(15);

        Assert.Equal(DailyRecordStatus.PartiallyCompleted, record.Status);
        Assert.Equal(15, record.ActualValue);
    }

    [Fact]
    public void PartiallyComplete_WithNegativeValue_ThrowsArgumentException()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);

        Assert.Throws<ArgumentException>(() => record.PartiallyComplete(-1));
    }

    [Fact]
    public void Skip_Record_StatusChangesToSkipped()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);

        record.Skip();

        Assert.Equal(DailyRecordStatus.Skipped, record.Status);
    }

    [Fact]
    public void UpdateNote_Record_NoteIsUpdated()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);

        record.UpdateNote("Felt tired today");

        Assert.Equal("Felt tired today", record.Note);
    }

    [Fact]
    public void UpdateNote_RecordWithNullNote_ClearsNote()
    {
        var record = DailyRecord.Create(_commitment.Id, DateTime.Today);
        record.UpdateNote("Some note");

        record.UpdateNote(null);

        Assert.Null(record.Note);
    }

    [Fact]
    public void GenerateDailyRecords_CreatesRecordsForEntirePlanPeriod()
    {
        var startDate = new DateTime(2025, 1, 1);
        var endDate = new DateTime(2025, 1, 31);
        var plan = Plan.Create("January Plan", startDate, endDate);
        var commitment = Commitment.Create(plan.Id, "Reading", CommitmentType.Boolean);

        var records = commitment.GenerateDailyRecords(plan.StartDate, plan.EndDate);

        Assert.Equal(31, records.Count);
        Assert.All(records, r =>
        {
            Assert.Equal(DailyRecordStatus.Pending, r.Status);
            Assert.Equal(commitment.Id, r.CommitmentId);
        });
    }
}
