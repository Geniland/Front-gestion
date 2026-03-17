<template>
  <div class="top-bar">
    <div class="title">E-TAXE AFRIQUE</div>
    <div class="user-info">
      <div class="user-details">
        <span class="role">{{ role }}</span>
        <span class="greeting">Bonjour {{ userName }} | {{ currentDate }}</span>
      </div>
      <div class="icons">
        <button @click="handleLogout" class="logout-btn" title="Se déconnecter">
          <i class="fas fa-sign-out-alt"></i>
        </button>
        <i class="fas fa-cog"></i>
        <i class="fas fa-bell"></i>
        <i class="fas fa-user-circle"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import auth from '../../store/auth';

export default {
  name: 'TopBar',
  setup() {
    const router = useRouter();
    
    const userName = computed(() => auth.user.user?.nom || 'Utilisateur');
    const role = computed(() => auth.user.user?.role || 'Role');
    
    const currentDate = computed(() => {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Intl.DateTimeFormat('fr-FR', options).format(new Date());
    });

    const handleLogout = async () => {
      await auth.logout();
      router.push('/login');
    };

    return {
      userName,
      role,
      currentDate,
      handleLogout
    };
  }
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #fff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-right: 25px;
  text-align: right;
}

.role {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: -2px;
}

.greeting {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}

.icons {
  display: flex;
  align-items: center;
  gap: 18px;
}

.icons i {
  font-size: 18px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.icons i:hover {
  color: #0ea5e9;
}

.logout-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn i {
  color: #ef4444;
}

.logout-btn i:hover {
  color: #b91c1c;
}
</style>
