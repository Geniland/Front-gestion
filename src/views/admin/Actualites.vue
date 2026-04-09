<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Actualités</h1>
      <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition">
        + Nouvelle Actualité
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="a in actualites" :key="a.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <img v-if="a.image" :src="a.image" class="w-full h-48 object-cover" />
        <div class="p-6">
          <div class="text-xs text-blue-600 font-bold mb-2 uppercase">{{ formatDate(a.published_at) }}</div>
          <h3 class="font-bold text-xl text-gray-800 mb-2">{{ a.titre }}</h3>
          <p class="text-gray-500 text-sm mb-4">{{ a.resume }}</p>
          <div class="flex gap-2 pt-4 border-t">
            <button @click="openModal(a)" class="text-blue-600 text-sm font-bold hover:underline">Modifier</button>
            <button @click="deleteActualite(a.id)" class="text-rose-600 text-sm font-bold hover:underline">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-6">{{ isEditing ? 'Modifier Actualité' : 'Nouvelle Actualité' }}</h2>
        <form @submit.prevent="saveActualite" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Titre</label>
            <input v-model="form.titre" class="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Résumé</label>
            <input v-model="form.resume" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Contenu</label>
            <textarea v-model="form.contenu" class="w-full border rounded-lg px-3 py-2" rows="6"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">URL Image</label>
            <input v-model="form.image" class="w-full border rounded-lg px-3 py-2" placeholder="https://..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date de publication</label>
            <input type="datetime-local" v-model="form.published_at" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-500">Annuler</button>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';

const actualites = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentId = ref(null);
const form = ref({ titre: '', resume: '', contenu: '', image: '', published_at: '' });

const fetchActualites = async () => {
  const { data } = await api.get('/public/actualites');
  actualites.value = data;
};

onMounted(fetchActualites);

const openModal = (a = null) => {
  if (a) {
    isEditing.value = true;
    currentId.value = a.id;
    form.value = { ...a, published_at: a.published_at ? a.published_at.substring(0, 16) : '' };
  } else {
    isEditing.value = false;
    form.value = { titre: '', resume: '', contenu: '', image: '', published_at: new Date().toISOString().substring(0, 16) };
  }
  showModal.value = true;
};

const saveActualite = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/public/admin/actualites/${currentId.value}`, form.value);
    } else {
      await api.post('/public/admin/actualites', form.value);
    }
    showModal.value = false;
    fetchActualites();
  } catch (e) { alert('Erreur'); }
};

const deleteActualite = async (id) => {
  if (confirm('Supprimer cette actualité ?')) {
    await api.delete(`/public/admin/actualites/${id}`);
    fetchActualites();
  }
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '—';
</script>
