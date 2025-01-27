import type { Middleware, ResponseContext } from '@/api/models/runtime'
import { useErrorHandling } from '@/stores/errorHandling'
import { useLoaderHandling } from '@/stores/loaderHandling'

export default class LoaderMiddleware implements Middleware {
  counter = 0
  readonly errorHandling = useErrorHandling()
  readonly loaderHandling = useLoaderHandling()

  async pre() {
    //document.getElementById('main-loader')!.style.visibility = "visible";
    this.loaderHandling.loaderSubject.next(true)
    this.counter++
  }

  async post(context: ResponseContext): Promise<void | Response> {
    this.counter--
    if (this.counter === 0) {
      //document.getElementById('main-loader')!.style.visibility = 'hidden';
      this.loaderHandling.loaderSubject.next(false)
    }
    if (context.response.status !== 200) {
      context.response.json().then((val) => {
        this.errorHandling.errorsSubject.next({
          display: true,
          text: val && val.detail ? val.detail : `STATUS_CODE: ${context.response.status}`
        })
      })
    }

    return context.response
  }
}
