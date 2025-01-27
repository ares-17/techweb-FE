<template>
  <div class="row w-100">
    <div class="col-12" v-if="!question">
      <v-radio-group
        v-model="typeOfQuest"
        :mandatory="true"
        inline
        @update:model-value="resetAnswers"
      >
        <v-radio label="Risposta singola" value="open" class="me-2"></v-radio>
        <v-radio label="Risposte multiple" value="closed"></v-radio>
      </v-radio-group>
    </div>

    <v-divider></v-divider>

    <form @submit.prevent="onConfirmQuestion">
      <div class="col-12">
        <v-text-field
          :label="$t('create_question_title')"
          variant="outlined"
          class="mb-3 ms-1"
          :readonly="!!question"
          v-model="questionRef.title"
          required
          hide-details="auto"
          :rules="[minLength]"
        ></v-text-field>
        <div v-if="typeOfQuest === 'open'">
          <v-textarea
            label="Label"
            variant="outlined"
            required
            :rules="[minLength]"
            class="ms-1"
            @update:model-value="updateSingleAnswer"
          ></v-textarea>
        </div>
        <div v-else class="w-100">
          <v-radio-group @update:model-value="onClickRadio" row :mandatory="true">
            <div class="col-12">
              <v-radio :value="0" class="d-flex align-center" required>
                <template v-slot:label>
                  <div v-if="!question" class="w-100">
                    <v-text-field
                      variant="outlined"
                      required
                      :rules="[minLength]"
                      @update:model-value="(val) => updateAnswer(0, val)"
                      :label="$t('craete_question_answer1')"
                      class="ml-3 mt-2"
                    ></v-text-field>
                  </div>
                  <div v-else class="ml-3 w-100 py-4">
                    <span v-html="sanitizer.sanitizeString(question?.answers[0]?.text)"></span>
                  </div>
                </template>
              </v-radio>
            </div>
            <div class="col-12">
              <v-radio :value="1" class="d-flex align-center" required>
                <template v-slot:label>
                  <div v-if="!question" class="w-100">
                    <v-text-field
                      variant="outlined"
                      required
                      :rules="[minLength]"
                      @update:model-value="(val) => updateAnswer(1, val)"
                      :label="$t('craete_question_answer2')"
                      class="ml-3 mt-2"
                    ></v-text-field>
                  </div>
                  <div v-else class="ml-3 w-100 py-4">
                    <span v-html="sanitizer.sanitizeString(question?.answers[1]?.text)"></span>
                  </div>
                </template>
              </v-radio>
            </div>
            <div class="col-12">
              <v-radio :value="2" class="d-flex align-center" required>
                <template v-slot:label>
                  <div v-if="!question" class="w-100">
                    <v-text-field
                      variant="outlined"
                      required
                      :rules="[minLength]"
                      @update:model-value="(val) => updateAnswer(2, val)"
                      :label="$t('craete_question_answer3')"
                      class="ml-3 mt-2"
                    ></v-text-field>
                  </div>
                  <div v-else class="ml-3 w-100 py-4">
                    <span v-html="sanitizer.sanitizeString(question?.answers[2]?.text)"></span>
                  </div>
                </template>
              </v-radio>
            </div>
            <div class="col-12">
              <v-radio :value="3" class="d-flex align-center" required>
                <template v-slot:label>
                  <div v-if="!question" class="w-100">
                    <v-text-field
                      variant="outlined"
                      required
                      :rules="[minLength]"
                      @update:model-value="(val) => updateAnswer(3, val)"
                      :label="$t('craete_question_answer4')"
                      class="ml-3 mt-2"
                    ></v-text-field>
                  </div>
                  <div v-else class="ml-3 w-100 py-4">
                    <span v-html="sanitizer.sanitizeString(question?.answers[3]?.text)"></span>
                  </div>
                </template>
              </v-radio>
            </div>
          </v-radio-group>
          <div
            v-if="
              submitted &&
              questionRef.answers?.every((a) => a.isCorrect === false) &&
              questionRef?.answers?.length === 4
            "
          >
            <span class="text-danger text-center">Selezionare una risposta come corretta</span>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="row w-100 mx-auto">
          <div v-if="index > 1" class="col-12 col-md-6 col-sm-12 col-lg-6 col-xl-6 m-2 mx-auto">
            <v-btn variant="text" @click="$emit('click:prev', questionRef)" class="mx-auto">
              {{ $t('question_component_back') }}
            </v-btn>
          </div>
          <v-spacer v-if="index > 1"></v-spacer>
          <div class="col-12 col-md-6 col-sm-12 col-lg-6 col-xl-6 m-2 mx-auto">
            <v-btn
              class="w-100 text-center mx-auto"
              v-if="index !== total"
              type="submit"
              color="primary"
              variant="flat"
            >
              {{ $t('question_component_next') }}
            </v-btn>
            <v-btn
              class="w-100 text-center mx-auto"
              v-else
              color="primary"
              type="submit"
              variant="flat"
            >
              {{ $t('question_component_last_next') }}
            </v-btn>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import type { QuestionDto } from '@/api/models'
import i18n from '@/i18n/i18n'
import { Sanitizer } from '@/utils/Sanitizer'
import { Validators } from '@/utils/Validators'
import { defineComponent, inject, ref, type PropType, type Ref } from 'vue'
import { VRadio, VRadioGroup } from 'vuetify/components'

export default defineComponent({
  props: {
    index: {
      type: Number,
      required: true,
      default: -1
    },
    total: {
      type: Number,
      requried: true,
      default: 0
    },
    question: {
      type: Object as PropType<QuestionDto>,
      required: false
    }
  },
  emits: ['click:prev', 'click:next', 'click:complete'],
  setup(props, { emit }) {
    const questionRef: Ref<Partial<QuestionDto>> = ref(props.question || {})
    const typeOfQuest: Ref<'open' | 'closed'> = props.question?.answers
      ? ref(props.question?.answers?.length === 1 ? 'open' : 'closed')
      : ref('open')
    const submitted = ref(false)
    const sanitizer = inject('Sanitizer') as Sanitizer

    const correctAnswer: Ref<undefined | number> = ref(undefined)

    function minLength(value: any) {
      return Validators.minLength(value) || i18n.global.t('validators_minlength')
    }

    function noNull(value: any) {
      return (
        (value !== null && value !== undefined) || 'Seleziona almeno una risposta come corretta'
      )
    }

    function resetAnswers() {
      submitted.value = false
      questionRef.value.answers = undefined
    }

    function updateSingleAnswer(value: string) {
      submitted.value = true
      questionRef.value.answers = [
        {
          isCorrect: true,
          text: value
        }
      ]
    }

    function updateAnswer(index: number, value: string) {
      submitted.value = true
      if (!questionRef.value?.answers) {
        questionRef.value.answers = []
      }
      if (!questionRef.value.answers[index]) {
        questionRef.value.answers[index] = {
          isCorrect: false,
          text: value
        }
      }
      questionRef.value.answers[index].text = value
    }

    function onClickRadio(index: any) {
      submitted.value = true
      if (!questionRef.value?.answers) {
        questionRef.value.answers = []
      }
      if (!questionRef.value.answers[index]) {
        questionRef.value.answers[index] = {
          isCorrect: true,
          text: ''
        }
      }
      questionRef.value.answers = questionRef.value?.answers?.map((a, i) => ({
        ...a,
        isCorrect: i === index
      }))
    }

    function onConfirmQuestion() {
      submitted.value = true
      if (hasErrors()) {
        return
      }
      emit(props.index === props.total ? 'click:complete' : 'click:next', questionRef.value)
    }

    function hasErrors() {
      return !questionRef.value?.title ||
        !questionRef.value.answers ||
        typeOfQuest.value === 'closed'
        ? hasErrorsMultipleAnswers()
        : hasErrorsSingleAnswer()
    }

    function hasErrorsSingleAnswer(): boolean {
      return (
        questionRef.value.answers?.length !== 1 || questionRef.value.answers[0]?.text?.trim() === ''
      )
    }

    function hasErrorsMultipleAnswers(): boolean | undefined {
      return (
        questionRef.value!.answers!.length !== 4 ||
        questionRef.value.answers?.some((a) => !a.text || a.text?.trim() === '')
      )
    }

    return {
      typeOfQuest,
      minLength,
      questionRef,
      resetAnswers,
      updateSingleAnswer,
      updateAnswer,
      correctAnswer,
      onClickRadio,
      onConfirmQuestion,
      noNull,
      submitted,
      sanitizer
    }
  },
  components: {
    VRadio,
    VRadioGroup
  }
})
</script>

<style>
.v-label.v-label--clickable {
  width: 100%;
}

.v-field--center-affix .v-label.v-field-label {
  height: auto !important;
}
</style>
