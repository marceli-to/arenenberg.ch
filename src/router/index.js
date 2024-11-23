import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StationsView from '../views/StationsView.vue'
import KapelleView from '../views/KapelleView.vue'
import StallDerZukunftView from '../views/StallDerZukunftView.vue'
import PraezisSmartDigitalView from '../views/PraezisSmartDigitalView.vue'
import GartenbaukunstView from '../views/GartenbaukunstView.vue'
import ALaFrancaiseView from '../views/ALaFrancaiseView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/stations',
      name: 'stations',
      component: StationsView
    },
    {
      path: '/stations/kapelle',
      name: 'kapelle',
      component: KapelleView
    },
    {
      path: '/stations/stall-der-zukunft',
      name: 'stall-der-zukunft',
      component: StallDerZukunftView
    },
    {
      path: '/stations/praezis-smart-digital',
      name: 'praezis-smart-digital',
      component: PraezisSmartDigitalView
    },
    {
      path: '/stations/gartenbaukunst',
      name: 'gartenbaukunst',
      component: GartenbaukunstView
    },
    {
      path: '/stations/a-la-francaise',
      name: 'a-la-francaise',
      component: ALaFrancaiseView
    }
  ]
})

export default router