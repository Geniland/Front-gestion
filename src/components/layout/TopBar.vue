<template>
  <div class="top-bar">
    <div class="title">EV-TAXE AFRIQUE</div>
    <div class="user-info">
      <span>Admin Bonjour Marc | 24 Avril 2024</span>
      <div class="icons">
        <i class="icon-settings"></i>
        <i class="icon-notifications"></i>
        <i class="icon-user"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-right: 20px;
}

.icons i {
  margin-left: 15px;
  cursor: pointer;
}
</style>
