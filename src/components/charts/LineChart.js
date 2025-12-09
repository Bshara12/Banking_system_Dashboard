// import { memo } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// function LineChart({ labels = [], series = [], title = "" }) {
//   const data = {
//     labels,
//     datasets: [
//       {
//         label: title || "Value",
//         data: series,
//         fill: true,
//         tension: 0.25,
//         backgroundColor: "rgba(47,95,97,0.12)",
//         borderColor: "rgba(47,95,97,0.9)",
//         pointRadius: 3,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: { legend: { display: false } },
//     scales: { y: { beginAtZero: true } },
//   };

//   return <Line data={data} options={options} />;
// }

// export default memo(LineChart);


// src/components/charts/LineChart.jsx
import { memo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function LineChart({ labels = [], series = [], title = "" }) {
  const data = {
    labels,
    datasets: [
      {
        label: title || "Total",
        data: series,
        fill: true,
        tension: 0.35,
        backgroundColor: "rgba(41, 53, 65, 0.12)",   
        borderColor: "rgba(41, 53, 65, 0.95)",
        pointBackgroundColor: "#22c55e",
        pointBorderColor:"#2f5f61",
        pointRadius: 4,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { color: "#6b7280" } },
    },
  };

  return <Line data={data} options={options} />;
}

export default memo(LineChart);
