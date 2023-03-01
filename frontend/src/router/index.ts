import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TemplateView from '@/views/TemplateView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'template',
    component: TemplateView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
