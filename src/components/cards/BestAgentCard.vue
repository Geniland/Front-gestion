<template>
  <div class="best-agent-card">
    <div class="header">
      <i class="icon-agent"></i>
      <span>Meilleur Agent</span>
    </div>
    <div class="agent-info">
      <img src="../../assets/images/agent.jpg" alt="Agent" />
      <div class="details">
        <div class="name">AGT-11 Mensah</div>
        <div class="zone">Adidogomé ></div>
        <div class="amount">1,600,000,00 CFA</div>
      </div>
    </div>
    <div class="stats">
      <div>AGT-11 Mensah <span>94%</span></div>
      <div>1 ECFA Faux guoterds <span>INSBFBAENE' 2024</span></div>
      <div>2 ECFA Taux de rezorescatios <span>A 9%</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BestAgentCard',
};
</script>

<style scoped>
.best-agent-card {
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

.agent-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.agent-info img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.details {
  flex-grow: 1;
}

.name {
  font-weight: bold;
}

.amount {
  font-weight: bold;
  color: #10b981;
}

.stats div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>
