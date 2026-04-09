<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Paiements FedaPay à valider</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase font-bold tracking-wider">
          <tr>
            <th class="px-6 py-4">Transaction ID</th>
            <th class="px-6 py-4">Contribuable</th>
            <th class="px-6 py-4">Montant</th>
            <th class="px-6 py-4">Statut FedaPay</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
          <tr v-for="p in items" :key="p.id" class="hover:bg-gray-50/50">
            <td class="px-6 py-4 font-mono text-xs">{{ p.transaction_id }}</td>
            <td class="px-6 py-4 font-medium text-gray-800">{{ p.user?.name || '—' }}</td>
            <td class="px-6 py-4 font-bold text-mairie-blue">{{ p.amount }} GNF</td>
            <td class="px-6 py-4">
              <span class="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Success</span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="bg-mairie-green text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:shadow-lg transition">Valider l'encaissement</button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic">Aucune transaction en attente</td>
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

const fetchPayments = async () => {
  try {
    const { data } = await api.get('/admin/online-payments');
    items.value = data.data || [];
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchPayments);

async function validatePayment(id) {
  try {
    await api.post(`/admin/online-payments/${id}/validate`);
    alert('Paiement validé !');
    fetchPayments();
  } catch (e) {
    alert('Erreur');
  }
}
</script>