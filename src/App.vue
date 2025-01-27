<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import LoaderComponent from './components/LoaderComponent.vue'
import ErrorSnackbar from './components/ErrorSnackbar.vue'
import FooterComponent from './components/FooterComponent.vue'

const router = useRouter()
const isInHomePage = ref(false)

router.beforeEach((to) => {
  isInHomePage.value = to.path === '/'
})
</script>

<template>
  <v-layout ref="imageBackground">
    <Navbar />
    <v-main class="page-content pt-0" :class="{ 'image-background': isInHomePage }">
      <div class="container-fluid container-page">
        <router-view :key="$route.path" />
      </div>
    </v-main>
    <FooterComponent />
  </v-layout>

  <LoaderComponent />
  <ErrorSnackbar />
</template>

<style scoped>
.v-layout {
  background-color: #6fa7e2;
  margin: 0;
  width: 100%;
  min-height: fit-content;
  flex-direction: column;
  display: flex;
}

.container-page {
  width: 100%;
  margin: 0;
  padding: 0;
  padding-top: 10rem;
  padding-bottom: 20rem;
  min-height: 90%;
  border-bottom: 2px solid darkblue;
  flex: 1 1 auto;
}

.image-background {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('./assets/mystery-box-with-gifts-concept.jpg');
  height: max-content;
}
</style>
