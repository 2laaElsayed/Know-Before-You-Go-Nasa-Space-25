import React from "react";
import { FaSun, FaCloud, FaCloudRain, FaWind, FaThermometerHalf } from "react-icons/fa";

const staticMetrics = [
  { 
    title: "Temperature", 
    value: "25°C", 
    status: "Sunny", 
    icon: <FaThermometerHalf size={24} />, 
    sparkline: [22, 23, 24, 25, 25] 
  },
  { 
    title: "Wind", 
    value: "10 km/h", 
    status: "Gentle breeze", 
    icon: <FaWind size={24} />, 
    sparkline: [8, 9, 10, 10, 11] 
  },
  { 
    title: "Rain", 
    value: "0.5 mm", 
    status: "Light rain", 
    icon: <FaCloudRain size={24} />, 
    sparkline: [0, 0.2, 0.3, 0.5, 0.4] 
  },
  { 
    title: "Comfort", 
    value: "Comfortable", 
    status: "Great day!", 
    icon: <FaSun size={24} />, 
    sparkline: [70, 75, 78, 80, 79] 
  },
  { 
    title: "ESI Score", 
    value: "45", 
    status: "Moderate", 
    icon: <FaCloud size={24} />, 
    sparkline: [40, 42, 44, 45, 45] 
  },
];

const sparklinePath = (values = [], w = 100, h = 40) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1 || 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return `M ${points.join(" L ")}`;
};

export default function EventDashboardStatic() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Evening Walk</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4
              bg-gradient-to-br from-[#5076B4] to-[#C48EF1] dark:from-[#002E78] dark:to-[#160524]"
          >
            <div className="text-white mb-2">{metric.icon}</div>
            <h2 className="text-xl font-semibold text-white">{metric.title}</h2>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-sm text-white/80">{metric.status}</p>

            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path
                d={sparklinePath(metric.sparkline, 100, 40)}
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
