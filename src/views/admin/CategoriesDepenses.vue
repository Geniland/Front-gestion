<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Catégories de Dépenses</h1>
        <p class="text-sm text-gray-500 mt-1">Gérer les catégories pour les dépenses de la commune</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
      >
        <i class="fas fa-plus mr-2"></i> Nouvelle Catégorie
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <th class="px-6 py-5">Nom</th>
              <th class="px-6 py-5">Description</th>
              <th class="px-6 py-5">Commune</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-for="cat in categories" :key="cat.id" class="hover:bg-blue-50/30 transition-colors group">
              <td class="px-6 py-5 font-bold text-gray-800">{{ cat.nom }}</td>
              <td class="px-6 py-5">{{ cat.description || '—' }}</td>
              <td class="px-6 py-5">{{ cat.commune?.nom || '—' }}</td>
              <td class="px-6 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openEditModal(cat)" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteCategory(cat.id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="categories.length === 0">
              <td colspan="4" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-2xl">
                    <i class="fas fa-folder-open"></i>
                  </div>
                  <p class="text-gray-400 font-medium italic">Aucune catégorie trouvée</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-gray-800">{{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div v-if="isSuperAdmin">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Commune</label>
            <select v-model="form.commune_id" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required>
              <option value="">Sélectionner une commune</option>
              <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
            </select>
          </div>
          <!-- Si c'est un maire, on pré-remplit et on affiche pas le champ -->
          <input v-else type="hidden" v-model="form.commune_id" />
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom</label>
            <input v-model="form.nom" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
            <textarea v-model="form.description" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" rows="3"></textarea>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showModal = false" class="flex-1 py-3 rounded-xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50">Annuler</button>
            <button type="submit" :disabled="saving" class="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50">
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '../../api/axios';
import auth from '../../store/auth';

const categories = ref([]);
const communes = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editingCategory = ref(null);

const isSuperAdmin = computed(() => auth.user.value?.role === 'super_admin');

const form = reactive({
  commune_id: null,
  nom: '',
  description: ''
});

const fetchCategories = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/categories-depenses');
    categories.value = data.categories || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchCommunes = async () => {
  try {
    const { data } = await api.get('/communes');
    communes.value = data.data || [];
  } catch (e) {
    console.error(e);
  }
};

const openCreateModal = () => {
  editingCategory.value = null;
  form.commune_id = auth.user.value?.commune_id || '';
  form.nom = '';
  form.description = '';
  showModal.value = true;
};

const openEditModal = (cat) => {
  editingCategory.value = cat;
  form.commune_id = cat.commune_id;
  form.nom = cat.nom;
  form.description = cat.description;
  showModal.value = true;
};

const saveCategory = async () => {
  saving.value = true;
  try {
    if (editingCategory.value) {
      await api.put(`/categories-depenses/${editingCategory.value.id}`, form);
    } else {
      await api.post('/categories-depenses', form);
    }
    alert('Catégorie enregistrée avec succès');
    showModal.value = false;
    fetchCategories();
  } catch (e) {
    console.error(e);
    alert('Erreur lors de l\'enregistrement');
  } finally {
    saving.value = false;
  }
};

const deleteCategory = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    try {
      await api.delete(`/categories-depenses/${id}`);
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression');
    }
  }
};

onMounted(() => {
  fetchCategories();
  fetchCommunes();
});
</script>
