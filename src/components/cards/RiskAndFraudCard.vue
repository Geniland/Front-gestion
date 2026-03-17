<template>
  <div class="risk-fraud-card">
    <div class="header">
      <i class="icon-fraud"></i>
      <span>Risque et Fraude</span>
    </div>
    <div class="content">
      <div class="item">
        <span>Alertes</span>
        <span>3</span>
      </div>
      <div class="item">
        <span>Anomalies detectées</span>
        <span>2</span>
      </div>
      <div class="item">
        <span>Taxues suspects</span>
        <span>16</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskAndFraudCard',
};
</script>

<style scoped>
.risk-fraud-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header i {
  margin-right: 10px;
  color: #ef4444;
}

.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
