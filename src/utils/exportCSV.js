export function exportCSV(filename, rows) {
  const headers = Object.keys(rows[0]).join(",");
  const data = rows.map(r => Object.values(r).join(",")).join("\n");

  const blob = new Blob([headers + "\n" + data], { type: "text/csv" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename + ".csv";
  link.click();
}
