<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold mb-6">Mot de passe oublié</h1>

    <form @submit.prevent="submit" class="space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        required
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 rounded text-white transition
               bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {{ loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation" }}
      </button>

      <!-- Message succès -->
      <p
        v-if="successMessage"
        class="text-green-600 text-sm mt-2"
      >
        {{ successMessage }}
      </p>

      <!-- Message erreur -->
      <p
        v-if="errorMessage"
        class="text-red-600 text-sm mt-2"
      >
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import apiPublic from "../../api/axiosPublic";

const email = ref("");
const loading = ref(false);

const successMessage = ref("");
const errorMessage = ref("");

async function submit() {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    await apiPublic.post("/public/forgot-password", { email: email.value });

    // Message standard pour éviter de révéler si le compte existe (sécurité)
    successMessage.value =
      "Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.";

    email.value = "";
  } catch (e) {
    errorMessage.value =
      "Une erreur est survenue. Vérifiez votre adresse email et réessayez.";
  } finally {
    loading.value = false;
  }
}
</script>