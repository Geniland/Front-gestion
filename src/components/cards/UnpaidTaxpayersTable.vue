<template>
  <div class="unpaid-taxpayers-table">
    <div class="header">
      <span>Contribuables Impayés</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Zone</th>
          <th>Serats</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="taxpayer in taxpayers" :key="taxpayer.id">
          <td>{{ taxpayer.id }}</td>
          <td>{{ taxpayer.name }}</td>
          <td>{{ taxpayer.zone }}</td>
          <td><span class="status" :class="taxpayer.status.class">{{ taxpayer.status.text }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'UnpaidTaxpayersTable',
  data() {
    return {
      taxpayers: [
        { id: 'BGZ-2002', name: 'Adidogomé', zone: 'S', status: { text: 'En attente', class: 'pending' } },
        { id: 'AGT-447', name: 'Koffi', zone: 'GDL', status: { text: 'En attente', class: 'pending' } },
        { id: 'AGT-03', name: 'Kodjo', zone: 'AD.UA', status: { text: 'En attente', class: 'pending' } },
        { id: 'AGF-05', name: 'Amouzouh', zone: 'G9.G', status: { text: 'En attente', class: 'pending' } },
        { id: 'AGT-12', name: 'Belair', zone: 'A', status: { text: 'En attente', class: 'pending' } },
      ],
    };
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
</style>
