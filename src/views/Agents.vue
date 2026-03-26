<template>
  <div class="agents-page">
    <!-- Header de la page -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <span class="title-icon">👮‍♂️</span>
          Gestion des Agents
        </h1>
        <p class="page-subtitle">Gérez les comptes des agents, maires et administrateurs</p>
      </div>
      <button class="add-btn" @click="openModal()">
        <span class="btn-icon">+</span>
        Nouvel Agent
      </button>
    </header>

    <!-- Filtres et Recherche -->
    <div class="filters-card">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" v-model="search" placeholder="Rechercher un agent, email, rôle..." />
      </div>
      <div class="filter-actions">
        <button class="refresh-btn" @click="fetchAgents" :disabled="loading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Table des Agents -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Chargement des agents...</p>
      </div>

      <div v-else-if="agents.length === 0" class="empty-state">
        <div class="empty-icon">👥</div>
        <p>Aucun agent trouvé</p>
        <button @click="openModal()" class="btn-link">Créer le premier agent</button>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Contact</th>
            <th>Commune</th>
            <th>Rôle</th>
            <th>Date d'inscription</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agent in agents" :key="agent.id">
            <td>
              <div class="agent-profile">
                <div class="avatar">{{ agent.nom.charAt(0) }}</div>
                <div class="info">
                  <span class="font-bold">{{ agent.nom }}</span>
                  <span class="text-xs text-slate-500">ID #{{ agent.id }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="contact-info">
                <span class="email"><i class="far fa-envelope"></i> {{ agent.email }}</span>
                <span class="phone"><i class="fas fa-phone-alt"></i> {{ agent.telephone }}</span>
              </div>
            </td>
            <td>
              <span class="commune-tag" v-if="agent.commune">
                <i class="fas fa-city"></i> {{ agent.commune.nom }}
              </span>
              <span v-else class="text-slate-400">Non assignée</span>
            </td>
            <td>
              <span class="badge" :class="getRoleClass(agent.role)">
                {{ formatRole(agent.role) }}
              </span>
              <div v-if="agent.is_blocked" class="blocked-tag" :title="agent.blocked_reason">
                <i class="fas fa-ban"></i> Bloqué
              </div>
            </td>
            <td>{{ formatDate(agent.created_at) }}</td>
            <td class="text-right actions-cell">
              <button 
                class="action-btn block" 
                @click="agent.is_blocked ? unblockAgent(agent) : promptBlockAgent(agent)" 
                :title="agent.is_blocked ? 'Débloquer' : 'Bloquer'"
                :class="{ 'is-blocked': agent.is_blocked }"
              >
                <i class="fas" :class="agent.is_blocked ? 'fa-unlock' : 'fa-lock'"></i>
              </button>
              <button class="action-btn edit" @click="openModal(agent)" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click="confirmDelete(agent)" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="pagination">
        <button 
          :disabled="pagination.current_page === 1" 
          @click="fetchAgents(pagination.current_page - 1)"
          class="page-btn"
        >
          &laquo; Précédent
        </button>
        <div class="page-numbers">
          <button 
            v-for="page in pagination.last_page" 
            :key="page"
            @click="fetchAgents(page)"
            class="page-num"
            :class="{ active: pagination.current_page === page }"
          >
            {{ page }}
          </button>
        </div>
        <button 
          :disabled="pagination.current_page === pagination.last_page" 
          @click="fetchAgents(pagination.current_page + 1)"
          class="page-btn"
        >
          Suivant &raquo;
        </button>
      </div>
    </div>

    <!-- Modal Ajout/Modification -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Modifier l\'Agent' : 'Nouvel Agent' }}</h2>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="saveAgent" class="modal-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nom complet</label>
                <input v-model="form.nom" type="text" placeholder="Ex: Jean Dupont" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" placeholder="agent@mairie.tg" required />
              </div>
              <div class="form-group">
                <label>Téléphone</label>
                <input v-model="form.telephone" type="text" placeholder="Ex: +228 90 00 00 00" required />
              </div>
              <div class="form-group">
                <label>Commune</label>
                <select v-model="form.commune_id" required>
                  <option value="">Sélectionner une commune</option>
                  <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Rôle</label>
                <select v-model="form.role" required>
                  <option value="agent">Agent</option>
                  <option value="maire">Maire</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>Mot de passe {{ isEditing ? '(Laisser vide pour ne pas changer)' : '' }}</label>
                <input v-model="form.password" type="password" placeholder="••••••••" :required="!isEditing" />
              </div>
              <div class="form-group" v-if="form.password">
                <label>Confirmer le mot de passe</label>
                <input v-model="form.password_confirmation" type="password" placeholder="••••••••" required />
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
              <button type="submit" class="btn-submit" :disabled="saving">
                {{ saving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'agent') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import api from '../api/axios';

export default {
  name: 'Agents',
  setup() {
    const agents = ref([]);
    const communes = ref([]);
    const pagination = ref(null);
    const loading = ref(false);
    const saving = ref(false);
    const search = ref('');
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentId = ref(null);

    const form = reactive({
      commune_id: '',
      nom: '',
      telephone: '',
      email: '',
      role: 'agent',
      password: '',
      password_confirmation: ''
    });

    const fetchAgents = async (page = 1) => {
      loading.value = true;
      try {
        const response = await api.get(`/agents?page=${page}`);
        if (response.data.status) {
          agents.value = response.data.data.data;
          pagination.value = response.data.data;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des agents', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCommunes = async () => {
      try {
        const response = await api.get('/communes'); // On suppose une route pour lister toutes les communes
        if (response.data.status) {
          communes.value = response.data.data.data || response.data.data;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des communes', error);
      }
    };

    const openModal = (agent = null) => {
      if (agent) {
        isEditing.value = true;
        currentId.value = agent.id;
        form.nom = agent.nom;
        form.email = agent.email;
        form.telephone = agent.telephone;
        form.commune_id = agent.commune_id;
        form.role = agent.role;
        form.password = '';
        form.password_confirmation = '';
      } else {
        isEditing.value = false;
        currentId.value = null;
        form.nom = '';
        form.email = '';
        form.telephone = '';
        form.commune_id = '';
        form.role = 'agent';
        form.password = '';
        form.password_confirmation = '';
      }
      showModal.value = true;
      if (communes.value.length === 0) fetchCommunes();
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveAgent = async () => {
      saving.value = true;
      try {
        const payload = { ...form };
        if (isEditing.value) {
          await api.put(`/agents/${currentId.value}`, payload);
        } else {
          await api.post('/agents', payload);
        }
        fetchAgents(pagination.value?.current_page || 1);
        closeModal();
      } catch (error) {
        alert(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        saving.value = false;
      }
    };

    const confirmDelete = async (agent) => {
      if (confirm(`Voulez-vous vraiment supprimer l'agent "${agent.nom}" ?`)) {
        try {
          await api.delete(`/agents/${agent.id}`);
          fetchAgents(pagination.value?.current_page || 1);
        } catch (error) {
          alert('Erreur lors de la suppression');
        }
      }
    };

    const promptBlockAgent = async (agent) => {
      const reason = prompt(`Raison du blocage pour ${agent.nom} :`);
      if (reason) {
        try {
          await api.post(`/agents/${agent.id}/block`, { reason });
          fetchAgents(pagination.value?.current_page || 1);
        } catch (error) {
          alert('Erreur lors du blocage');
        }
      }
    };

    const unblockAgent = async (agent) => {
      if (confirm(`Voulez-vous débloquer l'agent ${agent.nom} ?`)) {
        try {
          // On utilise l'update classique pour débloquer
          await api.post(`/agents/${agent.id}/unblock `, { 
            ...agent,
            is_blocked: false,
            blocked_reason: null
          });
          fetchAgents(pagination.value?.current_page || 1);
        } catch (error) {
          alert('Erreur lors du déblocage');
        }
      }
    };

    const getRoleClass = (role) => {
      const classes = {
        'super_admin': 'role-super-admin',
        'maire': 'role-maire',
        'agent': 'role-agent'
      };
      return classes[role] || 'role-default';
    };

    const formatRole = (role) => {
      const roles = {
        'super_admin': 'Super Admin',
        'maire': 'Maire',
        'agent': 'Agent'
      };
      return roles[role] || role;
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    onMounted(() => {
      fetchAgents();
      fetchCommunes();
    });

    return {
      agents,
      communes,
      pagination,
      loading,
      saving,
      search,
      showModal,
      isEditing,
      form,
      fetchAgents,
      openModal,
      closeModal,
      saveAgent,
      confirmDelete,
      promptBlockAgent,
      unblockAgent,
      getRoleClass,
      formatRole,
      formatDate
    };
  }
};
</script>

<style scoped>
.agents-page {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-subtitle { color: #64748b; margin: 4px 0 0 44px; }

.add-btn {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.filters-card {
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.search-box { position: relative; width: 350px; }
.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
.search-box i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }

.table-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
}

table { width: 100%; border-collapse: collapse; }
th { background: #f1f5f9; padding: 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; }
td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }

.agent-profile { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 40px;
  height: 40px;
  background: #e0f2fe;
  color: #0ea5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.info { display: flex; flex-direction: column; }
.font-bold { font-weight: 600; color: #1e293b; }
.text-xs { font-size: 11px; }

.contact-info { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.contact-info i { width: 16px; color: #94a3b8; }

.commune-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
}

.badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
.role-super-admin { background: #fee2e2; color: #dc2626; }
.role-maire { background: #fef3c7; color: #d97706; }
.role-agent { background: #dcfce7; color: #16a34a; }

.blocked-tag {
  margin-top: 5px;
  font-size: 10px;
  color: #ef4444;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; margin-left: 6px; }
.edit { background: #f0f9ff; color: #0ea5e9; }
.delete { background: #fef2f2; color: #ef4444; }
.block { background: #f3f4f6; color: #4b5563; }
.block.is-blocked { background: #fef2f2; color: #ef4444; }

.edit:hover { background: #0ea5e9; color: white; }
.delete:hover { background: #ef4444; color: white; }
.block:hover { background: #4b5563; color: white; }
.block.is-blocked:hover { background: #ef4444; color: white; }

/* Pagination */
.pagination { padding: 16px; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-top: 1px solid #e2e8f0; }
.page-numbers { display: flex; gap: 6px; }
.page-btn, .page-num { padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; cursor: pointer; }
.page-num.active { background: #0ea5e9; color: white; border-color: #0ea5e9; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { background: white; width: 100%; max-width: 600px; border-radius: 20px; padding: 32px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 14px; font-weight: 600; color: #475569; }
.form-group input, .form-group select { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; }

.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
.btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; }
.btn-submit { padding: 10px 20px; border-radius: 8px; border: none; background: #0ea5e9; color: white; font-weight: 600; cursor: pointer; }

.loader { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #0ea5e9; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.loading-state, .empty-state { padding: 40px; text-align: center; }
</style>
