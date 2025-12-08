const getRentDays = (startDate: string, endDate: string): number | null => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return null;
  }

  if (end < start) {
    return null;
  }

  const diffInMs = end.getTime() - start.getTime();
  const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return days;
};

export default getRentDays;
