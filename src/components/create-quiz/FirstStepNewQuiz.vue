<template>
  <div class="row">
    <h2 class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 mb-4 p-3 mx-auto">
      {{ $t('createquiz_title') }}
    </h2>
    <form @submit.prevent="onNext">
      <div class="row">
        <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-3">
          <v-text-field
            :label="$t('createquiz_titlequiz')"
            variant="outlined"
            ref="values.title"
            v-model="values.title"
            required
            hide-details="auto"
            :rules="[minLength]"
          ></v-text-field>
        </div>
        <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-6 mb-3">
          <v-text-field
            :label="$t('createquiz_description')"
            variant="outlined"
            ref="values.description"
            v-model="values.description"
            required
            hide-details="auto"
            :rules="[minLength]"
          ></v-text-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-12 col-sm-12 col-lg-6 col-xl-6 mb-3">
          <v-text-field
            type="number"
            :label="$t('createquiz_numQuestions')"
            :rules="[rangeQuestions]"
            variant="outlined"
            ref="values.numQuestions"
            v-model="values.numQuestions"
            required
            hide-details="auto"
          ></v-text-field>
        </div>
        <div class="col-12 col-md-12 col-sm-12 col-lg-6 col-xl-6 mb-3">
          <v-text-field
            type="number"
            :disabled="!values.numQuestions || values.numQuestions < 0 || values.numQuestions > 30"
            :label="$t('createquiz_max_errors')"
            :rules="[rangeMaxErrors]"
            variant="outlined"
            ref="values.numMaxErrors"
            v-model="values.numMaxErrors"
            required
            hide-details="auto"
          ></v-text-field>
        </div>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" type="submit">
          {{ $t('question_component_next') }}
        </v-btn>
      </v-card-actions>
    </form>
  </div>
</template>

<script lang="ts">
import { Validators } from '@/utils/Validators'
import { defineComponent, inject, ref, type Ref } from 'vue'
import i18n from '@/i18n/i18n'
import type { QuizCreation } from '@/api/models/QuizCreation'
import { Sanitizer } from '@/utils/Sanitizer'

export default defineComponent({
  name: 'FirstStepNewQuiz',
  emits: ['next', 'update:counter'],
  setup(_, { emit }) {
    const values: Ref<QuizCreation> = ref({})
    const sanitizer = inject('Sanitizer') as Sanitizer

    function onNext() {
      if (hasNoErrors()) {
        emit('update:counter', values.value.numQuestions)
        emit('next', values.value)
      }
    }

    function hasNoErrors(): boolean {
      sanitizer.sanitize(values.value)
      return (
        !!values.value?.title &&
        !!values.value?.description &&
        values.value?.numMaxErrors !== undefined &&
        values.value.numMaxErrors !== null &&
        values.value?.numQuestions !== undefined &&
        values.value.numQuestions !== null &&
        Validators.minLength(values.value.title) &&
        Validators.minLength(values.value.description) &&
        Validators.numRange((values.value?.numQuestions || 0).toString(), { min: 1, max: 30 }) &&
        values.value.numMaxErrors > -1 &&
        values.value.numMaxErrors < values.value.numQuestions
      )
    }

    function minLength(value: any) {
      return Validators.minLength(value) || i18n.global.t('validators_minlength')
    }

    function onUpdateCounter(val: number) {
      values.value.numQuestions = val
    }

    function rangeQuestions(value: number | undefined | null) {
      return (
        (!!value && value < 31 && value > 0) ||
        i18n.global.t('validators_numRange', { min: 1, max: 30 })
      )
    }

    function rangeMaxErrors(value: number | undefined | null) {
      return (
        (!!value &&
          values.value?.numQuestions &&
          value < values.value?.numQuestions &&
          value > -1) ||
        i18n.global.t('validators_numRange', { min: 0, max: values.value?.numQuestions })
      )
    }

    return {
      values,
      Validators,
      minLength,
      onNext,
      onUpdateCounter,
      rangeQuestions,
      rangeMaxErrors
    }
  },
  components: {}
})
</script>

<style></style>
