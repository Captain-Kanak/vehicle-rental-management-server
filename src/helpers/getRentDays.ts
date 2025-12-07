const getRentDays = (startDate: string, endDate: string): unknown => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      success: false,
      message: "Invalid date format",
    };
  }

  const diffInMs = end.getTime() - start.getTime();

  const days = diffInMs / (1000 * 60 * 60 * 24);

  return days;
};

export default getRentDays;
