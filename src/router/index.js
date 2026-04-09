import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../views/DashboardLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Communes from '../views/Communes.vue';
import Agents from '../views/Agents.vue';
import TypeTaxes from '../views/TypeTaxes.vue';
import Quartiers from '../views/Quartiers.vue';
import Paiements from '../views/Paiements.vue';
import Settings from '../views/Settings.vue';

// Admin management views
import AdminContribuables from '../views/admin/Contribuables.vue';
import AdminTaxes from '../views/admin/Taxes.vue';
import AdminPaiements from '../views/admin/Paiements.vue';
import AdminEtatCivil from '../views/admin/EtatCivil.vue';
import AdminActualites from '../views/admin/Actualites.vue';
import AdminServices from '../views/admin/Services.vue';

import auth from '../store/auth';

// Public site imports
import PublicLayout from '../views/public/PublicLayout.vue';
import Home from '../views/public/Home.vue';
import Services from '../views/public/Services.vue';
import Actualites from '../views/public/Actualites.vue';
import ActualiteDetail from '../views/public/ActualiteDetail.vue';
import Taxes from '../views/public/Taxes.vue';
import EtatCivil from '../views/public/EtatCivil.vue';
import UserLogin from '../views/public/UserLogin.vue';
import Register from '../views/public/Register.vue';
import ForgotPassword from '../views/public/ForgotPassword.vue';
import Profil from '../views/public/Profil.vue';
import TicketVerify from '../views/public/TicketVerify.vue';
import userAuth from '../store/userAuth';

const routes = [
  // Public site
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'services', name: 'Services', component: Services },
      { path: 'actualites', name: 'Actualites', component: Actualites },
      { path: 'actualites/:id', name: 'ActualiteDetail', component: ActualiteDetail },
      { path: 'taxes', name: 'Taxes', component: Taxes, meta: { requiresUser: true } },
      { path: 'etat-civil', name: 'EtatCivil', component: EtatCivil, meta: { requiresUser: true } },
      { path: 'ticket/verify/:reference', name: 'TicketVerify', component: TicketVerify },
      { path: 'login', name: 'UserLogin', component: UserLogin, meta: { guestUser: true } },
      { path: 'register', name: 'Register', component: Register, meta: { guestUser: true } },
      { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { guestUser: true } },
      { path: 'profil', name: 'Profil', component: Profil, meta: { requiresUser: true } },
    ],
  },

  // Admin login route (separate)
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: Login,
    meta: { guestAdmin: true }
  },

  // Admin dashboard area moved under /admin
  {
    path: '/admin',
    component: DashboardLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'communes', name: 'Communes', component: Communes },
      { path: 'agents', name: 'Agents', component: Agents },
      { path: 'types-taxes', name: 'TypeTaxes', component: TypeTaxes },
      { path: 'quartiers', name: 'Quartiers', component: Quartiers },
      { path: 'paiements', name: 'Paiements', component: Paiements },
      { path: 'settings', name: 'Settings', component: Settings },
      
      // Nouvelles routes d'approbation
      { path: 'contribuables', name: 'AdminContribuables', component: AdminContribuables },
      { path: 'taxes', name: 'AdminTaxes', component: AdminTaxes },
      { path: 'paiements-en-ligne', name: 'AdminPaiements', component: AdminPaiements },
      { path: 'etat-civil', name: 'AdminEtatCivil', component: AdminEtatCivil },
      { path: 'actualites', name: 'AdminActualites', component: AdminActualites },
      { path: 'services', name: 'AdminServices', component: AdminServices },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation globale
router.beforeEach((to, from, next) => {
  const isAdminAuthenticated = auth.isAuthenticated.value;
  const isUserAuthenticated = userAuth.isAuthenticated.value;

  // Admin guards
  if (to.meta.requiresAdmin && !isAdminAuthenticated) {
    return next({ name: 'AdminLogin' });
  }
  if (to.meta.guestAdmin && isAdminAuthenticated) {
    return next({ name: 'Dashboard' });
  }

  // Public user guards
  if (to.meta.requiresUser && !isUserAuthenticated) {
    return next({ name: 'UserLogin' });
  }
  if (to.meta.guestUser && isUserAuthenticated) {
    return next({ name: 'Profil' });
  }

  next();
});

export default router;
