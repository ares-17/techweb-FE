<template>
  <div class="row mx-auto">
    <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8 mx-auto">
      <v-card>
        <div class="row">
          <v-img width="50%" height="auto" lazy-src="/attack.jpg" src="/attack.jpg">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
          <span class="w-100 text-center under-attacks-span">{{ $t('under_attack') }}</span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    return {}
  }
}
</script>

<style>
.under-attacks-span {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
