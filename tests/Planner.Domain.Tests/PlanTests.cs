using Planner.Domain.Entities;
using Planner.Domain.Enums;
using Xunit;

namespace Planner.Domain.Tests;

public class PlanTests
{
    [Fact]
    public void Create_ValidPlan_ReturnsPlan()
    {
        var startDate = DateTime.Today;
        var endDate = DateTime.Today.AddDays(29);

        var plan = Plan.Create("Test Plan", startDate, endDate);

        Assert.NotEqual(Guid.Empty, plan.Id);
        Assert.Equal("Test Plan", plan.Title);
        Assert.Equal(startDate.Date, plan.StartDate);
        Assert.Equal(endDate.Date, plan.EndDate);
        Assert.Empty(plan.Commitments);
    }

    [Fact]
    public void Create_PlanWithEmptyTitle_ThrowsArgumentException()
    {
        var startDate = DateTime.Today;
        var endDate = DateTime.Today.AddDays(29);

        Assert.Throws<ArgumentException>(() => Plan.Create("", startDate, endDate));
    }

    [Fact]
    public void Create_PlanWithWhitespaceTitle_ThrowsArgumentException()
    {
        var startDate = DateTime.Today;
        var endDate = DateTime.Today.AddDays(29);

        Assert.Throws<ArgumentException>(() => Plan.Create("   ", startDate, endDate));
    }

    [Fact]
    public void Create_PlanWithStartDateAfterEndDate_ThrowsArgumentException()
    {
        var startDate = DateTime.Today.AddDays(30);
        var endDate = DateTime.Today;

        Assert.Throws<ArgumentException>(() => Plan.Create("Test Plan", startDate, endDate));
    }

    [Fact]
    public void Create_PlanWithSameStartAndEndDate_ReturnsPlan()
    {
        var date = DateTime.Today;

        var plan = Plan.Create("Single Day Plan", date, date);

        Assert.Equal(date.Date, plan.StartDate);
        Assert.Equal(date.Date, plan.EndDate);
        Assert.Equal(1, plan.TotalDays);
    }

    [Fact]
    public void Update_ValidPlan_UpdatesProperties()
    {
        var plan = Plan.Create("Original", DateTime.Today, DateTime.Today.AddDays(29));
        var newStartDate = DateTime.Today.AddDays(1);
        var newEndDate = DateTime.Today.AddDays(30);

        plan.Update("Updated", newStartDate, newEndDate);

        Assert.Equal("Updated", plan.Title);
        Assert.Equal(newStartDate.Date, plan.StartDate);
        Assert.Equal(newEndDate.Date, plan.EndDate);
    }

    [Fact]
    public void Update_PlanWithEmptyTitle_ThrowsArgumentException()
    {
        var plan = Plan.Create("Original", DateTime.Today, DateTime.Today.AddDays(29));

        Assert.Throws<ArgumentException>(() => plan.Update("", DateTime.Today, DateTime.Today.AddDays(29)));
    }

    [Fact]
    public void Update_PlanWithStartDateAfterEndDate_ThrowsArgumentException()
    {
        var plan = Plan.Create("Original", DateTime.Today, DateTime.Today.AddDays(29));

        Assert.Throws<ArgumentException>(() =>
            plan.Update("Updated", DateTime.Today.AddDays(30), DateTime.Today));
    }

    [Fact]
    public void TotalDays_CalculatesCorrectly()
    {
        var startDate = new DateTime(2025, 1, 1);
        var endDate = new DateTime(2025, 1, 31);

        var plan = Plan.Create("January Plan", startDate, endDate);

        Assert.Equal(31, plan.TotalDays);
    }
}
