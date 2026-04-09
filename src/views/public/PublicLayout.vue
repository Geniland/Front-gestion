<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Navbar -->
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-mairie-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-mairie-blue/20 group-hover:scale-110 transition-transform">
              <i class="fas fa-landmark"></i>
            </div>
            <div class="flex flex-col">
              <span class="font-black text-xl tracking-tight text-gray-900 leading-none">GOLFE 7</span>
              <span class="text-[10px] font-bold text-mairie-green tracking-[0.2em] uppercase">Mairie Commune</span>
            </div>
          </router-link>

          <!-- Desktop Nav -->
          <nav class="hidden lg:flex items-center gap-8">
            <router-link to="/" class="nav-link">Accueil</router-link>
            <router-link to="/services" class="nav-link">Services</router-link>
            <router-link to="/actualites" class="nav-link">Actualités</router-link>
            <router-link to="/taxes" class="nav-link">Taxes & Paiement</router-link>
            <router-link to="/etat-civil" class="nav-link">État civil</router-link>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center gap-4">
            <template v-if="!isAuthenticated">
              <div class="hidden sm:flex items-center gap-3">
                <router-link to="/login" class="text-sm font-bold text-gray-600 hover:text-mairie-blue transition-colors px-4 py-2">Connexion</router-link>
                <router-link to="/register" class="px-6 py-2.5 rounded-full bg-mairie-blue text-white hover:bg-blue-700 shadow-lg shadow-mairie-blue/20 transition-all font-bold text-sm">S'inscrire</router-link>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center gap-3">
                <!-- Notifications -->
                <div class="relative">
                  <button @click="showNotifs = !showNotifs" class="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all relative">
                    <i class="far fa-bell text-xl"></i>
                    <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-black border-2 border-white animate-bounce">
                      {{ unreadCount }}
                    </span>
                  </button>

                  <!-- Notifs Dropdown -->
                  <div v-if="showNotifs" class="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div class="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                      <span class="font-black text-xs uppercase tracking-widest text-gray-500">Notifications</span>
                      <button @click="showNotifs = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="max-h-96 overflow-y-auto">
                      <div v-if="notifications.length === 0" class="p-10 text-center flex flex-col items-center gap-3">
                        <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-xl">
                          <i class="far fa-bell-slash"></i>
                        </div>
                        <p class="text-gray-400 text-sm font-medium">Tout est à jour !</p>
                      </div>
                      <div v-for="n in notifications" :key="n.id" class="p-4 border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer" @click="handleNotifClick(n)">
                        <div class="flex gap-4">
                          <div :class="n.type === 'taxe' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
                            <i :class="n.type === 'taxe' ? 'fas fa-receipt' : 'fas fa-fingerprint'"></i>
                          </div>
                          <div class="flex-1">
                            <div class="text-xs font-black text-gray-900 mb-1">{{ n.title }}</div>
                            <div class="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{{ n.message }}</div>
                            <div class="text-[9px] text-mairie-blue mt-2 font-black uppercase tracking-tighter">{{ n.date }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="notifications.length > 0" class="p-4 bg-gray-50/50 text-center border-t border-gray-100">
                      <button @click="clearNotifications" class="text-[10px] font-black text-mairie-blue hover:text-blue-800 uppercase tracking-widest">Marquer tout comme lu</button>
                    </div>
                  </div>
                </div>

                <!-- User Profile -->
                <router-link to="/profil" class="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                  <span class="text-xs font-black text-gray-700 hidden sm:inline">{{ user?.name }}</span>
                  <div class="w-8 h-8 bg-gradient-to-br from-mairie-blue to-blue-700 rounded-full flex items-center justify-center text-xs text-white font-black shadow-inner">
                    {{ user?.name?.charAt(0) || 'U' }}
                  </div>
                </router-link>
              </div>
            </template>

            <!-- Mobile Menu Toggle -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
              <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars-staggered'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-50 bg-white p-6 space-y-4 animate-in slide-in-from-top-4">
        <router-link @click="mobileMenuOpen = false" to="/" class="mobile-nav-link">Accueil</router-link>
        <router-link @click="mobileMenuOpen = false" to="/services" class="mobile-nav-link">Services Municipaux</router-link>
        <router-link @click="mobileMenuOpen = false" to="/actualites" class="mobile-nav-link">Actualités</router-link>
        <router-link @click="mobileMenuOpen = false" to="/taxes" class="mobile-nav-link">Taxes & Paiement</router-link>
        <router-link @click="mobileMenuOpen = false" to="/etat-civil" class="mobile-nav-link">État civil</router-link>
        <div v-if="!isAuthenticated" class="pt-4 border-t border-gray-50 flex flex-col gap-3">
          <router-link to="/login" class="w-full py-3 rounded-xl bg-gray-50 text-center font-bold text-gray-600">Connexion</router-link>
          <router-link to="/register" class="w-full py-3 rounded-xl bg-mairie-blue text-center font-bold text-white">Créer un compte</router-link>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div class="space-y-6">
            <router-link to="/" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                <i class="fas fa-landmark"></i>
              </div>
              <span class="font-black text-xl tracking-tight text-white">GOLFE 7</span>
            </router-link>
            <p class="text-sm leading-relaxed opacity-70">Au cœur du développement local, nous œuvrons chaque jour pour une commune moderne, inclusive et durable au service de chaque citoyen.</p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-mairie-blue hover:text-white transition-all"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-mairie-blue hover:text-white transition-all"><i class="fab fa-twitter"></i></a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-mairie-blue hover:text-white transition-all"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div>
            <h3 class="font-black text-xs uppercase tracking-[0.2em] text-white mb-8">Services Rapides</h3>
            <ul class="space-y-4 text-sm font-medium">
              <li><router-link to="/etat-civil" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Actes d'État Civil</router-link></li>
              <li><router-link to="/taxes" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Paiement de Taxes</router-link></li>
              <li><router-link to="/services" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Urbanisme & Travaux</router-link></li>
              <li><router-link to="/actualites" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Journal Municipal</router-link></li>
            </ul>
          </div>

          <div>
            <h3 class="font-black text-xs uppercase tracking-[0.2em] text-white mb-8">Informations</h3>
            <ul class="space-y-4 text-sm font-medium">
              <li><a href="#" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Horaires d'ouverture</a></li>
              <li><a href="#" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Organigramme</a></li>
              <li><a href="#" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Plan de la commune</a></li>
              <li><router-link to="/register" class="hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[10px] text-mairie-green"></i> Devenir contribuable</router-link></li>
            </ul>
          </div>

          <div>
            <h3 class="font-black text-xs uppercase tracking-[0.2em] text-white mb-8">Contact & Support</h3>
            <ul class="space-y-6 text-sm">
              <li class="flex gap-4">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-mairie-green flex-shrink-0">
                  <i class="fas fa-map-pin"></i>
                </div>
                <div>
                  <div class="text-white font-bold mb-1">Siège Social</div>
                  <div class="text-xs opacity-70">Quartier Administratif, Lomé - Togo</div>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-mairie-green flex-shrink-0">
                  <i class="fas fa-phone"></i>
                </div>
                <div>
                  <div class="text-white font-bold mb-1">Téléphone</div>
                  <div class="text-xs opacity-70">+228 90 00 00 00</div>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-mairie-green flex-shrink-0">
                  <i class="fas fa-envelope"></i>
                </div>
                <div>
                  <div class="text-white font-bold mb-1">Email</div>
                  <div class="text-xs opacity-70">contact@mairie-g7.tg</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="text-xs font-medium opacity-50">© {{ new Date().getFullYear() }} Mairie de Golfe 7. Développement local & Proximité citoyenne.</div>
          <div class="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-50">
            <a href="#" class="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" class="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" class="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import userAuth from '../../store/userAuth';
import { useRouter } from 'vue-router';
import api from '../../api/axios';

const router = useRouter();
const isAuthenticated = computed(() => userAuth.isAuthenticated.value);
const user = computed(() => userAuth.user.value);

const showNotifs = ref(false);
const mobileMenuOpen = ref(false);
const notifications = ref([]);
const unreadCount = computed(() => notifications.value.length);

async function fetchNotifications() {
  if (!isAuthenticated.value) return;
  
  try {
    const [taxesRes, requestsRes] = await Promise.all([
      api.get('/public/taxes'),
      api.get('/public/etat-civil/historique')
    ]);

    const newNotifs = [];

    // Notifications pour les taxes
    const taxes = taxesRes.data.data?.data || taxesRes.data.data || [];
    taxes.forEach(t => {
      if (t.commentaire_admin && t.status !== 'en_attente') {
        newNotifs.push({
          id: `taxe-${t.id}`,
          type: 'taxe',
          title: `Mise à jour Taxe: ${t.status}`,
          message: t.commentaire_admin,
          date: new Date(t.updated_at).toLocaleDateString('fr-FR'),
          link: '/taxes'
        });
      }
    });

    // Notifications pour l'état civil
    const requests = requestsRes.data.data || [];
    requests.forEach(r => {
      if (r.commentaire_admin && r.status !== 'en_attente') {
        newNotifs.push({
          id: `etc-${r.id}`,
          type: 'etat-civil',
          title: `État Civil: ${r.status}`,
          message: r.commentaire_admin,
          date: new Date(r.updated_at).toLocaleDateString('fr-FR'),
          link: '/etat-civil'
        });
      }
    });

    // Trier par date décroissante
    notifications.value = newNotifs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  } catch (e) {
    console.error("Erreur chargement notifications", e);
  }
}

function handleNotifClick(n) {
  showNotifs.value = false;
  router.push(n.link);
}

function clearNotifications() {
  notifications.value = [];
  showNotifs.value = false;
}

watch(isAuthenticated, (val) => {
  if (val) fetchNotifications();
  else notifications.value = [];
});

onMounted(() => {
  if (isAuthenticated.value) {
    fetchNotifications();
    // Rafraîchir toutes les 2 minutes
    setInterval(fetchNotifications, 120000);
  }
});

async function handleLogout() {
  await userAuth.logout();
  router.push({ name: 'Home' });
}
</script>

<style scoped>
.nav-link {
  @apply text-sm font-bold text-gray-500 hover:text-mairie-blue transition-all relative py-2;
}
.nav-link.router-link-active {
  @apply text-mairie-blue;
}
.nav-link.router-link-active::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-mairie-blue rounded-full;
}

.mobile-nav-link {
  @apply block py-4 px-6 rounded-2xl font-black text-gray-700 hover:bg-gray-50 hover:text-mairie-blue transition-all;
}
.mobile-nav-link.router-link-active {
  @apply bg-blue-50 text-mairie-blue;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>

