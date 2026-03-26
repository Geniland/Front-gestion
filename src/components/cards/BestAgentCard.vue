<template>
  <div class="best-agent-card" v-if="agent">
    <div class="header">
      <i class="icon-agent"></i>
      <span>Meilleur Agent</span>
    </div>

    <div class="agent-info">
      <img src="../../assets/images/agent.jpg" alt="Agent" />

      <div class="details">
        <div class="name">{{ agent.nom }}</div>
        <div class="zone">{{ agent.email || 'Pas d’email' }}</div>
        <div class="amount">{{ formatMoney(agent.total_collecte) }}</div>
      </div>
    </div>

    <div class="stats">
      <div>
        Tickets générés
        <span>{{ agent.total_tickets }}</span>
      </div>

      <div>
        Téléphone
        <span>{{ agent.telephone }}</span>
      </div>

      <div>
        Performance
        <span>{{ getPerformance() }}%</span>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else>
    Chargement...
  </div>
</template>

<script>
import api from "../../api/axios";

export default {
  name: "BestAgentCard",

  data() {
    return {
      agent: null,
    };
  },

  mounted() {
    this.getBestAgent();
  },

  methods: {
    async getBestAgent() {
      try {
        const response = await api.get(
          "/dashboard/agents"
        );

        // 🔥 on récupère seulement top_agent
        this.agent = response.data.top_agent;
      } catch (error) {
        console.error(error);
      }
    },

    formatMoney(value) {
      if (!value) return "0 FCFA";

      return Number(value).toLocaleString("fr-FR") + " FCFA";
    },

    // petit calcul simple de performance
    getPerformance() {
      if (!this.agent) return 0;

      let score =
        (this.agent.total_collecte / 1000) +
        this.agent.total_tickets * 5;

      return Math.min(100, Math.round(score));
    },
  },
};
</script>

<!-- <style scoped>
.best-agent-card {
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

.agent-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.agent-info img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.details {
  flex-grow: 1;
}

.name {
  font-weight: bold;
}

.amount {
  font-weight: bold;
  color: #10b981;
}

.stats div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
} -->

<style scoped>
  .best-agent-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.best-agent-card:hover {
  transform: translateY(-3px);
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
}

.header i {
  margin-right: 10px;
  color: #10b981;
  font-size: 20px;
}

/* AGENT INFO */
.agent-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.agent-info img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
  border: 2px solid #10b981;
}

/* DETAILS */
.details {
  flex-grow: 1;
}

.name {
  font-weight: bold;
  font-size: 16px;
  color: #111827;
}

.zone {
  font-size: 13px;
  color: #6b7280;
  margin-top: 3px;
}

.amount {
  font-weight: bold;
  font-size: 18px;
  color: #10b981;
  margin-top: 5px;
}

/* STATS */
.stats {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
}

.stats div {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
  color: #374151;
}

.stats span {
  font-weight: 600;
  color: #111827;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .agent-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .agent-info img {
    margin-bottom: 10px;
  }

  .amount {
    font-size: 16px;
  }
}
</style>
