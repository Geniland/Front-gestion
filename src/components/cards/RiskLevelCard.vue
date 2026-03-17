<template>
  <div class="risk-level-card">
    <div class="header">
      <i class="icon-risk"></i>
      <span>Niveau de Risque</span>
    </div>
    <div class="content">
      <div class="level">Médium <span>2</span></div>
      <div class="alerts">Alertes <span>2</span></div>
    </div>
    <div class="footer">
      <span>2 s alerc acclivéés</span>
      <span>3 zus ▷</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskLevelCard',
};
</script>

<style scoped>
.risk-level-card {
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
  color: #f59e0b;
}

.content {
  text-align: center;
  margin-bottom: 20px;
}

.level {
  font-size: 24px;
  font-weight: bold;
  color: #f59e0b;
}

.level span {
  font-size: 48px;
}

.alerts {
  font-size: 18px;
  color: #64748b;
}

.footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
}
</style>
