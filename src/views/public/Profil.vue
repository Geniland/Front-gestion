<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-mairie-blue px-8 py-10 text-white">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {{ user?.name?.charAt(0) || 'U' }}
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ user?.name || 'Utilisateur' }}</h1>
            <p class="text-blue-100">{{ user?.email }}</p>
          </div>
        </div>
      </div>
      
      <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1 space-y-6">
          <div>
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Informations personnelles</h2>
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-gray-700">
                <i class="fas fa-user text-gray-400 w-5"></i>
                <span>{{ user?.name }}</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700">
                <i class="fas fa-envelope text-gray-400 w-5"></i>
                <span>{{ user?.email }}</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="handleLogout" 
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <i class="fas fa-sign-out-alt"></i>
            Se déconnecter
          </button>
        </div>

        <div class="md:col-span-2 space-y-8">
          <div>
            <h2 class="text-xl font-bold text-gray-800 mb-4">Mes Activités Récentes</h2>
            
            <div v-if="loading" class="text-center py-10">
              <i class="fas fa-spinner fa-spin text-mairie-blue"></i>
            </div>

            <div v-else-if="activities.length === 0" class="bg-gray-50 rounded-2xl p-6 text-center text-gray-500 border border-dashed border-gray-200">
              <i class="fas fa-history text-3xl mb-3 block opacity-20"></i>
              <p>Aucune activité récente à afficher pour le moment.</p>
              <router-link to="/services" class="text-mairie-blue hover:underline text-sm font-medium mt-2 inline-block">Découvrir nos services</router-link>
            </div>

            <div v-else class="space-y-3">
              <div v-for="a in activities" :key="a.id" class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                <div class="flex items-center gap-4">
                  <div :class="a.activityType === 'Taxe' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'" class="w-10 h-10 rounded-lg flex items-center justify-center">
                    <i :class="a.activityType === 'Taxe' ? 'fas fa-file-invoice-dollar' : 'fas fa-user-shield'"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-800 text-sm">{{ a.activityType }}</div>
                    <div class="text-[10px] text-gray-400 font-medium uppercase">{{ formatDate(a.created_at) }} • Réf: {{ a.reference }}</div>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span :class="badgeClass(a.status)">{{ a.status }}</span>
                  <div v-if="a.commentaire_admin" class="text-[9px] text-amber-600 font-bold max-w-[150px] truncate text-right">
                    <i class="fas fa-comment-dots mr-1"></i> Nouveau message
                  </div>
                </div>
              </div>
              <div class="text-center pt-2">
                <router-link to="/taxes" class="text-xs font-bold text-mairie-blue hover:underline">Voir tout l'historique</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import userAuth from '../../store/userAuth';
import { useRouter } from 'vue-router';
import api from '../../api/axios';

const router = useRouter();
const user = computed(() => userAuth.user.value);

const activities = ref([]);
const loading = ref(true);

async function fetchActivities() {
  try {
    const [taxesRes, requestsRes] = await Promise.all([
      api.get('/public/taxes'),
      api.get('/public/etat-civil/historique')
    ]);

    const taxes = taxesRes.data.data?.data || taxesRes.data.data || [];
    const requests = requestsRes.data.data || [];

    const combined = [
      ...taxes.map(t => ({ ...t, activityType: 'Taxe' })),
      ...requests.map(r => ({ ...r, activityType: 'État Civil' }))
    ];

    activities.value = combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchActivities);

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function badgeClass(status) {
  const base = 'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase';
  if (status === 'validé' || status === 'approuvee' || status === 'payee') return `${base} bg-emerald-100 text-emerald-700`;
  if (status === 'rejeté' || status === 'rejetee') return `${base} bg-rose-100 text-rose-700`;
  return `${base} bg-amber-100 text-amber-700`;
}

async function handleLogout() {
  await userAuth.logout();
  router.push({ name: 'Home' });
}
</script>

