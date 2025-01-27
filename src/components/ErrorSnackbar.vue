<template>
  <v-snackbar v-model="snackbar" color="blue-accent-4" elevation="24">
    {{ text }}
  </v-snackbar>
</template>

<script lang="ts">
import { useErrorHandling } from '@/stores/errorHandling'
import { Sanitizer } from '@/utils/Sanitizer'
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  setup() {
    const snackbar = ref(false)
    const text = ref('')
    const errorHandling = useErrorHandling()
    const sanitizer = inject('Sanitizer') as Sanitizer

    errorHandling.errorsSubject.subscribe((value) => {
      if (value && value.display) {
        snackbar.value = true
        text.value = sanitizer.sanitizeString(value.text)!
        setTimeout(() => {
          snackbar.value = false
          text.value = ''
        }, 4000)
      }
    })

    return {
      snackbar,
      text,
      sanitizer
    }
  }
})
</script>
<style></style>
