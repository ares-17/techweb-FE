<template>
  <div class="row mx-auto">
    <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8 mx-auto">
      <v-card>
        <div class="row">
          <v-img width="auto" height="auto" lazy-src="/404.jpg" src="/404.jpg">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
          <span class="w-100 text-center span-text">{{ $t('404_text') }}</span>
          <div class="w-100 mx-auto d-flex p-3">
            <v-btn
              color="primary"
              :text="$t('go_back_btn')"
              class="mx-auto"
              type="button"
              variant="flat"
              @click="goToHome"
            ></v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    function goToHome() {
      router.push({ name: 'home' })
    }

    return {
      goToHome
    }
  }
}
</script>

<style>
.span-text {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
