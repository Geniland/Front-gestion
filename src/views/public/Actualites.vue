<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6">Actualités</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article v-for="a in actualites" :key="a.id" class="border rounded hover:shadow overflow-hidden bg-white">
        <div v-if="a.image" class="h-44 w-full">
          <img :src="a.image" :alt="a.titre" class="w-full h-full object-cover" />
        </div>
        <div v-else class="h-44 bg-gray-100 flex items-center justify-center text-gray-300">
          <i class="fas fa-image text-4xl"></i>
        </div>
        <div class="p-4">
          <h3 class="font-semibold line-clamp-2 h-12">{{ a.titre }}</h3>
          <p class="text-gray-600 text-sm mt-2 line-clamp-3 h-15">{{ a.resume }}</p>
          <router-link :to="`/actualites/${a.id}`" class="text-blue-600 text-sm font-medium inline-block mt-4 hover:underline">
            Lire plus →
          </router-link>
        </div>
      </article>
    </div>
  </div>
  <div v-if="demo" class="text-center text-xs text-gray-500 py-4">Mode Démo</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiPublic from '../../api/axiosPublic';

const actualites = ref([]);
const demo = ref(false);

onMounted(async () => {
  try {
    const { data } = await apiPublic.get('/public/actualites');
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

