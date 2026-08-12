const ALGORITHM_INTERVALS = {
    quick: [1, 3, 7],
    three_month: [3, 7, 15, 30, 60],
    six_month: [3, 7, 15, 30, 60, 120, 180],
    one_year: [3, 7, 15, 30, 60, 120, 180, 365],
    two_year: [3, 7, 15, 30, 60, 120, 180, 365, 730],
    custom: [1, 3, 7, 14, 30],
};

const calculateRevisionDates = (startDate, algorithmName = "three_month") => {
    const intervals = ALGORITHM_INTERVALS[algorithmName] || ALGORITHM_INTERVALS.three_month;
    const baseDate = new Date(startDate);

    return intervals.map((days, index) => {
        const revDate = new Date(baseDate);
        revDate.setDate(revDate.getDate() + days);

        const year = revDate.getFullYear();
        const month = String(revDate.getMonth() + 1).padStart(2, "0");
        const day = String(revDate.getDate()).padStart(2, "0");

        return {
            revision_number: index + 1,
            revision_date: `${year}-${month}-${day}`,
            algorithm: algorithmName,
            status: "pending",
        };
    });
};

module.exports = {
    ALGORITHM_INTERVALS,
    calculateRevisionDates,
};
