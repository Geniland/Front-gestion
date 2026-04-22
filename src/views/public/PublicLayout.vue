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
                <router-link to="/login" class="text-sm font-bold text-gray-600 hover:text-mairie-blue transition-colors px-4 py-2">
                  Connexion
                </router-link>
                <router-link to="/register" class="px-6 py-2.5 rounded-full bg-mairie-blue text-white hover:bg-blue-700 shadow-lg shadow-mairie-blue/20 transition-all font-bold text-sm">
                  S'inscrire
                </router-link>
              </div>
            </template>

            <template v-else>
              <div class="flex items-center gap-3">
                
                <!-- Notifications -->
                <div class="relative">
                  <button @click="toggleChat" class="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all relative group">
                    <i class="far fa-bell text-xl group-hover:rotate-12 transition-transform"></i>
                    <span
                      v-if="unreadCount > 0"
                      class="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm px-1 animate-bounce"
                    >
                      {{ unreadCount }}
                    </span>
                  </button>
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
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all border border-gray-200">
              <i class="fas fa-fw" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
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
          <router-link to="/login" class="w-full py-3 rounded-xl bg-gray-50 text-center font-bold text-gray-600">
            Connexion
          </router-link>
          <router-link to="/register" class="w-full py-3 rounded-xl bg-mairie-blue text-center font-bold text-white">
            Créer un compte
          </router-link>
        </div>
      </div>
    </header>


    <!-- ✅ CHAT MODAL (SORTI DU HEADER POUR ÉVITER LE PROBLÈME) -->
    <div
      v-if="showChatModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-10"
      @click.self="closeChat"
    >
      <div class="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col h-[650px] overflow-hidden animate-in fade-in zoom-in duration-300">

        <!-- Header modal -->
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-mairie-blue text-white">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <i class="fas fa-comments text-xl"></i>
            </div>
            <div>
              <h3 class="font-black text-sm uppercase tracking-widest">Messagerie Mairie</h3>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <p class="text-[10px] opacity-80 uppercase font-bold tracking-tighter">
                  Support en ligne
                </p>
              </div>
            </div>
          </div>

          <button @click="closeChat" class="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-6 bg-gray-50/50" ref="chatContainer">
          <div v-if="chatMessages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 space-y-6">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl opacity-20">
              <i class="far fa-comments"></i>
            </div>
            <p class="text-xs font-bold uppercase tracking-widest text-center">
              Aucun message pour le moment.<br />
              Posez vos questions à la mairie.
            </p>
          </div>

          <div v-else>
            <div v-for="(messages, date) in groupedMessages" :key="date">
              <!-- Date Separator -->
              <div class="flex justify-center my-8">
                <span class="px-4 py-1.5 bg-white text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 rounded-full border border-gray-100 shadow-sm">
                  {{ date }}
                </span>
              </div>

              <div
                v-for="msg in messages"
                :key="msg.id"
                :class="msg.sender_type === 'citizen' ? 'flex justify-end' : 'flex justify-start'"
                class="mb-6 last:mb-0"
              >
                <div
                  :class="[
                    msg.sender_type === 'citizen'
                      ? 'bg-mairie-blue text-white rounded-2xl rounded-tr-none shadow-lg shadow-blue-500/10'
                      : 'bg-white text-gray-800 rounded-2xl rounded-tl-none shadow-sm border border-gray-100',
                    msg.sender_type === 'admin' && !msg.is_read ? 'ring-2 ring-red-500/10' : ''
                  ]"
                  class="max-w-[85%] p-5 text-sm font-medium leading-relaxed relative group"
                >
                  {{ msg.message }}

                  <div
                    class="text-[9px] mt-3 opacity-60 font-black uppercase tracking-tighter flex items-center gap-2"
                    :class="msg.sender_type === 'citizen' ? 'text-white' : 'text-gray-400'"
                  >
                    <i class="far fa-clock"></i>
                    {{ new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}
                    
                    <!-- Status indicator for citizen messages -->
                    <template v-if="msg.sender_type === 'citizen'">
                      <div class="flex items-center ml-auto px-1.5 py-0.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <i class="fas fa-check text-[8px] transition-colors" :class="msg.is_read ? 'text-emerald-300' : 'text-white/40'"></i>
                        <i v-if="msg.is_read" class="fas fa-check text-[8px] -ml-1 text-emerald-300 animate-in fade-in zoom-in"></i>
                      </div>
                    </template>
                    
                    <!-- Unread dot for admin messages -->
                    <template v-else-if="!msg.is_read">
                      <span class="w-1.5 h-1.5 bg-red-500 rounded-full ml-auto animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    </template>
                  </div>
                  
                  <!-- Left accent for unread admin messages -->
                  <div v-if="msg.sender_type === 'admin' && !msg.is_read" class="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-5 bg-white border-t border-gray-100">
          <form @submit.prevent="sendMessage" class="flex gap-3">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Votre message..."
              class="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-mairie-blue/10 transition-all outline-none"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim() || sendingMessage"
              class="w-14 h-14 bg-mairie-blue text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-mairie-blue/20 disabled:opacity-50 active:scale-95"
            >
              <i class="fas fa-paper-plane" v-if="!sendingMessage"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
            </button>
          </form>
        </div>

      </div>
    </div>


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
            <p class="text-sm leading-relaxed opacity-70">
              Au cœur du développement local, nous œuvrons chaque jour pour une commune moderne, inclusive et durable au service de chaque citoyen.
            </p>
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
          <div class="text-xs font-medium opacity-50">
            © {{ new Date().getFullYear() }} Mairie de Golfe 7. Développement local & Proximité citoyenne.
          </div>
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
import apiPublic from '../../api/axiosPublic';

const router = useRouter();
const isAuthenticated = userAuth.isAuthenticated;
const user = userAuth.user;

const showChatModal = ref(false);
const mobileMenuOpen = ref(false);
const chatMessages = ref([]);
const newMessage = ref('');
const sendingMessage = ref(false);
const chatContainer = ref(null);

async function fetchNotifications() {
  if (!isAuthenticated.value) return;
  try {
    const response = await apiPublic.get('/notifications');
    chatMessages.value = response.data.data;
  } catch (error) {
    console.error('Erreur notifications:', error);
  }
}

const unreadCount = computed(() => {
  if (!isAuthenticated.value) return 0;
  return chatMessages.value.filter(m => !m.is_read && m.sender_type === 'admin').length;
});

const groupedMessages = computed(() => {
  const groups = {};
  chatMessages.value.forEach(msg => {
    const date = new Date(msg.created_at).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  });
  return groups;
});

function closeChat() {
  showChatModal.value = false;
}

function toggleChat() {
  showChatModal.value = !showChatModal.value;

  if (showChatModal.value) {
    fetchNotifications();
    markAllAsRead();

    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTo({
          top: chatContainer.value.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 300);
  }
}

async function markAllAsRead() {
  const unread = chatMessages.value.filter(m => !m.is_read && m.sender_type === 'admin');
  if (unread.length === 0) return;

  for (const m of unread) {
    try {
      await apiPublic.post(`/notifications/${m.id}/read`);
      m.is_read = true;
    } catch (e) {
      console.error(e);
    }
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || sendingMessage.value) return;

  const text = newMessage.value;
  newMessage.value = '';
  sendingMessage.value = true;

  try {
    const response = await apiPublic.post('/notifications', {
      message: text,
      title: 'Message de ' + user.value.name
    });

    chatMessages.value.push(response.data.data);

    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTo({
          top: chatContainer.value.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);

  } catch (error) {
    newMessage.value = text;
    console.error('Erreur envoi message:', error);
    alert("Erreur lors de l'envoi du message");
  } finally {
    sendingMessage.value = false;
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    fetchNotifications();
    setInterval(fetchNotifications, 10000);
  }
});

watch(isAuthenticated, (val) => {
  if (val) fetchNotifications();
  else chatMessages.value = [];
});

async function handleLogout() {
  await userAuth.logout();
  router.push({ name: 'Home' });
}
</script>

<style scoped>
.nav-link {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
}
.nav-link:hover {
  color: #0056b3;
  background-color: #f3f4f6;
}
.nav-link.router-link-active {
  color: #0056b3;
  background-color: #eff6ff;
}
.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: #0056b3;
  border-radius: 50%;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 800;
  color: #4b5563;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.mobile-nav-link:hover {
  background-color: #f9fafb;
  color: #0056b3;
}
.mobile-nav-link.router-link-active {
  background-color: #eff6ff;
  color: #0056b3;
  border-color: #dbeafe;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>