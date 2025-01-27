import DOMPurify from 'dompurify'
import { type Router } from 'vue-router'

export class Sanitizer {
  private router?: Router

  constructor(router: Router) {
    this.router = router
  }

  public sanitize(values: object): void {
    for (const [, value] of Object.entries(values)) {
      if (typeof value === 'string') {
        const sanitizedValue = DOMPurify.sanitize(value)

        if (sanitizedValue !== value) {
          this.router?.push({ name: 'under-attack' })
        }
      } else if (typeof value === 'object') {
        this.sanitize(value)
      }
    }
  }

  public sanitizeString(str: string | undefined): string | undefined {
    if (!str) {
      return str
    }
    const sanitizedValue = DOMPurify.sanitize(str)
    if (sanitizedValue !== str) {
      this.router?.push({ name: 'under-attack' })
    }
    return sanitizedValue
  }
}
