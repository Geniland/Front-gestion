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
import auth from '../store/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'communes',
        name: 'Communes',
        component: Communes,
      },
      {
        path: 'agents',
        name: 'Agents',
        component: Agents,
      },
      {
        path: 'types-taxes',
        name: 'TypeTaxes',
        component: TypeTaxes,
      },
      {
        path: 'quartiers',
        name: 'Quartiers',
        component: Quartiers,
      },
      {
        path: 'paiements',
        name: 'Paiements',
        component: Paiements,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation globale
router.beforeEach((to, from, next) => {
  const isAuthenticated = auth.isAuthenticated.value;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
