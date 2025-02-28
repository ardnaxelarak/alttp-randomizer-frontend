import { createRouter, createWebHistory } from "vue-router";
import SeedView from "@/views/SeedView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/seed/:id',
      name: 'game',
      component: SeedView,
    },
  ],
});

export default router;
