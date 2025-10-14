import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// Inicializar configuración (valida variables de entorno)
import { initConfig } from '@/config/app.config'

// Validar configuración antes de iniciar la app
initConfig()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
