<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3 mx-auto">
        <v-card class="text-bg-light p-5 w-100" elevation="16" v-if="!!quiz">
          <div class="input-container bg-transparent w-100">
            <div class="pb-5">
              <div class="row">
                <div class="col-12 col-md-6 col-sm-12 col-lg-12 col-xl-12 mb-2">
                  <v-btn rounded="md" color="primary">
                    <v-icon icon="mdi-arrow-left" class="mx-3"></v-icon>
                    {{ $t('go_back_btn') }}
                  </v-btn>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <h1
                v-html="quiz?.title ? Utils.toMarkdown(sanitizer.sanitizeString(quiz?.title)!) : ''"
              ></h1>
            </div>
            <span
              v-html="
                quiz?.description
                  ? Utils.toMarkdown(sanitizer.sanitizeString(quiz?.description)!)
                  : ''
              "
            ></span>
            <v-divider></v-divider>
            <v-form readonly>
              <div class="row">
                <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-2 h-100">
                  <v-text-field
                    v-model="quiz.maxErrors"
                    :label="$t('quiz_istance_errors')"
                  ></v-text-field>
                </div>
                <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-2 h-100">
                  <v-text-field
                    v-model="quiz.questions.length"
                    :label="$t('quiz_istance_num_questions')"
                  ></v-text-field>
                </div>
              </div>
            </v-form>
          </div>
        </v-card>
      </div>

      <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3 mx-auto" v-if="!!quiz">
        <CreateQuestionsWindows
          :quiz="quiz"
          :windows="quiz?.questions?.length"
          @complete="onCompleteQuestions"
        />
      </div>
    </div>
  </div>

  <v-dialog v-model="usernameDialog" width="auto" persistent>
    <template>
      <v-card
        max-width="500"
        prepend-icon="mdi-alert"
        :text="$t('dialog_takequiz_username_text')"
        :title="$t('dialog_takequiz_username_title')"
      >
        <v-form @submit.prevent="onAddUsername">
          <div class="row m-3">
            <div class="col-12">
              <v-text-field
                :label="$t('dialog_takequiz_title_input')"
                variant="outlined"
                v-model="usernameNotLogged"
                required
                hide-details="auto"
                :rules="[minLength]"
              ></v-text-field>
            </div>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :text="$t('dialog_takequiz_username_anonymous_btn')"
              @click="onStayAnonymous"
            ></v-btn>
            <v-btn :text="$t('create_quiz_dialog_ok_btn')" color="primary" type="submit"></v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { ScoreApi, type QuizApi } from '@/api'
import type { QuestionDto, QuizDto } from '@/api/models'
import type { QuestionResponseDto } from '@/api/models/QuestionResponseDto'
import type { QuizResponseDto } from '@/api/models/QuizResponseDto'
import CreateQuestionsWindows from '@/components/create-quiz/CreateQuestionsWindows.vue'
import i18n from '@/i18n/i18n'
import { useSessionStore } from '@/stores/sessionStore'
import { Sanitizer } from '@/utils/Sanitizer'
import Utils from '@/utils/Utils'
import { Validators } from '@/utils/Validators'
import { inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CreateQuiz',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const quizApi = inject('QuizApi') as QuizApi
    const router = useRouter()
    const scoreApi = inject('ScoreApi') as ScoreApi
    const quiz: Ref<QuizDto | undefined> = ref()
    const sessionStorage = useSessionStore()

    const usernameDialog = ref(false)
    const usernameNotLogged: Ref<string | undefined> = ref()
    const USERNAME_ANONYMOUS = 'Anonymous'
    const sanitizer = inject('Sanitizer') as Sanitizer

    onMounted(() => {
      quizApi
        .getQuizById({ uidQuiz: props.id })
        .then((res) => {
          quiz.value = res
          usernameDialog.value = !sessionStorage.getFromSessionStorage('idCustomer')
        })
        .catch((e) => console.log(e))
    })

    function questionToQuestionResponseDto(question: QuestionDto): QuestionResponseDto {
      sanitizer.sanitize(question)
      if (!question) {
        throw new Error('Question in questionToQuestionResponseDto is null')
      }
      if (!question.answers || question.answers?.length === 0) {
        throw new Error('Answers array in questionToQuestionResponseDto is null')
      }

      const answer =
        question.answers?.length === 1
          ? question.answers[0].text
          : question.answers?.find((a) => !!a.isCorrect)?.text

      return {
        answer,
        id: question.id
      }
    }

    function minLength(value: any) {
      return Validators.minLength(value) || i18n.global.t('validators_minlength')
    }

    function onAddUsername() {
      if (
        usernameNotLogged.value &&
        Validators.minLength(sanitizer.sanitizeString(usernameNotLogged.value)!)
      ) {
        usernameDialog.value = false
      }
    }

    function onStayAnonymous() {
      usernameDialog.value = false
      usernameNotLogged.value = USERNAME_ANONYMOUS
    }

    function onCompleteQuestions(questions: QuestionDto[]) {
      const idCustomer = sessionStorage.getFromSessionStorage('idCustomer')
        ? (sanitizer.sanitizeString(sessionStorage.getFromSessionStorage('idCustomer')!) as string)
        : undefined

      const quizResponseDto: QuizResponseDto = {
        id: quiz.value?.id,
        questions: questions.map(questionToQuestionResponseDto),
        isCustomerAnonymous: !idCustomer,
        idCustomer,
        nonAuthenticableUsername:
          usernameNotLogged.value?.trim() !== '' && usernameNotLogged.value !== USERNAME_ANONYMOUS
            ? usernameNotLogged.value
            : undefined
      }
      sanitizer.sanitize(quizResponseDto)
      scoreApi
        .completeQuiz({ quizResponseDto })
        .then(() => router.push({ name: 'quiz-istance', params: { id: props.id } }))
        .catch((e) => console.log(e))
    }

    return {
      quiz,
      Utils,
      onCompleteQuestions,
      usernameDialog,
      minLength,
      usernameNotLogged,
      onAddUsername,
      onStayAnonymous,
      sanitizer
    }
  },
  components: {
    CreateQuestionsWindows
  }
}
</script>

<style scoped></style>
