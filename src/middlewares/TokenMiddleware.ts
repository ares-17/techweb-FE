import type { Middleware } from '@/api/models/runtime'
import { useSessionStore } from '@/stores/sessionStore'

export default class TokenMiddleware implements Middleware {
  async pre(context: any) {
    const sessionStorage = useSessionStore()
    const token = sessionStorage.getFromSessionStorage('token')
    if (token) {
      ;(context.init.headers as any)['Authorization'] = `Bearer ${token}`
    }
    ;(context.init.headers as any)['Content-Type'] = 'application/json'
    ;(context.init.headers as any)['Connection'] = 'keep-alive'
    ;(context.init.headers as any)['Accept-Encoding'] = 'gzip, deflate, br'
    ;(context.init.headers as any)['Accept'] = '*/*'
    ;(context.init.headers as any)['Host'] = 'localhost:8084'
    return context
  }
}
