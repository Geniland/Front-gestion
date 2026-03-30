<template>
  <div class="best-zone-card">
    <div class="header">
      <i class="icon-zone"></i>
      <span>Meilleure Zone</span>
    </div>

    <div class="content">
      <div class="zone">{{ bestZone.zone }}</div>
      <div class="amount">{{ formatCurrency(bestZone.montant) }}</div>
    </div>

    <div class="footer">
      <span>{{ bestZone.payements }} paiement(s) dans la zone</span>
    </div>
  </div>
</template>

<script>
import api from "../../api/axios";

export default {
  name: "BestZoneCard",
  data() {
    return {
      bestZone: {
        zone: "Chargement...",
        montant: 0,
        payements: 0,
      },
    };
  },

  mounted() {
    this.getBestZone();
  },

  methods: {
    async getBestZone() {
      try {
        const res = await api.get("/dashboard/best-zone", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        this.bestZone = res.data;
      } catch (error) {
        console.error("Erreur best zone:", error);
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
    },
  },
};
</script>

<style scoped>
.best-zone-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header i {
  margin-right: 10px;
  color: #10b981;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.zone {
  font-size: 24px;
  font-weight: bold;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  color: #10b981;
}

.footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
}
</style>