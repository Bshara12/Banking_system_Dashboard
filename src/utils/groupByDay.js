export function groupTransactionsByDay(rows) {
  const map = {};

  rows.forEach((t) => {
    const day = t.date.substring(0, 10); // "2025-12-08"
    map[day] = (map[day] || 0) + Number(t.amount);
  });

  return Object.entries(map).map(([day, total]) => ({
    day,
    total
  }));
}
