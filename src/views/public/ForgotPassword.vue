<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold mb-6">Mot de passe oublié</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full border rounded px-3 py-2" />
      <button class="w-full py-2 rounded bg-blue-600 text-white">Envoyer le lien de réinitialisation</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../api/axios';

const email = ref('');

async function submit() {
  try {
    await api.post('/public/forgot-password', { email: email.value });
    alert('Si un compte existe, un email a été envoyé');
  } catch (e) {
    alert('Erreur lors de la demande');
  }
}
</script>

