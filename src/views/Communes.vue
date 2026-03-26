<template>
  <div class="communes-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <span class="title-icon">🏛️</span>
          Gestion des Communes
        </h1>
        <p class="page-subtitle">Visualisez et gérez les communes et leurs quartiers</p>
      </div>
      <button class="add-btn" @click="openModal()">
        <span class="btn-icon">+</span>
        Nouvelle Commune
      </button>
    </header>

    <!-- Filtres -->
    <div class="filters-card">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" v-model="search" placeholder="Rechercher une commune..." />
      </div>
      <div class="filter-actions">
        <button class="refresh-btn" @click="fetchCommunes" :disabled="loading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Chargement des communes...</p>
      </div>

      <div v-else-if="communes.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <p>Aucune commune trouvée</p>
        <button @click="openModal()" class="btn-link">Créer la première commune</button>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom de la Commune</th>
            <th>Région</th>
            <!-- <th>Quartiers</th> -->
            <th>Date de création</th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commune in communes" :key="commune.id">
            <td>#{{ commune.id }}</td>
            <td class="font-bold">{{ commune.nom }}</td>
            <td>
              <span class="region-tag">{{ commune.region }}</span>
            </td>
            <!-- <td>
              <div class="quartiers-chips">
                <span v-for="q in commune.quartiers" :key="q.id" class="q-chip">
                  {{ q.nom }}
                </span>
                <span v-if="!commune.quartiers || commune.quartiers.length === 0" class="text-slate-400">
                  Aucun quartier
                </span>
              </div>
            </td> -->
            <td>{{ formatDate(commune.created_at) }}</td>
            <td class="actions-cell">
              <button class="action-btn edit" @click="openModal(commune)" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click="confirmDelete(commune)" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="pagination">
        <button :disabled="pagination.current_page === 1" @click="fetchCommunes(pagination.current_page - 1)" class="page-btn">&laquo; Précédent</button>
        <div class="page-numbers">
          <button v-for="page in pagination.last_page" :key="page" @click="fetchCommunes(page)" class="page-num" :class="{ active: pagination.current_page === page }">{{ page }}</button>
        </div>
        <button :disabled="pagination.current_page === pagination.last_page" @click="fetchCommunes(pagination.current_page + 1)" class="page-btn">Suivant &raquo;</button>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Modifier la Commune' : 'Nouvelle Commune' }}</h2>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="saveCommune" class="modal-form">
            <div class="form-group">
              <label>Nom de la Commune</label>
              <input v-model="form.nom" type="text" placeholder="Ex: Golf 7" required />
            </div>
            <div class="form-group">
              <label>Région</label>
              <input v-model="form.region" type="text" placeholder="Ex: Maritime" required />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
              <button type="submit" class="btn-submit" :disabled="saving">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
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
  name: 'Communes',
  setup() {
    const communes = ref([]);
    const pagination = ref(null);
    const loading = ref(false);
    const saving = ref(false);
    const search = ref('');
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentId = ref(null);
    
    const form = reactive({ 
      nom: '', 
      region: ''
    });

    const fetchCommunes = async (page = 1) => {
      loading.value = true;
      try {
        const response = await api.get(`/communes?page=${page}`);
        if (response.data.status) {
          communes.value = response.data.data.data;
          pagination.value = response.data.data;
        }
      } catch (error) {
        console.error('Erreur chargement communes', error);
      } finally {
        loading.value = false;
      }
    };

    const openModal = (commune = null) => {
      if (commune) {
        isEditing.value = true;
        currentId.value = commune.id;
        form.nom = commune.nom;
        form.region = commune.region;
      } else {
        isEditing.value = false;
        currentId.value = null;
        form.nom = '';
        form.region = '';
      }
      showModal.value = true;
    };

    const closeModal = () => { showModal.value = false; };

    const saveCommune = async () => {
      saving.value = true;
      try {
        if (isEditing.value) {
          await api.put(`/communes/${currentId.value}`, form);
        } else {
          await api.post('/communes', form);
        }
        fetchCommunes(pagination.value?.current_page || 1);
        closeModal();
      } catch (error) {
        alert(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        saving.value = false;
      }
    };

    const confirmDelete = async (commune) => {
      if (confirm(`Supprimer la commune "${commune.nom}" ?`)) {
        try {
          await api.delete(`/communes/${commune.id}`);
          fetchCommunes(pagination.value?.current_page || 1);
        } catch (error) {
          alert('Erreur lors de la suppression');
        }
      }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR');

    onMounted(() => {
      fetchCommunes();
    });

    return { 
      communes, pagination, loading, saving, search, showModal, isEditing, form, 
      fetchCommunes, openModal, closeModal, saveCommune, confirmDelete, formatDate 
    };
  }
};
</script>

<style scoped>
.communes-page { padding: 24px; background: #f8fafc; min-height: 100vh; }
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
.region-tag { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }

.quartiers-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.q-chip { background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 12px; }

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
.modal-card { background: white; width: 100%; max-width: 550px; border-radius: 20px; padding: 32px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 14px; font-weight: 600; color: #475569; }
.form-group input { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; }

/* Quartiers dynamique */
.quartier-input-wrapper { display: flex; gap: 8px; }
.quartier-input-wrapper input { flex: 1; }
.btn-plus { width: 44px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 10px; color: #0ea5e9; cursor: pointer; font-size: 18px; }
.added-quartiers-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.added-q-tag { background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
.added-q-tag button { background: none; border: none; color: #0369a1; cursor: pointer; font-weight: bold; font-size: 16px; line-height: 1; }

.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
.btn-cancel { padding: 12px 24px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; }
.btn-submit { padding: 12px 24px; border-radius: 10px; border: none; background: #0ea5e9; color: white; font-weight: 600; cursor: pointer; }
</style>
