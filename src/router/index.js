import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../views/DashboardLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
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
      // Vous pouvez ajouter d'autres routes ici
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
