<template>
  <div class="revenue-chart">
    <div class="chart-header">
      <h3 class="chart-title">Prévision des Recettes 2027</h3>
      <div class="chart-legend">
        <span class="legend-item">
          <span class="legend-color" style="background: linear-gradient(180deg, #10b981, #059669)"></span>
          Recettes projetées
        </span>
      </div>
    </div>
    
    <div class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    
    <div class="chart-footer">
      <div class="stats-mini">
        <div class="stat-mini-item">
          <span class="stat-mini-label">Moyenne</span>
          <span class="stat-mini-value">{{ averageValue }} M FCFA</span>
        </div>
        <div class="stat-mini-item">
          <span class="stat-mini-label">Croissance</span>
          <span class="stat-mini-value positive">+{{ growthRate }}%</span>
        </div>
        <div class="stat-mini-item">
          <span class="stat-mini-label">Pic</span>
          <span class="stat-mini-value">{{ maxValue }} M FCFA</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Filler
);

export default {
  name: 'RevenueForecastChart',
  components: { Line },
  data() {
    return {
      chartData: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
          {
            label: 'Prévision des Recettes',
            data: [40, 39, 45, 52, 58, 63, 68, 72, 75, 78, 82, 85],
            //  data: [],
            borderColor: '#10b981',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
              gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
              gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
              return gradient;
            },
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#059669',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 3,
            borderWidth: 3,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            titleColor: '#111827',
            titleFont: {
              family: 'Inter, sans-serif',
              size: 13,
              weight: '600',
            },
            bodyColor: '#374151',
            bodyFont: {
              family: 'Inter, sans-serif',
              size: 12,
            },
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(context.parsed.y * 1000000);
                }
                return label;
              }
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(156, 163, 175, 0.15)',
              drawBorder: false,
              lineWidth: 1,
            },
            ticks: {
              callback: function(value) {
                return value + 'M';
              },
              color: '#6b7280',
              font: {
                family: 'Inter, sans-serif',
                size: 11,
                weight: '500',
              },
              padding: 8,
              stepSize: 20,
            },
            title: {
              display: true,
              text: 'Montant (Millions FCFA)',
              color: '#9ca3af',
              font: {
                family: 'Inter, sans-serif',
                size: 11,
                weight: '400',
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6b7280',
              font: {
                family: 'Inter, sans-serif',
                size: 11,
                weight: '500',
              },
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
        elements: {
          line: {
            borderJoinStyle: 'round',
          },
          point: {
            hoverBorderWidth: 3,
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animations: {
          tension: {
            duration: 1500,
            easing: 'easeInOutQuart',
          },
          y: {
            duration: 1500,
            easing: 'easeInOutQuart',
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 5,
            right: 15
          }
        }
      },
    };
  },
  computed: {
    averageValue() {
      const sum = this.chartData.datasets[0].data.reduce((a, b) => a + b, 0);
      return (sum / this.chartData.datasets[0].data.length).toFixed(1);
    },
    growthRate() {
      const first = this.chartData.datasets[0].data[0];
      const last = this.chartData.datasets[0].data[this.chartData.datasets[0].data.length - 1];
      return (((last - first) / first) * 100).toFixed(1);
    },
    maxValue() {
      return Math.max(...this.chartData.datasets[0].data);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.revenue-chart {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
  border: 1px solid rgba(229, 231, 235, 0.6);
  position: relative;
  overflow: hidden;
}

.revenue-chart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #059669, #10b981);
  background-size: 200% 100%;
  animation: gradientMove 3s ease infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.revenue-chart:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(16, 185, 129, 0.15), 0 12px 24px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.chart-title {
  font-size: 1.35rem;
  font-weight: 600;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  position: relative;
  padding-left: 12px;
}

.chart-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

.chart-legend {
  display: flex;
  gap: 16px;
  background: #f9fafb;
  padding: 8px 16px;
  border-radius: 40px;
  border: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: #10b981;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.chart-container {
  height: 350px;
  position: relative;
  margin-bottom: 20px;
}

.chart-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  margin-top: 4px;
}

.stats-mini {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.stat-mini-item {
  text-align: center;
  flex: 1;
  padding: 12px 8px;
  background: #f9fafb;
  border-radius: 16px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.stat-mini-item:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
  transform: translateY(-2px);
}

.stat-mini-label {
  display: block;
  font-size: 0.7rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.stat-mini-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-mini-value.positive {
  color: #10b981;
  position: relative;
  display: inline-block;
}

.stat-mini-value.positive::after {
  content: '▲';
  font-size: 0.8rem;
  margin-left: 4px;
  opacity: 0.7;
}

/* Animation d'entrée */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.revenue-chart {
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Responsive */
@media (max-width: 768px) {
  .revenue-chart {
    padding: 16px;
  }
  
  .chart-title {
    font-size: 1.1rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .stats-mini {
    flex-wrap: wrap;
  }
  
  .stat-mini-item {
    min-width: calc(33.333% - 12px);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .revenue-chart {
    background: #1f2937;
    border-color: #374151;
  }
  
  .chart-title {
    background: linear-gradient(135deg, #f9fafb, #e5e7eb);
    -webkit-background-clip: text;
  }
  
  .chart-legend {
    background: #374151;
    border-color: #4b5563;
  }
  
  .legend-item {
    color: #d1d5db;
  }
  
  .stat-mini-item {
    background: #374151;
  }
  
  .stat-mini-value {
    color: #f9fafb;
  }
  
  .stat-mini-label {
    color: #9ca3af;
  }
  
  .chart-footer {
    border-top-color: #374151;
  }
}
</style>