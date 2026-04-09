<template>
  <div class="p-6">
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
        <button @click="fetchUsers" class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <th class="px-6 py-5">Utilisateur</th>
              <th class="px-6 py-5">Contact & Identifiants</th>
              <th class="px-6 py-5">Date d'inscription</th>
              <th class="px-6 py-5">Statut du compte</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm text-gray-600">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-blue-50/30 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                    {{ u.name.charAt(0).toUpperCase() }}
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
                  <div v-if="u.telephone" class="flex items-center gap-2">
                    <i class="fas fa-phone text-gray-400 w-4"></i>
                    <span class="text-xs">{{ u.telephone }}</span>
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
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  <i class="fas fa-check-circle text-[8px]"></i> Actif
                </span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="viewDetails(u)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Voir l'historique">
                    <i class="fas fa-history"></i>
                  </button>
                  <button class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Désactiver le compte">
                    <i class="fas fa-user-slash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-2xl">
                    <i class="fas fa-users-slash"></i>
                  </div>
                  <p class="text-gray-400 font-medium italic">Aucun utilisateur trouvé</p>
                  <button v-if="search" @click="search = ''" class="text-blue-600 text-xs font-bold hover:underline">Effacer la recherche</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../api/axios';

const users = ref([]);
const search = ref('');
const loading = ref(false);

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

const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  const s = search.value.toLowerCase();
  return users.value.filter(u => 
    u.name.toLowerCase().includes(s) || 
    u.email.toLowerCase().includes(s)
  );
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
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

const viewDetails = (user) => {
  // Optionnel : rediriger vers une vue de détails ou ouvrir une modal
  alert(`Historique de ${user.name} bientôt disponible`);
};

onMounted(fetchUsers);
</script>
