<template>
  <div class="row m-0">
    <div
      v-if="quizDetails"
      class="ps-5 col-12 col-sm-12 col-md-12 col-lg-8 col-xl-6 mx-auto mt-3 order-md-first order-sm-first"
    >
      <v-card class="text-bg-light p-5 w-100" elevation="16">
        <div class="input-container bg-transparent w-100">
          <div class="pb-5">
            <div class="row">
              <div class="col-12 col-md-6 col-sm-12 col-lg-6 col-xl-6 mb-2">
                <v-btn rounded="md" @click="goBack" color="primary">
                  <v-icon icon="mdi-arrow-left" class="mx-3"></v-icon>
                  {{ $t('go_back_btn') }}
                </v-btn>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h1 v-html="quizDetails?.title ? Utils.toMarkdown(quizDetails?.title) : ''"></h1>
          </div>
          <span
            v-html="quizDetails?.description ? Utils.toMarkdown(quizDetails?.description) : ''"
          ></span>
          <v-divider></v-divider>
          <div class="row">
            <div
              class="d-flex justify-content-start col-12 col-md-6 col-sm-12 col-lg-6 col-xl-6 mb-2"
            >
              <v-btn
                rounded="md"
                color="primary"
                class="w-100 mx-auto my-auto"
                @click="goToQuiz"
                variant="elevated"
              >
                {{ $t('quiz_deatails_play') }}
                <v-icon icon="mdi-play-circle-outline" class="mx-3"></v-icon>
              </v-btn>
            </div>
            <div
              class="d-flex justify-content-end col-12 col-md-6 col-sm-12 col-lg-6 col-xl-6 mb-2"
            >
              <v-btn
                rounded="md"
                aria-label="Generate qr code"
                class="w-100 mx-auto my-auto"
                @click="showQrCode"
                variant="outlined"
              >
                {{ $t('quiz_deatails_qrcode_gen') }}
                <v-icon icon="mdi-qrcode" class="mx-3"></v-icon>
              </v-btn>
            </div>
          </div>
          <div class="div-link text-center">
            <span
              >Copia il codice del quiz
              <v-btn
                v-if="!errorOnCopy"
                icon="mdi-content-copy"
                variant="text"
                @click="copyToClipboard"
              ></v-btn>
              <span v-else><br />{{ quizDetails?.id }}</span>
            </span>
          </div>
          <v-divider></v-divider>
          <v-form readonly>
            <div class="row">
              <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-2 h-100">
                <v-text-field
                  v-model="quizDetails!.numQuestions"
                  :label="$t('quiz_istance_num_questions')"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-2 h-100">
                <v-text-field
                  v-model="quizDetails!.maxErrors"
                  :label="$t('quiz_istance_errors')"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-2 h-100">
                <v-text-field
                  v-model="quizDetails!.createdBy"
                  :label="$t('quiz_istance_num_created_by')"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-2 h-100">
                <v-text-field
                  v-model="quizDetails!.createdAt"
                  :label="$t('quiz_istance_created_at')"
                ></v-text-field>
              </div>
            </div>
          </v-form>
          <div>
            <v-divider></v-divider>
            <h4 class="align-items-center d-flex my-4">
              <v-icon icon="mdi-account"></v-icon> Punteggi ottenuti
            </h4>
            <v-table max-height="300px" style="background: none" v-if="scores && scores.length > 0">
              <thead>
                <tr>
                  <th class="text-left">Nome utente</th>
                  <th class="text-left">Punteggio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in scores" :key="i">
                  <td v-html="sanitizer.sanitizeString(item.customerUsername)"></td>
                  <td v-html="sanitizer.sanitizeString(String(item.score))"></td>
                </tr>
              </tbody>
            </v-table>
            <div class="no-scores text-center" v-else>
              <span>{{ $t('quiz_istance_no_scores') }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>

  <v-dialog v-model="stateQrCodeDialog" width="auto">
    <v-card :text="$t('dialog_qrcode_text')" :title="$t('dialog_qrcode_title')">
      <div class="w-100 d-flex">
        <canvas ref="canvas" class="mx-auto"></canvas>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :text="$t('create_quiz_dialog_ok_btn')"
          @click="stateQrCodeDialog = !stateQrCodeDialog"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { QuizApi, ScoreApi, UserApi } from '@/api'
import type { ScoreDto } from '@/api/models'
import { ENV_BASE_PATH } from '@/api/models/runtime'
import i18n from '@/i18n/i18n'
import { useErrorHandling } from '@/stores/errorHandling'
import Utils from '@/utils/Utils'
import { Sanitizer } from '@/utils/Sanitizer'
import QRCode from 'qrcode'
import { inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null)
    const qrCodeGenerated = ref(false)
    const router = useRouter()
    const quizDetails: Ref<{
      title?: string
      description?: string
      numQuestions?: number
      createdAt?: string
      maxErrors?: number
      createdBy?: string
      id?: string
    }> = ref({})
    const quizApi = inject('QuizApi') as QuizApi
    const scoreApi = inject('ScoreApi') as ScoreApi
    const userApi = inject('UserApi') as UserApi
    const stateQrCodeDialog = ref(false)
    const scores: Ref<ScoreDto[] | undefined> = ref()
    const errorHandling = useErrorHandling()
    const errorOnCopy = ref(false)
    const sanitizer = inject('Sanitizer') as Sanitizer

    onMounted(() => {
      quizApi
        .getQuizById({ uidQuiz: props.id })
        .then((res) => {
          quizDetails.value = {
            ...res,
            createdAt: res.createdAt?.toLocaleDateString(),
            numQuestions: res.questions?.length || 0,
            createdBy: ''
          }
          if (res.createdBy) {
            userApi
              .getCustomerById({ idCustomer: res.createdBy })
              .then((customer) => (quizDetails.value.createdBy = customer.username))
          }
        })
        .catch((e) => console.log(e))

      scoreApi
        .getScoresByQuiz({ idQuiz: props.id })
        .then((res) => (scores.value = res))
        .catch((e) => console.log(e))
    })

    function showQrCode() {
      stateQrCodeDialog.value = true
      setTimeout(() => generateQrCode(), 100)
    }

    const getQrCodeSizeByDisplay = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const minDimension = Math.min(screenWidth, screenHeight)
      const qrCodeSize = Math.floor(0.5 * minDimension)
      return qrCodeSize
    }

    const generateQrCode = () => {
      if (canvas.value) {
        const size = getQrCodeSizeByDisplay()
        const options = {
          width: size,
          height: size
        }
        const path = sanitizer.sanitizeString(`http://${ENV_BASE_PATH}:5173/quiz/${props.id}`)!
        QRCode.toCanvas(canvas.value, path, options, (error) => {
          if (error) {
            console.error(error)
            qrCodeGenerated.value = false
          } else {
            qrCodeGenerated.value = true
          }
        })
      }
    }

    function copyToClipboard(): void {
      if (!navigator.clipboard) {
        console.error('Clipboard API is not available')
        return
      }

      navigator.clipboard
        .writeText(quizDetails?.value?.id!)
        .then(() => {
          console.log('Text copied to clipboard')
          errorHandling.errorsSubject.next({
            display: true,
            text: i18n.global.t('quiz_istance_copy_ok')
          })
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err)
          errorOnCopy.value = true
          errorHandling.errorsSubject.next({
            display: true,
            text: i18n.global.t('quiz_istance_copy_ko')
          })
        })
    }

    function goBack() {
      router.push('/')
    }

    function goToQuiz() {
      router.push({ name: 'take-quiz', params: { id: props.id } })
    }

    return {
      canvas,
      qrCodeGenerated,
      quizDetails,
      showQrCode,
      stateQrCodeDialog,
      scores,
      goBack,
      Utils,
      goToQuiz,
      copyToClipboard,
      errorOnCopy,
      sanitizer
    }
  }
}
</script>

<style scoped>
@media (min-width: 992px) {
  .title-col {
    margin-left: 5rem;
  }

  .input-col {
    margin-left: 5rem;
  }

  h1.title {
    margin-top: 2rem;
    font-size: 4rem;
    color: white;
    font-weight: 600;
    font-family: Poppins;
    text-shadow:
      -1px 0 black,
      0 1px black,
      1px 0 black,
      0 -1px black;
  }
}

@media (max-width: 992px) {
  .title-col {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1rem;
  }

  .input-col {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }

  h1.title {
    font-size: xx-large;
    color: white;
    font-weight: 600;
    font-family: Poppins;
    text-shadow:
      -1px 0 black,
      0 1px black,
      1px 0 black,
      0 -1px black;
  }
}

span.or {
  color: white;
  text-shadow:
    -1px 0 black,
    0 1px black,
    1px 0 black,
    0 -1px black;
}

.no-scores,
.v-table {
  background: none;
  border: 1px solid #999696;
  border-radius: 4px;
  padding: 1rem;
}

.div-link {
  border: 1px solid #999696;
  border-radius: 4px;
  margin: 1rem 0 1rem 0;
  width: auto;
}

.div-link:hover {
  background: aliceblue;
  font-weight: 600;
}
</style>
