import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  animation: {
    duration: 1,
  },
  scales: {
    x: {
      grid: {
        drawTicks: false,
        // borderDash: [5, 5],
      },
      direction: "right",
      type: "linear",
      position: "bottom",
      min: 0,
      max: 60,
      ticks: {
        callback: function (value) {
          return value === 0 || value === 60 ? value : "";
        },
      },
      title: {},
    },
    y: {
      grid: {
        drawTicks: false,
      },
      min: 0,
      max: 100,
      ticks: {
        callback: function (value) {
          return value === 1 ? value : "";
        },
      },
      title: {
        display: false,
      },
    },
  },
};

const LineChart = (props) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        tension: 0.4,
        fill: true,
        data: [],
        borderColor: "#F94144",
        backgroundColor: "rgba(249, 67, 70, 0.22)",
      },
    ],
  });

  const updateChartData = () => {
    setChartData((prevData) => {
      const currentTime = prevData.labels.length * 2;
      let newData = prevData.datasets[0].data;
      let newLabels = prevData.labels;
      if (prevData.datasets[0].data.length > 30) {
        newLabels = [...prevData.labels.slice(0), currentTime];
        newData = [...prevData.datasets[0].data.slice(1), props.data]; // Assuming 0-100%
      } else {
        newData.push(Math.floor(props.data));
        newLabels.push(currentTime);
      }
      return {
        labels: newLabels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: newData,
          },
        ],
      };
    });
  };

  useEffect(() => {
    updateChartData();
  }, [props.data]);

  return <Line options={options} data={chartData} />;
};

export default LineChart;
