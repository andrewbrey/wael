import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { type LogEntryWithFmt } from "~/types";

interface ChartProps {
  data: Array<LogEntryWithFmt>;
}

export const CSRChart = ({ data }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const largeScreen = window.innerWidth > 1024;
  const displayData = data.slice(largeScreen ? 0 : Math.max(data.length - 30, 0));

  useEffect(() => {
    if (!canvasRef.current) return;

    new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: displayData.map((entry) => entry.fmtCreatedAt),
        datasets: [
          {
            label: "Weight (lbs)",
            data: displayData.map((entry) => entry.weight),
            borderColor: "rgba(0,0,0,0.9)",
            pointStyle: "circle",
            pointBorderWidth: 0,
            pointRadius: largeScreen ? 6 : 4,
            pointHitRadius: largeScreen ? 40 : 20,
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        elements: {
          point: {
            backgroundColor: (item) => {
              const raw = displayData.at(item.dataIndex);

              if (raw?.cardio && raw?.lift) return "rgba(0,0,0,0.7)";
              if (raw?.cardio && !raw?.lift) return "rgba(0,0,0,0.4)";
              if (!raw?.cardio && raw?.lift) return "rgba(0,0,0,0.4)";

              return "rgba(0,0,0,0.1)";
            },
          },
        },
        plugins: {
          title: { display: false },
          legend: { display: false },
          tooltip: {
            callbacks: {
              footer: ([item]) => {
                const raw = displayData.at(item.dataIndex);

                const cardio = raw?.cardio ? "Yes" : "No";
                const lift = raw?.lift ? "Yes" : "No";

                return [`Cardio — ${cardio}`, `Lift — ${lift}`].join("\n");
              },
            },
          },
        },
        scales: {
          y: { min: 140, max: 190 },
          x: { display: false },
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  return <canvas ref={canvasRef}></canvas>;
};
