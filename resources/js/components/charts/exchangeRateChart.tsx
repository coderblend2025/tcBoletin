import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

const exchangeRateData: Record<string, number[]> = {
  '2023': [6.95, 6.94, 6.96, 6.92, 6.91, 6.93, 6.94, 6.96, 6.97, 6.98, 6.99, 7.00],
  '2024': [6.98, 6.97, 6.96, 6.99, 7.00, 7.01, 6.99, 6.97, 6.95, 6.93, 6.94, 6.96],
  '2025': [7.01, 7.00, 13.99, 14.98, 10.97, 12.96, 11.95, 15.94, 16.93, 17.92, 18.91, 19.90],
};

const months = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export default function ExchangeRateChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: `Tipo de cambio en ${selectedYear}`,
          data: exchangeRateData[selectedYear],
          borderColor: '#2563eb', 
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#1e3a8a', 
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#1e293b',
              font: { size: 12 }
            },
            grid: { display: false }
          },
          y: {
            beginAtZero: false,
            suggestedMin: 6.8,
            suggestedMax: 7.2,
            ticks: {
              color: '#1e293b',
              font: { size: 12 }
            },
            grid: {
              color: '#e2e8f0' 
            }
          }
        }
      }
    });
  }, [selectedYear]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-end">
        <select
          className="px-4 py-2 text-sm text-blue-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 bg-white hover:bg-blue-50"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {Object.keys(exchangeRateData).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full overflow-x-auto">
        <canvas ref={chartRef} className="w-full h-72" />
      </div>
        <p className="mt-4 text-sm text-gray-500 text-right italic">
          Fuente: Banco Central de Bolivia
        </p>
    </motion.div>
  );
}
