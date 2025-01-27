<template>
  <div class="row mx-auto">
    <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8 mx-auto">
      <v-card class="p-4 main-dialog-card" elevation="16">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-6 col-xl-6 col-sm-12">
            <v-img
              width="auto"
              height="auto"
              lazy-src="/4957136_4957136.jpg"
              src="/6183517_3071357.jpg"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-img>
          </div>
          <div class="col-12 col-md-6 col-lg-6 col-xl-6 col-sm-12 my-auto p-4">
            <h2 class="mb-4 pb-4">{{ $t('dialog_signup_title') }}</h2>
            <form @submit.prevent="onComplete">
              <v-text-field
                v-model="email"
                density="compact"
                placeholder="myBeatifulMail@gmail.com"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                class="my-3"
                required
                :rules="[emailValidation]"
              ></v-text-field>

              <v-text-field
                v-model="pwd"
                :append-inner-icon="isPwdVisibile ? 'mdi-eye-off' : 'mdi-eye'"
                label="Password"
                :type="isPwdVisibile ? 'text' : 'password'"
                density="compact"
                placeholder="WhatAStrongPwd!"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                @click:append-inner="isPwdVisibile = !isPwdVisibile"
                required
                :rules="[pwdValidation]"
              ></v-text-field>
              <v-divider class="my-2"></v-divider>
              <v-card-actions>
                <v-btn
                  color="primary"
                  :text="$t('create_quiz_dialog_ok_btn')"
                  class="mx-auto"
                  block
                  type="submit"
                  variant="flat"
                ></v-btn>
              </v-card-actions>
            </form>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import type { AuthApi } from '@/api'
import i18n from '@/i18n/i18n'
import { useSessionStore } from '@/stores/sessionStore'
import { Sanitizer } from '@/utils/Sanitizer'
import { Validators } from '@/utils/Validators'
import { inject, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const isPwdVisibile = ref(false)
    const showDialogState = ref(false)
    const authAPI = inject('AuthApi') as AuthApi
    const email: Ref<string | undefined> = ref(undefined)
    const pwd: Ref<string | undefined> = ref(undefined)
    const sessionStore = useSessionStore()
    const router = useRouter()
    const sanitizer = inject('Sanitizer') as Sanitizer

    function emailValidation(value: string) {
      return Validators.email(value!) || i18n.global.t('validation_email')
    }

    function pwdValidation(value: string) {
      return Validators.password(value!) || i18n.global.t('validation_pwd')
    }

    function onComplete() {
      pwd.value = sanitizer.sanitizeString(pwd.value)
      email.value = sanitizer.sanitizeString(email.value)
      if (
        !pwd.value ||
        !email.value ||
        !Validators.email(email.value) ||
        !Validators.password(pwd.value)
      ) {
        return
      }

      authAPI
        .register({
          customerDto: {
            password: pwd.value,
            username: email.value
          }
        })
        .then((res) => {
          sessionStore.saveUserToSessionStorage(res, email.value!)
          router.push('/')
        })
        .catch((e) => console.log(e))
    }

    return {
      isPwdVisibile,
      onComplete,
      showDialogState,
      email,
      pwd,
      emailValidation,
      pwdValidation
    }
  },
  components: {}
}
</script>
<style>
@media (max-width: 992px) {
  .main-dialog-card {
    min-width: 80vw;
  }
}
@media (min-width: 992px) {
  .main-dialog-card {
    min-width: 50vw;
  }
}
@media (min-width: 1200px) {
  .main-dialog-card {
    min-width: 40vw;
  }
}
@media (min-width: 1400px) {
  .main-dialog-card {
    min-width: 30vw;
  }
}

.v-card-item {
  padding: 1rem;
}
</style>
