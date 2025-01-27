<template>
  <div v-if="windowsRef && windowsRef !== 0" class="h-100">
    <div class="card h-100 w-100 text-bg-light elevated p-4">
      <div class="card-body d-flex justify-center align-center h-100 w-100">
        <v-window v-model="currentWindow" class="h-100 w-100" v-if="!quiz">
          <v-window-item v-for="step in windowsRef" :key="step">
            <v-card class="d-flex flex-column h-100 text-bg-light">
              <h2 class="mb-4 mt-1">
                {{ $t('create_question_num_title', { current: step, total: windowsRef }) }}
              </h2>
              <CreateQuestionComponent
                :index="step"
                :total="windowsRef"
                @click:complete="(q) => onClickComplete(step - 1, q)"
                @click:next="(q) => onClickNextWindow(step - 1, q)"
                @click:prev="(q) => onClickPrevWindow(step - 1, q)"
              />
            </v-card>
          </v-window-item>
        </v-window>

        <v-window v-model="currentWindow" class="h-100 w-100" v-else>
          <v-window-item v-for="(question, i) in quiz.questions" :key="question.id">
            <v-card class="d-flex flex-column h-100 text-bg-light">
              <h2 class="text-center mb-4 mt-1">
                {{
                  $t('create_question_num_title', { current: i + 1, total: quiz.questions?.length })
                }}
              </h2>
              <CreateQuestionComponent
                :question="question"
                :index="i + 1"
                :total="quiz.questions?.length"
                @click:complete="(q) => onClickComplete(i, q)"
                @click:next="(q) => onClickNextWindow(i, q)"
                @click:prev="(q) => onClickPrevWindow(i, q)"
              />
            </v-card>
          </v-window-item>
        </v-window>
      </div>
    </div>
  </div>
  <div v-else class="card h-100 text-bg-light elevated">
    <div class="card-header header-domande">Sezione domande del quiz</div>
    <div class="card-body d-flex justify-center align-center h-100">
      <span>Seleziona il numero di domande del quiz</span>
    </div>
  </div>
</template>

<script lang="ts">
import type { QuestionDto, QuizDto } from '@/api/models'
import type { PropType, Ref } from 'vue'
import { defineComponent, inject, ref, watch } from 'vue'
import CreateQuestionComponent from './CreateQuestionComponent.vue'
import type { Sanitizer } from '@/utils/Sanitizer'

export default defineComponent({
  name: 'CreateQuestionsWindows',
  props: {
    windows: {
      type: Number,
      required: false,
      default: 0
    },
    quiz: {
      type: Object as PropType<QuizDto>,
      required: false
    }
  },
  emits: ['complete'],
  setup(props, { emit }) {
    const currentWindow = ref(0)
    const windowsRef = ref(Number(props.windows))
    watch(
      () => props.windows,
      () => {
        windowsRef.value = Number(props.windows)
        currentWindow.value = 0
      }
    )
    const sanitizer = inject('Sanitizer') as Sanitizer
    const questions: Ref<Partial<QuestionDto>[]> = ref([])

    function onClickPrevWindow(index: number, question: QuestionDto) {
      questions.value[index] = question
      if (currentWindow.value === 0) {
        return
      }
      currentWindow.value -= 1
    }

    function onClickNextWindow(index: number, question: QuestionDto) {
      questions.value[index] = question
      if (currentWindow.value === Number(windowsRef.value) - 1) {
        return
      }
      currentWindow.value += 1
    }

    function onClickComplete(index: number, question: QuestionDto) {
      questions.value[index] = question
      emit('complete', questions.value)
    }

    return {
      windowsRef,
      currentWindow,
      onClickPrevWindow,
      onClickComplete,
      onClickNextWindow,
      questions,
      sanitizer
    }
  },
  components: {
    CreateQuestionComponent
  }
})
</script>
<style>
div.v-window {
  height: 100%;
}

div.v-window__container {
  height: 100%;
}

div.v-window-item {
  height: 100%;
}

div.header-domande {
  height: 5rem;
  display: flex;
  align-items: center;
  box-shadow:
    0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 5px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));
}

.elevated {
  box-shadow:
    0px 8px 10px -5px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 16px 24px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 6px 30px 5px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12)) !important;
}
</style>
