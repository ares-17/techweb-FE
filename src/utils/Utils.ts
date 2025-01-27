import { marked } from 'marked'

export default class Utils {
  public static toMarkdown(value: string) {
    try {
      return marked(value)
    } catch (e) {
      console.log(e)
      return ''
    }
  }
}
