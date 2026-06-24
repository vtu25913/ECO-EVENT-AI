import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function RadarChart({ labels, datasets, className = '' }) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      ...ds,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.3,
    })),
  }

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#6b7280',
          backdropColor: 'transparent',
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
        angleLines: { color: 'rgba(255,255,255,0.05)' },
        pointLabels: {
          color: '#9ca3af',
          font: { size: 11 },
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#9ca3af', usePointStyle: true, font: { size: 11 } },
      },
    },
    maintainAspectRatio: true,
  }

  return <Radar data={data} options={options} className={className} />
}
