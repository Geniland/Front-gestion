<template>
  <div class="sidebar">
    <div class="logo">
      <img src="../../assets/images/logos.png" alt="Logo" />
      <span>EVENOU TAXE-AFRIQUE</span>
    </div>
    <nav>
      <ul>
        <li :class="{ active: $route.name === 'Dashboard' }">
          <router-link to="/admin">
            <i class="fas fa-tachometer-alt"></i> Tableau de Bord
          </router-link>
        </li>
        
        <template v-if="isSuperAdmin">
          <li class="section-title text-xs font-bold text-gray-400 mt-6 mb-2 px-2 uppercase tracking-widest">Gestion Administrative</li>
          
          <li :class="{ active: $route.name === 'Communes' }">
            <router-link to="/admin/communes">
              <i class="fas fa-city"></i> Communes
            </router-link>
          </li>
          <li :class="{ active: $route.name === 'Quartiers' }">
            <router-link to="/admin/quartiers">
              <i class="fas fa-map-marker-alt"></i> Quartiers
            </router-link>
          </li>
          <li :class="{ active: $route.name === 'Agents' }">
            <router-link to="/admin/agents">
              <i class="fas fa-user-tie"></i> Agents
            </router-link>
          </li>
          <li :class="{ active: $route.name === 'TypeTaxes' }">
            <router-link to="/admin/types-taxes">
              <i class="fas fa-coins"></i> Types de Taxes
            </router-link>
          </li>
        </template>

        <template v-if="isSuperAdmin || isMaire">
          <li class="section-title text-xs font-bold text-gray-400 mt-6 mb-2 px-2 uppercase tracking-widest">Approbations Clients</li>
          
          <li :class="{ active: $route.name === 'AdminContribuables' }">
            <router-link to="/admin/contribuables">
              <i class="fas fa-users"></i> Contribuables
            </router-link>
          </li>
          <li :class="{ active: $route.name === 'AdminTaxes' }">
            <router-link to="/admin/taxes">
              <i class="fas fa-file-invoice-dollar"></i> Taxes à valider
            </router-link>
          </li>
          <li :class="{ active: $route.name === 'AdminPaiements' }">
            <router-link to="/admin/paiements-en-ligne">
              <i class="fas fa-credit-card"></i> Paiements Mobile
            </router-link>
          </li>
          <li :class="{ active: $route.name === 'AdminEtatCivil' }">
            <router-link to="/admin/etat-civil">
              <i class="fas fa-file-signature"></i> État Civil
            </router-link>
          </li>
        </template>

        <template v-if="isSuperAdmin || isMaire">
          <li class="section-title text-xs font-bold text-gray-400 mt-6 mb-2 px-2 uppercase tracking-widest">Contenu & Site</li>
          
          <li :class="{ active: $route.name === 'AdminActualites' }">
            <router-link to="/admin/actualites">
              <i class="fas fa-newspaper"></i> Actualités
            </router-link>
          </li>
          <li :class="{ active: $route.name === 'AdminServices' }">
            <router-link to="/admin/services">
              <i class="fas fa-concierge-bell"></i> Services
            </router-link>
          </li>
        </template>
        
        <li v-if="isSuperAdmin" :class="{ active: $route.name === 'Settings' }">
          <router-link to="/admin/settings">
            <i class="fas fa-cog"></i> Paramètres
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed } from 'vue';
import auth from '../../store/auth';

export default {
  name: 'Sidebar',
  setup() {
    const userRole = computed(() => auth.user.value?.role);
    const isSuperAdmin = computed(() => userRole.value === 'super_admin');
    const isMaire = computed(() => userRole.value === 'maire');
    const isAgent = computed(() => userRole.value === 'agent');

    return {
      isSuperAdmin,
      isMaire,
      isAgent
    };
  }
};
</script>

<style scoped>
/* .sidebar {
  width: 250px;
  background-color: #1e293b;
  color: #fff;
  padding: 20px;
} */
.sidebar {
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  padding: 24px;
  color: #fff;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 50;

  /* Dégradé vert sombre vers transparent + image */
  background-image: 
    linear-gradient(to bottom, rgba(0, 64, 32, 0.9), rgba(0, 64, 32, 0.6)),
    url('../../assets/images/sidebar.png');
    
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.logo img {
  width: 40px;
  margin-right: 10px;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav li {
  margin-bottom: 15px;
}

nav a {
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
}

nav i {
  margin-right: 10px;
}

nav li.active {
  background-color: #0ea5e9;
  border-radius: 5px;
  padding: 10px;
}
</style>
