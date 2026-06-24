import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BarChart({ labels, datasets, horizontal = false, className = '' }) {
  const data = { labels, datasets }

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
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
  }

  return <Bar data={data} options={options} className={className} />
}
