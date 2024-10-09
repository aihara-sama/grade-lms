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

interface Props {
  labels: string[];
  data: number[];
  label: string;
  shouldCalcRightSide?: boolean;
}

const Insight: FunctionComponent<Props> = ({
  data,
  labels,
  label,
  shouldCalcRightSide = true,
}) => {
  // State
  const [chartWidth, setChartWidth] = useState(0);

  // Effects
  useEffect(() => {
    const calculateChartWidth = () => {
      const contentPadding = 48;
      const rightPanel = 300;
      const contentGap = 30;
      const insightsGap = 20;

      let widthAdjustment = 0;

      if (shouldCalcRightSide) {
        if (window.innerWidth < 1280) {
          widthAdjustment = -contentPadding - insightsGap;
        } else if (window.innerWidth >= 1432) {
          widthAdjustment =
            -(window.innerWidth - 1432) -
            rightPanel -
            contentGap -
            contentPadding;
        } else {
          widthAdjustment = -rightPanel - contentGap - contentPadding;
        }
      } else if (window.innerWidth >= 1432) {
        widthAdjustment =
          -(window.innerWidth - 1432) -
          rightPanel -
          contentGap -
          contentPadding;
      } else if (window.innerWidth < 640) {
        widthAdjustment = -contentPadding - insightsGap;
      } else {
        widthAdjustment = -rightPanel - contentGap - contentPadding;
      }

      // Apply additional width adjustments based on screen size
      const baseWidth = window.innerWidth + widthAdjustment;
      const finalWidth = window.innerWidth >= 768 ? baseWidth / 2 : baseWidth;
      setChartWidth(finalWidth);
    };

    calculateChartWidth();
    window.addEventListener("resize", calculateChartWidth);

    return () => window.removeEventListener("resize", calculateChartWidth);
  }, [shouldCalcRightSide]);

  // View
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
