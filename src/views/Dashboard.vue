<template>
  <div class="dashboard">
    <!-- Header avec titre et date -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">
          <span class="title-icon">📊</span>
          Tableau de Bord
        </h1>
        <p class="dashboard-date">{{ currentDate }}</p>
      </div>
      
      <div class="header-right">
        <div class="notification-badge">
          <span class="notification-dot"></span>
          <span class="notification-text">Mise à jour en temps réel</span>
        </div>
        <button class="refresh-btn" @click="refreshData">
          <span class="refresh-icon">↻</span>
          Actualiser
        </button>
      </div>
    </header>

    <!-- Cartes de résumé avec animation -->
    <Transition name="fade-slide" appear>
      <SummaryCardsRow />
    </Transition>

    <!-- Grille principale améliorée -->
    <div class="main-grid">
      <!-- Colonne de gauche (2/3) -->
      <div class="left-column">
        <Transition name="fade-slide" appear>
          <div class="grid-item large">
            <RevenueForecastChart />
          </div>
        </Transition>

        <Transition name="fade-slide" appear>
          <div class="grid-item map-container">
            <MapCard />
          </div>
        </Transition>

        <!-- Tableau des contribuables (déplacé ici) -->
        <Transition name="fade-slide" appear>
          <div class="grid-item large unpaid-table-container">
            <UnpaidTaxpayersTable />
          </div>
        </Transition>
      </div>

      <!-- Colonne de droite (1/3) avec disposition optimisée -->
      <div class="right-column">
        <TransitionGroup name="stagger" tag="div" class="right-column-content">
          <!-- Cartes de risque et performance -->
          <!-- <div key="risk" class="grid-item small">
            <RiskLevelCard />
          </div> -->
          
          <div key="zone" class="grid-item small">
            <BestZoneCard />
          </div>
          
          <div key="agent" class="grid-item small">
            <BestAgentCard />
          </div>
          
          <!-- Cartes de risque et fraude -->
          <div key="fraud" class="grid-item medium">
            <RiskAndFraudCard />
          </div>
          
          <!-- Graphiques supplémentaires -->
          <!-- <div key="atuness" class="grid-item small">
            <AtunessChart />
          </div> -->
          
          <!-- <div key="recovery" class="grid-item small">
            <RecoveryRateChart />
          </div> -->
        </TransitionGroup>
      </div>
    </div>

    <!-- Barre du bas avec animations -->
    <Transition name="fade-up" appear>
      <BottomBar />
    </Transition>

    <!-- Bouton de retour en haut (mobile) -->
    <Transition name="fade">
      <button 
        v-show="showScrollTop" 
        class="scroll-top-btn"
        @click="scrollToTop"
      >
        ↑
      </button>
    </Transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import SummaryCardsRow from '../components/layout/SummaryCardsRow.vue'
import RevenueForecastChart from '../components/charts/RevenueForecastChart.vue'
import MapCard from '../components/cards/MapCard.vue'
import RiskLevelCard from '../components/cards/RiskLevelCard.vue'
import BestZoneCard from '../components/cards/BestZoneCard.vue'
import BestAgentCard from '../components/cards/BestAgentCard.vue'
import RiskAndFraudCard from '../components/cards/RiskAndFraudCard.vue'
import UnpaidTaxpayersTable from '../components/cards/UnpaidTaxpayersTable.vue'
import AtunessChart from '../components/charts/AtunessChart.vue'
import RecoveryRateChart from '../components/charts/RecoveryRateChart.vue'
import BottomBar from '../components/layout/BottomBar.vue'

export default {
  name: 'Dashboard',
  components: {
    SummaryCardsRow,
    RevenueForecastChart,
    MapCard,
    RiskLevelCard,
    BestZoneCard,
    BestAgentCard,
    RiskAndFraudCard,
    UnpaidTaxpayersTable,
    AtunessChart,
    RecoveryRateChart,
    BottomBar,
  },
  setup() {
    const showScrollTop = ref(false)
    const currentDate = ref('')

    // Mettre à jour la date
    const updateDate = () => {
      const now = new Date()
      currentDate.value = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Gestion du scroll
    const handleScroll = () => {
      showScrollTop.value = window.scrollY > 300
    }

    // Scroll to top
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Rafraîchir les données
    const refreshData = () => {
      // Implémenter la logique de rafraîchissement
      console.log('Rafraîchissement des données...')
    }

    onMounted(() => {
      updateDate()
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      showScrollTop,
      currentDate,
      refreshData,
      scrollToTop
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.dashboard {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 24px 32px;
  position: relative;
  overflow-x: hidden;
}

/* .grid-item {
  max-width: 100%;
  box-sizing: border-box;
} */

/* .left-column,
.right-column {
  min-width: 0;
} */

/* Header amélioré */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dashboard-title span:not(.title-icon) {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dashboard-date {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
  text-transform: capitalize;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 40px;
  font-size: 0.9rem;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.notification-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
}

.refresh-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.refresh-btn:hover .refresh-icon {
  transform: rotate(180deg);
}

/* Grille principale améliorée */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

/* Colonnes */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  position: relative;
}

.right-column-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Éléments de grille */
.grid-item {
  background: white;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.grid-item.large {
  min-height: 350px;
}

.grid-item.medium {
  min-height: 250px;
}

.grid-item.small {
  min-height: 180px;
}

.map-container {
  padding: 0;
  overflow: hidden;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

/* Transitions Vue */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-active {
  transition: all 0.6s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* Animation staggered pour la colonne droite */
.stagger-enter-active {
  transition: all 0.5s ease;
  transition-delay: calc(0.1s * var(--stagger-index));
}

.stagger-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

/* Bouton scroll to top */
.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
}

.scroll-top-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.5);
}

/* Responsive design */
@media (max-width: 1200px) {
  .dashboard {
    padding: 20px;
  }
  
  .main-grid {
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .grid-item.large,
  .grid-item.medium,
  .grid-item.small {
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .dashboard-title {
    font-size: 1.8rem;
  }
  
  .title-icon {
    font-size: 2rem;
  }
  
  .notification-badge {
    display: none;
  }
  
  .refresh-btn {
    width: 100%;
    justify-content: center;
  }
  
  .scroll-top-btn {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .dashboard {
    background: linear-gradient(135deg, #0f172a, #1e293b);
  }
  
  .dashboard-header {
    background: rgba(30, 41, 59, 0.8);
    border-color: #334155;
  }
  
  .dashboard-date {
    color: #94a3b8;
  }
  
  .notification-badge {
    background: #1e293b;
    border-color: #334155;
    color: #cbd5e1;
  }
  
  .refresh-btn {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
  }
  
  .refresh-btn:hover {
    background: #334155;
  }
  
  .grid-item {
    background: #1e293b;
    border-color: #334155;
  }
  
  .grid-item:hover {
    border-color: #4b5563;
  }
}
</style>