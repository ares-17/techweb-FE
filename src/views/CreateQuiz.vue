<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3 mx-auto">
        <div class="stepper-container mx-auto">
          <v-stepper
            hide-actions
            :items="steps"
            v-model="currentStep"
            class="text-bg-light"
            elevation="16"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.1>
              <FirstStepNewQuiz @next="onNextFirstStep" />
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.2>
              <PreviewStepNewQuiz
                v-if="firstStepValues"
                :prev-values="firstStepValues"
                @prev="currentStep = 1"
              />
            </template>
          </v-stepper>
        </div>
      </div>

      <div
        class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3 mx-auto"
        v-if="firstStepValues?.numQuestions && firstStepValues?.numQuestions > 0"
      >
        <CreateQuestionsWindows
          :windows="firstStepValues?.numQuestions"
          @complete="onCompleteQuestions"
        />
      </div>
    </div>
  </div>

  <v-dialog v-model="showDialog" width="auto">
    <v-card
      max-width="500"
      prepend-icon="mdi-alert"
      :text="$t('create_quiz_dialog_text')"
      :title="$t('create_quiz_dialog_title')"
    >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :text="$t('create_quiz_dialog_close_btn')" @click="hideConfirmDialog"></v-btn>
        <v-btn :text="$t('create_quiz_dialog_ok_btn')" @click="createQuiz"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" timeout="5000">{{ snackbarText }}</v-snackbar>
</template>

<script lang="ts">
import type { QuizApi } from '@/api'
import type { QuestionDto, QuizDto } from '@/api/models'
import CreateQuestionsWindows from '@/components/create-quiz/CreateQuestionsWindows.vue'
import FirstStepNewQuiz from '@/components/create-quiz/FirstStepNewQuiz.vue'
import PreviewStepNewQuiz from '@/components/create-quiz/PreviewStepNewQuiz.vue'
import i18n from '@/i18n/i18n'
import { useSessionStore } from '@/stores/sessionStore'
import { Sanitizer } from '@/utils/Sanitizer'
import { inject, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CreateQuiz',
  setup() {
    const steps = ref([
      i18n.global.t('createquiz_title'),
      i18n.global.t('createquiz_title_preview')
    ])
    const firstStepValues: Ref<any> = ref()
    const currentStep = ref(1)
    const showDialog = ref(false)
    const snackbar = ref(false)
    const questions: Ref<QuestionDto[]> = ref([])
    const snackbarText = ref('')
    const quizApi = inject('QuizApi') as QuizApi
    const sessionStorage = useSessionStore()
    const router = useRouter()
    const sanitizer = inject('Sanitizer') as Sanitizer

    function onNextFirstStep(value: any) {
      sanitizer.sanitize(value)
      firstStepValues.value = value
      currentStep.value = 2
    }

    function showConfirmDialog() {
      showDialog.value = true
    }

    function hideConfirmDialog() {
      showDialog.value = false
    }

    function onCompleteQuestions(values: QuestionDto[]) {
      if (hasErrors(values)) {
        return
      }
      questions.value = values
      showConfirmDialog()
    }

    function hasErrors(questions: QuestionDto[]) {
      sanitizer.sanitize(firstStepValues.value)
      return (
        !firstStepValues.value ||
        isEmptyString(firstStepValues.value?.title) ||
        isEmptyString(firstStepValues.value?.description) ||
        !questions ||
        questions?.length !== Number(firstStepValues.value?.numQuestions)
      )
    }

    function isEmptyString(str: string) {
      return !str || str?.trim() === ''
    }

    function createQuiz() {
      hideConfirmDialog()
      const quiz: QuizDto = {
        questions: questions.value,
        title: firstStepValues.value.title,
        description: firstStepValues.value.description,
        maxErrors: firstStepValues.value.numMaxErrors,
        createdBy: sessionStorage.getFromSessionStorage('idCustomer') as string
      }
      sanitizer.sanitize(quiz)
      quizApi
        .createQuiz({ quizDto: quiz })
        .then((res) => {
          router.push({ name: 'quiz-istance', params: { id: sanitizer.sanitizeString(res.id!) } })
        })
        .catch((e) => console.log(e))
    }

    return {
      steps,
      onNextFirstStep,
      currentStep,
      firstStepValues,
      onCompleteQuestions,
      showDialog,
      hideConfirmDialog,
      createQuiz,
      snackbar,
      snackbarText
    }
  },
  components: {
    FirstStepNewQuiz,
    PreviewStepNewQuiz,
    CreateQuestionsWindows
  }
}
</script>

<style scoped>
div.row div {
  min-height: 20rem;
}
div.v-stepper-header {
  background-color: var(--bs-card-cap-bg);
}
</style>
