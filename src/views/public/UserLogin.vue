<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold mb-6">Connexion</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full border rounded px-3 py-2" />
      <input v-model="password" type="password" placeholder="Mot de passe" class="w-full border rounded px-3 py-2" />
      <button class="w-full py-2 rounded bg-blue-600 text-white">Se connecter</button>
    </form>
    <div class="text-sm mt-3">
      <router-link to="/forgot-password" class="text-blue-600">Mot de passe oublié ?</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import userAuth from '../../store/userAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

async function submit() {
  try {
    await userAuth.login({ email: email.value, password: password.value });
    router.push({ name: 'Profil' });
  } catch (e) {
    alert('Identifiants invalides');
  }
}
</script>

