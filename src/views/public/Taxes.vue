<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6">Taxes & Paiement</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <form @submit.prevent="createTaxe" class="p-6 border rounded-lg space-y-4">
        <h2 class="font-semibold text-lg">Créer une taxe</h2>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Contribuable</label>
          <input v-model="form.contribuable_nom" class="w-full border rounded px-3 py-2" placeholder="Nom complet" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Type de taxe</label>
            <select v-model="form.type_taxe_id" class="w-full border rounded px-3 py-2" required>
              <option v-for="t in typeTaxes" :value="t.id" :key="t.id">{{ t.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Montant</label>
            <input v-model.number="form.montant" type="number" min="0" class="w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Période début</label>
            <input v-model="form.periode_debut" type="date" class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Période fin</label>
            <input v-model="form.periode_fin" type="date" class="w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <button class="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Créer la taxe' }}
        </button>
      </form>

      <div class="p-6 border rounded-lg space-y-4">
        <h2 class="font-semibold text-lg">Payer une taxe</h2>
        <div v-if="taxesToPay.length > 0">
          <label class="block text-sm text-gray-600 mb-1">Vos taxes à payer</label>
          <select v-model="selectedTaxeId" class="w-full border rounded px-3 py-2">
            <option v-for="t in taxesToPay" :value="t.id" :key="t.id">
              {{ t.type_taxe?.nom || 'Taxe' }} • {{ t.montant }} F ({{ t.status }})
            </option>
          </select>
          <button class="mt-4 w-full px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700" @click="initiatePayment" :disabled="!selectedTaxeId">
            Payer par Mobile Money
          </button>
        </div>
        <div v-else class="text-center py-4 bg-gray-50 rounded">
          <p class="text-sm text-gray-500 italic">Aucune taxe approuvée disponible pour paiement.</p>
        </div>
        <p class="text-xs text-gray-500">Statut initial : en attente de validation admin</p>
      </div>
    </div>

    <div class="mt-10">
      <h2 class="font-semibold text-lg mb-3">Historique de vos taxes</h2>
      <div v-if="loadingHistory" class="text-center py-6">
        <i class="fas fa-spinner fa-spin"></i> Chargement...
      </div>
      <div v-else-if="taxes.length === 0" class="text-center py-10 bg-gray-50 rounded border border-dashed">
        <p class="text-gray-400">Aucune taxe enregistrée.</p>
      </div>
      <div v-else class="border rounded-lg divide-y bg-white overflow-hidden shadow-sm">
        <div v-for="t in taxes" :key="t.id" class="p-4 flex items-center justify-between hover:bg-gray-50 transition">
          <div>
            <div class="font-bold text-gray-800">{{ t.type_taxe?.nom || 'Taxe sans nom' }}</div>
            <div class="text-sm text-gray-500">
              <span class="mr-3"><i class="fas fa-money-bill-wave mr-1"></i> {{ t.montant }} F</span>
              <span><i class="far fa-calendar-alt mr-1"></i> {{ formatDate(t.created_at) }}</span>
            </div>
            <div class="text-xs text-gray-400 mt-1">Réf: {{ t.reference }}</div>
            <div v-if="t.commentaire_admin" class="mt-2 p-2 bg-amber-50 text-amber-700 text-[10px] rounded-lg border border-amber-100 flex items-start gap-2">
              <i class="fas fa-info-circle mt-0.5"></i>
              <span>{{ t.commentaire_admin }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="badgeClass(t.status)">{{ t.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../api/axiosPublic';
import userAuth from '../../store/userAuth';

const typeTaxes = ref([]);
const taxes = ref([]);
const payments = ref([]);
const loading = ref(false);
const loadingHistory = ref(true);
const selectedTaxeId = ref(null);

const form = ref({
  contribuable_nom: userAuth.user.value?.name || '',
  type_taxe_id: null,
  montant: 0,
  periode_debut: '',
  periode_fin: '',
});

const taxesToPay = computed(() => {
  return taxes.value.filter(t => t.status === 'approuvee');
});

const fetchTaxes = async () => {
  loadingHistory.value = true;
  try {
    const response = await api.get('/public/taxes');
    taxes.value = response.data.data?.data || response.data.data || [];
  } catch (e) {
    console.error("Erreur chargement taxes", e);
    taxes.value = [];
  } finally {
    loadingHistory.value = false;
  }
};

onMounted(async () => {
  try {
    const [typesRes] = await Promise.all([
      api.get('/types-taxes'),
    ]);
    typeTaxes.value = (typesRes.data.data?.data || typesRes.data.data || []);
    fetchTaxes();
  } catch (e) {
    typeTaxes.value = [];
  }
});

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

function badgeClass(status) {
  const base = 'text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider';
  if (status === 'approuvee') return `${base} bg-emerald-100 text-emerald-700`;
  if (status === 'payee') return `${base} bg-blue-100 text-blue-700`;
  if (status === 'rejetee') return `${base} bg-rose-100 text-rose-700`;
  return `${base} bg-amber-100 text-amber-700`;
}

async function createTaxe() {
  loading.value = true;
  try {
    await api.post('/public/taxes', form.value);
    alert('Taxe enregistrée en attente de validation');
    fetchTaxes();
  } catch (e) {
    alert('Erreur lors de la création de la taxe');
  } finally {
    loading.value = false;
  }
}

async function initiatePayment() {
  try {
    const { data } = await api.post('/public/payments/initiate', {
      taxe_id: selectedTaxeId.value,
    });
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert('Lien de paiement indisponible');
    }
  } catch (e) {
    alert('Erreur lors de l’initialisation du paiement');
  }
}
</script>

<style scoped>
</style>

