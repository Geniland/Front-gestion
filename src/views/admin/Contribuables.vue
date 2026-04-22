<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <p class="text-sm text-gray-500 mt-1">Liste des citoyens inscrits sur le portail public</p>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <div class="relative flex-1 md:w-64">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un utilisateur..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm"
          />
        </div>

        <button
          @click="fetchUsers"
          class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <th class="px-6 py-5">Utilisateur</th>
              <th class="px-6 py-5">Contact</th>
              <th class="px-6 py-5">Date d'inscription</th>
              <th class="px-6 py-5">Statut</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr
              v-for="u in filteredUsers"
              :key="u.id"
              class="hover:bg-blue-50/30 transition-colors group"
            >
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                    {{ u.name?.charAt(0)?.toUpperCase() || "U" }}
                  </div>
                  <div>
                    <div class="font-bold text-gray-900 text-base">{{ u.name }}</div>
                    <div class="text-xs text-gray-400">ID: #{{ u.id }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <i class="far fa-envelope text-gray-400 w-4"></i>
                    <span class="font-medium text-gray-700">{{ u.email }}</span>
                  </div>

                  <div v-if="u.phone" class="flex items-center gap-2">
                    <i class="fas fa-phone text-gray-400 w-4"></i>
                    <span class="text-xs">{{ u.phone }}</span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-gray-700 font-medium">{{ formatDate(u.created_at) }}</span>
                  <span class="text-[10px] text-gray-400 uppercase tracking-tighter">{{ formatTime(u.created_at) }}</span>
                </div>
              </td>

              <td class="px-6 py-5">
                <span
                  v-if="u.is_blocked"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider"
                  :title="u.blocked_reason"
                >
                  <i class="fas fa-ban text-[8px]"></i> Bloqué
                </span>

                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider"
                >
                  <i class="fas fa-check-circle text-[8px]"></i> Actif
                </span>
              </td>

              <td class="px-6 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="viewDetails(u)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir l'historique"
                  >
                    <i class="fas fa-history"></i>
                  </button>

                  <button
                    @click="openEditModal(u)"
                    class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <i class="fas fa-edit"></i>
                  </button>

                  <button
                    v-if="!u.is_blocked"
                    @click="promptBlock(u)"
                    class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Bloquer le compte"
                  >
                    <i class="fas fa-user-slash"></i>
                  </button>

                  <button
                    v-else
                    @click="unblock(u)"
                    class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Débloquer le compte"
                  >
                    <i class="fas fa-user-check"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-2xl">
                    <i class="fas fa-users-slash"></i>
                  </div>
                  <p class="text-gray-400 font-medium italic">Aucun utilisateur trouvé</p>
                  <button
                    v-if="search"
                    @click="search = ''"
                    class="text-blue-600 text-xs font-bold hover:underline"
                  >
                    Effacer la recherche
                  </button>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Modification -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-gray-800">Modifier l'utilisateur</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="updateUser" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom complet</label>
            <input v-model="editForm.name" type="text"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</label>
            <input v-model="editForm.email" type="email"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Téléphone</label>
            <input v-model="editForm.phone" type="text"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Nouveau mot de passe (optionnel)
            </label>
            <input v-model="editForm.password" type="password"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div v-if="editForm.password">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Confirmer le mot de passe
            </label>
            <input v-model="editForm.password_confirmation" type="password"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showEditModal = false"
              class="flex-1 py-3 rounded-xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Enregistrement...' : 'Mettre à jour' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Historique -->
    <div
      v-if="showHistoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden h-[600px] flex flex-col">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-600 text-white">
          <div>
            <h3 class="font-bold">Historique de {{ selectedUser?.name }}</h3>
            <p class="text-xs opacity-70">Activités du portail public + terrain</p>
          </div>

          <button
            @click="showHistoryModal = false"
            class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="loadingHistory" class="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
            <i class="fas fa-spinner fa-spin text-3xl"></i>
            <p class="font-bold text-xs uppercase tracking-widest">Chargement de l'historique...</p>
          </div>

          <div v-else class="space-y-8">
            <!-- Etat civil -->
            <div>
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <i class="fas fa-id-card text-blue-500"></i>
                Demandes État Civil ({{ historyData.etat_civil.length }})
              </h4>

              <div v-if="historyData.etat_civil.length === 0"
                class="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4 text-center"
              >
                Aucune demande état civil
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="t in historyData.etat_civil"
                  :key="t.id"
                  class="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center shadow-sm"
                >
                  <div>
                    <div class="font-bold text-gray-800">
                      {{ t.type_document || "Demande Etat Civil" }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase">
                      {{ formatDate(t.created_at) }} • Réf: {{ t.id }}
                    </div>
                  </div>

                  <div class="text-right">
                    <span class="text-[10px] font-black uppercase tracking-tighter text-gray-500">
                      {{ t.status || 'en attente' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Taxes publiques -->
            <div>
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <i class="fas fa-file-invoice-dollar text-amber-500"></i>
                Taxes Publiques ({{ historyData.public_taxes.length }})
              </h4>

              <div v-if="historyData.public_taxes.length === 0"
                class="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4 text-center"
              >
                Aucune taxe publique
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="t in historyData.public_taxes"
                  :key="t.id"
                  class="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center shadow-sm"
                >
                  <div>
                    <div class="font-bold text-gray-800">
                      {{ t.type_taxe?.nom || "Taxe" }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase">
                      {{ formatDate(t.created_at) }} • Réf: {{ t.id }}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="font-black text-blue-600">{{ t.montant }} FCFA</div>
                    <span class="text-[10px] font-black uppercase tracking-tighter text-gray-500">
                      {{ t.status || "en attente" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paiements publics -->
            <div>
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <i class="fas fa-receipt text-emerald-500"></i>
                Paiements en Ligne ({{ historyData.public_payments.length }})
              </h4>

              <div v-if="historyData.public_payments.length === 0"
                class="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4 text-center"
              >
                Aucun paiement en ligne
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="p in historyData.public_payments"
                  :key="p.id"
                  class="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center shadow-sm border-l-4 border-l-emerald-500"
                >
                  <div>
                    <div class="font-bold text-gray-800">
                      Paiement Taxe #{{ p.taxe_id }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase">
                      {{ formatDate(p.created_at) }} • {{ p.methode_paiement || "en ligne" }}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="font-black text-emerald-600">{{ p.montant }} FCFA</div>
                    <div class="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                      Réf: {{ p.reference_transaction || "-" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Taxes terrain -->
            <div>
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <i class="fas fa-map-marker-alt text-purple-500"></i>
                Taxes Terrain ({{ historyData.terrain_taxes.length }})
              </h4>

              <div v-if="historyData.terrain_taxes.length === 0"
                class="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4 text-center"
              >
                Aucune taxe terrain
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="t in historyData.terrain_taxes"
                  :key="t.id"
                  class="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center shadow-sm"
                >
                  <div>
                    <div class="font-bold text-gray-800">
                      {{ t.type_taxe?.nom || "Taxe terrain" }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase">
                      {{ formatDate(t.created_at) }} • Réf: {{ t.id }}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="font-black text-blue-600">{{ t.montant }} FCFA</div>
                    <span class="text-[10px] font-black uppercase tracking-tighter text-gray-500">
                      {{ t.status || "en attente" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paiements terrain -->
            <div>
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <i class="fas fa-money-bill-wave text-green-500"></i>
                Paiements Terrain ({{ historyData.terrain_payments.length }})
              </h4>

              <div v-if="historyData.terrain_payments.length === 0"
                class="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4 text-center"
              >
                Aucun paiement terrain
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="p in historyData.terrain_payments"
                  :key="p.id"
                  class="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center shadow-sm border-l-4 border-l-green-500"
                >
                  <div>
                    <div class="font-bold text-gray-800">
                      Paiement Taxe #{{ p.taxe_id }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase">
                      {{ formatDate(p.created_at) }} • {{ p.methode_paiement || "terrain" }}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="font-black text-emerald-600">{{ p.montant }} FCFA</div>
                  </div>
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

const users = ref([]);
const search = ref('');
const loading = ref(false);
const saving = ref(false);

const showEditModal = ref(false);
const editForm = reactive({
  id: null,
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
});

const showHistoryModal = ref(false);
const loadingHistory = ref(false);
const selectedUser = ref(null);

const historyData = ref({
  etat_civil: [],
  public_taxes: [],
  public_payments: [],
  terrain_taxes: [],
  terrain_payments: []
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/public-users');
    users.value = data.data || [];
  } catch (e) {
    console.error("Erreur lors de la récupération des utilisateurs", e);
  } finally {
    loading.value = false;
  }
};

const openEditModal = (user) => {
  editForm.id = user.id;
  editForm.name = user.name;
  editForm.email = user.email;
  editForm.phone = user.phone;
  editForm.password = '';
  editForm.password_confirmation = '';
  showEditModal.value = true;
};

const updateUser = async () => {
  saving.value = true;
  try {
    const payload = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
    };

    if (editForm.password) {
      payload.password = editForm.password;
      payload.password_confirmation = editForm.password_confirmation;
    }

    await api.put(`/public-users/${editForm.id}`, payload);

    alert('Utilisateur mis à jour avec succès');
    showEditModal.value = false;
    fetchUsers();

  } catch (e) {
    console.log(e.response?.data);

    if (e.response?.data?.errors?.email) {
      alert("Cet email est déjà utilisé.");
    } else {
      alert(e.response?.data?.message || "Erreur lors de la mise à jour");
    }
  } finally {
    saving.value = false;
  }
};

const promptBlock = async (user) => {
  const reason = prompt(`Raison du blocage pour ${user.name} :`);
  if (reason) {
    try {
      await api.post(`/public-users/${user.id}/block`, { reason });
      fetchUsers();
    } catch (e) {
      alert('Erreur lors du blocage');
    }
  }
};

const unblock = async (user) => {
  if (confirm(`Débloquer ${user.name} ?`)) {
    try {
      await api.post(`/public-users/${user.id}/unblock`);
      fetchUsers();
    } catch (e) {
      alert('Erreur lors du déblocage');
    }
  }
};

const viewDetails = async (user) => {
  selectedUser.value = user;
  showHistoryModal.value = true;
  loadingHistory.value = true;

  // reset
  historyData.value = {
    etat_civil: [],
    public_taxes: [],
    public_payments: [],
    terrain_taxes: [],
    terrain_payments: []
  };

  try {
    const { data } = await api.get(`/public-users/${user.id}/history`);
    historyData.value = data.data;
  } catch (e) {
    console.error(e);
    alert("Erreur lors du chargement de l'historique");
  } finally {
    loadingHistory.value = false;
  }
};

const filteredUsers = computed(() => {
  if (!search.value) return users.value;

  const s = search.value.toLowerCase();
  return users.value.filter(u =>
    (u.name && u.name.toLowerCase().includes(s)) ||
    (u.email && u.email.toLowerCase().includes(s)) ||
    (u.phone && u.phone.includes(s))
  );
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(fetchUsers);
</script>