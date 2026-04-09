<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Services</h1>
      <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition">
        + Nouveau Service
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="s in services" :key="s.id" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4">
            <i :class="s.icon || 'fas fa-concierge-bell'"></i>
          </div>
          <h3 class="font-bold text-lg text-gray-800 mb-2">{{ s.titre }}</h3>
          <p class="text-gray-500 text-sm mb-4">{{ s.description }}</p>
        </div>
        <div class="flex gap-2 pt-4 border-t">
          <button @click="openModal(s)" class="text-blue-600 text-sm font-bold hover:underline">Modifier</button>
          <button @click="deleteService(s.id)" class="text-rose-600 text-sm font-bold hover:underline">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-6">{{ isEditing ? 'Modifier Service' : 'Nouveau Service' }}</h2>
        <form @submit.prevent="saveService" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Titre</label>
            <input v-model="form.titre" class="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="form.description" class="w-full border rounded-lg px-3 py-2" rows="3"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Icon (FontAwesome class)</label>
            <input v-model="form.icon" class="w-full border rounded-lg px-3 py-2" placeholder="fas fa-star" />
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

const services = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentId = ref(null);
const form = ref({ titre: '', description: '', icon: '' });

const fetchServices = async () => {
  const { data } = await api.get('/public/services');
  services.value = data;
};

onMounted(fetchServices);

const openModal = (s = null) => {
  if (s) {
    isEditing.value = true;
    currentId.value = s.id;
    form.value = { ...s };
  } else {
    isEditing.value = false;
    form.value = { titre: '', description: '', icon: '' };
  }
  showModal.value = true;
};

const saveService = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/public/admin/services/${currentId.value}`, form.value);
    } else {
      await api.post('/public/admin/services', form.value);
    }
    showModal.value = false;
    fetchServices();
  } catch (e) { alert('Erreur'); }
};

const deleteService = async (id) => {
  if (confirm('Supprimer ce service ?')) {
    await api.delete(`/public/admin/services/${id}`);
    fetchServices();
  }
};
</script>
