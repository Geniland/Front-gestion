<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="main-content">
      <TopBar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/layout/Sidebar.vue';
import TopBar from '../components/layout/TopBar.vue';

export default {
  name: 'DashboardLayout',
  components: {
    Sidebar,
    TopBar,
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
}

.main-content {
  flex-grow: 1;
}
</style>
