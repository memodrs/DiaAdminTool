import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'

const Login = () => import('@/views/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')

const routes = [
  { path: '/login', name: 'Login', component: Login, meta: { guestOnly: true } },
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth Guard
let userLoaded = false
let currentUser = null

const getCurrentUser = () =>
  new Promise((resolve) => {
    if (userLoaded) return resolve(currentUser)
    onAuthStateChanged(auth, (user) => {
      userLoaded = true
      currentUser = user
      resolve(user)
    })
  })

router.beforeEach(async (to) => {
  const user = await getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && user) {
    return { name: 'Dashboard' }
  }
  return true
})

export default router
