<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">États Financiers</h1>
        <p class="text-sm text-gray-500 mt-1">Rapports financiers de la commune</p>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="isSuperAdmin">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Commune</label>
          <select v-model="communeId" @change="loadData" class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
            <option value="">Toutes les communes</option>
            <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Année</label>
          <select v-model="annee" @change="loadData" class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
            <option v-for="y in anneesDisponibles" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <button @click="exportToPdf" class="px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all">
          <i class="fas fa-download mr-2"></i> Exporter
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-rose-600">{{ error }}</p>
      <button @click="loadData" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
        Réessayer
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-800 mb-6">Compte de Résultat</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600">Recettes Prévues</span>
            <span class="font-bold text-emerald-600 text-lg">{{ Number(compteResultat?.total_prevu_recettes || 0).toLocaleString('fr-FR') }} FCFA</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600">Recettes Réalisées</span>
            <span class="font-bold text-emerald-700 text-lg">{{ Number(compteResultat?.total_realise_recettes || 0).toLocaleString('fr-FR') }} FCFA</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600">Dépenses Prévues</span>
            <span class="font-bold text-rose-600 text-lg">{{ Number(compteResultat?.total_prevu_depenses || 0).toLocaleString('fr-FR') }} FCFA</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600">Dépenses Réalisées</span>
            <span class="font-bold text-rose-700 text-lg">{{ Number(compteResultat?.total_realise_depenses || 0).toLocaleString('fr-FR') }} FCFA</span>
          </div>
          <div class="flex justify-between items-center py-4 bg-gray-50 rounded-xl mt-2 px-4">
            <span class="text-gray-700 font-bold text-lg">Résultat Prévu</span>
            <span class="font-black text-xl" :class="(compteResultat?.resultat_prevu || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'">
              {{ Number(compteResultat?.resultat_prevu || 0).toLocaleString('fr-FR') }} FCFA
            </span>
          </div>
          <div class="flex justify-between items-center py-4 bg-blue-50 rounded-xl mt-2 px-4">
            <span class="text-blue-700 font-bold text-lg">Résultat Réalisé</span>
            <span class="font-black text-xl" :class="(compteResultat?.resultat_realise || 0) >= 0 ? 'text-blue-600' : 'text-rose-600'">
              {{ Number(compteResultat?.resultat_realise || 0).toLocaleString('fr-FR') }} FCFA
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-800 mb-6">Bilan Financier</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600">Solde Total des Comptes</span>
            <span class="font-bold text-blue-600 text-lg">{{ Number(bilan?.solde_total || 0).toLocaleString('fr-FR') }} FCFA</span>
          </div>
        </div>
        <div class="mt-6">
          <h3 class="font-bold text-gray-700 mb-3">Budgets de l'année</h3>
          <div v-if="!bilan?.budgets || bilan.budgets.length === 0" class="text-center py-6 text-gray-400 italic">
            Aucun budget pour cette année
          </div>
          <div v-else class="space-y-3">
            <div v-for="budget in bilan.budgets" :key="budget.id" class="p-4 border border-gray-100 rounded-xl">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-gray-800">{{ budget.annee }} - {{ budget.description || 'Budget' }}</span>
                <span class="text-sm px-2 py-1 rounded-full" :class="{
                  'bg-gray-100 text-gray-700': budget.statut === 'brouillon',
                  'bg-emerald-100 text-emerald-700': budget.statut === 'valide',
                  'bg-amber-100 text-amber-700': budget.statut === 'cloture'
                }">{{ budget.statut }}</span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-400">Recettes</p>
                  <p class="font-bold text-emerald-600">{{ Number(budget.total_prevu_recettes || 0).toLocaleString('fr-FR') }} FCFA</p>
                </div>
                <div>
                  <p class="text-gray-400">Dépenses</p>
                  <p class="font-bold text-rose-600">{{ Number(budget.total_prevu_depenses || 0).toLocaleString('fr-FR') }} FCFA</p>
                </div>
                <div>
                  <p class="text-gray-400">Dép. Réalisées</p>
                  <p class="font-bold text-rose-700">{{ Number(budget.total_realise_depenses || 0).toLocaleString('fr-FR') }} FCFA</p>
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
import { ref, computed, onMounted } from 'vue';
import api from '../../api/axios';
import auth from '../../store/auth';

const annee = ref(new Date().getFullYear());
const communeId = ref(null);
const communes = ref([]);
const bilan = ref(null);
const compteResultat = ref(null);
const loading = ref(false);
const error = ref(null);

const isSuperAdmin = computed(() => auth.user.value?.role === 'super_admin');

const anneesDisponibles = computed(() => {
  const current = new Date().getFullYear();
  const annees = [];
  for (let i = current - 5; i <= current + 1; i++) {
    annees.push(i);
  }
  return annees;
});

const loadCommunes = async () => {
  try {
    const { data } = await api.get('/communes');
    communes.value = data.data || [];
  } catch (e) {
    console.error('Erreur lors du chargement des communes:', e);
  }
};

const loadData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = { annee: annee.value };
    if (isSuperAdmin.value && communeId.value) {
      params.commune_id = communeId.value;
    }
    console.log('Chargement des données avec params:', params);
    
    const [bilanRes, compteRes] = await Promise.all([
      api.get('/etats-financiers/bilan', { params }),
      api.get('/etats-financiers/compte-resultat', { params })
    ]);
    
    console.log('Réponse bilan:', bilanRes.data);
    console.log('Réponse compte résultat:', compteRes.data);
    
    bilan.value = bilanRes.data.data;
    compteResultat.value = compteRes.data.data;
  } catch (e) {
    console.error('Erreur lors du chargement des états financiers:', e);
    error.value = e.response?.data?.message || 'Erreur lors du chargement des données';
  } finally {
    loading.value = false;
  }
};

const exportToPdf = () => {
  alert('Fonctionnalité d\'export PDF à implémenter !');
};

onMounted(() => {
  if (isSuperAdmin.value) {
    loadCommunes();
  }
  loadData();
});
</script>
