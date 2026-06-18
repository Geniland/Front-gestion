<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Paiements FedaPay à valider</h1>
    </div>

    <!-- Message de succès -->
    <div v-if="successMessage" class="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
      <i class="fas fa-check-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase font-bold tracking-wider">
          <tr>
            <th class="px-6 py-4">Transaction ID</th>
            <th class="px-6 py-4">Contribuable</th>
            <th class="px-6 py-4">Montant</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
          <tr v-for="p in items" :key="p.id" class="hover:bg-gray-50/50">
            <td class="px-6 py-4 font-mono text-xs">{{ p.transaction_id || '—' }}</td>
            <td class="px-6 py-4 font-medium text-gray-800">{{ p.user_name || '—' }}</td>
            <td class="px-6 py-4 font-bold text-mairie-blue">{{ p.montant }} GNF</td>
            <td class="px-6 py-4">
              <span :class="statusBadgeClass(p.status)">
                {{ formatStatus(p.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button 
                v-if="p.status !== 'validé'"
                @click="validatePayment(p.id)"
                :disabled="loading"
                class="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {{ loading ? 'Validation...' : 'Valider l\'encaissement' }}
              </button>
              <span v-else class="text-emerald-600 text-xs font-medium">
                <i class="fas fa-check-circle mr-1"></i>
                Validé
              </span>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic">Aucune transaction</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';

const items = ref([]);
const loading = ref(false);
const successMessage = ref('');

const fetchPayments = async () => {
  try {
    const { data } = await api.get('/admin/online-payments');
    items.value = data.data || [];
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchPayments);

function formatStatus(status) {
  const statusMap = {
    'en_attente': 'En attente',
    'validé': 'Validé',
    'failed': 'Échoué',
    'rejeté': 'Rejeté',
    'success': 'Succès'
  };
  return statusMap[status] || status;
}

function statusBadgeClass(status) {
  const classes = 'text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider';
  if (status === 'validé') return `${classes} bg-emerald-100 text-emerald-700`;
  if (status === 'failed' || status === 'rejeté') return `${classes} bg-rose-100 text-rose-700`;
  if (status === 'success') return `${classes} bg-blue-100 text-blue-700`;
  return `${classes} bg-amber-100 text-amber-700`;
}

async function validatePayment(id) {
  loading.value = true;
  successMessage.value = '';
  
  try {
    const { data } = await api.post(`/admin/online-payments/${id}/validate`);
    successMessage.value = data.message || 'Paiement validé !';
    await fetchPayments();
  } catch (e) {
    alert('Erreur lors de la validation : ' + (e.response?.data?.message || e.message));
  } finally {
    loading.value = false;
  }
}
</script>