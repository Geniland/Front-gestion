<template>
  <div class="risk-fraud-card">
    <div class="header">
      <i class="icon-fraud"></i>
      <span>Risque et Fraude</span>
    </div>

    <div v-if="loading" class="loading">
      Chargement...
    </div>

    <div v-else class="content">
      <div class="item">
        <span>Alertes</span>
        <span class="danger">{{ alertes }}</span>
      </div>

      <div class="item">
        <span>Anomalies détectées</span>
        <span class="warning">{{ anomalies }}</span>
      </div>

      <div class="item">
        <span>Taxes suspects</span>
        <span class="danger">{{ taxesSuspects }}</span>
      </div>

      <!-- ✅ LÉGENDE -->
      <div class="legend">
        <h4>Légende</h4>
        <ul>
          <li>
            <span class="danger">Alertes :</span>
            Taxes dont le montant payé est différent du <br> montant de  la taxe attendue.
          </li>
          <li>
            <span class="warning">Anomalies :</span>
            Taxes dont le montant déclaré ne correspond  <br> pas au montant officiel défini dans le type de taxe.
          </li>
          <li>
            <span class="danger">Taxes suspects :</span>
            Taxes présentant au moins une incohérence <br> (paiement insuffisant, paiement supérieur, ou montant non conforme).
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";

const loading = ref(true);

const alertes = ref(0);
const anomalies = ref(0);
const taxesSuspects = ref(0);

const fetchRiskFraud = async () => {
  try {
    loading.value = true;

    const response = await api.get("/dashboard/risk-fraud");

    if (response.data.success) {
      alertes.value = response.data.data.alertes;
      anomalies.value = response.data.data.anomalies;
      taxesSuspects.value = response.data.data.taxes_suspects;
    }
  } catch (error) {
    console.error("Erreur Risk Fraud:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRiskFraud();
});
</script>

<style scoped>
.risk-fraud-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.header i {
  margin-right: 10px;
  color: #ef4444;
}

.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.danger {
  color: #ef4444;
  font-weight: bold;
}

.warning {
  color: #f59e0b;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #64748b;
}

/* ✅ LÉGENDE STYLE */
.legend {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
  font-size: 13px;
  color: #334155;
}

.legend h4 {
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: bold;
}

.legend ul {
  padding-left: 18px;
  margin: 0;
}

.legend li {
  margin-bottom: 8px;
  line-height: 1.4;
}
</style>