import { defineStore } from 'pinia'
import { BehaviorSubject } from 'rxjs'

export const useErrorHandling = defineStore('errorHandling', () => {
  const errorsSubject = new BehaviorSubject({ display: false, text: '' })

  return {
    errorsSubject
  }
})
