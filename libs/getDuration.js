function getStartAndEndOfDay(date = new Date().toISOString()) {
  const start = new Date(date);
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

module.exports = getStartAndEndOfDay;
