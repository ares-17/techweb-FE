import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap/dist/css/bootstrap.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { AuthApi, QuestionsApi, QuizApi, ScoreApi, UserApi } from './api'
import i18n from './i18n/i18n'
import router from './router'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { Configuration } from './api/models/runtime'
import LoaderMiddleware from './middlewares/LoaderMiddleware'
import TokenMiddleware from './middlewares/TokenMiddleware'
import { Sanitizer } from './utils/Sanitizer'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives
})

app.use(createPinia())
app.use(vuetify)
app.use(router)
app.use(i18n)

const defaultConfig = new Configuration({
  middleware: [new TokenMiddleware(), new LoaderMiddleware()]
})

app.provide('QuestionsApi', new QuestionsApi(defaultConfig))
app.provide('QuizApi', new QuizApi(defaultConfig))
app.provide('UserApi', new UserApi(defaultConfig))
app.provide('ScoreApi', new ScoreApi(defaultConfig))
app.provide('AuthApi', new AuthApi(defaultConfig))
app.provide('Sanitizer', new Sanitizer(router))

app.mount('#app')
