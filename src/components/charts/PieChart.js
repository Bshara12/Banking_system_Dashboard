import { memo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ labels = [], series = [], title = "" }) {
  const colors = ['#2f5f61','#aac7d7','#dfebf7','#dc2626','#facc15'];
  const data = {
    labels,
    datasets: [{ data: series, backgroundColor: colors.slice(0, series.length) }]
  };
  const options = { responsive: true, plugins:{legend:{position:'bottom'}} };
  return <Pie data={data} options={options} />;
}

export default memo(PieChart);
