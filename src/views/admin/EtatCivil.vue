<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Demandes d'État Civil</h1>
      <div class="flex gap-4">
        <select v-model="statusFilter" class="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
          <option value="en_attente">En attente</option>
          <option value="validé">Validées</option>
          <option value="rejeté">Rejetées</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div v-for="d in filteredItems" :key="d.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
        <div class="flex items-start gap-5">
          <div :class="typeIconClass(d.type)" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            <i :class="typeIcon(d.type)"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-gray-900 uppercase tracking-wide text-lg">{{ d.type }}</span>
              <span :class="badgeClass(d.status)" class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{{ d.status }}</span>
            </div>
            <div class="text-sm text-gray-600 font-medium">
              <i class="fas fa-user mr-1 text-gray-400"></i> {{ d.nom }} 
              <span class="mx-2 text-gray-300">|</span>
              <i class="fas fa-phone mr-1 text-gray-400"></i> {{ d.telephone }}
            </div>
            <div class="text-xs text-gray-400 mt-2 flex items-center gap-4">
              <span><i class="fas fa-hashtag mr-1"></i> {{ d.reference }}</span>
              <span><i class="far fa-calendar-alt mr-1"></i> {{ formatDate(d.created_at) }}</span>
            </div>
            <div v-if="d.details" class="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic border-l-4 border-gray-200">
              "{{ d.details }}"
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
          <button 
            v-if="d.status === 'en_attente'"
            @click="openDecisionModal(d, 'approve')" 
            class="flex-1 md:flex-none bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <i class="fas fa-check"></i> Approuver
          </button>
          <button 
            v-if="d.status === 'en_attente'"
            @click="openDecisionModal(d, 'reject')" 
            class="flex-1 md:flex-none bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
          >
            <i class="fas fa-times"></i> Rejeter
          </button>
          <button 
            @click="openMessageModal(d)"
            class="flex-1 md:flex-none bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
          >
            <i class="fas fa-envelope"></i> Message
          </button>
          <a 
            v-if="d.document_url"
            :href="d.document_url"
            target="_blank"
            class="flex-1 md:flex-none bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <i class="fas fa-download"></i> Document
          </a>
        </div>
      </div>
      
      <div v-if="filteredItems.length === 0" class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200 text-3xl">
          <i class="fas fa-inbox"></i>
        </div>
        <p class="text-gray-400 font-medium">Aucune demande trouvée avec ce statut.</p>
      </div>
    </div>

    <!-- Modal Décision (Approuver/Rejeter) -->
    <div v-if="showDecisionModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ currentAction === 'approve' ? 'Approuver la demande' : 'Rejeter la demande' }}
          </h2>
          <button @click="showDecisionModal = false" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
        </div>
        
        <div class="mb-6">
          <div class="p-4 bg-gray-50 rounded-2xl mb-6">
            <div class="font-bold text-gray-800">{{ currentItem?.nom }}</div>
            <div class="text-sm text-gray-500">{{ currentItem?.type }} - {{ currentItem?.reference }}</div>
          </div>
          
          <label class="block text-sm font-bold text-gray-700 mb-2">Message au client (optionnel)</label>
          <textarea 
            v-model="adminComment" 
            class="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none" 
            rows="4"
            :placeholder="currentAction === 'approve' ? 'Félicitations, votre demande est validée...' : 'Désolé, votre demande a été rejetée car...'"
          ></textarea>
        </div>

        <div v-if="currentAction === 'approve'" class="mb-6 p-4 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/30">
          <label class="block text-sm font-bold text-blue-700 mb-2">Uploader le document final (optionnel)</label>
          <input type="file" @change="handleFileUpload" class="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <div class="flex gap-4">
          <button @click="showDecisionModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Annuler</button>
          <button 
            @click="submitDecision" 
            :disabled="processing"
            :class="currentAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'"
            class="flex-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i v-if="processing" class="fas fa-spinner fa-spin"></i>
            {{ processing ? 'Traitement...' : 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Message Direct -->
    <div v-if="showMessageModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Envoyer un message</h2>
          <button @click="showMessageModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-4 bg-blue-50 rounded-2xl mb-6 flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <i class="fas fa-user"></i>
          </div>
          <div>
            <div class="font-bold text-blue-900">{{ currentItem?.nom }}</div>
            <div class="text-xs text-blue-600">{{ currentItem?.email }}</div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Votre message</label>
          <textarea 
            v-model="directMessage" 
            class="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none" 
            rows="5"
            placeholder="Écrivez votre message ici..."
          ></textarea>
        </div>

        <div class="flex gap-4">
          <button @click="showMessageModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Annuler</button>
          <button 
            @click="sendDirectMessage" 
            :disabled="processing"
            class="flex-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i v-if="processing" class="fas fa-spinner fa-spin"></i>
            {{ processing ? 'Envoi...' : 'Envoyer le message' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../api/axios';

const items = ref([]);
const statusFilter = ref('en_attente');
const processing = ref(false);

// State for modals
const showDecisionModal = ref(false);
const showMessageModal = ref(false);
const currentItem = ref(null);
const currentAction = ref(''); // 'approve' or 'reject'
const adminComment = ref('');
const directMessage = ref('');
const uploadedFile = ref(null);

const fetchDemandes = async () => {
  try {
    const { data } = await api.get('/admin/etat-civil-requests');
    items.value = data.data || [];
  } catch (e) {
    console.error(e);
  }
};

const filteredItems = computed(() => {
  return items.value.filter(item => item.status === statusFilter.value);
});

onMounted(fetchDemandes);

const openDecisionModal = (item, action) => {
  currentItem.value = item;
  currentAction.value = action;
  adminComment.value = '';
  uploadedFile.value = null;
  showDecisionModal.value = true;
};

const openMessageModal = (item) => {
  currentItem.value = item;
  directMessage.value = '';
  showMessageModal.value = true;
};

const handleFileUpload = (e) => {
  uploadedFile.value = e.target.files[0];
};

const submitDecision = async () => {
  processing.value = true;
  try {
    const id = currentItem.value.id;
    const actionPath = currentAction.value === 'approve' ? 'approve' : 'reject';
    
    // 1. Update status and comment
    await api.post(`/admin/etat-civil-requests/${id}/${actionPath}`, {
      commentaire_admin: adminComment.value
    });

    // 2. If approving and file is present, upload it
    if (currentAction.value === 'approve' && uploadedFile.value) {
      const formData = new FormData();
      formData.append('document', uploadedFile.value);
      await api.post(`/admin/etat-civil-requests/${id}/upload-document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    alert(`Demande ${currentAction.value === 'approve' ? 'approuvée' : 'rejetée'} avec succès !`);
    showDecisionModal.value = false;
    fetchDemandes();
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Erreur lors du traitement de la demande';
    alert(errorMsg);
    console.error(e);
  } finally {
    processing.value = false;
  }
};

const sendDirectMessage = async () => {
  processing.value = true;
  try {
    // Simulation d'envoi de message (via API update ou une future table messages)
    await api.put(`/admin/etat-civil-requests/${currentItem.value.id}`, {
      details: currentItem.value.details + "\n\n[Admin]: " + directMessage.value
    });
    
    alert('Message envoyé au client !');
    showMessageModal.value = false;
    fetchDemandes();
  } catch (e) {
    alert('Erreur lors de l\'envoi du message');
  } finally {
    processing.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const badgeClass = (status) => {
  const base = 'px-2.5 py-1 rounded-lg font-bold text-[10px] tracking-wider';
  if (status === 'validé') return `${base} bg-emerald-100 text-emerald-700`;
  if (status === 'rejeté') return `${base} bg-rose-100 text-rose-700`;
  return `${base} bg-amber-100 text-amber-700`;
};

const typeIconClass = (type) => {
  const base = 'shadow-sm';
  if (type === 'naissance') return `${base} bg-blue-100 text-blue-600`;
  if (type === 'deces') return `${base} bg-gray-100 text-gray-600`;
  if (type === 'mariage') return `${base} bg-pink-100 text-pink-600`;
  return `${base} bg-purple-100 text-purple-600`;
};

const typeIcon = (type) => {
  if (type === 'naissance') return 'fas fa-baby';
  if (type === 'deces') return 'fas fa-dove';
  if (type === 'mariage') return 'fas fa-ring';
  return 'fas fa-file-signature';
};
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
