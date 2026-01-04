import { createRouter, createWebHistory } from "vue-router";
import SeedView from "@/views/SeedView.vue";
import MultiView from "@/views/MultiView.vue";
import GenerateView from "@/views/GenerateView.vue";
import GenerateMulti from "@/views/GenerateMulti.vue";
import GenerateApr2025View from "@/views/GenerateApr2025View.vue";
import GenerateDungeonMapView from "@/views/GenerateDungeonMapView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/generate',
      name: 'generate',
      component: GenerateView,
      alias: '/',
    },
    {
      path: '/multiworld',
      name: 'multiworld',
      component: GenerateMulti,
      alias: '/multi',
    },
    {
      path: '/generate/apr2025',
      component: GenerateApr2025View,
    },
    {
      path: '/generate/beta_test',
      component: GenerateDungeonMapView,
    },
    {
      path: '/seed/:id',
      name: 'seed',
      component: SeedView,
    },
    {
      path: '/multi/:id',
      name: 'multi',
      component: MultiView,
    },
  ],
});

export default router;
