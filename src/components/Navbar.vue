<template>
  <v-app-bar>
    <v-app-bar-title>
      <router-link class="nav-link m-3 d-none d-md-flex" to="/">SmartQuiz</router-link>
      <v-btn class="d-lg-none" icon="mdi-home" variant="text" @click="router.push('/')"></v-btn>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <template v-slot:append>
      <div v-if="!isLogged" class="d-flex align-items-center">
        <RouterLink to="/login" class="nav-link m-3 d-none d-md-flex">{{
          $t('navbar_signin')
        }}</RouterLink>
        <RouterLink to="/register" class="nav-link m-3 d-none d-md-flex">{{
          $t('navbar_signup')
        }}</RouterLink>
        <v-btn icon class="d-flex d-md-none" @click="drawer = true">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>
      <div v-else class="d-flex align-items-center">
        <span class="mx-5 d-none d-md-block">{{ $t('navbar_welcome', { username }) }}</span>
        <v-btn class="mx-3" variant="outlined" @click="logout">
          <span class="d-none d-md-block">Logout</span>
          <v-icon icon="mdi-exit-to-app"></v-icon>
        </v-btn>
      </div>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app temporary class="d-md-none">
    <v-list>
      <v-list-item>
        <RouterLink to="/login" class="nav-link m-3">{{ $t('navbar_signin') }}</RouterLink>
      </v-list-item>
      <v-list-item>
        <RouterLink to="/register" class="nav-link m-3">{{ $t('navbar_signup') }}</RouterLink>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { useSessionStore } from '@/stores/sessionStore'
import { Sanitizer } from '@/utils/Sanitizer'
import { inject } from 'vue'
import { defineComponent, onBeforeUnmount, ref, type Ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainNavbar',
  setup() {
    const drawer = ref(false)
    const isLogged = ref(false)
    const username: Ref<string | undefined> = ref(undefined)
    const router = useRouter()
    const sessionStore = useSessionStore()
    const sanitizer = inject('Sanitizer') as Sanitizer

    const subscriptionIsLogged = sessionStore.isLoggedSubject.subscribe((value) => {
      isLogged.value = value
    })

    const subSessionStorage = sessionStore.sessionStorageSubject.subscribe((values) => {
      if (values && values['username']) {
        username.value = sanitizer.sanitizeString(
          sessionStore.getFromSessionStorage('username') as string
        )
      }
    })

    function logout() {
      sessionStore.removeUser()
      router.push('/')
    }

    onBeforeUnmount(() => {
      subscriptionIsLogged.unsubscribe()
      subSessionStorage.unsubscribe()
    })

    return {
      drawer,
      isLogged,
      logout,
      username,
      router
    }
  },
  components: {
    RouterLink
  }
})
</script>

<style scoped>
.navbar-nav .nav-link:hover {
  text-decoration: underline;
}

.navbar-nav .nav-link {
  font-size: larger;
  font-stretch: expanded;
  line-height: 1.25rem;
}

.logo {
  border-radius: 50%;
}

.nav-link {
  font-weight: 600;
  font-stretch: expanded;
  line-height: 1.25rem;
  text-transform: uppercase;
}

.nav-link:hover {
  text-decoration: underline;
}

.v-app-bar-title {
  font-size: x-large;
  text-transform: uppercase;
}

.v-app-bar.v-toolbar {
  background: #0000001f;
}
</style>
