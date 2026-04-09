<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6">Nos Services</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="s in services" :key="s.id" class="p-6 border rounded-lg hover:shadow">
        <div class="text-3xl mb-3">🛠</div>
        <h3 class="font-semibold text-lg">{{ s.titre }}</h3>
        <p class="text-gray-600 mt-2">{{ s.description }}</p>
      </div>
    </div>
  </div>
  <div v-if="demo" class="text-center text-xs text-gray-500 py-4">Mode Démo</div>
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';

const services = ref([]);
const demo = ref(false);

onMounted(async () => {
  try {
    const { data } = await api.get('/public/services');
    // Le contrôleur renvoie directement le tableau ou un objet avec data
    services.value = Array.isArray(data) ? data : (data.data || []);
  } catch (e) {
    demo.value = true;
    services.value = [
      { id: 1, titre: 'État civil', description: 'Demandes d’actes' },
      { id: 2, titre: 'Paiement taxes', description: 'Règlement des taxes en ligne' },
      { id: 3, titre: 'Urbanisme', description: 'Dépôt de dossier' },
    ];
  }
});
</script>

