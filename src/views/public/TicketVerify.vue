<template>
  <div class="min-h-[60vh] flex items-center justify-center p-6">
    <div v-if="loading" class="text-gray-500">Vérification du ticket...</div>

    <div v-else-if="status === 'valid'" class="max-w-md w-full rounded-2xl shadow border overflow-hidden">
      <div class="bg-emerald-600 text-white p-6 text-center">
        <div class="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">✓</div>
        <h2 class="text-xl font-bold">Ticket Valide</h2>
      </div>
      <div class="p-6 space-y-2 text-sm">
        <div class="flex justify-between"><span>Numéro</span><strong>{{ ticket.numero }}</strong></div>
        <div class="flex justify-between"><span>Contribuable</span><strong>{{ ticket.contribuable }}</strong></div>
        <div class="flex justify-between"><span>Taxe</span><strong>{{ ticket.taxe }}</strong></div>
        <div class="flex justify-between"><span>Montant</span><strong>{{ formatPrice(ticket.montant) }} GNF</strong></div>
        <div class="flex justify-between"><span>Expiration</span><strong>{{ ticket.date_expiration }}</strong></div>
        <div class="text-right"><span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Expire dans {{ ticket.days_diff }} jours</span></div>
      </div>
    </div>

    <div v-else-if="status === 'expired'" class="max-w-md w-full rounded-2xl shadow border overflow-hidden">
      <div class="bg-amber-500 text-white p-6 text-center">
        <div class="w-16 h-16 bg-white text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">!</div>
        <h2 class="text-xl font-bold">Ticket Expiré</h2>
      </div>
      <div class="p-6 text-sm space-y-2">
        <div class="flex justify-between"><span>Numéro</span><strong>{{ ticket.numero }}</strong></div>
        <div class="flex justify-between"><span>Expiration</span><strong>{{ ticket.date_expiration }}</strong></div>
        <div class="text-right"><span class="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Expiré depuis {{ Math.abs(ticket.days_diff) }} jours</span></div>
      </div>
    </div>

    <div v-else class="max-w-md w-full rounded-2xl shadow border overflow-hidden">
      <div class="bg-rose-600 text-white p-6 text-center">
        <div class="w-16 h-16 bg-white text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">!</div>
        <h2 class="text-xl font-bold">Ticket Invalide</h2>
      </div>
      <div class="p-6 text-sm text-center">
        Ce ticket est introuvable ou frauduleux.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api/axios';

const route = useRoute();
const reference = route.params.reference;
const status = ref('invalid');
const ticket = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get(`/v/${reference}`.replace('/api', '')); // if baseURL includes /api
    // If backend is proxied via /api, use /api/v/{reference}
  } catch (e) {
    // fallback using API prefix
    try {
      const { data } = await api.get(`/v/${reference}`.startsWith('/api') ? `/v/${reference}` : `/v/${reference}`);
      status.value = data.status;
      ticket.value = data.ticket;
    } catch (e2) {
      status.value = 'invalid';
    }
  } finally {
    loading.value = false;
  }
});

function formatPrice(n) {
  try {
    return new Intl.NumberFormat('fr-FR').format(n || 0);
  } catch {
    return n;
  }
}
</script>

