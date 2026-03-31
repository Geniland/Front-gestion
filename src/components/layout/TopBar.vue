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
        <i class="fas fa-cog" @click="$router.push('/settings')"></i>
        
        <!-- Cloche de notification -->
        <div class="notification-wrapper">
          <i class="fas fa-bell" @click="toggleNotifications"></i>
          <span v-if="notificationsCount > 0" class="badge">{{ notificationsCount }}</span>
          
          <div v-if="showNotifications" class="notification-dropdown">
            <div class="dropdown-header">
              <span>Notifications ({{ notificationsCount }})</span>
              <button @click="showNotifications = false">&times;</button>
            </div>
            <div class="dropdown-content">
              <div v-if="notifications.length === 0" class="no-notifications">
                Aucune alerte pour le moment
              </div>
              <div v-for="notif in notifications" :key="notif.id" class="notif-item" :class="notif.type">
                <div class="notif-body">
                  <div class="notif-title">{{ notif.title }}</div>
                  <div class="notif-msg">{{ notif.message }}</div>
                  <div class="notif-meta">
                    <span>Par {{ notif.agent }}</span>
                    <span>{{ notif.date }}</span>
                  </div>
                </div>
                <button class="delete-notif" @click="deleteNotification(notif.taxe_id)">&times;</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Icone User -->
        <div class="user-profile-wrapper">
          <i class="fas fa-user-circle" @click="toggleProfileModal"></i>
          
          <div v-if="showProfileModal" class="profile-modal-overlay" @click.self="showProfileModal = false">
            <div class="profile-modal">
              <div class="modal-header">
                <h3>Mon Profil</h3>
                <button @click="showProfileModal = false">&times;</button>
              </div>
              <form @submit.prevent="updateProfile" class="modal-body">
                <div class="form-group">
                  <label>Nom complet</label>
                  <input type="text" v-model="profileForm.nom" required />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="profileForm.email" required />
                </div>
                <div class="form-group">
                  <label>Téléphone</label>
                  <input type="text" v-model="profileForm.telephone" />
                </div>
                <div class="form-group">
                  <label>Nouveau mot de passe (laisser vide si inchangé)</label>
                  <input type="password" v-model="profileForm.password" />
                </div>
                <div class="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input type="password" v-model="profileForm.password_confirmation" />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="showProfileModal = false">Annuler</button>
                  <button type="submit" class="btn-save" :disabled="updatingProfile">
                    {{ updatingProfile ? 'Mise à jour...' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import auth from '../../store/auth';
import api from '../../api/axios';

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

    // Notifications logic
    const showNotifications = ref(false);
    const notifications = ref([]);
    const notificationsCount = computed(() => notifications.value.length);

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) {
        fetchNotifications();
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/dashboard/risk-fraud');
        if (response.data.success) {
          notifications.value = response.data.data.details || [];
        }
      } catch (error) {
        console.error('Erreur notifications:', error);
      }
    };

    const deleteNotification = async (taxeId) => {
      try {
        await api.delete(`/dashboard/notifications/${taxeId}`);
        notifications.value = notifications.value.filter(n => n.taxe_id !== taxeId);
      } catch (error) {
        console.error('Erreur suppression notification:', error);
      }
    };

    // Profile Modal Logic
    const showProfileModal = ref(false);
    const updatingProfile = ref(false);
    const profileForm = ref({
      nom: auth.user.user?.nom || '',
      email: auth.user.user?.email || '',
      telephone: auth.user.user?.telephone || '',
      password: '',
      password_confirmation: ''
    });

    const toggleProfileModal = () => {
      showProfileModal.value = !showProfileModal.value;
      if (showProfileModal.value) {
        profileForm.value = {
          nom: auth.user.user?.nom || '',
          email: auth.user.user?.email || '',
          telephone: auth.user.user?.telephone || '',
          password: '',
          password_confirmation: ''
        };
      }
    };

    const updateProfile = async () => {
      updatingProfile.value = true;
      try {
        const response = await api.put('/profile', profileForm.value);
        if (response.data.success) {
          // Update local store user
          const updatedUser = response.data.agent;
          auth.user.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(auth.user));
          
          alert('Profil mis à jour avec succès');
          showProfileModal.value = false;
        }
      } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        alert(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        updatingProfile.value = false;
      }
    };

    onMounted(() => {
      fetchNotifications();
    });

    return {
      userName,
      role,
      currentDate,
      handleLogout,
      showNotifications,
      notifications,
      notificationsCount,
      toggleNotifications,
      deleteNotification,
      showProfileModal,
      toggleProfileModal,
      profileForm,
      updateProfile,
      updatingProfile
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

/* Notification styles */
.notification-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 15px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #1e293b;
}

.dropdown-header button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
}

.dropdown-content {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.notif-item {
  padding: 15px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
  transition: background 0.2s;
}

.notif-item:hover {
  background: #f8fafc;
}

.notif-item.danger {
  border-left: 4px solid #ef4444;
}

.notif-body {
  flex: 1;
}

.notif-title {
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 4px;
}

.notif-msg {
  font-size: 13px;
  color: #475569;
  line-height: 1.4;
  margin-bottom: 8px;
}

.notif-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
}

.delete-notif {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 18px;
  cursor: pointer;
  height: fit-content;
  padding: 0 5px;
}

.delete-notif:hover {
  color: #ef4444;
}

/* Profile Modal Styles */
.profile-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.profile-modal {
  background: white;
  width: 450px;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.modal-footer {
  padding: 20px 25px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}

.btn-save {
  padding: 10px 25px;
  background: #0ea5e9;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.btn-save:hover {
  background: #0284c7;
}

.btn-save:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>
