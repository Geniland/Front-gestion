<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <img src="../assets/images/logo.png" alt="Logo" v-if="hasLogo" />
        <h1>E-TAXE AFRIQUE</h1>
        <p>Gestion de Dashboard de Mairie</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            placeholder="admin@mairiegolf7.tg" 
            required 
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            placeholder="••••••••" 
            required 
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="loading">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <div class="footer">
        © 2026 MAIRIE GOLFE 7 - Tous droits réservés
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import auth from '../store/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref(null);
    const hasLogo = ref(false);

    const form = reactive({
      email: '',
      password: '',
    });

    onMounted(() => {
      // Check if logo exists (optional, depends on user's assets)
      const img = new Image();
      img.src = '../assets/images/logo.png';
      img.onload = () => (hasLogo.value = true);
    });

    const handleLogin = async () => {
      loading.value = true;
      error.value = null;
      try {
        await auth.login(form);
        router.push('/admin');
      } catch (err) {
        if (err.response?.status === 403) {
          error.value = `Compte bloqué : ${err.response.data.reason || 'Contactez l\'administrateur'}`;
        } else {
          error.value = err.response?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      handleLogin,
      hasLogo,
    };
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 20px;
}

.login-card {
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo img {
  width: 80px;
  margin-bottom: 15px;
}

.logo h1 {
  font-size: 24px;
  color: #1e293b;
  margin: 0;
  font-weight: 700;
}

.logo p {
  color: #64748b;
  font-size: 14px;
  margin-top: 5px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #0284c7;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}
</style>
