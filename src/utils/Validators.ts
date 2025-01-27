export class Validators {
  /* eslint-disable no-useless-escape */
  static emailRegex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )

  static minLength(value: string, min = 3) {
    return value?.length > min
  }

  static numRange(
    value: string,
    options: { min: number; max: number } = { min: 0, max: Number.MAX_SAFE_INTEGER }
  ) {
    try {
      const numvalue = Number(value)
      return numvalue >= options.min && numvalue <= options.max
    } catch (e) {
      console.log(e)
      return false
    }
  }

  static email(value: string) {
    return Validators.emailRegex.test(value)
  }

  static password(value: string) {
    return value !== undefined && value !== null && value.trim().length >= 7
  }
}
