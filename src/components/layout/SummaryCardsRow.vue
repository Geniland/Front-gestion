<template>
  <div class="summary-cards-row">
    <SummaryCard title="Recette du Jour" :value="formatCurrency(revenuJour)" color="#347b35" />
    <SummaryCard title="Recette de la Semaine" :value="formatCurrency(revenuSemaine)" color="#14677c" />
    <SummaryCard title="Recette du Mois" :value="formatCurrency(revenuMois)" color="#0c5687" />
    <SummaryCard title="Recette de l'Année" :value="formatCurrency(revenuAnnee)" color="#0e583d" />
    <div class="recovery-rate">
      <div class="rate">{{ tauxRecouvrement }} %</div>
      <div class="label">Taux de Recouvrement</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';
import SummaryCard from '../cards/SummaryCard.vue';

// Valeurs réactives
const revenuJour = ref(0);
const revenuSemaine = ref(0);
const revenuMois = ref(0);
const revenuAnnee = ref(0);
const tauxRecouvrement = ref(0);

const fetchRevenus = async () => {
  try {
    const response = await api.get('/dashboard/revenue');
//      console.log("DATA:", response.data);
// console.log("MOIS:", revenuMois.value);
    if (response.data.success) {
     revenuJour.value = Number(response.data.revenu_jour);
      revenuSemaine.value = Number(response.data.revenu_semaine);
      revenuMois.value = Number(response.data.revenu_mois);
      revenuAnnee.value = Number(response.data.revenu_annee);
   

      // Calcul simple du taux de recouvrement
      // ici exemple : total payé / total attendu
      // si tu as une API spécifique pour le taux, utilise-la
      const totalAttendu = 1000000; // remplace par ta logique réelle
      tauxRecouvrement.value = ((revenuAnnee.value / totalAttendu) * 100).toFixed(1);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des revenus :', error);
   
  }
};

onMounted(() => {
  fetchRevenus();
});

// Fonction pour formater en FCFA
const formatCurrency = (val) => {
  const number = Number(val);
  if (!number) return '0 FCFA';

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(number);
};
</script>

<style scoped>
.summary-cards-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.recovery-rate {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.rate {
  font-size: 28px;
  font-weight: bold;
  color: #16a34a;
}

.label {
  font-size: 16px;
  color: #64748b;
}
</style>