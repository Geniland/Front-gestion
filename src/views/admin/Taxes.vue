<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Taxes à valider</h1>
        <p class="text-sm text-gray-500 mt-1">Gérer les déclarations de taxes envoyées via le portail citoyen</p>
      </div>
      <div class="flex gap-3">
        <select v-model="statusFilter" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all">
          <option value="en_attente">En attente</option>
          <option value="approuvee">Approuvées</option>
          <option value="rejetee">Rejetées</option>
          <option value="payee">Payées</option>
        </select>
        <button @click="fetchTaxes" class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <th class="px-6 py-5">Contribuable / Utilisateur</th>
              <th class="px-6 py-5">Type de Taxe</th>
              <th class="px-6 py-5 text-right">Montant</th>
              <th class="px-6 py-5">Période</th>
              <th class="px-6 py-5">Statut</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-for="t in filteredItems" :key="t.id" class="hover:bg-blue-50/30 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900">{{ t.contribuable_nom }}</span>
                  <span class="text-[10px] text-gray-400 font-medium">Portail: {{ t.user?.name || 'Inconnu' }}</span>
                  <span class="text-[10px] text-gray-300">Réf: {{ t.reference }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] uppercase tracking-wide">
                  {{ t.type_taxe?.nom || '—' }}
                </div>
              </td>
              <td class="px-6 py-5 text-right">
                <span class="font-bold text-gray-900 text-base">{{ formatAmount(t.montant) }} F</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col text-xs">
                  <span class="text-gray-600">Du: {{ formatDate(t.periode_debut) }}</span>
                  <span class="text-gray-600">Au: {{ formatDate(t.periode_fin) }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span :class="badgeClass(t.status)">
                  <i class="fas fa-circle text-[6px] mr-2"></i>
                  {{ t.status }}
                </span>
              </td>
              <td class="px-6 py-5 text-right">
                <div v-if="t.status === 'en_attente'" class="flex justify-end gap-2">
                  <button @click="openModal(t, 'approve')" class="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Approuver">
                    <i class="fas fa-check"></i>
                  </button>
                  <button @click="openModal(t, 'reject')" class="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Rejeter">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div v-else class="text-gray-400 text-[10px] italic">
                  Traité le {{ formatDate(t.updated_at) }}
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="6" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-2xl">
                    <i class="fas fa-file-invoice-dollar"></i>
                  </div>
                  <p class="text-gray-400 font-medium italic">Aucune taxe trouvée dans cette catégorie</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de décision -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 class="text-2xl font-bold mb-6 text-gray-900">
          {{ currentAction === 'approve' ? 'Confirmer l\'approbation' : 'Motif du rejet' }}
        </h2>
        
        <div class="p-4 bg-gray-50 rounded-2xl mb-6">
          <div class="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Détails de la taxe</div>
          <div class="font-bold text-gray-800 text-lg">{{ currentItem?.contribuable_nom }}</div>
          <div class="text-blue-600 font-bold">{{ formatAmount(currentItem?.montant) }} F</div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Commentaire (optionnel)</label>
          <textarea 
            v-model="comment" 
            class="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" 
            rows="4"
            placeholder="Votre message au contribuable..."
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button @click="showModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Annuler</button>
          <button 
            @click="submitAction" 
            :disabled="processing"
            :class="currentAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'"
            class="flex-2 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i v-if="processing" class="fas fa-spinner fa-spin"></i>
            {{ processing ? 'Traitement...' : 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../api/axios';

const items = ref([]);
const statusFilter = ref('en_attente');
const loading = ref(false);
const processing = ref(false);

// State for Modal
const showModal = ref(false);
const currentItem = ref(null);
const currentAction = ref('');
const comment = ref('');

const fetchTaxes = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/public-taxes');
    items.value = data.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const filteredItems = computed(() => {
  return items.value.filter(item => item.status === statusFilter.value);
});

const openModal = (item, action) => {
  currentItem.value = item;
  currentAction.value = action;
  comment.value = '';
  showModal.value = true;
};

const submitAction = async () => {
  processing.value = true;
  try {
    const id = currentItem.value.id;
    const path = currentAction.value === 'approve' ? 'approve' : 'reject';
    
    await api.post(`/admin/public-taxes/${id}/${path}`, {
      commentaire_admin: comment.value
    });
    
    alert(`Taxe ${currentAction.value === 'approve' ? 'approuvée' : 'rejetée'} !`);
    showModal.value = false;
    fetchTaxes();
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Erreur lors du traitement';
    alert(errorMsg);
  } finally {
    processing.value = false;
  }
};

const formatAmount = (val) => new Intl.NumberFormat('fr-FR').format(val);
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : '—';

const badgeClass = (status) => {
  const base = 'text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center w-fit';
  if (status === 'approuvee') return `${base} bg-emerald-100 text-emerald-700`;
  if (status === 'payee') return `${base} bg-blue-100 text-blue-700`;
  if (status === 'rejetee') return `${base} bg-rose-100 text-rose-700`;
  return `${base} bg-amber-100 text-amber-700`;
};

onMounted(fetchTaxes);
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
