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
  name: 'AtunessChart',
  components: { Line },
  data() {
    return {
      chartData: {
        labels: ['So', '2001', '2555', 'Sen', '2000', 'Mor', 'Max'],
        datasets: [
          {
            label: 'Atuness',
            backgroundColor: '#a7f3d0',
            borderColor: '#10b981',
            data: [20000, 25000, 22000, 28000, 30000, 32000, 35000],
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
