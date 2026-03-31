<template>
  <div class="settings-page">
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <span class="title-icon">⚙️</span>
          Paramètres Système
        </h1>
        <p class="page-subtitle">Configuration globale et centre de contrôle Super Admin</p>
      </div>
      <button class="save-all-btn" @click="saveAllSettings" :disabled="saving">
        <i class="fas fa-check-circle"></i>
        {{ saving ? 'Enregistrement...' : 'Enregistrer tout' }}
      </button>
    </header>

    <div class="settings-container">
      <!-- Onglets Verticaux -->
      <aside class="settings-sidebar">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </aside>

      <!-- Contenu des Onglets -->
      <main class="settings-content">
        <Transition name="fade-slide" mode="out-in">
          <!-- SECTION GÉNÉRAL -->
          <div v-if="activeTab === 'general'" key="general" class="tab-pane">
            <section class="settings-section">
              <h3><i class="fas fa-building"></i> Identité de la Plateforme</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nom de l'application</label>
                  <input type="text" v-model="settings.general.app_name" placeholder="E-TAXE AFRIQUE" />
                </div>
                <div class="form-group">
                  <label>Slogan / Description</label>
                  <input type="text" v-model="settings.general.app_slogan" placeholder="Gestion de Dashboard de Mairie" />
                </div>
                <div class="form-group">
                  <label>Devise par défaut</label>
                  <select v-model="settings.general.currency">
                    <option value="XOF">FCFA (XOF)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Logo de la plateforme</label>
                  <div class="logo-upload">
                    <div class="logo-preview">
                      <img :src="logoPreview || getLogoUrl(settings.general.logo_path)" alt="Logo" />
                    </div>
                    <input type="file" ref="logoInput" @change="onLogoChange" style="display: none" accept="image/*" />
                    <button class="btn-outline-sm" @click="$refs.logoInput.click()">Changer le logo</button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- SECTION SÉCURITÉ & LOGS - Version avec effet de survol et état actif -->
<div v-else-if="activeTab === 'security'" key="security" class="tab-pane">
  <section class="settings-section">
    <h3><i class="fas fa-history"></i> Audit Logs (Journaux d'activité)</h3>
    <div class="table-container">
      <table class="audit-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Action</th>
            <th>Module</th>
            <th>Date</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in auditLogs" :key="log.id" class="audit-row">
            <td>
              <div class="user-cell">
                <div class="avatar-xs">{{ log.user ? log.user.charAt(0).toUpperCase() : '?' }}</div>
                <span>{{ log.user || 'Système' }}</span>
              </div>
            </td>
            <td>
              <span class="badge-action" :class="log.type?.toLowerCase() || 'default'">
                {{ log.action }}
              </span>
            </td>
            <td>{{ log.module || '-' }}</td>
            <td>{{ formatDate(log.date) }}</td>
            <td class="ip-cell">{{ log.ip || 'N/A' }}</td>
          </tr>
          <!-- Message si pas de logs -->
          <tr v-if="!auditLogs?.length">
            <td colspan="5" class="text-center py-4" style="color: #64748b;">
              Aucun journal d'activité disponible
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="settings-section mt-8">
    <h3><i class="fas fa-shield-alt"></i> Politique de Sécurité</h3>
    <div class="form-group checkbox-group">
      <div class="security-option">
        <label class="switch">
          <input type="checkbox" v-model="settings.security.twoFactor" />
          <span class="slider"></span>
        </label>
        <span class="option-label">Forcer l'authentification à deux facteurs (2FA)</span>
      </div>
    </div>
    <div class="form-group mt-4">
      <label for="session-timeout" style="color: #1e293b; font-weight: 600;">Expiration des sessions (minutes)</label>
      <input 
        id="session-timeout"
        type="number" 
        v-model.number="settings.security.sessionTimeout" 
        class="w-32"
        min="1"
        max="1440"
        style="color: #1e293b; background: white; border: 1px solid #e2e8f0; padding: 8px; border-radius: 6px;"
      />
    </div>
  </section>
</div>

          <!-- SECTION FINANCES -->
          <div v-else-if="activeTab === 'finances'" key="finances" class="tab-pane">
            <section class="settings-section">
              <h3><i class="fas fa-money-check-alt"></i> Passerelles de Paiement</h3>
              <div class="gateways-grid">
                <div class="gateway-card" :class="{ active: settings.finances.tmoney_enabled }">
                  <div class="gateway-header">
                    <img src="https://via.placeholder.com/40x40?text=TM" alt="T-Money" />
                    <label class="switch">
                      <input type="checkbox" v-model="settings.finances.tmoney_enabled">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  <h4>T-Money (Togo Cellulaire)</h4>
                  <input type="password" placeholder="API Key" v-model="settings.finances.tmoney_key" />
                </div>
                <div class="gateway-card" :class="{ active: settings.finances.flooz_enabled }">
                  <div class="gateway-header">
                    <img src="https://via.placeholder.com/40x40?text=FL" alt="Flooz" />
                    <label class="switch">
                      <input type="checkbox" v-model="settings.finances.flooz_enabled">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  <h4>Flooz (Moov Africa)</h4>
                  <input type="password" placeholder="Merchant ID" v-model="settings.finances.flooz_key" />
                </div>
              </div>
            </section>

            <section class="settings-section mt-8">
              <h3><i class="fas fa-percentage"></i> Pénalités & Majorations</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Taux de pénalité par défaut (%)</label>
                  <input type="number" v-model="settings.finances.penalty_rate" />
                </div>
                <div class="form-group">
                  <label>Délai de grâce (jours)</label>
                  <input type="number" v-model="settings.finances.grace_period" />
                </div>
              </div>
            </section>
          </div>

          <!-- SECTION NOTIFICATIONS -->
          <div v-else-if="activeTab === 'notifications'" key="notifications" class="tab-pane">
            <section class="settings-section">
              <h3><i class="fas fa-envelope-open-text"></i> Templates de Messages</h3>
              <div class="template-selector">
                <div class="form-group">
                  <label>Type de notification</label>
                  <select v-model="selectedTemplate">
                    <option value="receipt">Reçu de paiement</option>
                    <option value="reminder">Rappel de taxe</option>
                    <option value="welcome">Bienvenue nouvel agent</option>
                  </select>
                </div>
                <div class="form-group mt-4">
                  <label>Contenu du SMS / Email</label>
                  <textarea v-model="settings.notifications.template_body" rows="6"></textarea>
                  <p class="text-xs text-slate-400 mt-2">Variables disponibles : {NOM}, {MONTANT}, {DATE}, {COMMUNE}</p>
                </div>
              </div>
            </section>
          </div>

          <!-- SECTION SYSTÈME -->
          <div v-else-if="activeTab === 'system'" key="system" class="tab-pane">
            <section class="settings-section">
              <h3><i class="fas fa-database"></i> Sauvegardes & Maintenance</h3>
              <div class="maintenance-actions">
                <div class="action-card">
                  <i class="fas fa-cloud-download-alt"></i>
                  <div class="action-info">
                    <h4>Sauvegarde Complète</h4>
                    <p>Télécharger un dump SQL de la base de données actuelle.</p>
                  </div>
                  <button class="btn-primary" @click="downloadBackup" :disabled="backingUp">
                    <i v-if="backingUp" class="fas fa-spinner fa-spin mr-2"></i>
                    {{ backingUp ? 'Génération...' : 'Lancer le backup' }}
                  </button>
                </div>
                <div class="action-card mt-4">
                  <i class="fas fa-file-import"></i>
                  <div class="action-info">
                    <h4>Importation Massive</h4>
                    <p>Importer des contribuables ou agents via un fichier CSV/Excel.</p>
                  </div>
                  <button class="btn-outline">Choisir un fichier</button>
                </div>
              </div>
            </section>

            <section class="settings-section mt-8 danger-zone">
              <h3><i class="fas fa-exclamation-triangle"></i> Zone de Danger</h3>
              <div class="danger-box">
                <div class="action-info">
                  <h4>Réinitialiser les compteurs</h4>
                  <p>Remettre à zéro tous les numéros de tickets pour la nouvelle année.</p>
                </div>
                <button class="btn-danger">Réinitialiser</button>
              </div>
            </section>
          </div>
        </Transition>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import api from '../api/axios';

export default {
  name: 'Settings',
  setup() {
    const activeTab = ref('general');
    const saving = ref(false);
    const backingUp = ref(false);
    const selectedTemplate = ref('receipt');
    const logoInput = ref(null);
    const logoPreview = ref(null);
    const logoFile = ref(null);

    const tabs = [
      { id: 'general', label: 'Général', icon: 'fas fa-cog' },
      { id: 'security', label: 'Sécurité & Logs', icon: 'fas fa-shield-alt' },
      { id: 'finances', label: 'Finances & Taxes', icon: 'fas fa-money-bill-wave' },
      { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
      { id: 'system', label: 'Système', icon: 'fas fa-server' },
    ];

    const settings = reactive({
      general: {
        app_name: 'E-TAXE AFRIQUE',
        app_slogan: 'Gestion de Dashboard de Mairie',
        currency: 'XOF',
        logo_path: ''
      },
      security: {
        twoFactor: false,
        sessionTimeout: 60
      },
      finances: {
        tmoney_enabled: true,
        tmoney_key: '••••••••••••••••',
        flooz_enabled: false,
        flooz_key: '',
        penalty_rate: 10,
        grace_period: 5
      },
      notifications: {
        template_body: "Bonjour {NOM}, votre paiement de {MONTANT} FCFA pour la taxe {TYPE} a bien été enregistré le {DATE}. Merci."
      }
    });

    const auditLogs = ref([]);

    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        // Merge with defaults to ensure all keys exist
        Object.keys(response.data).forEach(section => {
          if (settings[section]) {
            Object.assign(settings[section], response.data[section]);
          }
        });
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    };

    const fetchAuditLogs = async () => {
      try {
        const response = await api.get('/audit-logs');
        auditLogs.value = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des logs d\'audit:', error);
      }
    };

    onMounted(() => {
      fetchSettings();
      fetchAuditLogs();
    });

    const saveAllSettings = async () => {
      saving.value = true;
      try {
        const formData = new FormData();
        // Add settings as a JSON string or individually
        formData.append('settings', JSON.stringify(settings));
        
        if (logoFile.value) {
          formData.append('logo', logoFile.value);
        }

        await api.post('/settings', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        alert('Tous les paramètres ont été mis à jour avec succès !');
        // Refresh to get updated logo path if changed
        fetchSettings();
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des paramètres:', error);
        alert('Une erreur est survenue lors de l\'enregistrement.');
      } finally {
        saving.value = false;
      }
    };

    const downloadBackup = async () => {
      backingUp.value = true;
      try {
        const response = await api.get('/settings/backup', {
          responseType: 'blob'
        });
        
        // Create a download link for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const filename = `backup-${new Date().toISOString().split('T')[0]}.sql`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erreur lors du téléchargement du backup:', error);
        alert('Une erreur est survenue lors de la génération du backup.');
      } finally {
        backingUp.value = false;
      }
    };

    const onLogoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        logoFile.value = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          logoPreview.value = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const getLogoUrl = (path) => {
      if (!path) return '/src/assets/images/logo.png';
      if (path.startsWith('http')) return path;
      return `${api.defaults.baseURL.replace('/api', '')}/storage/${path}`;
    };

    const formatDate = (date) => {
      if (!date) return '-';
      return date;
    };

    return {
      activeTab,
      tabs,
      settings,
      auditLogs,
      saving,
      backingUp,
      selectedTemplate,
      logoInput,
      logoPreview,
      onLogoChange,
      getLogoUrl,
      saveAllSettings,
      downloadBackup,
      formatDate
    };
  }
};
</script>

<style scoped>

/* Styles pour les lignes du tableau avec effet de survol */
.audit-table tbody tr {
  transition: background-color 0.2s ease;
}

.audit-table tbody tr:hover {
  background-color: #f8fafc;
  cursor: pointer;
}

/* Style pour les cellules de texte */
.audit-table td {
  color: #1e293b;
  padding: 12px;
}

/* Style pour les en-têtes */
.audit-table th {
  color: #475569;
  font-weight: 600;
}

/* Style pour l'avatar */
.avatar-xs {
  width: 28px;
  height: 28px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

/* Effet de survol sur l'avatar */
.audit-row:hover .avatar-xs {
  background: #0ea5e9;
  color: white;
}

/* Style pour les badges avec effet de survol */
.badge-action {
  transition: all 0.2s ease;
  display: inline-block;
}

.audit-row:hover .badge-action {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Couleurs des badges */
.badge-action.update { background: #e0f2fe; color: #0369a1; }
.badge-action.delete { background: #fee2e2; color: #dc2626; }
.badge-action.login { background: #dcfce7; color: #16a34a; }
.badge-action.export { background: #fef3c7; color: #d97706; }
.badge-action.default { background: #f1f5f9; color: #475569; }

/* Effet de survol sur les badges */
.audit-row:hover .badge-action.update { background: #bae6fd; }
.audit-row:hover .badge-action.delete { background: #fecaca; }
.audit-row:hover .badge-action.login { background: #bbf7d0; }
.audit-row:hover .badge-action.export { background: #fde68a; }
.audit-row:hover .badge-action.default { background: #e2e8f0; }

/* Style pour l'IP */
.ip-cell {
  color: #64748b;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.audit-row:hover .ip-cell {
  color: #0ea5e9;
}

/* Style pour le switch avec effet */
.security-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.security-option:hover {
  background-color: #f8fafc;
}

.option-label {
  color: #1e293b;
  font-weight: 500;
  cursor: pointer;
}

/* Style pour l'input number avec effet de survol */
.w-32 {
  transition: all 0.2s ease;
}

.w-32:hover {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
}

.w-32:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}


.settings-page { padding: 24px; background: #f8fafc; min-height: 100vh; }

.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.page-title { font-size: 1.8rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 15px; }
.page-subtitle { color: #64748b; margin: 4px 0 0 48px; }

.save-all-btn {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.settings-container { display: flex; gap: 30px; }

/* Sidebar Onglets */
.settings-sidebar {
  width: 280px;
  background: white;
  border-radius: 20px;
  padding: 15px;
  height: fit-content;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
}

.tab-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border: none;
  background: none;
  color: #64748b;
  font-weight: 600;
  font-size: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 5px;
}

.tab-btn:hover { background: #f1f5f9; color: #1e293b; }
.tab-btn.active { background: #e0f2fe; color: #0ea5e9; }

/* Zone de contenu */
.settings-content { flex: 1; }

.tab-pane {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
}

.settings-section h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.form-group { display: flex; flex-direction: column; gap: 10px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 14px; font-weight: 600; color: #475569; }
.form-group input, .form-group select, .form-group textarea {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
}

/* Audit Table */
.audit-table { width: 100%; border-collapse: collapse; }
.audit-table th { text-align: left; padding: 12px; font-size: 12px; color: #64748b; text-transform: uppercase; }
.audit-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }

.badge-action { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.update { background: #e0f2fe; color: #0369a1; }
.delete { background: #fee2e2; color: #dc2626; }
.login { background: #dcfce7; color: #16a34a; }
.export { background: #fef3c7; color: #d97706; }

/* Gateways */
.gateways-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.gateway-card {
  padding: 20px;
  border: 2px solid #f1f5f9;
  border-radius: 15px;
  transition: all 0.3s;
}
.gateway-card.active { border-color: #0ea5e9; background: #f0f9ff; }
.gateway-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }

/* Maintenance */
.action-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 15px;
}
.action-card i { font-size: 24px; color: #64748b; }
.action-info { flex: 1; }
.action-info h4 { margin: 0; font-size: 15px; color: #1e293b; }
.action-info p { margin: 5px 0 0; font-size: 13px; color: #64748b; }

/* Danger Zone */
.danger-zone h3 { color: #ef4444; border-bottom-color: #fee2e2; }
.danger-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #fee2e2;
  background: #fff1f2;
  border-radius: 15px;
}

.btn-danger { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-primary { background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-outline { background: white; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }

/* Switch Toggle */
.switch { position: relative; display: inline-block; width: 40px; height: 22px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #0ea5e9; }
input:checked + .slider:before { transform: translateX(18px); }

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
