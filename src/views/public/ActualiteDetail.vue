<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-else-if="!item" class="text-center text-red-600">Actualité introuvable</div>
    <article v-else class="bg-white p-8 rounded-lg shadow-sm">
      <h1 class="text-3xl font-bold mb-3 text-gray-900">{{ item.titre }}</h1>
      <div class="flex items-center text-gray-500 text-sm mb-8 gap-4">
        <span><i class="far fa-calendar-alt mr-2"></i>{{ formatDate(item.published_at) }}</span>
      </div>
      
      <div v-if="item.image" class="w-full mb-8 rounded-xl overflow-hidden shadow-lg">
        <img :src="item.image" :alt="item.titre" class="w-full object-cover max-h-[500px]" />
      </div>
      
      <div class="prose prose-blue max-w-none text-gray-700 leading-relaxed" v-html="item.contenu"></div>
      
      <div class="mt-12 pt-8 border-t border-gray-100">
        <router-link to="/actualites" class="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
          <i class="fas fa-arrow-left"></i> Retour aux actualités
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiPublic from '../../api/axiosPublic';

const route = useRoute();
const id = route.params.id;

const item = ref(null);
const loading = ref(true);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(async () => {
  try {
    const { data } = await apiPublic.get(`/public/actualites/${id}`);
    item.value = data.data || null;
  } catch (e) {
    console.error("Erreur lors de la récupération de l'actualité", e);
    item.value = null;
  } finally {
    loading.value = false;
  }
});
</script>

