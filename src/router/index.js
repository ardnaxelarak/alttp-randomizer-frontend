import { createRouter, createWebHistory } from "vue-router";
import SeedView from "@/views/SeedView.vue";
import GenerateView from "@/views/GenerateView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/generate',
      name: 'generate',
      component: GenerateView,
    },
    {
      path: '/seed/:id',
      name: 'seed',
      component: SeedView,
    },
  ],
});

export default router;
