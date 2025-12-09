import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPDF(fileName, rows = []) {
  if (!rows || rows.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();

  const headers = Object.keys(rows[0]);

  const data = rows.map((row) => headers.map((h) => row[h]));

  autoTable(doc, {
    head: [headers],
    body: data,
    theme: "grid",
  });

  doc.save(`${fileName}.pdf`);
}
