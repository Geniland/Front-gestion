<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6">Actualités</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article v-for="a in actualites" :key="a.id" class="border rounded hover:shadow overflow-hidden">
        <div class="h-44 bg-gray-200"></div>
        <div class="p-4">
          <h3 class="font-semibold">{{ a.titre }}</h3>
          <p class="text-gray-600 text-sm mt-1">{{ a.resume }}</p>
          <router-link :to="`/actualites/${a.id}`" class="text-blue-600 text-sm inline-block mt-2">Lire →</router-link>
        </div>
      </article>
    </div>
  </div>
  <div v-if="demo" class="text-center text-xs text-gray-500 py-4">Mode Démo</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';

const actualites = ref([]);
const demo = ref(false);

onMounted(async () => {
  try {
    const { data } = await api.get('/public/actualites');
    // Le contrôleur renvoie directement le tableau ou un objet avec data
    actualites.value = Array.isArray(data) ? data : (data.data || []);
  } catch (e) {
    demo.value = true;
    actualites.value = [
      { id: 1, titre: 'Nettoyage de la commune', resume: 'Opération grand ménage' },
      { id: 2, titre: 'Nouveau guichet unique', resume: 'Service modernisé' },
    ];
  }
});
</script>

