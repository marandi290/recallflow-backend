const { calculateRevisionDates, ALGORITHM_INTERVALS } = require("../../../src/utils/scheduler");

describe("Scheduler Utility", () => {
    it("should calculate correct revision dates for three_month algorithm", () => {
        const startDate = "2026-08-11";
        const dates = calculateRevisionDates(startDate, "three_month");

        expect(dates).toHaveLength(5);
        expect(dates[0]).toEqual({
            revision_number: 1,
            revision_date: "2026-08-14",
            algorithm: "three_month",
            status: "pending",
        });
        expect(dates[1]).toEqual({
            revision_number: 2,
            revision_date: "2026-08-18",
            algorithm: "three_month",
            status: "pending",
        });
        expect(dates[2]).toEqual({
            revision_number: 3,
            revision_date: "2026-08-26",
            algorithm: "three_month",
            status: "pending",
        });
    });

    it("should calculate correct revision dates for quick algorithm", () => {
        const startDate = "2026-08-11";
        const dates = calculateRevisionDates(startDate, "quick");

        expect(dates).toHaveLength(3);
        expect(dates[0].revision_date).toBe("2026-08-12");
        expect(dates[1].revision_date).toBe("2026-08-14");
        expect(dates[2].revision_date).toBe("2026-08-18");
    });

    it("should fallback to three_month algorithm if unknown algorithm is passed", () => {
        const startDate = "2026-08-11";
        const dates = calculateRevisionDates(startDate, "invalid_algorithm");

        expect(dates).toHaveLength(5);
    });
});
