import { defineStore } from 'pinia'
import { BehaviorSubject } from 'rxjs'

export const useLoaderHandling = defineStore('loaderHandling', () => {
  const loaderSubject = new BehaviorSubject(false)

  return {
    loaderSubject
  }
})
