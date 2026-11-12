<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Budgets Communaux</h1>
        <p class="text-sm text-gray-500 mt-1">Gérer les budgets annuels de la commune</p>
      </div>
      <div class="flex items-center gap-3">
        <button v-if="alerts.length > 0" @click="showAlertsModal = true" class="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-lg hover:bg-rose-700 transition-all">
          <i class="fas fa-exclamation-triangle mr-2"></i> {{ alerts.length }} Alertes
        </button>
        <button @click="openCreateModal" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          <i class="fas fa-plus mr-2"></i> Nouveau Budget
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
        <p class="text-sm opacity-80 mb-2">Total Budgets Créés</p>
        <p class="text-3xl font-black">{{ budgets.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
        <p class="text-sm opacity-80 mb-2">Validés</p>
        <p class="text-3xl font-black">{{ budgets.filter(b => b.statut === 'valide').length }}</p>
      </div>
      <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg">
        <p class="text-sm opacity-80 mb-2">Brouillons</p>
        <p class="text-3xl font-black">{{ budgets.filter(b => b.statut === 'brouillon').length }}</p>
      </div>
      <div class="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-2xl text-white shadow-lg">
        <p class="text-sm opacity-80 mb-2">Alertes Actives</p>
        <p class="text-3xl font-black">{{ alerts.length }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <th class="px-6 py-5">Année</th>
              <th class="px-6 py-5">Commune</th>
              <th class="px-6 py-5">Statut</th>
              <th class="px-6 py-5">Recettes Prévues</th>
              <th class="px-6 py-5">Recettes Réalisées</th>
              <th class="px-6 py-5">Dépenses Prévues</th>
              <th class="px-6 py-5">Dépenses Réalisées</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-for="budget in budgets" :key="budget.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="px-6 py-5 font-bold text-xl text-gray-800">{{ budget.annee }}</td>
              <td class="px-6 py-5">{{ budget.commune?.nom }}</td>
              <td class="px-6 py-5">
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                  :class="{
                    'bg-gray-100 text-gray-700': budget.statut === 'brouillon',
                    'bg-emerald-100 text-emerald-700': budget.statut === 'valide',
                    'bg-amber-100 text-amber-700': budget.statut === 'cloture'
                  }"
                >
                  {{ budget.statut }}
                </span>
              </td>
              <td class="px-6 py-5 font-bold text-emerald-600">{{ budget.total_prevu_recettes?.toLocaleString('fr-FR') || 0 }} FCFA</td>
              <td class="px-6 py-5 font-bold text-emerald-700">{{ budget.total_realise_recettes?.toLocaleString('fr-FR') || 0 }} FCFA</td>
              <td class="px-6 py-5 font-bold text-rose-600">{{ budget.total_prevu_depenses?.toLocaleString('fr-FR') || 0 }} FCFA</td>
              <td class="px-6 py-5 font-bold text-rose-700">{{ budget.total_realise_depenses?.toLocaleString('fr-FR') || 0 }} FCFA</td>
              <td class="px-6 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="viewDetails(budget)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="openEditModal(budget)" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteBudget(budget.id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="budgets.length === 0">
              <td colspan="8" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-2xl">
                    <i class="fas fa-calculator"></i>
                  </div>
                  <p class="text-gray-400 font-medium italic">Aucun budget trouvé</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-gray-800">{{ editingBudget ? 'Modifier le budget' : 'Nouveau budget' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="saveBudget" class="p-6 space-y-6 overflow-y-auto flex-1">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="isSuperAdmin">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Commune</label>
              <select v-model="form.commune_id" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required>
                <option value="">Sélectionner</option>
                <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
              </select>
            </div>
            <input v-else type="hidden" v-model="form.commune_id" />
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Année</label>
              <input v-model="form.annee" type="number" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" min="2020" max="2030" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Statut</label>
              <select v-model="form.statut" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required>
                <option value="brouillon">Brouillon</option>
                <option value="valide">Validé</option>
                <option value="cloture">Clôturé</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
            <textarea v-model="form.description" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" rows="2"></textarea>
          </div>
          <div class="border-t border-gray-100 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-gray-800">Lignes Budgétaires</h4>
              <button type="button" @click="addLine" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">
                <i class="fas fa-plus mr-1"></i> Ajouter une ligne
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="(line, idx) in form.lines" :key="idx" class="grid grid-cols-12 gap-3 items-end bg-gray-50 p-4 rounded-xl">
                <div class="col-span-2">
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Type</label>
                  <select v-model="line.type" class="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm">
                    <option value="recette">Recette</option>
                    <option value="depense">Dépense</option>
                  </select>
                </div>
                <div class="col-span-4">
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Libellé</label>
                  <input v-model="line.libelle" type="text" class="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm" required />
                </div>
                <div class="col-span-3">
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Montant Prévu</label>
                  <input v-model.number="line.montant_prevu" type="number" class="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm" min="0" required />
                </div>
                <div v-if="line.type === 'depense'" class="col-span-2">
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Seuil Alerte</label>
                  <input v-model.number="line.seuil_alerte" type="number" class="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm" min="0" />
                </div>
                <div v-if="line.type === 'depense'" class="col-span-1">
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Actif</label>
                  <input v-model="line.alerte_active" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                </div>
                <div class="col-span-1">
                  <button type="button" @click="removeLine(idx)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                    <i class="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </div>
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

    <div v-if="showDetails" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-600 text-white">
          <div>
            <h3 class="font-bold">Budget {{ selectedBudget?.annee }} - {{ selectedBudget?.commune?.nom }}</h3>
            <p class="text-xs opacity-70">Détails des lignes budgétaires</p>
          </div>
          <button @click="showDetails = false" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div v-if="selectedBudget?.lines?.length === 0">
            <p class="text-gray-400 text-center italic">Aucune ligne budgétaire</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="line in selectedBudget.lines" :key="line.id" class="p-4 border border-gray-100 rounded-xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    :class="line.type === 'recette' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                  >
                    {{ line.type }}
                  </span>
                  <span class="font-bold text-gray-800">{{ line.libelle }}</span>
                  <span v-if="line.en_depassement" class="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold uppercase">
                    <i class="fas fa-exclamation-triangle mr-1"></i> Alerte
                  </span>
                </div>
              </div>
              <p v-if="line.description" class="text-xs text-gray-400 mt-1">{{ line.description }}</p>
              <div class="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-400 uppercase font-bold">Prévu</p>
                  <p class="text-xl font-bold" :class="line.type === 'recette' ? 'text-emerald-600' : 'text-rose-600'">
                    {{ Number(line.montant_prevu).toLocaleString('fr-FR') }} FCFA
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-400 uppercase font-bold">Réalisé</p>
                  <p class="text-xl font-bold" :class="line.type === 'recette' ? 'text-emerald-700' : 'text-rose-700'">
                    {{ Number(line.montant_realise).toLocaleString('fr-FR') }} FCFA
                  </p>
                </div>
              </div>
              <div v-if="line.type === 'depense' && line.montant_prevu > 0" class="mt-2">
                <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all"
                    :class="(line.montant_realise / line.montant_prevu) > 0.9 ? 'bg-rose-500' : 'bg-blue-500'"
                    :style="{ width: Math.min((line.montant_realise / line.montant_prevu) * 100, 100) + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-400 mt-1 text-right">
                  {{ Math.round((line.montant_realise / line.montant_prevu) * 100) }}% utilisé
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAlertsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-rose-600 text-white">
          <div>
            <h3 class="font-bold"><i class="fas fa-exclamation-triangle mr-2"></i> Alertes Budgétaires</h3>
            <p class="text-xs opacity-70">{{ alerts.length }} alerte(s) active(s)</p>
          </div>
          <button @click="showAlertsModal = false" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div v-if="alerts.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 text-2xl">
              <i class="fas fa-check-circle"></i>
            </div>
            <p class="text-gray-400 font-medium italic">Aucune alerte active</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="alert in alerts" :key="alert.id" class="p-4 border-l-4 border-rose-500 bg-rose-50 rounded-lg">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-rose-800">{{ alert.libelle }}</h4>
                <span class="text-xs text-rose-600 font-semibold">{{ alert.budget }} - {{ alert.commune }}</span>
              </div>
              <div class="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Prévu</p>
                  <p class="font-bold text-gray-800">{{ Number(alert.montant_prevu).toLocaleString('fr-FR') }} FCFA</p>
                </div>
                <div>
                  <p class="text-gray-500">Réalisé</p>
                  <p class="font-bold text-rose-700">{{ Number(alert.montant_realise).toLocaleString('fr-FR') }} FCFA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '../../api/axios';
import auth from '../../store/auth';

const budgets = ref([]);
const communes = ref([]);
const alerts = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const showDetails = ref(false);
const showAlertsModal = ref(false);
const editingBudget = ref(null);
const selectedBudget = ref(null);

const isSuperAdmin = computed(() => auth.user.value?.role === 'super_admin');

const form = reactive({
  commune_id: null,
  annee: new Date().getFullYear(),
  statut: 'brouillon',
  description: '',
  lines: []
});

const fetchBudgets = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/budgets');
    budgets.value = data.budgets || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchAlerts = async () => {
  try {
    const { data } = await api.get('/budgets/alerts');
    alerts.value = data.alerts || [];
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

const addLine = () => {
  form.lines.push({
    type: 'depense',
    libelle: '',
    montant_prevu: 0,
    description: '',
    seuil_alerte: 0,
    alerte_active: true
  });
};

const removeLine = (idx) => {
  form.lines.splice(idx, 1);
};

const openCreateModal = () => {
  editingBudget.value = null;
  form.commune_id = auth.user.value?.commune_id || '';
  form.annee = new Date().getFullYear();
  form.statut = 'brouillon';
  form.description = '';
  form.lines = [];
  showModal.value = true;
};

const openEditModal = (budget) => {
  editingBudget.value = budget;
  form.commune_id = budget.commune_id;
  form.annee = budget.annee;
  form.statut = budget.statut;
  form.description = budget.description;
  form.lines = budget.lines ? [...budget.lines] : [];
  showModal.value = true;
};

const viewDetails = (budget) => {
  selectedBudget.value = budget;
  showDetails.value = true;
};

const saveBudget = async () => {
  saving.value = true;
  try {
    if (editingBudget.value) {
      await api.put(`/budgets/${editingBudget.value.id}`, form);
    } else {
      await api.post('/budgets', form);
    }
    alert('Budget enregistré avec succès');
    showModal.value = false;
    fetchBudgets();
    fetchAlerts();
  } catch (e) {
    console.error(e.response?.data || e);
    alert('Erreur lors de l\'enregistrement');
  } finally {
    saving.value = false;
  }
};

const deleteBudget = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
      fetchAlerts();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression');
    }
  }
};

onMounted(() => {
  fetchBudgets();
  fetchCommunes();
  fetchAlerts();
});
</script>
