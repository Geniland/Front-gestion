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
import { onMounted } from 'vue';
import auth from '../store/auth';

export default {
  name: 'DashboardLayout',
  components: {
    Sidebar,
    TopBar,
  },
  setup() {
    onMounted(async () => {
      // console.log('DashboardLayout mounted, fetching profile...');
      await auth.fetchProfile();
    });
  }
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Empêche le contenu de déborder du flex item */
}

.content {
  flex-grow: 1;
  background-color: #f8fafc;
  overflow-y: auto;
}
</style>
