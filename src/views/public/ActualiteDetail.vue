<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-else-if="!item" class="text-center text-red-600">Actualité introuvable</div>
    <article v-else>
      <h1 class="text-3xl font-bold mb-3">{{ item.titre }}</h1>
      <div class="text-gray-500 text-sm mb-6">{{ item.published_at || '—' }}</div>
      <div class="h-64 bg-gray-200 mb-6"></div>
      <div class="prose max-w-none" v-html="item.contenu"></div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api/axios';

const route = useRoute();
const id = route.params.id;

const item = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get(`/public/actualites/${id}`);
    item.value = data.data || null;
  } catch (e) {
    item.value = null;
  } finally {
    loading.value = false;
  }
});
</script>

