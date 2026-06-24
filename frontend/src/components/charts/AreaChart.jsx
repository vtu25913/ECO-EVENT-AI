import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function AreaChart({ labels, datasets, className = '' }) {
  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 2,
    })),
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#9ca3af', usePointStyle: true, font: { size: 11 } },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6b7280' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6b7280' },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }

  return <Line data={data} options={options} className={className} />
}
