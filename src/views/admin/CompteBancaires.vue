<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Comptes Bancaires</h1>
        <p class="text-sm text-gray-500 mt-1">Gestion des comptes de la commune</p>
      </div>
      <button @click="openCreateModal" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
        <i class="fas fa-plus mr-2"></i> Nouveau Compte
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div v-for="compte in comptes" :key="compte.id" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-gray-800 text-lg">{{ compte.nom }}</h3>
            <p v-if="compte.banque" class="text-sm text-gray-500">{{ compte.banque }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
            <i class="fas fa-university"></i>
          </div>
        </div>
        <div class="mb-4">
          <p class="text-xs text-gray-400 uppercase font-bold mb-1">Solde Actuel</p>
          <p class="text-3xl font-black" :class="getSoldeClass(compte.solde_actuel)">
            {{ Number(compte.solde_actuel).toLocaleString('fr-FR') }} {{ compte.devise }}
          </p>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span v-if="isSuperAdmin" class="text-gray-500">{{ compte.commune?.nom }}</span>
          <button @click="viewCompteDetails(compte)" class="text-blue-600 hover:text-blue-800 font-medium">
            Voir les mouvements
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-gray-800">{{ editingCompte ? 'Modifier le compte' : 'Nouveau compte' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="saveCompte" class="p-6 space-y-4">
          <div v-if="isSuperAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Commune</label>
              <select v-model="form.commune_id" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required>
                <option value="">Sélectionner</option>
                <option v-for="c in communes" :key="c.id" :value="c.id">{{ c.nom }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom du compte</label>
              <input v-model="form.nom" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required />
            </div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="hidden" v-model="form.commune_id" />
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom du compte</label>
              <input v-model="form.nom" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Banque</label>
              <input v-model="form.banque" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Numéro de compte</label>
              <input v-model="form.numero_compte" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Devise</label>
              <select v-model="form.devise" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                <option value="FCFA">FCFA</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Solde Initial</label>
            <input v-model.number="form.solde_initial" type="number" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" min="0" required />
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
      <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-600 text-white">
          <div>
            <h3 class="font-bold">{{ selectedCompte?.nom }}</h3>
            <p class="text-sm opacity-70">{{ selectedCompte?.banque || '' }}</p>
          </div>
          <button @click="showDetails = false" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto flex-1">
          <div class="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
            <div>
              <p class="text-sm text-gray-500">Solde actuel</p>
              <p class="text-2xl font-black" :class="getSoldeClass(selectedCompte?.solde_actuel)">
                {{ Number(selectedCompte?.solde_actuel).toLocaleString('fr-FR') }} {{ selectedCompte?.devise }}
              </p>
            </div>
            <button @click="openCreateMouvement" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all">
              <i class="fas fa-plus mr-1"></i> Nouveau mouvement
            </button>
          </div>
          <div v-if="selectedCompte?.mouvements?.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 text-2xl">
              <i class="fas fa-list"></i>
            </div>
            <p class="text-gray-400 font-medium italic">Aucun mouvement</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="m in selectedCompte.mouvements" :key="m.id" class="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="m.type === 'entree' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                  <i :class="m.type === 'entree' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
                </div>
                <div>
                  <p class="font-bold text-gray-800">{{ m.libelle }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(m.date_mouvement) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-lg" :class="m.type === 'entree' ? 'text-green-600' : 'text-red-600'">
                  {{ m.type === 'entree' ? '+' : '-' }}{{ Number(m.montant).toLocaleString('fr-FR') }} {{ selectedCompte.devise }}
                </p>
                <p v-if="m.mode_paiement" class="text-xs text-gray-400 uppercase">{{ m.mode_paiement }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMouvementModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-gray-800">Nouveau mouvement</h3>
          <button @click="showMouvementModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="saveMouvement" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Type de mouvement</label>
              <select v-model="mouvementForm.type" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required>
                <option value="entree">Entrée</option>
                <option value="sortie">Sortie</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date</label>
              <input v-model="mouvementForm.date_mouvement" type="date" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Libellé</label>
            <input v-model="mouvementForm.libelle" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" required />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Montant</label>
              <input v-model.number="mouvementForm.montant" type="number" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" min="0" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mode de paiement</label>
              <select v-model="mouvementForm.mode_paiement" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                <option value="">Sélectionner</option>
                <option value="cash">Cash</option>
                <option value="virement">Virement</option>
                <option value="cheque">Chèque</option>
                <option value="tmoney">TMoney</option>
                <option value="flooz">Flooz</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Référence</label>
              <input v-model="mouvementForm.reference" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
            <textarea v-model="mouvementForm.description" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" rows="2"></textarea>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showMouvementModal = false" class="flex-1 py-3 rounded-xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50">Annuler</button>
            <button type="submit" :disabled="savingMouvement" class="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50">
              {{ savingMouvement ? 'Enregistrement...' : 'Enregistrer' }}
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

const comptes = ref([]);
const communes = ref([]);
const loading = ref(false);
const saving = ref(false);
const savingMouvement = ref(false);
const showModal = ref(false);
const showDetails = ref(false);
const showMouvementModal = ref(false);
const editingCompte = ref(null);
const selectedCompte = ref(null);

const isSuperAdmin = computed(() => auth.user.value?.role === 'super_admin');

const form = reactive({
  commune_id: null,
  nom: '',
  banque: '',
  numero_compte: '',
  devise: 'FCFA',
  solde_initial: 0
});

const mouvementForm = reactive({
  type: 'entree',
  libelle: '',
  description: '',
  montant: 0,
  date_mouvement: new Date().toISOString().split('T')[0],
  mode_paiement: '',
  reference: ''
});

const fetchComptes = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/compte-bancaires');
    comptes.value = data.comptes || [];
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
  editingCompte.value = null;
  form.commune_id = auth.user.value?.commune_id || '';
  form.nom = '';
  form.banque = '';
  form.numero_compte = '';
  form.devise = 'FCFA';
  form.solde_initial = 0;
  showModal.value = true;
};

const saveCompte = async () => {
  saving.value = true;
  try {
    if (editingCompte.value) {
      await api.put(`/compte-bancaires/${editingCompte.value.id}`, form);
    } else {
      await api.post('/compte-bancaires', form);
    }
    alert('Compte enregistré avec succès');
    showModal.value = false;
    fetchComptes();
  } catch (e) {
    console.error(e);
    alert('Erreur lors de l\'enregistrement');
  } finally {
    saving.value = false;
  }
};

const viewCompteDetails = (compte) => {
  selectedCompte.value = compte;
  showDetails.value = true;
};

const openCreateMouvement = () => {
  mouvementForm.type = 'entree';
  mouvementForm.libelle = '';
  mouvementForm.description = '';
  mouvementForm.montant = 0;
  mouvementForm.date_mouvement = new Date().toISOString().split('T')[0];
  mouvementForm.mode_paiement = '';
  mouvementForm.reference = '';
  showMouvementModal.value = true;
};

const saveMouvement = async () => {
  savingMouvement.value = true;
  try {
    await api.post('/mouvement-tresoreries', {
      ...mouvementForm,
      compte_bancaire_id: selectedCompte.value.id,
      commune_id: selectedCompte.value.commune_id
    });
    alert('Mouvement enregistré avec succès');
    showMouvementModal.value = false;
    fetchComptes();
    if (selectedCompte.value) {
      const { data } = await api.get(`/compte-bancaires/${selectedCompte.value.id}`);
      selectedCompte.value = data.compte;
    }
  } catch (e) {
    console.error(e);
    alert('Erreur lors de l\'enregistrement');
  } finally {
    savingMouvement.value = false;
  }
};

const getSoldeClass = (solde) => {
  if (solde >= 0) return 'text-green-600';
  return 'text-red-600';
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
  fetchComptes();
  fetchCommunes();
});
</script>
