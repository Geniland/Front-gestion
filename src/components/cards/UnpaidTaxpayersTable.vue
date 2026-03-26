<template>
  <div class="unpaid-taxpayers-table">
    <div class="header">
      <span>Contribuables Impayés</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Contribuable</th>
          <th>Taxe</th>
          <th>Agent</th>
          <th>Statut</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tax in taxes" :key="tax.id">
          <td>{{ tax.id }}</td>
          <td>{{ tax.contribuable }}</td>
          <td>{{ tax.taxe }}</td>
          <td>{{ tax.agent || 'N/A' }}</td>

          <td>
            <span
              class="status"
              :class="getStatusClass(tax.statut)"
            >
              {{ formatStatus(tax.statut) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Si vide -->
    <div v-if="taxes.length === 0" class="empty">
      Aucune taxe impayée
    </div>
  </div>
</template>

<script>
import api from '../../api/axios';

export default {
  name: "UnpaidTaxpayersTable",

  data() {
    return {
      taxes: [],
    };
  },

  mounted() {
    this.fetchTaxes();
  },

  methods: {
    async fetchTaxes() {
      try {
        const res = await api.get(
          "/dashboard/top-taxes"
        );

        // 🔥 on récupère les taxes impayées
        this.taxes = res.data.taxes_impayees;
      } catch (error) {
        console.error(error);
      }
    },

    formatStatus(status) {
      if (status === "en_attente") return "En attente";
      if (status === "payee") return "Payée";
      return "Impayée";
    },

    getStatusClass(status) {
      if (status === "en_attente") return "pending";
      if (status === "payee") return "paid";
      return "unpaid";
    },
  },
};
</script>
<style scoped>
.unpaid-taxpayers-table {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.header {
  margin-bottom: 20px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
}

.status.pending {
  background-color: #f59e0b;
}

/* états supplémentaires */
.status.paid {
  background-color: #10b981;
}

.status.unpaid {
  background-color: #ef4444;
}

/* message vide */
.empty {
  text-align: center;
  padding: 15px;
  color: #6b7280;
  font-size: 14px;
}
</style>
