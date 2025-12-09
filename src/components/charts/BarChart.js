// import { memo } from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, TimeScale } from "chart.js";
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, TimeScale);

// function BarChart({ labels = [], series = [], title = "" }) {
//   const data = {
//     labels,
//     datasets: [
//       {
//         label: title || "Count",
//         data: series,
//         borderRadius: 6,
//         backgroundColor: "rgba(47,95,97,0.85)",
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
//     scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
//   };

//   return <Bar data={data} options={options} />;
// }

// export default memo(BarChart);


import { memo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function BarChart({ labels = [], values = [] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Transactions",
        data: values,
        backgroundColor: "rgba(41, 53, 65, 0.7)", 
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
}

export default memo(BarChart);
