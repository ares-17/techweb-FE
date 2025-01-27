import ErrorSnackbar from '@/components/ErrorSnackbar.vue'
import { useErrorHandling } from '@/stores/errorHandling'
import { mount } from '@vue/test-utils'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { BehaviorSubject } from 'rxjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

describe('ErrorSnackbar.vue', () => {

  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  it('Mostra il messaggio di errore quando viene emesso dallo store', async () => {
    const errorHandling = useErrorHandling()
    const TEXT = 'Errore di test';

    const mockSanitizer = {
      sanitizeString: vi.fn(text => text)
    }

    const component = mount(ErrorSnackbar, {
      global: {
        plugins: [vuetify],
        provide: {
          Sanitizer: mockSanitizer
        }
      }
    })

    errorHandling.errorsSubject.next({ display: true, text: TEXT })
    errorHandling.errorsSubject.subscribe(() => {
      vi.advanceTimersByTime(1000)
      expect(component.text()).toContain(TEXT)
      expect(mockSanitizer.sanitizeString).toHaveBeenCalledWith(TEXT)
    })
  })

  it('Nasconde il messaggio di errore dopo 4 secondi', async () => {
    const errorHandling = useErrorHandling()
    const TEXT = 'Errore di test';

    const mockSanitizer = {
      sanitizeString: vi.fn(text => text)
    }

    const component = mount(ErrorSnackbar, {
      global: {
        plugins: [vuetify],
        provide: {
          Sanitizer: mockSanitizer
        }
      }
    })

    errorHandling.errorsSubject.next({ display: true, text: TEXT })
    errorHandling.errorsSubject.subscribe(() => {
      vi.advanceTimersByTime(5000)
      expect(component.text()).toContain('')
      expect(component.vm.snackbar).toBe(false)
      expect(mockSanitizer.sanitizeString).toHaveBeenCalledWith(TEXT)
    })
  })
})