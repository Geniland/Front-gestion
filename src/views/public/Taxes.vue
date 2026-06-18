<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-6">Taxes & Paiement</h1>

    <!-- Message succès -->
    <div
      v-if="successMessage"
      class="mb-6 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm"
    >
      <i class="fas fa-check-circle mr-1"></i> {{ successMessage }}
    </div>

    <!-- Message erreur -->
    <div
      v-if="errorMessage"
      class="mb-6 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm"
    >
      <i class="fas fa-times-circle mr-1"></i> {{ errorMessage }}
    </div>

    <!-- Erreurs validation -->
    <div
      v-if="Object.keys(validationErrors).length"
      class="mb-6 p-3 rounded bg-amber-50 border border-amber-200 text-amber-700 text-sm"
    >
      <p class="font-bold mb-2">
        <i class="fas fa-exclamation-triangle mr-1"></i> Vérifiez les champs :
      </p>
      <ul class="list-disc ml-5 space-y-1">
        <li v-for="(errs, key) in validationErrors" :key="key">
          {{ errs[0] }}
        </li>
      </ul>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Formulaire Création taxe -->
      <form @submit.prevent="createTaxe" class="p-6 border rounded-lg space-y-4 bg-white">
        <h2 class="font-semibold text-lg">Créer une taxe</h2>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Contribuable</label>
          <input
            v-model="form.contribuable_nom"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Nom complet"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Type de taxe</label>
            <select
              v-model="form.type_taxe_id"
              @change="onTypeChange"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option disabled value="">-- Choisir --</option>
              <option v-for="t in typeTaxes" :value="t.id" :key="t.id">
                {{ t.nom }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Montant</label>
            <input
              v-model.number="form.montant"
              type="number"
              min="0"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />

            <div
              v-if="montantDifference"
              class="text-[10px] text-amber-600 font-bold mt-1"
            >
              <i class="fas fa-exclamation-triangle"></i>
              Montant différent du montant de base ({{ baseMontant }} F)
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Période début</label>
            <input
              v-model="form.periode_debut"
              type="date"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Période fin</label>
            <input
              v-model="form.periode_fin"
              type="date"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
          :disabled="loading"
        >
          {{ loading ? "Enregistrement..." : "Créer la taxe" }}
        </button>
      </form>

      <!-- Paiement -->
      <div class="p-6 border rounded-lg space-y-4 bg-white">
        <h2 class="font-semibold text-lg">Payer une taxe</h2>

        <div v-if="taxesToPay.length > 0">
          <label class="block text-sm text-gray-600 mb-1">Vos taxes à payer</label>
          <select
            v-model="selectedTaxeId"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-300"
          >
            <option disabled value="">-- Choisir une taxe --</option>
            <option v-for="t in taxesToPay" :value="t.id" :key="t.id">
              {{ t.type_taxe?.nom || "Taxe" }} • {{ t.montant }} F ({{ t.status }})
            </option>
          </select>

          <button
            class="mt-4 w-full px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition"
            @click="initiatePayment"
            :disabled="!selectedTaxeId || paymentLoading"
          >
            {{ paymentLoading ? "Initialisation..." : "Payer par Mobile Money" }}
          </button>
        </div>

        <div v-else class="text-center py-4 bg-gray-50 rounded">
          <p class="text-sm text-gray-500 italic">
            Aucune taxe approuvée disponible pour paiement.
          </p>
        </div>

        <p class="text-xs text-gray-500">
          Statut initial : en attente de validation admin
        </p>
      </div>
    </div>

    <!-- Historique -->
    <div class="mt-10">
      <h2 class="font-semibold text-lg mb-3">Historique de vos taxes</h2>

      <div v-if="loadingHistory" class="text-center py-6 text-gray-600">
        <i class="fas fa-spinner fa-spin"></i> Chargement...
      </div>

      <div
        v-else-if="taxes.length === 0"
        class="text-center py-10 bg-gray-50 rounded border border-dashed"
      >
        <p class="text-gray-400">Aucune taxe enregistrée.</p>
      </div>

      <div v-else class="border rounded-lg divide-y bg-white overflow-hidden shadow-sm">
        <div
          v-for="t in taxes"
          :key="t.id"
          class="p-4 hover:bg-gray-50 transition"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="font-bold text-gray-800">
                {{ t.type_taxe?.nom || "Taxe sans nom" }}
              </div>

              <div class="text-sm text-gray-500">
                <span class="mr-3">
                  <i class="fas fa-money-bill-wave mr-1"></i> {{ t.montant }} F
                </span>
                <span>
                  <i class="far fa-calendar-alt mr-1"></i> {{ formatDate(t.created_at) }}
                </span>
              </div>

              <div class="text-xs text-gray-400 mt-1">
                Réf: {{ t.reference }}
              </div>

              <div
                v-if="t.commentaire_admin"
                class="mt-2 p-2 bg-amber-50 text-amber-700 text-[10px] rounded-lg border border-amber-100 flex items-start gap-2"
              >
                <i class="fas fa-info-circle mt-0.5"></i>
                <span>{{ t.commentaire_admin }}</span>
              </div>
              
              <!-- Bouton de téléchargement du ticket -->
              <div v-if="t.ticket" class="mt-3">
                <a 
                  :href="`/v/${t.ticket.qr_hash}`" 
                  target="_blank" 
                  rel="noopener"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                >
                  <i class="fas fa-receipt"></i>
                  Voir le Ticket #{{ t.ticket.numero_ticket }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span :class="badgeClass(t.status)">
                {{ t.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from 'vue-router';
import apiPublic from "../../api/axiosPublic";
import userAuth from "../../store/userAuth";

const route = useRoute();
const typeTaxes = ref([]);
const taxes = ref([]);

const loading = ref(false);
const loadingHistory = ref(true);
const paymentLoading = ref(false);

const selectedTaxeId = ref("");

// UI Messages
const successMessage = ref("");
const errorMessage = ref("");
const validationErrors = ref({});

const form = ref({
  contribuable_nom: userAuth.user.value?.name || "",
  type_taxe_id: "",
  montant: 0,
  periode_debut: "",
  periode_fin: "",
});

function resetMessages() {
  successMessage.value = "";
  errorMessage.value = "";
  validationErrors.value = {};
}

const selectedType = computed(() =>
  typeTaxes.value.find((t) => t.id === form.value.type_taxe_id)
);

const baseMontant = computed(() => selectedType.value?.montant_base || 0);

const montantDifference = computed(() => {
  return form.value.type_taxe_id && form.value.montant !== baseMontant.value;
});

function onTypeChange() {
  if (selectedType.value) {
    form.value.montant = selectedType.value.montant_base || 0;
  }
}

const taxesToPay = computed(() => {
  return taxes.value.filter((t) => t.status === "approuvee");
});

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function badgeClass(status) {
  const base =
    "text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider";

  if (status === "approuvee") return `${base} bg-emerald-100 text-emerald-700`;
  if (status === "payee") return `${base} bg-blue-100 text-blue-700`;
  if (status === "rejetee") return `${base} bg-rose-100 text-rose-700`;
  return `${base} bg-amber-100 text-amber-700`;
}

function extractLaravelErrors(e) {
  if (e?.response?.status === 422 && e.response.data?.errors) {
    validationErrors.value = e.response.data.errors;
    return true;
  }
  return false;
}

async function fetchTaxes() {
  loadingHistory.value = true;

  try {
    const response = await apiPublic.get("/public/taxes");
    taxes.value = response.data.data?.data || response.data.data || [];
  } catch (e) {
    taxes.value = [];
    errorMessage.value = "Impossible de charger les taxes. Réessayez plus tard.";
  } finally {
    loadingHistory.value = false;
  }
}

// Fonction pour vérifier les paramètres du callback
async function checkPaymentCallback() {
  // Utiliser route.query si vous utilisez vue-router
  // OU window.location.search si vous n'utilisez pas vue-router
  const query = route.query || Object.fromEntries(new URLSearchParams(window.location.search));
  
  console.log('Paramètres reçus:', query); // Pour déboguer
  
  // Récupérer le statut du paiement (correspond à ce que vous envoyez depuis Laravel)
  const paymentStatus = query.payment_status || query.status;
  const transactionId = query.transaction_id;
  
  if (paymentStatus) {
    console.log('Statut du paiement:', paymentStatus);
    
    switch(paymentStatus) {
      case 'success':
        successMessage.value = "✓ Votre paiement a été effectué avec succès ! Votre ticket est prêt.";
        // Recharger les taxes pour afficher le bouton du ticket
        await fetchTaxes();
        break;
      case 'failed':
        errorMessage.value = "✗ Le paiement a échoué. Veuillez réessayer ou contacter le support.";
        break;
      case 'pending':
        successMessage.value = "⏳ Paiement en cours de vérification. Vous recevrez une confirmation sous peu.";
        break;
      case 'error':
        errorMessage.value = "⚠️ Une erreur technique est survenue. Veuillez contacter l'administrateur.";
        break;
      case 'missing_id':
        errorMessage.value = "Information de transaction manquante.";
        break;
      case 'not_found':
        errorMessage.value = "Transaction non trouvée.";
        break;
      default:
        if (paymentStatus === 'approved') {
          successMessage.value = "✓ Paiement confirmé avec succès ! Votre ticket est prêt.";
          // Recharger les taxes pour afficher le bouton du ticket
          await fetchTaxes();
        } else if (paymentStatus === 'canceled' || paymentStatus === 'declined') {
          errorMessage.value = "Le paiement a été annulé.";
        }
    }
    
    // Nettoyer l'URL après avoir lu les paramètres (optionnel)
    // Cela évite d'afficher les messages à chaque rafraîchissement
    setTimeout(() => {
      if (window.history.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }, 100);
  }
}

onMounted(async () => {
  resetMessages();

  // Vérifier les paramètres du callback de paiement
  checkPaymentCallback();

  try {
    const typesRes = await apiPublic.get("/types-taxes");
    typeTaxes.value = typesRes.data.data?.data || typesRes.data.data || [];

    await fetchTaxes();
  } catch (e) {
    typeTaxes.value = [];
    errorMessage.value = "Impossible de charger les types de taxes.";
  }
});

async function createTaxe() {
  loading.value = true;
  resetMessages();

  try {
    await apiPublic.post("/public/taxes", form.value);

    successMessage.value =
      "Taxe enregistrée avec succès (en attente de validation).";

    // Reset formulaire
    form.value.type_taxe_id = "";
    form.value.montant = 0;
    form.value.periode_debut = "";
    form.value.periode_fin = "";

    await fetchTaxes();
  } catch (e) {
    if (!extractLaravelErrors(e)) {
      errorMessage.value =
        e?.response?.data?.message || "Erreur lors de la création de la taxe.";
    }
  } finally {
    loading.value = false;
  }
}

async function initiatePayment() {
  paymentLoading.value = true;
  resetMessages();

  try {
    const { data } = await apiPublic.post("/public/payments/initiate", {
      taxe_id: selectedTaxeId.value,
    });

    if (data.checkout_url) {
      successMessage.value = "Redirection vers la page de paiement...";
      window.location.href = data.checkout_url;
    } else {
      errorMessage.value = "Lien de paiement indisponible.";
    }
  } catch (e) {
    if (!extractLaravelErrors(e)) {
      errorMessage.value =
        e?.response?.data?.message ||
        "Erreur lors de l’initialisation du paiement.";
    }
  } finally {
    paymentLoading.value = false;
  }
}
</script>

<style scoped>
</style>