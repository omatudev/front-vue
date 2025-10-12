import axios, { type AxiosInstance, type AxiosError } from 'axios'

// Configuración base de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requests - agregar token si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de responses - manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Manejo centralizado de errores
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('No autorizado - Token inválido')
          // Aquí podrías redirigir al login
          break
        case 404:
          console.error('Recurso no encontrado')
          break
        case 500:
          console.error('Error del servidor')
          break
        default:
          console.error('Error en la petición:', error.message)
      }
    } else if (error.request) {
      console.error('Sin respuesta del servidor')
    } else {
      console.error('Error al configurar la petición:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
