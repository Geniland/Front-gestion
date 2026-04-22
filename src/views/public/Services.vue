<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6">Nos Services</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="s in services" :key="s.id" class="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div class="h-48 w-full relative group">
          <img v-if="s.image_url" :src="s.image_url" :alt="s.titre" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div v-else class="w-full h-full bg-blue-50 flex items-center justify-center">
            <i :class="s.icon || 'fas fa-concierge-bell'" class="text-4xl text-blue-500 opacity-50"></i>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
             <span class="text-white font-bold text-sm">En savoir plus</span>
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <i :class="s.icon || 'fas fa-check'"></i>
            </div>
            <h3 class="font-bold text-xl text-gray-900">{{ s.titre }}</h3>
          </div>
          <p class="text-gray-600 leading-relaxed text-sm flex-1">{{ s.description }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="demo" class="text-center text-xs text-gray-500 py-4">Mode Démo</div>
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import apiPublic from '../../api/axiosPublic';

const services = ref([]);
const demo = ref(false);

onMounted(async () => {
  try {
    const { data } = await apiPublic.get('/public/services');
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

