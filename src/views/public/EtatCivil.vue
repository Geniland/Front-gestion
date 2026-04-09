<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Demande d’acte d’état civil</h1>
      <p class="text-gray-500">Effectuez vos demandes de documents officiels en ligne en quelques clics.</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Nom complet</label>
              <input
                v-model="form.nom"
                placeholder="Ex: Jean Dupont"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mairie-blue focus:ring-2 focus:ring-mairie-blue/20 transition-all outline-none"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Téléphone</label>
              <input
                v-model="form.telephone"
                placeholder="Ex: +228 90 00 00 00"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mairie-blue focus:ring-2 focus:ring-mairie-blue/20 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Type de demande</label>
              <select
                v-model="form.type"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mairie-blue focus:ring-2 focus:ring-mairie-blue/20 transition-all outline-none appearance-none bg-no-repeat bg-[right_1rem_center]"
                style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27%2F%3E%3C%2Fsvg%3E');"
                required
              >
                <option value="naissance">Acte de naissance</option>
                <option value="deces">Acte de décès</option>
                <option value="mariage">Acte de mariage</option>
                <option value="rectification">Rectification d'acte</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Email de contact</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="votre@email.com"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mairie-blue focus:ring-2 focus:ring-mairie-blue/20 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Détails de la demande</label>
            <textarea
              v-model="form.details"
              rows="4"
              placeholder="Précisez ici les informations nécessaires (date de l'événement, noms des parents, etc.)"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mairie-blue focus:ring-2 focus:ring-mairie-blue/20 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Justificatifs (Photos/PDF)</label>
            <div class="relative group">
              <input
                type="file"
                multiple
                @change="handleFiles"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div class="border-2 border-dashed border-gray-200 group-hover:border-mairie-blue rounded-xl p-8 text-center transition-colors bg-gray-50 group-hover:bg-blue-50/50">
                <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 group-hover:text-mairie-blue mb-2 transition-colors"></i>

                <p class="text-sm text-gray-500 group-hover:text-gray-700 font-medium">
                  {{ form.files.length > 0 ? `${form.files.length} fichier(s) sélectionné(s)` : 'Cliquez ou glissez vos documents ici' }}
                </p>

                <p class="text-xs text-gray-400 mt-1">Formats acceptés: JPG, PNG, PDF (Max 4Mo)</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end pt-4">
            <button
              :disabled="submitting"
              class="flex items-center gap-2 px-8 py-3 bg-mairie-blue text-white rounded-xl font-bold hover:shadow-lg hover:shadow-mairie-blue/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
              {{ submitting ? 'Envoi en cours...' : 'Envoyer ma demande' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-16">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Historique des demandes</h2>
        <button @click="fetchDemandes" class="text-mairie-blue hover:underline text-sm font-medium">Actualiser</button>
      </div>

      <div v-if="loading" class="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <i class="fas fa-circle-notch fa-spin text-mairie-blue text-2xl mb-2"></i>
        <p class="text-gray-500">Chargement de l'historique...</p>
      </div>

      <div v-else-if="demandes.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-folder-open text-gray-300 text-2xl"></i>
        </div>
        <p class="text-gray-500 font-medium">Vous n'avez pas encore effectué de demande.</p>
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
        <div
          v-for="d in demandes"
          :key="d.id"
          class="p-6 flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div :class="typeIconClass(d.type)">
              <i :class="typeIcon(d.type)"></i>
            </div>

            <div>
              <div class="font-bold text-gray-800 capitalize">{{ d.type }}</div>
              <div class="text-xs text-gray-400 font-medium flex items-center gap-1">
                <i class="far fa-calendar-alt"></i>
                {{ formatDate(d.created_at) }}
              </div>
              <div class="text-xs text-gray-500 font-medium">
                Réf: {{ d.reference || '—' }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div v-if="d.commentaire_admin" class="group relative">
              <i class="fas fa-comment-dots text-amber-500 cursor-help"></i>
              <div class="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {{ d.commentaire_admin }}
              </div>
            </div>

            <span :class="badgeClass(d.status)">
              <i class="fas fa-circle text-[6px] mr-2"></i>
              {{ d.status }}
            </span>

            <a
              v-if="d.document_url"
              :href="d.document_url"
              target="_blank"
              class="p-2 text-mairie-blue hover:bg-blue-50 rounded-lg transition-colors"
              title="Télécharger le document officiel"
            >
              <i class="fas fa-file-pdf"></i>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';
import userAuth from '../../store/userAuth';

const form = ref({
  nom: userAuth.user.value?.name || '',
  telephone: '',
  email: userAuth.user.value?.email || '',
  type: 'naissance',
  details: '',
  files: [],
});

const demandes = ref([]);
const loading = ref(true);
const submitting = ref(false);

const fetchDemandes = async () => {
  loading.value = true;
  try {
    const response = await api.get('/public/etat-civil/historique');
    
    if (response.data && response.data.status === true) {
      demandes.value = response.data.data || [];
    } else {
      demandes.value = [];
      if (response.data?.message) console.warn(response.data.message);
    }
  } catch (e) {
    console.error("Erreur historique:", e);
    demandes.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDemandes);

function handleFiles(e) {
  form.value.files = Array.from(e.target.files || []);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function badgeClass(status) {
  const base = 'text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center';
  if (status === 'validé') return `${base} bg-emerald-100 text-emerald-700`;
  if (status === 'rejeté') return `${base} bg-rose-100 text-rose-700`;
  return `${base} bg-amber-100 text-amber-700`;
}

function typeIconClass(type) {
  const base = 'w-10 h-10 rounded-xl flex items-center justify-center';
  if (type === 'naissance') return `${base} bg-blue-100 text-blue-600`;
  if (type === 'deces') return `${base} bg-gray-100 text-gray-600`;
  if (type === 'mariage') return `${base} bg-pink-100 text-pink-600`;
  return `${base} bg-purple-100 text-purple-600`;
}

function typeIcon(type) {
  if (type === 'naissance') return 'fas fa-baby';
  if (type === 'deces') return 'fas fa-dove';
  if (type === 'mariage') return 'fas fa-ring';
  return 'fas fa-file-signature';
}

async function handleSubmit() {
  submitting.value = true;

  try {
    const fd = new FormData();
    fd.append('nom', form.value.nom);
    fd.append('telephone', form.value.telephone);
    fd.append('email', form.value.email);
    fd.append('type', form.value.type);
    fd.append('details', form.value.details ?? '');

    // backend attend files[]
    form.value.files.forEach(file => {
      fd.append('files[]', file);
    });

    const response = await api.post('/public/etat-civil', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.status) {
      alert(response.data.message || 'Demande envoyée avec succès.');
      // reset
      form.value.details = '';
      form.value.files = [];
      await fetchDemandes();
    } else {
      alert(response.data.message || 'Erreur lors de l’envoi.');
    }
  } catch (e) {
    console.error(e);
    const msg = e.response?.data?.message || 'Une erreur est survenue lors de l’envoi de la demande.';
    alert(msg);
  } finally {
    submitting.value = false;
  }
}
</script>