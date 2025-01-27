<template>
  <v-dialog id="main-loader" v-model="dialog" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item prepend-icon="$vuetify-outline" title="Fetching data...">
        <template v-slot:prepend>
          <div class="pe-4">
            <v-icon color="primary" size="x-large"></v-icon>
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script lang="ts">
import { useLoaderHandling } from '@/stores/loaderHandling'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const loaderHandling = useLoaderHandling()
    const dialog = ref(false)

    loaderHandling.loaderSubject.subscribe((val) => (dialog.value = val))

    return {
      dialog
    }
  }
})
</script>
<style scoped></style>
