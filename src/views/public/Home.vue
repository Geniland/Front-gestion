<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mairie-blue/20 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mairie-green/10 rounded-full blur-[120px]"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8 text-center lg:text-left animate-in slide-in-from-left-8 duration-700">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-mairie-green text-xs font-black uppercase tracking-widest">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-mairie-green opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-mairie-green"></span>
              </span>
              Portail Citoyen Officiel
            </div>
            <h1 class="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              L'administration <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-mairie-blue to-mairie-green">à portée de clic.</span>
            </h1>
            <p class="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Simplifiez votre quotidien avec les services numériques de la Mairie de Golfe 7. Demandes d'actes, paiement de taxes et actualités locales en un seul endroit.
            </p>
            <div class="flex flex-wrap justify-center lg:justify-start gap-4">
              <router-link to="/services" class="group px-8 py-4 rounded-2xl bg-mairie-blue text-white font-black hover:bg-blue-600 transition-all shadow-xl shadow-mairie-blue/20 flex items-center gap-3">
                Découvrir les services
                <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </router-link>
              <router-link to="/taxes" class="px-8 py-4 rounded-2xl bg-white/5 text-white font-black hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3">
                Payer mes taxes
                <i class="fas fa-receipt opacity-50"></i>
              </router-link>
            </div>
            <div class="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div class="text-center">
                <div class="text-2xl font-black text-white">24/7</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Disponibilité</div>
              </div>
              <div class="w-px h-8 bg-white/10"></div>
              <div class="text-center">
                <div class="text-2xl font-black text-white">100%</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Sécurisé</div>
              </div>
              <div class="w-px h-8 bg-white/10"></div>
              <div class="text-center">
                <div class="text-2xl font-black text-white">0F</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Frais de dossier</div>
              </div>
            </div>
          </div>

          <div class="hidden lg:block relative animate-in zoom-in-95 duration-1000">
            <div class="relative z-10 bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-sm shadow-2xl">
              <img src="https://images.unsplash.com/photo-1573164060897-42531883213e?auto=format&fit=crop&q=80&w=1000" class="rounded-[2rem] shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700" alt="Mairie Golfe 7" />
            </div>
            <!-- Decorative Elements -->
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-mairie-green/20 rounded-full blur-2xl animate-pulse"></div>
            <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-mairie-blue/20 rounded-full blur-2xl animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Services -->
    <section class="py-32 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 class="text-xs font-black text-mairie-blue uppercase tracking-[0.3em]">Nos Missions</h2>
          <h3 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Des services pensés pour vous.</h3>
          <p class="text-gray-500 font-medium leading-relaxed">Nous modernisons nos outils pour vous offrir une expérience citoyenne fluide, transparente et accessible partout.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group p-10 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
            <div class="w-16 h-16 bg-blue-100 text-mairie-blue rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-mairie-blue group-hover:text-white transition-all duration-500">
              <i class="fas fa-id-card"></i>
            </div>
            <h4 class="text-xl font-black text-gray-900 mb-4">État Civil Numérique</h4>
            <p class="text-gray-500 text-sm leading-relaxed mb-8">Commandez vos extraits de naissance, certificats de mariage ou de décès en quelques clics sans vous déplacer.</p>
            <router-link to="/etat-civil" class="text-xs font-black text-mairie-blue uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
              Faire une demande <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>

          <div class="group p-10 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
            <div class="w-16 h-16 bg-green-100 text-mairie-green rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-mairie-green group-hover:text-white transition-all duration-500">
              <i class="fas fa-coins"></i>
            </div>
            <h4 class="text-xl font-black text-gray-900 mb-4">Fiscalité Simplifiée</h4>
            <p class="text-gray-500 text-sm leading-relaxed mb-8">Consultez vos taxes communales et réglez-les en toute sécurité via Mobile Money (T-Money, Flooz) ou carte bancaire.</p>
            <router-link to="/taxes" class="text-xs font-black text-mairie-green uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
              Accéder aux paiements <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>

          <div class="group p-10 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              <i class="fas fa-bullhorn"></i>
            </div>
            <h4 class="text-xl font-black text-gray-900 mb-4">Infos & Actualités</h4>
            <p class="text-gray-500 text-sm leading-relaxed mb-8">Restez informé des projets de la commune, des travaux en cours et des événements culturels de votre quartier.</p>
            <router-link to="/actualites" class="text-xs font-black text-purple-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
              Lire le journal <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-24 bg-mairie-blue relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div class="space-y-2">
            <div class="text-5xl font-black text-white tracking-tighter">15k+</div>
            <div class="text-xs font-bold text-blue-200 uppercase tracking-widest">Citoyens Connectés</div>
          </div>
          <div class="space-y-2">
            <div class="text-5xl font-black text-white tracking-tighter">48h</div>
            <div class="text-xs font-bold text-blue-200 uppercase tracking-widest">Délai Moyen Actes</div>
          </div>
          <div class="space-y-2">
            <div class="text-5xl font-black text-white tracking-tighter">100%</div>
            <div class="text-xs font-bold text-blue-200 uppercase tracking-widest">Paiements Sécurisés</div>
          </div>
          <div class="space-y-2">
            <div class="text-5xl font-black text-white tracking-tighter">24/7</div>
            <div class="text-xs font-bold text-blue-200 uppercase tracking-widest">Support Disponible</div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section class="py-32 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div class="max-w-xl space-y-4">
            <h2 class="text-xs font-black text-mairie-blue uppercase tracking-[0.3em]">Actualités</h2>
            <h3 class="text-4xl font-black text-gray-900 tracking-tight">À la une de votre commune</h3>
          </div>
          <router-link to="/actualites" class="px-6 py-3 rounded-xl bg-white border border-gray-200 text-sm font-black text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            Voir toutes les actualités
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="n in actualites.slice(0, 3)" :key="n.id" class="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
            <div class="relative h-56 overflow-hidden">
              <img :src="n.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-mairie-blue text-[10px] font-black text-white uppercase tracking-widest">Nouveau</div>
            </div>
            <div class="p-8 flex-1 flex flex-col">
              <div class="text-[10px] font-black text-mairie-green uppercase tracking-widest mb-3">{{ formatDate(n.published_at) }}</div>
              <h4 class="text-xl font-black text-gray-900 mb-4 group-hover:text-mairie-blue transition-colors line-clamp-2 leading-tight">{{ n.titre }}</h4>
              <p class="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">{{ n.resume }}</p>
              <router-link :to="`/actualites/${n.id}`" class="mt-auto inline-flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest group-hover:text-mairie-blue transition-colors">
                Lire l'article <i class="fas fa-plus text-[10px]"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
      <div class="relative bg-gradient-to-br from-mairie-blue to-blue-800 rounded-[3rem] p-12 md:p-24 overflow-hidden shadow-2xl shadow-blue-900/40">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-mairie-green/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div class="relative z-10 text-center max-w-2xl mx-auto space-y-8">
          <h2 class="text-4xl md:text-5xl font-black text-white tracking-tight">Prêt à simplifier vos démarches ?</h2>
          <p class="text-blue-100 font-medium text-lg leading-relaxed">Rejoignez des milliers de citoyens et profitez d'un accès rapide et sécurisé à tous les services de votre mairie.</p>
          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <router-link to="/register" class="px-10 py-5 rounded-2xl bg-mairie-green text-gray-900 font-black hover:scale-105 transition-all shadow-xl shadow-green-900/20">
              Créer mon compte citoyen
            </router-link>
            <router-link to="/services" class="px-10 py-5 rounded-2xl bg-white text-mairie-blue font-black hover:bg-gray-100 transition-all shadow-xl">
              Consulter les services
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';

const actualites = ref([]);

onMounted(async () => {
  try {
    const { data } = await api.get('/public/actualites');
    actualites.value = Array.isArray(data) ? data : (data.data || []);
  } catch (e) {
    console.error(e);
  }
});

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.slide-in-from-left-8 {
  animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.zoom-in-95 {
  animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>

