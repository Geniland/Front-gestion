<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold mb-6">Inscription</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <input v-model="nom" placeholder="Nom complet" class="w-full border rounded px-3 py-2" />
      <input v-model="email" type="email" placeholder="Email" class="w-full border rounded px-3 py-2" />
      <!-- <input v-model="telephone" placeholder="Téléphone" class="w-full border rounded px-3 py-2" /> -->
      <input v-model="password" type="password" placeholder="Mot de passe (min 8 car.)" class="w-full border rounded px-3 py-2" required />
      <input v-model="password_confirmation" type="password" placeholder="Confirmer le mot de passe" class="w-full border rounded px-3 py-2" required />
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <button :disabled="loading" class="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-50">
        {{ loading ? 'Création en cours...' : 'Créer mon compte' }}
      </button>
    </form>
    <p class="mt-4 text-center text-sm text-gray-600">
      Déjà un compte ? <router-link to="/login" class="text-blue-600 hover:underline">Connectez-vous</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import userAuth from '../../store/userAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const nom = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  if (password.value !== password_confirmation.value) {
    error.value = "Les mots de passe ne correspondent pas";
    return;
  }
  
  if (password.value.length < 8) {
    error.value = "Le mot de passe doit faire au moins 8 caractères";
    return;
  }

  error.value = '';
  loading.value = true;
  
  try {
    const response = await userAuth.register({  
      name: nom.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value, 
    });
    
    // Si le token n'est pas déjà dans le store (cas improbable avec ma modif), on tente le login
    if (!userAuth.isAuthenticated.value) {
      await userAuth.login({ email: email.value, password: password.value });
    }
    
    router.push({ name: 'Profil' });
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de l’inscription. Vérifiez vos informations.';
  } finally {
    loading.value = false;
  }
}
</script>

