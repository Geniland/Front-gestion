<template>
  <div class="paiements-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <span class="title-icon">💳</span>
          Gestion des Paiements
        </h1>
        <p class="page-subtitle">Enregistrez et suivez tous les paiements de taxes</p>
      </div>
      <button class="add-btn" @click="openModal()">
        <span class="btn-icon">+</span>
        Nouveau Paiement
      </button>
    </header>

    <!-- Table -->
    <div class="table-card">
      <!-- ... (table pour lister les paiements) ... -->
    </div>

    <!-- Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>Enregistrer un Paiement</h2>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="savePaiement" class="modal-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Commune</label>
                <select v-model="form.commune_id" @change="handleCommuneChange" required>
                  <option value="">Sélectionner une commune</option>
                  <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Zone (Quartier)</label>
                <select v-model="form.quartier_id" :disabled="!form.commune_id || loadingQuartiers" required>
                  <option value="">{{ loadingQuartiers ? 'Chargement...' : 'Sélectionner un quartier' }}</option>
                  <option v-for="q in quartiers" :key="q.id" :value="q.id">{{ q.nom }}</option>
                </select>
              </div>
              <!-- ... (autres champs du formulaire de paiement) ... -->
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
              <button type="submit" class="btn-submit" :disabled="saving">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import api from '../api/axios';

export default {
  name: 'Paiements',
  setup() {
    const showModal = ref(false);
    const saving = ref(false);
    const communes = ref([]);
    const quartiers = ref([]);
    const loadingQuartiers = ref(false);

    const form = reactive({
      commune_id: '',
      quartier_id: '',
      // ... (autres champs)
    });

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

    const handleCommuneChange = async () => {
      if (!form.commune_id) {
        quartiers.value = [];
        form.quartier_id = '';
        return;
      }
      loadingQuartiers.value = true;
      try {
        const response = await api.get(`/quartiers/commune/${form.commune_id}`);
        if (response.data.status) {
          quartiers.value = response.data.data;
          form.quartier_id = '';
        }
      } catch (error) {
        console.error('Erreur chargement quartiers', error);
      } finally {
        loadingQuartiers.value = false;
      }
    };

    const openModal = () => { showModal.value = true; };
    const closeModal = () => { showModal.value = false; };

    const savePaiement = async () => {
      // ... (logique de sauvegarde)
    };

    onMounted(() => {
      fetchCommunes();
    });

    return { showModal, saving, communes, quartiers, loadingQuartiers, form, openModal, closeModal, savePaiement, handleCommuneChange };
  }
}
</script>

<style scoped>
/* ... (styles similaires aux autres pages) ... */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
</style>
