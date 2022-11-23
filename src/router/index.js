import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import PlanetModel from '@/views/PlanetModel.vue'
import SpaceParticles from '@/views/SpaceParticles.vue'
import StatueModel from '@/views/StatueModel.vue'

const Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/planet',
      name: 'planet',
      component: PlanetModel
    },
    {
      path: '/statue',
      name: 'statue',
      component: StatueModel
    },
    {
      path: '/space',
      name: 'space',
      component: SpaceParticles
    }
  ]
})

export default Router
