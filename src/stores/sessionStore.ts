import type { AuthenticationDto } from '@/api/models'
import CryptoJS from 'crypto-js'
import { defineStore } from 'pinia'
import { BehaviorSubject } from 'rxjs'

export const useSessionStore = defineStore('sessionStore', () => {
  const sessionStorageSubject = new BehaviorSubject(getAllSessionStorage())
  const isLoggedSubject = new BehaviorSubject(isLoggedIn(getAllSessionStorage()))

  function isLoggedIn(store: any): boolean {
    return !!store.token && !!store.expiresIn
  }

  function saveToSessionStorage(key: string, value: string) {
    const secretKey = import.meta.env.VITE_SECRET_KEY
    if (!secretKey) {
      throw new Error('VITE_SECRET_KEY is not defined')
    }
    const encryptedVal = CryptoJS.AES.encrypt(value, secretKey).toString()
    sessionStorage.setItem(key, encryptedVal)
    sessionStorageSubject.next(getAllSessionStorage())
    isLoggedSubject.next(isLoggedIn(getAllSessionStorage()))
  }

  function getFromSessionStorage(key: string) {
    const secretKey = import.meta.env.VITE_SECRET_KEY
    if (!secretKey) {
      throw new Error('VITE_SECRET_KEY is not defined')
    }
    const encryptedVal = sessionStorage.getItem(key)
    if (encryptedVal) {
      const bytes = CryptoJS.AES.decrypt(encryptedVal, secretKey)
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8)
      return decryptedToken
    }
    return null
  }

  function removeSessionStorageItem(key: string) {
    sessionStorage.removeItem(key)
    sessionStorageSubject.next(getAllSessionStorage())
    isLoggedSubject.next(isLoggedIn(getAllSessionStorage()))
  }

  function saveUserToSessionStorage(dto: AuthenticationDto, email: string) {
    const secretKey = import.meta.env.VITE_SECRET_KEY
    if (!secretKey) {
      throw new Error('VITE_SECRET_KEY is not defined')
    }
    cryptAndSave('token', dto.token, secretKey)
    cryptAndSave('expiresIn', dto.expiresIn?.toString(), secretKey)
    cryptAndSave('username', email, secretKey)
    cryptAndSave('idCustomer', dto.idCustomer, secretKey)

    sessionStorageSubject.next(getAllSessionStorage())
    isLoggedSubject.next(isLoggedIn(getAllSessionStorage()))
  }

  function removeUser() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('expiresIn')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('idCustomer')
    sessionStorageSubject.next(getAllSessionStorage())
    isLoggedSubject.next(isLoggedIn(getAllSessionStorage()))
  }

  function cryptAndSave(key: any, value: any, secretKey: any) {
    const encryptedVal = CryptoJS.AES.encrypt(value, secretKey).toString()
    sessionStorage.setItem(key, encryptedVal)
  }

  function getAllSessionStorage() {
    const store: any = {}
    for (let i = 0; i < sessionStorage.length; i++) {
      const key: any = sessionStorage.key(i)
      store[key] = sessionStorage.getItem(key)
    }
    return store
  }

  return {
    saveToSessionStorage,
    getFromSessionStorage,
    removeSessionStorageItem,
    isLoggedSubject,
    sessionStorageSubject,
    saveUserToSessionStorage,
    removeUser
  }
})
