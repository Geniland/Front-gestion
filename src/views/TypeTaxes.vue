<template>
  <div class="typetaxes-page">
    <!-- Header de la page -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <span class="title-icon">📜</span>
          Types de Taxes
        </h1>
        <p class="page-subtitle">Configurez les différentes catégories de taxes et leurs montants</p>
      </div>
      <button class="add-btn" @click="openModal()">
        <span class="btn-icon">+</span>
        Nouveau Type
      </button>
    </header>

    <!-- Filtres et Recherche -->
    <div class="filters-card">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" v-model="search" placeholder="Rechercher un type de taxe..." />
      </div>
      <div class="filter-actions">
        <button class="refresh-btn" @click="fetchTypeTaxes" :disabled="loading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Table des Types de Taxes -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Chargement des types de taxes...</p>
      </div>

      <div v-else-if="typetaxes.length === 0" class="empty-state">
        <div class="empty-icon">📄</div>
        <p>Aucun type de taxe configuré</p>
        <button @click="openModal()" class="btn-link">Créer le premier type de taxe</button>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Nom & Description</th>
            <th>Commune</th>
            <th>Montant de Base</th>
            <th>Périodicité</th>
            <th>Statut</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in typetaxes" :key="type.id">
            <td>
              <div class="type-info">
                <span class="font-bold">{{ type.nom }}</span>
                <span class="description text-xs">{{ type.description || 'Aucune description' }}</span>
              </div>
            </td>
            <td>
              <span class="commune-tag" v-if="type.commune">
                <i class="fas fa-city"></i> {{ type.commune.nom }}
              </span>
            </td>
            <td>
              <span class="amount-tag">{{ formatCurrency(type.montant_base) }}</span>
            </td>
            <td>
              <span class="badge period-badge">{{ formatPeriode(type.periode) }}</span>
            </td>
            <td>
              <span class="badge" :class="type.actif ? 'status-active' : 'status-inactive'">
                {{ type.actif ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="text-right actions-cell">
              <button class="action-btn edit" @click="openModal(type)" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click="confirmDelete(type)" title="Supprimer">
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
          @click="fetchTypeTaxes(pagination.current_page - 1)"
          class="page-btn"
        >
          &laquo; Précédent
        </button>
        <div class="page-numbers">
          <button 
            v-for="page in pagination.last_page" 
            :key="page"
            @click="fetchTypeTaxes(page)"
            class="page-num"
            :class="{ active: pagination.current_page === page }"
          >
            {{ page }}
          </button>
        </div>
        <button 
          :disabled="pagination.current_page === pagination.last_page" 
          @click="fetchTypeTaxes(pagination.current_page + 1)"
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
            <h2>{{ isEditing ? 'Modifier le Type de Taxe' : 'Nouveau Type de Taxe' }}</h2>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="saveTypeTaxe" class="modal-form">
            <div class="form-grid">
              <div class="form-group full">
                <label>Nom du Type de Taxe</label>
                <input v-model="form.nom" type="text" placeholder="Ex: Taxe de Voirie" required />
              </div>
              <div class="form-group full">
                <label>Description</label>
                <textarea v-model="form.description" rows="3" placeholder="Description courte du type de taxe..."></textarea>
              </div>
              <div class="form-group">
                <label>Commune</label>
                <select v-model="form.commune_id" required>
                  <option value="">Sélectionner une commune</option>
                  <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Montant de Base (FCFA)</label>
                <input v-model="form.montant_base" type="number" step="0.01" min="0" required />
              </div>
              <div class="form-group">
                <label>Périodicité</label>
                <select v-model="form.periode" required>
                  <option value="journalier">Journalier</option>
                  <option value="mensuel">Mensuel</option>
                  <option value="annuel">Annuel</option>
                  <option value="unique">Unique</option>
                </select>
              </div>
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.actif" />
                  Statut Actif
                </label>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
              <button type="submit" class="btn-submit" :disabled="saving">
                {{ saving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le type') }}
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
  name: 'TypeTaxes',
  setup() {
    const typetaxes = ref([]);
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
      description: '',
      montant_base: 0,
      periode: 'mensuel',
      actif: true
    });

    const fetchTypeTaxes = async (page = 1) => {
      loading.value = true;
      try {
        const response = await api.get(`/types-taxes?page=${page}`);
        if (response.data.success) {
          typetaxes.value = response.data.data.data;
          pagination.value = response.data.data;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des types de taxes', error);
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
        console.error('Erreur lors du chargement des communes', error);
      }
    };

    const openModal = (type = null) => {
      if (type) {
        isEditing.value = true;
        currentId.value = type.id;
        form.nom = type.nom;
        form.description = type.description;
        form.commune_id = type.commune_id;
        form.montant_base = type.montant_base;
        form.periode = type.periode;
        form.actif = !!type.actif;
      } else {
        isEditing.value = false;
        currentId.value = null;
        form.nom = '';
        form.description = '';
        form.commune_id = '';
        form.montant_base = 0;
        form.periode = 'mensuel';
        form.actif = true;
      }
      showModal.value = true;
      if (communes.value.length === 0) fetchCommunes();
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveTypeTaxe = async () => {
      saving.value = true;
      try {
        const payload = { ...form };
        if (isEditing.value) {
          await api.put(`/types-taxes/${currentId.value}`, payload);
        } else {
          await api.post('/types-taxes', payload);
        }
        fetchTypeTaxes(pagination.value?.current_page || 1);
        closeModal();
      } catch (error) {
        alert(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        saving.value = false;
      }
    };

    const confirmDelete = async (type) => {
      if (confirm(`Voulez-vous vraiment supprimer le type de taxe "${type.nom}" ?`)) {
        try {
          await api.delete(`/types-taxes/${type.id}`);
          fetchTypeTaxes(pagination.value?.current_page || 1);
        } catch (error) {
          alert('Erreur lors de la suppression');
        }
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
      }).format(amount || 0);
    };

    const formatPeriode = (periode) => {
      const periodes = {
        'journalier': 'Journalier',
        'mensuel': 'Mensuel',
        'annuel': 'Annuel',
        'unique': 'Unique'
      };
      return periodes[periode] || periode;
    };

    onMounted(() => {
      fetchTypeTaxes();
      fetchCommunes();
    });

    return {
      typetaxes,
      communes,
      pagination,
      loading,
      saving,
      search,
      showModal,
      isEditing,
      form,
      fetchTypeTaxes,
      openModal,
      closeModal,
      saveTypeTaxe,
      confirmDelete,
      formatCurrency,
      formatPeriode
    };
  }
};
</script>

<style scoped>
.typetaxes-page {
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
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
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

.type-info { display: flex; flex-direction: column; gap: 2px; }
.description { color: #64748b; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.amount-tag {
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 4px 8px;
  border-radius: 6px;
}

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
.period-badge { background: #eff6ff; color: #1d4ed8; }
.status-active { background: #dcfce7; color: #16a34a; }
.status-inactive { background: #fee2e2; color: #dc2626; }

.action-btn { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; margin-left: 6px; }
.edit { background: #f0f9ff; color: #0ea5e9; }
.delete { background: #fef2f2; color: #ef4444; }

.pagination { padding: 16px; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-top: 1px solid #e2e8f0; }
.page-numbers { display: flex; gap: 6px; }
.page-btn, .page-num { padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; cursor: pointer; }
.page-num.active { background: #0ea5e9; color: white; border-color: #0ea5e9; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { background: white; width: 100%; max-width: 600px; border-radius: 20px; padding: 32px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 14px; font-weight: 600; color: #475569; }
.form-group input, .form-group select, .form-group textarea { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit; }

.checkbox-group { flex-direction: row; align-items: center; }
.checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }

.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
.btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; }
.btn-submit { padding: 10px 20px; border-radius: 8px; border: none; background: #0ea5e9; color: white; font-weight: 600; cursor: pointer; }

.loader { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #0ea5e9; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.loading-state, .empty-state { padding: 40px; text-align: center; }
</style>
