<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dépenses</h1>
        <p class="text-sm text-gray-500 mt-1">Suivre toutes les dépenses de la commune</p>
      </div>
      <button @click="openCreateModal" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
        <i class="fas fa-plus mr-2"></i> Nouvelle Dépense
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500 mb-2">Total Dépenses</p>
        <p class="text-3xl font-black text-rose-600">{{ totalDepenses.toLocaleString('fr-FR') }} FCFA</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500 mb-2">Ce Mois</p>
        <p class="text-3xl font-black text-amber-600">{{ totalThisMonth.toLocaleString('fr-FR') }} FCFA</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500 mb-2">Nombre de Dépenses</p>
        <p class="text-3xl font-black text-blue-600">{{ depenses.length }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <th class="px-6 py-5">Date</th>
              <th class="px-6 py-5">Libellé</th>
              <th class="px-6 py-5">Catégorie</th>
              <th class="px-6 py-5">Bénéficiaire</th>
              <th class="px-6 py-5">Créé par</th>
              <th class="px-6 py-5">Montant</th>
              <th class="px-6 py-5">Mode Paiement</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-for="d in depenses" :key="d.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="px-6 py-5">{{ formatDate(d.date_depense) }}</td>
              <td class="px-6 py-5 font-bold text-gray-800">{{ d.libelle }}</td>
              <td class="px-6 py-5">{{ d.categorie?.nom || '—' }}</td>
              <td class="px-6 py-5">{{ d.beneficiaire || '—' }}</td>
              <td class="px-6 py-5">{{ d.agent?.nom || d.agent?.email || '—' }}</td>
              <td class="px-6 py-5 font-bold text-rose-600">{{ Number(d.montant).toLocaleString('fr-FR') }} FCFA</td>
              <td class="px-6 py-5">
                <span v-if="d.mode_paiement" class="px-2 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase">
                  {{ d.mode_paiement }}
                </span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openEditModal(d)" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteDepense(d.id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="depenses.length === 0">
              <td colspan="8" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-2xl">
                    <i class="fas fa-credit-card"></i>
                  </div>
                  <p class="text-gray-400 font-medium italic">Aucune dépense trouvée</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-gray-800">{{ editingDepense ? 'Modifier la dépense' : 'Nouvelle dépense' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="saveDepense" class="p-6 space-y-4">
          <div v-if="isSuperAdmin" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Commune</label>
              <select v-model="form.commune_id" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" @change="loadFilters()" required>
                <option value="">Sélectionner</option>
                <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Catégorie</label>
              <select v-model="form.categorie_depense_id" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required>
                <option value="">Sélectionner</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
              </select>
            </div>
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <input type="hidden" v-model="form.commune_id" />
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Catégorie</label>
              <select v-model="form.categorie_depense_id" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required>
                <option value="">Sélectionner</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ligne Budgétaire (optionnel)</label>
              <select v-model="form.budget_line_id" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                <option value="">Aucune</option>
                <option v-for="line in budgetLines" :key="line.id" :value="line.id">{{ line.libelle }} ({{ line.montant_prevu.toLocaleString('fr-FR') }} FCFA)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Libellé</label>
            <input v-model="form.libelle" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
            <textarea v-model="form.description" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" rows="2"></textarea>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Montant</label>
              <input v-model.number="form.montant" type="number" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" min="0" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date</label>
              <input v-model="form.date_depense" type="date" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mode Paiement</label>
              <select v-model="form.mode_paiement" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                <option value="">Sélectionner</option>
                <option value="cash">Cash</option>
                <option value="tmoney">TMoney</option>
                <option value="flooz">Flooz</option>
                <option value="banque">Banque</option>
                <option value="cheque">Chèque</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Référence</label>
              <input v-model="form.reference" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bénéficiaire</label>
              <input v-model="form.beneficiaire" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
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

const depenses = ref([]);
const categories = ref([]);
const budgetLines = ref([]);
const communes = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editingDepense = ref(null);

const isSuperAdmin = computed(() => auth.user.value?.role === 'super_admin');

const form = reactive({
  commune_id: null,
  categorie_depense_id: null,
  budget_line_id: null,
  libelle: '',
  description: '',
  montant: 0,
  date_depense: new Date().toISOString().split('T')[0],
  mode_paiement: '',
  reference: '',
  beneficiaire: ''
});

const totalDepenses = computed(() => {
  return depenses.value.reduce((sum, d) => sum + Number(d.montant), 0);
});

const totalThisMonth = computed(() => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return depenses.value.reduce((sum, d) => {
    const dDate = new Date(d.date_depense);
    if (dDate.getMonth() === month && dDate.getFullYear() === year) {
      return sum + Number(d.montant);
    }
    return sum;
  }, 0);
});

const fetchDepenses = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/depenses');
    depenses.value = data.depenses || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const { data } = await api.get('/categories-depenses');
    categories.value = data.categories || [];
  } catch (e) {
    console.error(e);
  }
};

const fetchBudgetsAndLines = async () => {
  try {
    const { data } = await api.get('/budgets');
    const budgets = data.budgets || [];
    budgetLines.value = budgets.flatMap(b => b.lines || []).filter(l => l.type === 'depense');
  } catch (e) {
    console.error(e);
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

const loadFilters = () => {
  fetchCategories();
  fetchBudgetsAndLines();
};

const openCreateModal = () => {
  editingDepense.value = null;
  form.commune_id = auth.user.value?.commune_id || '';
  form.categorie_depense_id = null;
  form.budget_line_id = null;
  form.libelle = '';
  form.description = '';
  form.montant = 0;
  form.date_depense = new Date().toISOString().split('T')[0];
  form.mode_paiement = '';
  form.reference = '';
  form.beneficiaire = '';
  loadFilters();
  showModal.value = true;
};

const openEditModal = (depense) => {
  editingDepense.value = depense;
  form.commune_id = depense.commune_id;
  form.categorie_depense_id = depense.categorie_depense_id;
  form.budget_line_id = depense.budget_line_id;
  form.libelle = depense.libelle;
  form.description = depense.description;
  form.montant = depense.montant;
  form.date_depense = depense.date_depense;
  form.mode_paiement = depense.mode_paiement;
  form.reference = depense.reference;
  form.beneficiaire = depense.beneficiaire;
  loadFilters();
  showModal.value = true;
};

const saveDepense = async () => {
  saving.value = true;
  try {
    if (editingDepense.value) {
      await api.put(`/depenses/${editingDepense.value.id}`, form);
    } else {
      await api.post('/depenses', form);
    }
    alert('Dépense enregistrée avec succès');
    showModal.value = false;
    fetchDepenses();
  } catch (e) {
    console.error(e);
    alert('Erreur lors de l\'enregistrement');
  } finally {
    saving.value = false;
  }
};

const deleteDepense = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
    try {
      await api.delete(`/depenses/${id}`);
      fetchDepenses();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression');
    }
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  fetchDepenses();
  fetchCategories();
  fetchBudgetsAndLines();
  fetchCommunes();
});
</script>
