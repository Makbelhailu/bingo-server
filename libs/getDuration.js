function getStartAndEndOfDay() {
  const start = new Date();
  const end = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(24, 0, 0, 0);
  return { start, end };
}

module.exports = getStartAndEndOfDay;
