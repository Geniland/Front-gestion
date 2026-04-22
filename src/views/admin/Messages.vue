<template>
  <div class="p-6 h-[calc(100vh-80px)] flex flex-col">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Messagerie Citoyenne</h1>
      <p class="text-sm text-gray-500 mt-1">Échangez directement avec les citoyens inscrits</p>
    </div>

    <div class="flex-1 flex gap-6 overflow-hidden">
      <!-- Liste des conversations -->
      <div class="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input v-model="search" type="text" placeholder="Rechercher un citoyen..." class="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="p-8 text-center text-gray-400">
            <i class="fas fa-spinner fa-spin mb-2"></i>
            <p class="text-[10px] uppercase font-bold tracking-widest">Chargement...</p>
          </div>
          <div v-else-if="filteredConversations.length === 0" class="p-8 text-center text-gray-400">
            <p class="text-xs">Aucune conversation</p>
          </div>
          <div v-for="conv in filteredConversations" :key="conv.userId" 
            @click="selectUser(conv)"
            :class="selectedUserId === conv.userId ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'"
            class="p-4 border-b border-gray-50 cursor-pointer transition-all"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                {{ conv.userName.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-0.5">
                  <span class="font-bold text-gray-900 text-sm truncate">{{ conv.userName }}</span>
                  <span v-if="conv.unreadCount > 0" class="w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <p class="text-[11px] text-gray-500 truncate">{{ conv.lastMessage }}</p>
                <span class="text-[9px] text-gray-400 font-medium uppercase mt-1 block">{{ formatDate(conv.lastDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat area -->
      <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <template v-if="selectedUserId">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center font-bold">
                {{ selectedUserName.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="font-bold text-gray-900">{{ selectedUserName }}</h3>
                <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">En ligne</p>
              </div>
            </div>
            <button @click="fetchMessages" class="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30" ref="chatContainer">
            <div v-for="msg in selectedMessages" :key="msg.id" :class="msg.sender_type === 'admin' ? 'flex justify-end' : 'flex justify-start'">
              <div :class="msg.sender_type === 'admin' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-gray-800 rounded-2xl rounded-tl-none shadow-sm'" class="max-w-[70%] p-4 text-sm font-medium leading-relaxed">
                {{ msg.message }}
                <div class="text-[9px] mt-2 opacity-60 font-black uppercase tracking-tighter" :class="msg.sender_type === 'admin' ? 'text-white' : 'text-gray-500'">
                  {{ new Date(msg.created_at).toLocaleString('fr-FR') }}
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-white border-t border-gray-100">
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <input v-model="newMessage" type="text" :placeholder="'Répondre à ' + selectedUserName + '...'" class="flex-1 bg-gray-50 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all" />
              <button type="submit" :disabled="!newMessage.trim() || sending" class="px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2">
                <i class="fas fa-paper-plane" v-if="!sending"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>Envoyer</span>
              </button>
            </form>
          </div>
        </template>
        <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
          <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl">
            <i class="far fa-comments opacity-20"></i>
          </div>
          <p class="text-xs font-bold uppercase tracking-widest">Sélectionnez une conversation</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import api from '../../api/axios';

const messages = ref([]);
const loading = ref(false);
const sending = ref(false);
const search = ref('');
const selectedUserId = ref(null);
const selectedUserName = ref('');
const newMessage = ref('');
const chatContainer = ref(null);

const fetchMessages = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/notifications');
    messages.value = data.data || [];
    if (selectedUserId.value) {
      markAsRead(selectedUserId.value);
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

const conversations = computed(() => {
  const groups = {};
  messages.value.forEach(msg => {
    const userId = msg.user_id;
    if (!groups[userId]) {
      groups[userId] = {
        userId,
        userName: msg.user?.name || 'Citoyen #' + userId,
        lastMessage: msg.message,
        lastDate: msg.created_at,
        unreadCount: 0,
        messages: []
      };
    }
    groups[userId].messages.push(msg);
    if (!msg.is_read && msg.sender_type === 'citizen') {
      groups[userId].unreadCount++;
    }
    if (new Date(msg.created_at) > new Date(groups[userId].lastDate)) {
      groups[userId].lastMessage = msg.message;
      groups[userId].lastDate = msg.created_at;
    }
  });
  return Object.values(groups).sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
});

const filteredConversations = computed(() => {
  if (!search.value) return conversations.value;
  const s = search.value.toLowerCase();
  return conversations.value.filter(c => c.userName.toLowerCase().includes(s));
});

const selectedMessages = computed(() => {
  if (!selectedUserId.value) return [];
  return messages.value
    .filter(m => m.user_id === selectedUserId.value)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
});

const selectUser = (conv) => {
  selectedUserId.value = conv.userId;
  selectedUserName.value = conv.userName;
  markAsRead(conv.userId);
  scrollToBottom();
};

const markAsRead = async (userId) => {
  const unread = messages.value.filter(m => m.user_id === userId && !m.is_read && m.sender_type === 'citizen');
  for (const m of unread) {
    try {
      await api.post(`/notifications/${m.id}/read`);
      m.is_read = true;
    } catch (e) {
      console.error(e);
    }
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;
  
  const text = newMessage.value;
  newMessage.value = ''; // Clear immediately for UX
  sending.value = true;
  try {
    const { data } = await api.post('/notifications', {
      user_id: selectedUserId.value,
      message: text
    });
    // On ajoute le message à la liste locale
    messages.value.push(data.data);
    scrollToBottom();
  } catch (e) {
    newMessage.value = text; // Restore if failed
    alert('Erreur lors de l\'envoi');
  } finally {
    sending.value = false;
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const formatDate = (d) => {
  const date = new Date(d);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

onMounted(() => {
  fetchMessages();
  setInterval(fetchMessages, 30000);
});

</script>

<style scoped>
.flex-1 {
  min-height: 0;
}

.messages-list-enter-active,
.messages-list-leave-active {
  transition: all 0.3s ease;
}
.messages-list-enter-from,
.messages-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
