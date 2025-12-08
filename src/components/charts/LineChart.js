import { memo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function LineChart({ labels = [], series = [], title = "" }) {
  const data = {
    labels,
    datasets: [{
      label: title || 'Value',
      data: series,
      fill: true,
      tension: 0.25,
      backgroundColor: 'rgba(47,95,97,0.12)',
      borderColor: 'rgba(47,95,97,0.9)',
      pointRadius: 3,
    }]
  };

  const options = { responsive: true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} };

  return <Line data={data} options={options} />;
}

export default memo(LineChart);
