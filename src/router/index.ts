import { useSessionStore } from '@/stores/sessionStore'
import LoginView from '@/views/LoginView.vue'
import CreateQuiz from '@/views/CreateQuiz.vue'
import HomePage from '@/views/HomePage.vue'
import QuizIstance from '@/views/QuizIstance.vue'
import RegisterView from '@/views/RegisterView.vue'
import TakeQuiz from '@/views/TakeQuiz.vue'
import { createRouter, createWebHistory } from 'vue-router'
import UnderAttackErrorPage from '@/views/UnderAttackErrorPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

const authGuard = () => {
  const sessionStorage = useSessionStore()
  if (
    !sessionStorage.getFromSessionStorage('token') ||
    !sessionStorage.getFromSessionStorage('expiresIn')
  ) {
    return '/login'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/create-quiz',
      name: 'create-quiz',
      component: CreateQuiz,
      beforeEnter: authGuard
    },
    {
      path: '/quiz/:id',
      name: 'quiz-istance',
      props: true,
      component: QuizIstance
    },
    {
      path: '/take-quiz/:id',
      name: 'take-quiz',
      props: true,
      component: TakeQuiz
    },
    {
      path: '/under-attack',
      name: 'under-attack',
      component: UnderAttackErrorPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundPage
    }
  ]
})

export default router
