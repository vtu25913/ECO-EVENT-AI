import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DoughnutChart({ data, labels, colors, className = '' }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || ['#22c55e', '#06b6d4', '#eab308', '#f97316', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          padding: 16,
          usePointStyle: true,
          font: { size: 11 },
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  }

  return <Doughnut data={chartData} options={options} className={className} />
}
