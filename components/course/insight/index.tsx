"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState, type FunctionComponent } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface IProps {
  labels: string[];
  data: number[];
  label: string;
}

const Insight: FunctionComponent<IProps> = ({ data, labels, label }) => {
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const handleSetChartWidth = () => {
      const contentPadding = 48;
      const rightPanel = 300;
      const contentGap = 30;
      const insightsGap = 20;

      let newChartWidth: number;

      if (window.innerWidth < 1280) {
        newChartWidth = window.innerWidth - contentPadding - insightsGap;
      } else if (window.innerWidth >= 1432) {
        newChartWidth =
          window.innerWidth -
          (window.innerWidth - 1432) -
          rightPanel -
          contentGap -
          contentPadding;
      } else {
        newChartWidth =
          window.innerWidth - rightPanel - contentGap - contentPadding;
      }

      if (window.innerWidth >= 768) newChartWidth /= 2;
      setChartWidth(newChartWidth);
    };
    handleSetChartWidth();

    window.addEventListener("resize", handleSetChartWidth);
    return () => window.removeEventListener("resize", handleSetChartWidth);
  }, []);
  return (
    <div className="flex-[1] h-[300px]">
      <div
        className="h-[300px] overflow-hidden relative"
        style={{
          width: `${chartWidth}px`,
        }}
      >
        <Line
          data={{
            labels,
            datasets: [
              {
                label,
                data,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Insight;
