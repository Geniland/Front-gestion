<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
  name: 'RecoveryRateChart',
  components: { Line },
  data() {
    return {
      chartData: {
        labels: ['205', 'fest', 'Sea', '2000', 'Sert', 'Mor', 'Mar', '3k'],
        datasets: [
          {
            label: 'Taux de Recouvrement',
            backgroundColor: '#a7f3d0',
            borderColor: '#10b981',
            data: [2000, 2200, 2500, 2300, 2800, 3000, 3200, 3500],
            fill: true,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>

<style scoped>
.chart-container {
  height: 150px;
}
</style>
