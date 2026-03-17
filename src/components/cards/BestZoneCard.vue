<template>
  <div class="best-zone-card">
    <div class="header">
      <i class="icon-zone"></i>
      <span>Meilleure Zone</span>
    </div>
    <div class="content">
      <div class="zone">Quintox</div>
      <div class="amount">9.450.000</div>
    </div>
    <div class="footer">
      <span>53 rartenes tesies</span>
      <span>+ 15%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BestZoneCard',
};
</script>

<style scoped>
.best-zone-card {
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
  color: #10b981;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.zone {
  font-size: 24px;
  font-weight: bold;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  color: #10b981;
}

.footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
}
</style>
