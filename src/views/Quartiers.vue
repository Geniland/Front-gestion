<template>
  <div class="quartiers-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <span class="title-icon">🏘️</span>
          Gestion des Quartiers
        </h1>
        <p class="page-subtitle">Organisez les localités et quartiers de chaque commune</p>
      </div>
      <button class="add-btn" @click="openModal()">
        <span class="btn-icon">+</span>
        Nouveau Quartier
      </button>
    </header>

    <!-- Filtres -->
    <div class="filters-card">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" v-model="search" placeholder="Rechercher un quartier..." />
      </div>
      <div class="filter-actions">
        <button class="refresh-btn" @click="fetchQuartiers" :disabled="loading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Chargement des quartiers...</p>
      </div>

      <div v-else-if="quartiers.length === 0" class="empty-state">
        <div class="empty-icon">🗺️</div>
        <p>Aucun quartier trouvé</p>
        <button @click="openModal()" class="btn-link">Créer le premier quartier</button>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du Quartier</th>
            <th>Commune</th>
            <th>Date de création</th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quartier in quartiers" :key="quartier.id">
            <td>#{{ quartier.id }}</td>
            <td class="font-bold">{{ quartier.nom }}</td>
            <td>
              <span class="commune-tag" v-if="quartier.commune">
                <i class="fas fa-city"></i> {{ quartier.commune.nom }}
              </span>
              <span v-else class="text-slate-400">Non assignée</span>
            </td>
            <td>{{ formatDate(quartier.created_at) }}</td>
            <td class="actions-cell">
              <button class="action-btn edit" @click="openModal(quartier)" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click="confirmDelete(quartier)" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="pagination">
        <button :disabled="pagination.current_page === 1" @click="fetchQuartiers(pagination.current_page - 1)" class="page-btn">&laquo; Précédent</button>
        <div class="page-numbers">
          <button v-for="page in pagination.last_page" :key="page" @click="fetchQuartiers(page)" class="page-num" :class="{ active: pagination.current_page === page }">{{ page }}</button>
        </div>
        <button :disabled="pagination.current_page === pagination.last_page" @click="fetchQuartiers(pagination.current_page + 1)" class="page-btn">Suivant &raquo;</button>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Modifier le Quartier' : 'Nouveau Quartier' }}</h2>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="saveQuartier" class="modal-form">
            <div class="form-group">
              <label>Nom du Quartier</label>
              <input v-model="form.nom" type="text" placeholder="Ex: Sagbado" required />
            </div>
            <div class="form-group">
              <label>Commune</label>
              <select v-model="form.commune_id" required>
                <option value="">Sélectionner une commune</option>
                <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
              <button type="submit" class="btn-submit" :disabled="saving">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
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
  name: 'Quartiers',
  setup() {
    const quartiers = ref([]);
    const communes = ref([]);
    const pagination = ref(null);
    const loading = ref(false);
    const saving = ref(false);
    const search = ref('');
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentId = ref(null);

    const form = reactive({ commune_id: '', nom: '' });

    const fetchQuartiers = async (page = 1) => {
      loading.value = true;
      try {
        const response = await api.get(`/quartiers?page=${page}`);
        if (response.data.status) {
          quartiers.value = response.data.data.data;
          pagination.value = response.data.data;
        }
      } catch (error) {
        console.error('Erreur chargement quartiers', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCommunes = async () => {
      try {
        const response = await api.get('/communes');
        if (response.data.status) {
          communes.value = response.data.data.data || response.data.data;
        }
      } catch (error) {
        console.error('Erreur chargement communes', error);
      }
    };

    const openModal = (quartier = null) => {
      if (quartier) {
        isEditing.value = true;
        currentId.value = quartier.id;
        form.nom = quartier.nom;
        form.commune_id = quartier.commune_id;
      } else {
        isEditing.value = false;
        currentId.value = null;
        form.nom = '';
        form.commune_id = '';
      }
      showModal.value = true;
    };

    const closeModal = () => { showModal.value = false; };

    const saveQuartier = async () => {
      saving.value = true;
      try {
        if (isEditing.value) {
          await api.put(`/quartiers/${currentId.value}`, form);
        } else {
          await api.post('/quartiers', form);
        }
        fetchQuartiers(pagination.value?.current_page || 1);
        closeModal();
      } catch (error) {
        alert(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        saving.value = false;
      }
    };

    const confirmDelete = async (quartier) => {
      if (confirm(`Supprimer le quartier "${quartier.nom}" ?`)) {
        try {
          await api.delete(`/quartiers/${quartier.id}`);
          fetchQuartiers(pagination.value?.current_page || 1);
        } catch (error) {
          alert('Erreur lors de la suppression');
        }
      }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR');

    onMounted(() => {
      fetchQuartiers();
      fetchCommunes();
    });

    return { quartiers, communes, pagination, loading, saving, search, showModal, isEditing, form, fetchQuartiers, openModal, closeModal, saveQuartier, confirmDelete, formatDate };
  }
};
</script>

<style scoped>
.quartiers-page { padding: 24px; background: #f8fafc; min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 12px; }
.page-subtitle { color: #64748b; margin: 4px 0 0 44px; }
.add-btn { background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.filters-card { background: white; padding: 16px; border-radius: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
.search-box { position: relative; width: 300px; }
.search-box input { width: 100%; padding: 10px 16px 10px 40px; border: 1px solid #e2e8f0; border-radius: 10px; }
.search-box i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
.table-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }

table { width: 100%; border-collapse: collapse; }
th { background: #f1f5f9; padding: 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; }
td { padding: 16px; border-bottom: 1px solid #f1f5f9; }

.font-bold { font-weight: 600; }
.commune-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: #f1f5f9; border-radius: 6px; }

.actions-header { text-align: right; padding-right: 24px !important; }
.actions-cell { text-align: right; padding-right: 24px !important; }
.action-btn { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; margin-left: 8px; }
.edit { background: #f0f9ff; color: #0ea5e9; }
.delete { background: #fef2f2; color: #ef4444; }

.pagination { padding: 16px; display: flex; justify-content: space-between; align-items: center; }
.page-numbers { display: flex; gap: 8px; }
.page-btn, .page-num { padding: 8px 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; }
.page-num.active { background: #0ea5e9; color: white; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { background: white; width: 100%; max-width: 500px; border-radius: 20px; padding: 32px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-form .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.modal-form .form-group label { font-size: 14px; font-weight: 600; color: #475569; }
.modal-form .form-group input, .modal-form .form-group select { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
.btn-cancel { padding: 12px 24px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; }
.btn-submit { padding: 12px 24px; border-radius: 10px; border: none; background: #0ea5e9; color: white; font-weight: 600; cursor: pointer; }

.loader { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #0ea5e9; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.loading-state, .empty-state { padding: 40px; text-align: center; }
</style>
