<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold mb-6">Connexion</h1>

    <!-- Message erreur -->
    <div v-if="errorMessage" class="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
      {{ errorMessage }}
    </div>

    <!-- Message succès -->
    <div v-if="successMessage" class="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
      {{ successMessage }}
    </div>

    <form @submit.prevent="submit" class="space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border rounded px-3 py-2"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="w-full border rounded px-3 py-2"
      />

      <button
        :disabled="loading"
        class="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-60"
      >
        {{ loading ? "Connexion..." : "Se connecter" }}
      </button>
    </form>

    <div class="text-sm mt-3">
      <router-link to="/forgot-password" class="text-blue-600">
        Mot de passe oublié ?
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import userAuth from "../../store/userAuth";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");

const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

async function submit() {
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const res = await userAuth.login({
      email: email.value,
      password: password.value,
    });

    successMessage.value = res?.message || "Connexion réussie";
    router.push({ name: "Profil" });

  } catch (e) {
    // Axios error
    const status = e?.response?.status;
    const message = e?.response?.data?.message;

    if (status === 403) {
      // user bloqué
      errorMessage.value = message || "Votre compte est bloqué.";
    } 
    else if (status === 401) {
      errorMessage.value = "Identifiants invalides.";
    }
    else if (status === 422) {
      errorMessage.value = "Veuillez remplir correctement tous les champs.";
    }
    else {
      errorMessage.value = message || "Erreur serveur, veuillez réessayer.";
    }
  } finally {
    loading.value = false;
  }
}
</script>