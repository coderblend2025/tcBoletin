
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

const months = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

// Datos hardcodeados USDT/BOB mercado paralelo (aproximado)
const hardcodedRates: Record<string, number[]> = {
  '2023': [13.8, 13.8, 13.8, 13.8, 13.8, 13.8, 13.8, 13.8, 13.8, 13.8, 13.8, 13.8],
  '2024': [14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0],
  '2025': [15.0, 15.2, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, NaN, NaN, NaN, NaN]
};


export default function ExchangeRateChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  // Rango de fechas
  const [startYear, setStartYear] = useState('2023');
  const [startMonth, setStartMonth] = useState('1');
  const [endYear, setEndYear] = useState('2025');
  const [endMonth, setEndMonth] = useState('12');

  // Generar datos y etiquetas según rango
  const yearOptions = ['2023', '2024', '2025'];
  const monthOptions = months.map((m, i) => ({ label: m, value: String(i + 1) }));

  // Construir arrays de labels y valores según rango seleccionado
  const monthlyLabels: string[] = [];
  const monthlyAverages: number[] = [];
  for (let y = Number(startYear); y <= Number(endYear); y++) {
    const rates = hardcodedRates[String(y)];
    if (!rates) continue;
    let mStart = y === Number(startYear) ? Number(startMonth) : 1;
    let mEnd = y === Number(endYear) ? Number(endMonth) : 12;
    for (let m = mStart; m <= mEnd; m++) {
      monthlyLabels.push(`${months[m - 1]} ${y}`);
      monthlyAverages.push(rates[m - 1]);
    }
  }

  useEffect(() => {
    if (!chartRef.current) return;
    if (monthlyLabels.length === 0 || monthlyAverages.length === 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyLabels,
        datasets: [{
          label: `USDT/BOB (${monthlyLabels[0]} - ${monthlyLabels[monthlyLabels.length - 1]})`,
          data: monthlyAverages,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#fff',
          borderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 1200,
          easing: 'easeOutBounce',
        },
        plugins: {
          legend: {
            labels: {
              color: '#1e3a8a',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#2563eb',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#1e3a8a',
            borderWidth: 2,
            padding: 12,
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#1e293b',
              font: { size: 14 }
            },
            grid: { display: false }
          },
          y: {
            beginAtZero: false,
            suggestedMin: 6.8,
            suggestedMax: 7.1,
            ticks: {
              color: '#1e293b',
              font: { size: 14 }
            },
            grid: {
              color: '#e2e8f0'
            }
          }
        }
      }
    });
  }, [monthlyLabels.join(','), monthlyAverages.join(',')]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-end mb-2 w-full">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-blue-800 font-semibold">Desde:</span>
          <select
            className="px-2 py-1 text-xs sm:text-base text-blue-800 font-semibold bg-white rounded shadow w-full sm:w-auto focus:ring-2 focus:ring-blue-200"
            value={startMonth}
            onChange={e => setStartMonth(e.target.value)}
          >
            {monthOptions.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            className="px-2 py-1 text-xs sm:text-base text-blue-800 font-semibold bg-white rounded shadow w-full sm:w-auto focus:ring-2 focus:ring-blue-200"
            value={startYear}
            onChange={e => setStartYear(e.target.value)}
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-blue-800 font-semibold">Hasta:</span>
          <select
            className="px-2 py-1 text-xs sm:text-base text-blue-800 font-semibold bg-white rounded shadow w-full sm:w-auto focus:ring-2 focus:ring-blue-200"
            value={endMonth}
            onChange={e => setEndMonth(e.target.value)}
          >
            {monthOptions.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            className="px-2 py-1 text-xs sm:text-base text-blue-800 font-semibold bg-white rounded shadow w-full sm:w-auto focus:ring-2 focus:ring-blue-200"
            value={endYear}
            onChange={e => setEndYear(e.target.value)}
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        {monthlyLabels.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] sm:h-[500px] text-red-700 font-bold text-base sm:text-lg">No hay datos para el rango seleccionado.</div>
        ) : (
          <div className="w-full min-w-[220px] sm:min-w-0">
            <canvas ref={chartRef} className="w-full h-[220px] sm:h-[500px]" />
          </div>
        )}
      </div>
      <p className="mt-2 sm:mt-4 text-xs sm:text-base text-gray-500 text-right italic">
        Fuente: Binance (USDT/BOB)
      </p>
    </motion.div>
  );
}
