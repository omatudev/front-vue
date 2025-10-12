# 🏗️ Arquitectura Hexagonal del Proyecto# 🏗️ Arquitectura del Proyecto - Hexagonal (Ports & Adapters)

Este proyecto implementa **arquitectura hexagonal simplificada** (Ports & Adapters) adaptada para Vue 3 + TypeScript.## 📋 Tabla de Contenidos

## 🎯 Principios Fundamentales- [Descripción General](#descripción-general)

- [Estructura de Carpetas](#estructura-de-carpetas)

1. **Dependency Inversion**: El dominio no depende de infraestructura- [Flujo de Datos](#flujo-de-datos)

2. **Repository Pattern**: Contratos que abstraen el origen de datos (API/Store)- [Capas de la Arquitectura](#capas-de-la-arquitectura)

3. **Service Layer**: Lógica de negocio aislada que decide cuándo usar API o Store- [Ejemplos de Uso](#ejemplos-de-uso)

4. **Single Responsibility**: Cada clase/módulo tiene una única responsabilidad- [Mejores Prácticas](#mejores-prácticas)

5. **Cache-First Strategy**: Verificar Store antes de consultar API

## 🎯 Descripción General

## 🔄 Flujo de Datos

Este proyecto implementa una **arquitectura hexagonal simplificada** (Ports & Adapters) adaptada para Vue 3 + TypeScript. La idea principal es separar las responsabilidades en capas bien definidas mediante contratos (interfaces), permitiendo intercambiar implementaciones sin afectar la lógica de negocio.

`````

┌──────────────────────────────────────────┐### Principios Fundamentales

│        VISTA (UsersView.vue)             │ ← Presentación

└──────────────────────────────────────────┘1. **Dependency Inversion**: El dominio no depende de infraestructura

                  ↓ usa2. **Repository Pattern**: Contratos que abstraen el origen de datos (API/Store)

┌──────────────────────────────────────────┐3. **Use Cases**: Lógica de negocio aislada que decide cuándo usar API o Store

│     COMPOSABLE (useUser.ts)              │ ← Interfaz Vue4. **Single Responsibility**: Cada clase/módulo tiene una única responsabilidad

│  • Loading states                        │5. **Type Safety**: TypeScript estricto con interfaces explícitas

│  • Error handling                        │

│  • Métodos simples                       │## 📁 Estructura de Carpetas

└──────────────────────────────────────────┘

                  ↓ ejecuta```

┌──────────────────────────────────────────┐src/

│        SERVICE (GetAll)                  │ ← Lógica de negocio├── domain/                      # 🎯 CAPA DE DOMINIO (Núcleo)

│  • Decide: ¿Store o API?                 ││   ├── entities/               # Modelos de negocio

│  • Orquesta repositorios                 ││   │   └── User.ts            # Entidad User + DTOs

│  • Sincroniza Store                      ││   └── repositories/           # Contratos (Interfaces)

└──────────────────────────────────────────┘│       └── IUserRepository.ts # Interface del repositorio

            ↓                    ↓│

    ┌───────────────┐    ┌───────────────┐├── services/                   # 🎬 CASOS DE USO (Lógica de negocio)

    │ IUserRepository│    │ IUserRepository│ ← Contratos│   └── user/

    │  (Interface)  │    │  (Interface)  ││       ├── GetAllUsers.ts     # Decide: Store o API

    └───────────────┘    └───────────────┘│       ├── GetUserById.ts     # Decide: Store o API

            ↓                    ↓│       ├── CreateUser.ts      # Siempre API + actualiza Store

┌─────────────────────┐  ┌─────────────────────┐│       ├── UpdateUser.ts      # API + sincroniza Store

│ UserApiRepository   │  │ UserStoreRepository │ ← Implementaciones│       └── DeleteUser.ts      # API + limpia Store

│ (Axios)             │  │ (Pinia Store)       ││

└─────────────────────┘  └─────────────────────┘├── repositories/                # 🔌 IMPLEMENTACIONES (Adaptadores)

            ↓                    ↓│   ├── UserApiRepository.ts   # Implementa IUserRepository con Axios

    ┌──────────────┐     ┌──────────────┐│   └── UserStoreRepository.ts # Implementa IUserRepository con Pinia

    │  Backend API │     │  Pinia Store ││

    └──────────────┘     └──────────────┘├── stores/                      # 💾 ESTADO GLOBAL (Pinia)

```│   └── user.store.ts          # Store de usuarios (cache)

│

## 📦 Capas de la Arquitectura├── api/                         # 🌐 CONFIGURACIÓN HTTP

│   └── client.ts              # Axios con interceptors

### 1. Domain Layer (Núcleo)│

├── composables/                 # 🎨 CAPA DE PRESENTACIÓN

**Ubicación**: `src/domain/`│   └── useUser.ts             # Expone services a las vistas

│

**Responsabilidad**: Define entidades de negocio y contratos (interfaces).├── views/                       # 📄 VISTAS

│   └── UsersView.vue          # Consume composables

```typescript│

// domain/entities/User.ts├── components/                  # 🧩 COMPONENTES

export interface User {├── layouts/                     # 📐 LAYOUTS

  id: number├── router/                      # 🛣️ RUTAS

  name: string├── utils/                       # 🛠️ UTILIDADES

  email: string└── assets/                      # 🎨 ASSETS

}```



export type CreateUserDTO = Omit<User, 'id'>## 🔄 Flujo de Datos (Arquitectura Hexagonal)

export type UpdateUserDTO = Partial<User> & { id: number }

### Arquitectura en Capas

// domain/repositories/IUserRepository.ts

export interface IUserRepository {```

  getAll(): Promise<User[]>┌──────────────────────────────────────────┐

  getById(id: number): Promise<User>│        VISTA (UsersView.vue)             │ ← Presentación

  create(data: CreateUserDTO): Promise<User>└──────────────────────────────────────────┘

  update(data: UpdateUserDTO): Promise<User>                  ↓ usa

  delete(id: number): Promise<boolean>┌──────────────────────────────────────────┐

}│     COMPOSABLE (useUser.ts)              │ ← Interfaz Vue

```│  • Loading states                        │

│  • Error handling                        │

**Reglas**:│  • Métodos simples para vistas           │

- No importa nada de infraestructura (API, Store, Vue)└──────────────────────────────────────────┘

- Solo tipos e interfaces                  ↓ ejecuta

- Es el núcleo inmutable┌──────────────────────────────────────────┐

│        USE CASES (GetAllUsers)           │ ← Lógica de negocio

### 2. Service Layer (Lógica de Negocio)│  • Decide: ¿Store o API?                 │

│  • Orquesta repositorios                 │

**Ubicación**: `src/services/{entidad}/`│  • Sincroniza Store después de API       │

└──────────────────────────────────────────┘

**Responsabilidad**: Implementa la lógica de negocio y decide cuándo usar API o Store.            ↓                    ↓

    ┌───────────────┐    ┌───────────────┐

```typescript    │  REPOSITORY   │    │  REPOSITORY   │  ← Contratos

// services/user/GetAll.ts    │   (Interface) │    │   (Interface) │

import type { User } from '@/domain/entities/User'    └───────────────┘    └───────────────┘

import type { IUserRepository } from '@/domain/repositories/IUserRepository'            ↓                    ↓

import { UserApiRepository } from '@/repositories/UserApiRepository'┌─────────────────────┐  ┌─────────────────────┐

import { useUserStore } from '@/stores/user.store'│ UserApiRepository   │  │ UserStoreRepository │ ← Implementaciones

│ (Axios)             │  │ (Pinia Store)       │

export class GetAll {└─────────────────────┘  └─────────────────────┘

  private apiRepository: IUserRepository            ↓                    ↓

  private store = useUserStore()    ┌──────────────┐     ┌──────────────┐

    │  Backend API │     │  Pinia Store │

  constructor() {    └──────────────┘     └──────────────┘

    this.apiRepository = new UserApiRepository()```

  }

### Estrategia de Cache Inteligente

  async execute(forceRefresh = false): Promise<User[]> {

    // 1. Cache-first: verificar Store**Primera carga de usuarios:**

    if (!forceRefresh && this.store.allUsers.length > 0) {

      console.log('💾 Using cached users from Store')1. Vista llama `fetchUsers()`

      return this.store.allUsers2. Composable ejecuta `GetAllUsersUseCase`

    }3. Use Case verifica: ¿Store vacío?

4. **Sí está vacío** → Usa `UserApiRepository` → Llama API

    // 2. No hay cache: consultar API5. Guarda resultado en Store

    console.log('📡 Fetching users from API...')6. Retorna usuarios

    const users = await this.apiRepository.getAll()

    **Segunda carga (datos cacheados):**

    // 3. Guardar en Store para futuros accesos

    this.store.setUsers(users)1. Vista llama `fetchUsers()`

    2. Use Case verifica: ¿Store tiene datos?

    return users3. **Sí tiene datos** → Usa `UserStoreRepository` → Lee del Store

  }4. Retorna usuarios (sin llamar API) 💾

}

```**Forzar refresh:**



**Patrón Cache-First**:```typescript

1. ¿Hay datos en Store y no es `forceRefresh`? → Usar Store 💾fetchUsers(true) // forceRefresh = true, siempre API

2. Si no → Consultar API 📡```

3. Guardar resultado en Store para próxima vez

4. Retornar datos## 🏛️ Capas de la Arquitectura



**Mutaciones (Create/Update/Delete)**:### 1️⃣ Domain Layer (Dominio)

```typescript

// services/user/Create.ts**Responsabilidad**: Definir entidades y contratos.

export class Create {

  async execute(data: CreateUserDTO): Promise<User> {**Archivos**:

    // 1. SIEMPRE consultar API primero

    const newUser = await this.apiRepository.create(data)- `domain/entities/User.ts` - Entidad de negocio

    - `domain/repositories/IUserRepository.ts` - Contrato del repositorio

    // 2. Actualizar Store con el nuevo dato

    this.store.setUser(newUser)**Características**:



    return newUser- ✅ Sin dependencias externas

  }- ✅ Interfaces puras

}- ✅ Modelos de dominio

```- ✅ DTOs (Data Transfer Objects)



### 3. Repository Layer (Adaptadores)**Ejemplo**:



**Ubicación**: `src/repositories/````typescript

// domain/entities/User.ts

**Responsabilidad**: Implementaciones concretas de las interfaces del dominio.export interface User {

  id: number

#### API Repository (Datos externos)  name: string

  email: string

```typescript}

// repositories/UserApiRepository.ts

import apiClient from '@/api/client'// domain/repositories/IUserRepository.ts

import type { User, CreateUserDTO, UpdateUserDTO } from '@/domain/entities/User'export interface IUserRepository {

import type { IUserRepository } from '@/domain/repositories/IUserRepository'  getAll(): Promise<User[]>

  getById(id: number): Promise<User | null>

export class UserApiRepository implements IUserRepository {}

  async getAll(): Promise<User[]> {```

    const { data } = await apiClient.get<User[]>('/users')

    return data### 2️⃣ Use Cases Layer (Casos de Uso)

  }

**Responsabilidad**: Lógica de negocio que orquesta repositorios.

  async getById(id: number): Promise<User> {

    const { data } = await apiClient.get<User>(`/users/${id}`)**Archivos**:

    return data

  }- `services/user/GetAllUsers.ts`

- `services/user/GetUserById.ts`

  async create(userData: CreateUserDTO): Promise<User> {- `services/user/CreateUser.ts`

    const { data } = await apiClient.post<User>('/users', userData)

    return data**Características**:

  }

- ✅ Decide cuándo usar API o Store

  async update(userData: UpdateUserDTO): Promise<User> {- ✅ Orquesta múltiples repositorios

    const { data } = await apiClient.put<User>(`/users/${userData.id}`, userData)- ✅ Sincroniza Store después de operaciones

    return data- ✅ Manejo de errores centralizado

  }

**Ejemplo**:

  async delete(id: number): Promise<boolean> {

    await apiClient.delete(`/users/${id}`)```typescript

    return true// services/user/GetUserById.ts

  }export class GetUserByIdUseCase {

}  async execute(id: number, forceRefresh = false): Promise<User | null> {

```    // Si forzamos refresh o no existe en store → API

    if (forceRefresh || !this.store.hasUser(id)) {

#### Store Repository (Datos locales)      console.log('📡 Fetching from API...')

      const user = await this.apiRepository.getById(id)

```typescript      if (user) this.store.setUser(user) // Guardar en cache

// repositories/UserStoreRepository.ts      return user

import type { User, CreateUserDTO, UpdateUserDTO } from '@/domain/entities/User'    }

import type { IUserRepository } from '@/domain/repositories/IUserRepository'

import { useUserStore } from '@/stores/user.store'    // Si existe en store → usar cache

    console.log('💾 Using cached data')

export class UserStoreRepository implements IUserRepository {    return await this.storeRepository.getById(id)

  private store = useUserStore()  }

}

  async getAll(): Promise<User[]> {```

    return this.store.allUsers

  }### 3️⃣ Repository Layer (Repositorios)



  async getById(id: number): Promise<User> {**Responsabilidad**: Implementar contratos para acceder a datos.

    const user = this.store.getUserById(id)

    if (!user) throw new Error(`User ${id} not found in Store`)**Archivos**:

    return user

  }- `repositories/UserApiRepository.ts` - Implementación con Axios

- `repositories/UserStoreRepository.ts` - Implementación con Pinia

  async create(userData: CreateUserDTO): Promise<User> {

    throw new Error('Create operation not supported in Store')**Características**:

  }

- ✅ Implementan `IUserRepository`

  async update(userData: UpdateUserDTO): Promise<User> {- ✅ Intercambiables sin afectar use cases

    throw new Error('Update operation not supported in Store')- ✅ Aislamiento de dependencias externas

  }

**Ejemplo**:

  async delete(id: number): Promise<boolean> {

    throw new Error('Delete operation not supported in Store')```typescript

  }// repositories/UserApiRepository.ts

}export class UserApiRepository implements IUserRepository {

```  async getById(id: number): Promise<User | null> {

    const response = await apiClient.get<User>(`/users/${id}`)

**Nota**: Store es solo para lectura (cache). Las mutaciones van siempre a la API primero.    return response.data

  }

### 4. Store Layer (Cache)}



**Ubicación**: `src/stores/`// repositories/UserStoreRepository.ts

export class UserStoreRepository implements IUserRepository {

**Responsabilidad**: Estado global reactivo con Pinia (cache de datos).  async getById(id: number): Promise<User | null> {

    return this.store.getUserById(id) || null

```typescript  }

// stores/user.store.ts}

import { defineStore } from 'pinia'```

import { ref, computed } from 'vue'

import type { User } from '@/domain/entities/User'### 4️⃣ Presentation Layer (Composables)



export const useUserStore = defineStore('user', () => {**Responsabilidad**: Exponer use cases a las vistas con estados reactivos.

  // State - Usamos Map para búsquedas O(1)

  const users = ref<Map<number, User>>(new Map())**Archivos**:



  // Getters - Computed reactivos- `composables/useUser.ts`

  const allUsers = computed(() => Array.from(users.value.values()))

  const getUserById = computed(() => (id: number) => users.value.get(id))**Características**:

  const hasUser = computed(() => (id: number) => users.value.has(id))

- ✅ Loading/Error states

  // Actions - Mutaciones del state- ✅ Interfaz simple para vistas

  function setUsers(newUsers: User[]) {- ✅ Reactividad de Vue

    users.value.clear()- ✅ Manejo de errores UI

    newUsers.forEach(user => users.value.set(user.id, user))

  }**Ejemplo**:



  function setUser(user: User) {```typescript

    users.value.set(user.id, user)// composables/useUser.ts

  }export function useUser() {

  const loading = ref(false)

  function removeUser(id: number) {  const error = ref<string | null>(null)

    users.value.delete(id)  const users = computed(() => store.allUsers)

  }

  async function fetchUsers(forceRefresh = false) {

  function clearUsers() {    loading.value = true

    users.value.clear()    try {

  }      await getAllUsersUseCase.execute(forceRefresh)

    } catch (err) {

  return {      error.value = 'Error al cargar usuarios'

    // State    } finally {

    users,      loading.value = false

    // Getters    }

    allUsers,  }

    getUserById,

    hasUser,  return { loading, error, users, fetchUsers }

    // Actions}

    setUsers,```

    setUser,

    removeUser,### 5️⃣ View Layer (Vistas)

    clearUsers,

  }**Responsabilidad**: Presentar datos y capturar interacciones.

})

```**Ejemplo**:



**Decisión de diseño**: Usar `Map<id, Entity>` en lugar de arrays para:```vue

- Búsquedas O(1) en lugar de O(n)<script setup lang="ts">

- Updates eficientes por IDimport { onMounted } from 'vue'

- Evitar duplicados automáticamenteimport { useUser } from '@/composables/useUser'



### 5. API Layer (HTTP Client)const { users, loading, fetchUsers } = useUser()



**Ubicación**: `src/api/`onMounted(() => fetchUsers())

</script>

**Responsabilidad**: Configuración centralizada de Axios.

<template>

```typescript  <div v-if="loading">Cargando...</div>

// api/client.ts  <div v-else v-for="user in users" :key="user.id">

import axios from 'axios'    {{ user.name }}

  </div>

const apiClient = axios.create({</template>

  baseURL: 'https://jsonplaceholder.typicode.com',```

  timeout: 10000,

  headers: {## 💡 Ejemplos de Uso

    'Content-Type': 'application/json',

  },### Caso 1: Cargar todos los usuarios

})

```typescript

// Request interceptor: Agregar token de autenticación// En la vista

apiClient.interceptors.request.use(const { users, loading, fetchUsers } = useUser()

  (config) => {

    const token = localStorage.getItem('auth_token')onMounted(async () => {

    if (token) {  await fetchUsers() // Primera vez: API → Store

      config.headers.Authorization = `Bearer ${token}`  // Segunda vez: Store (cache) ✅

    }})

    return config```

  },

  (error) => Promise.reject(error)**Flujo interno**:

)

1. `fetchUsers()` → Composable

// Response interceptor: Manejar errores globalmente2. → `GetAllUsersUseCase.execute()`

apiClient.interceptors.response.use(3. → Verifica Store vacío → llama `UserApiRepository`

  (response) => response,4. → Guarda en Store

  (error) => {5. → Retorna usuarios

    if (error.response?.status === 401) {

      console.error('Unauthorized! Redirect to login...')### Caso 2: Ver detalles de un usuario

    }

    return Promise.reject(error)```typescript

  }const user = await fetchUserById(5)

)// Si el usuario 5 ya está en Store → 💾 Cache

// Si no existe → 📡 API

export default apiClient```

`````

### Caso 3: Forzar actualización desde API

### 6. Composable Layer (Vue Integration)

`````typescript

**Ubicación**: `src/composables/`await fetchUsers(true) // forceRefresh = true

// Siempre consulta la API, ignora cache

**Responsabilidad**: Exponer services a las vistas con estados reactivos de Vue.```



```typescript### Caso 4: Crear un nuevo usuario

// composables/useUser.ts

import { ref, computed } from 'vue'```typescript

import type { User, CreateUserDTO, UpdateUserDTO } from '@/domain/entities/User'const newUser = await createUser({

import { GetAll } from '@/services/user/GetAll'  name: 'John Doe',

import { GetById } from '@/services/user/GetById'  email: 'john@example.com',

import { Create } from '@/services/user/Create'  username: 'johndoe',

import { Update } from '@/services/user/Update'})

import { Delete } from '@/services/user/Delete'// Crea en API → Agrega al Store automáticamente

import { useUserStore } from '@/stores/user.store'```



export function useUser() {## ✅ Mejores Prácticas

  const store = useUserStore()

### 1. Contratos sobre Implementaciones

  // Instanciar services

  const getAllService = new GetAll()```typescript

  const getByIdService = new GetById()// ❌ MAL: Depender de implementación

  const createService = new Create()import { UserApiRepository } from '@/repositories/UserApiRepository'

  const updateService = new Update()

  const deleteService = new Delete()// ✅ BIEN: Depender de contrato

import type { IUserRepository } from '@/domain/repositories/IUserRepository'

  // Estado local del composable```

  const loading = ref(false)

  const error = ref<string | null>(null)### 2. Use Cases para Lógica de Negocio



  // Computed desde el store```typescript

  const users = computed(() => store.allUsers)// ❌ MAL: Lógica en la vista

  const hasUsers = computed(() => store.allUsers.length > 0)const users = await apiClient.get('/users')

store.setUsers(users)

  // Métodos que ejecutan services

  async function fetchUsers(forceRefresh = false) {// ✅ BIEN: Use case encapsula la lógica

    loading.value = trueawait getAllUsersUseCase.execute()

    error.value = null```

    try {

      await getAllService.execute(forceRefresh)### 3. Composables para Vistas

    } catch (err) {

      error.value = err instanceof Error ? err.message : 'Error al obtener usuarios'```typescript

    } finally {// ❌ MAL: Vista instancia use cases directamente

      loading.value = falseconst useCase = new GetAllUsersUseCase()

    }await useCase.execute()

  }

// ✅ BIEN: Vista usa composable

  async function fetchUserById(id: number, forceRefresh = false): Promise<User | null> {const { fetchUsers } = useUser()

    loading.value = trueawait fetchUsers()

    error.value = null```

    try {

      return await getByIdService.execute(id, forceRefresh)### 4. Mensajes de Debug

    } catch (err) {

      error.value = err instanceof Error ? err.message : `Error al obtener usuario ${id}````typescript

      return null// Los use cases loguean el origen de datos

    } finally {console.log('📡 Fetching from API...') // API

      loading.value = falseconsole.log('💾 Using cached data') // Store

    }```

  }

### 5. Testing

  async function createUser(data: CreateUserDTO): Promise<User | null> {

    loading.value = true```typescript

    error.value = null// Fácil de testear con mocks

    try {const mockRepository: IUserRepository = {

      return await createService.execute(data)  getAll: jest.fn().mockResolvedValue([mockUser]),

    } catch (err) {}

      error.value = err instanceof Error ? err.message : 'Error al crear usuario'

      return nullconst useCase = new GetAllUsersUseCase(mockRepository)

    } finally {```

      loading.value = false

    }## 🎯 Ventajas de esta Arquitectura

  }

1. **Testeable**: Cada capa se prueba independientemente

  return {2. **Escalable**: Agregar nuevas features sin modificar existentes

    // Estado3. **Mantenible**: Código organizado y predecible

    loading,4. **Flexible**: Cambiar implementaciones (GraphQL, localStorage, etc.)

    error,5. **Type-Safe**: TypeScript garantiza contratos

    users,6. **Performance**: Cache automático con Store

    hasUsers,7. **Developer Experience**: Código limpio y autodocumentado

    // Métodos

    fetchUsers,## 🔄 Agregar Nuevas Entidades

    fetchUserById,

    createUser,Para agregar una nueva entidad (ej: `Post`):

  }

}1. **Domain**: `domain/entities/Post.ts` + `domain/repositories/IPostRepository.ts`

```2. **Repositories**: `PostApiRepository.ts` + `PostStoreRepository.ts`

3. **Store**: `stores/post.store.ts`

**Ventajas**:4. **Use Cases**: `services/post/GetAllPosts.ts`, etc.

- Encapsula loading/error states5. **Composable**: `composables/usePost.ts`

- Expone API simple a las vistas6. **Vista**: Usa `usePost()` composable

- Reactivo automáticamente con Pinia

- Reutilizable entre vistas---



### 7. View Layer (Presentación)**🚀 Arquitectura implementada**: Hexagonal simplificada + Clean Architecture principles



**Ubicación**: `src/views/`- **NO**: Consulta Service → HTTP Client → API



**Responsabilidad**: UI y experiencia de usuario.3. **Actualización**: API → Service → Store (actualiza cache) → View



```vue## 🎨 Capas de la Arquitectura

<!-- views/UsersView.vue -->

<script setup lang="ts">### 1. Config Layer (`/config`)

import { onMounted } from 'vue'

import { useUser } from '@/composables/useUser'**Responsabilidad**: Configuración centralizada y constantes



const { users, loading, error, fetchUsers, createUser } = useUser()\`\`\`typescript

// api.config.ts

onMounted(() => {export const API_CONFIG = {

  fetchUsers()baseURL: 'https://api.omatu.dev',

})timeout: 30000,

retries: 3,

async function handleRefresh() {}

  await fetchUsers(true) // Force refresh

}export const API_ENDPOINTS = {

users: {

async function handleCreate() {base: '/users',

  await createUser({byId: (id) => \`/users/\${id}\`,

    name: 'New User',},

    email: 'new@example.com',}

    username: 'newuser',\`\`\`

  })

}**Características**:

</script>

- Endpoints centralizados

<template>- Configuración de timeouts y retries

  <div>- Configuración de cache (TTL)

    <h1>Users</h1>

    ### 2. Interfaces Layer (`/interfaces`)

    <button @click="handleRefresh">Refresh</button>

    <button @click="handleCreate">Create</button>**Responsabilidad**: Definición de tipos e interfaces



    <div v-if="loading">Loading...</div>\`\`\`typescript

    <div v-else-if="error">Error: {{ error }}</div>// user.interface.ts

    <div v-else>export interface User {

      <div v-for="user in users" :key="user.id">id: number

        {{ user.name }} ({{ user.email }})email: string

      </div>name: string

    </div>role: UserRole

  </div>}

</template>

```export interface UserCreateDTO {

email: string

**Reglas**:name: string

- Usar `<script setup>` + TypeScriptpassword: string

- No lógica de negocio aquí (solo en services)}

- Consumir composables\`\`\`

- No estilos inline (sin CSS en componentes)

**Características**:

## 🎯 Ventajas de esta Arquitectura

- Type-safety completo

### 1. Testeable- DTOs para request/response

```typescript- Interfaces de dominio

// Mock fácil de repositorios

const mockRepo: IUserRepository = {### 3. Services Layer (`/services`)

  getAll: jest.fn().mockResolvedValue([mockUser]),

}**Responsabilidad**: Comunicación con APIs externas



const service = new GetAll(mockRepo)\`\`\`typescript

const result = await service.execute()// user.service.ts

```class UserService {

async informationById(id: string | number): Promise<User> {

### 2. Intercambiableconst response = await httpClient.get(...)

Puedes cambiar de API a GraphQL solo cambiando la implementación del repositorio:return response.data.data

```typescript}

class UserGraphQLRepository implements IUserRepository {}

  async getAll(): Promise<User[]> {

    return await graphqlClient.query(GET_USERS_QUERY)export const userService = new UserService()

  }\`\`\`

}

```**Características**:



### 3. Escalable- Singleton pattern

Para agregar nueva entidad `Product`:- Métodos descriptivos (informationById, getAll, etc.)

1. `domain/entities/Product.ts` + `domain/repositories/IProductRepository.ts`- Transformación de datos

2. `repositories/ProductApiRepository.ts`- Manejo de errores

3. `stores/product.store.ts`

4. `services/product/GetAll.ts`, etc.**HTTP Client Features**:

5. `composables/useProduct.ts`

6. Vista usa `useProduct()`- ✅ Auto-retry con exponential backoff

- ✅ Timeout management

No tocas código existente de `User`.- ✅ Interceptores (auth token automático)

- ✅ Manejo centralizado de errores

### 4. Cache Inteligente- ✅ Event dispatch para errores 401

- Primera carga: API 📡

- Segunda carga: Store 💾 (instantáneo)### 4. Stores Layer (`/stores`)

- Force refresh: API 📡

- Después de Create/Update/Delete: API 📡 + sincroniza Store**Responsabilidad**: Estado global y cache inteligente



## 📊 Flujo Completo (Ejemplo GetAll)\`\`\`typescript

// user.ts

1. **Vista**: `await fetchUsers()`export const useUserStore = defineStore('user', () => {

2. **Composable**: `getAllService.execute()`const users = ref<User[]>([])

3. **Service**: const userCache = ref<UserCache>({})

   - ¿Hay users en Store? → Retornar Store

   - Si no → Llamar `apiRepository.getAll()`const getUserById = async (id, forceRefresh = false) => {

4. **Repository**: `axios.get('/users')`// Cache-first logic

5. **Service**: `store.setUsers(users)` + retornarif (!forceRefresh && isCacheValid(id)) {

6. **Composable**: Actualiza `loading` y `error`return userCache.value[id].data

7. **Vista**: Re-renderiza automáticamente (reactive)}



## 🔧 Configuración Recomendada    // Fetch from API

    const user = await userService.informationById(id)

```typescript

// tsconfig.json - Strict mode    // Update cache

{    userCache.value[id] = { data: user, timestamp: Date.now() }

  "compilerOptions": {

    "strict": true,    return user

    "noImplicitAny": true,

    "strictNullChecks": true}

  }

}return { users, getUserById, ... }

})

// .env - Variables de entorno\`\`\`

VITE_API_URL=https://api.example.com

```**Características**:



---- Cache con TTL configurable

- Invalidación de cache manual o automática

**Esta arquitectura prioriza simplicidad, escalabilidad y mantenibilidad.**- Estados de loading y error

- Sincronización con servicios
- Getters computados

### 5. Composables Layer (`/composables`)

**Responsabilidad**: Lógica reutilizable de UI

\`\`\`typescript
// useUser.ts
export function useUser() {
const userStore = useUserStore()

const users = computed(() => userStore.users)
const loading = computed(() => userStore.loading)

const getUser = async (id, forceRefresh = false) => {
return await userStore.getUserById(id, forceRefresh)
}

return { users, loading, getUser, ... }
}
\`\`\`

**Características**:

- Abstracción del store
- Estados reactivos (computed)
- Métodos simplificados
- Facilita testing

### 6. Views Layer (`/views`)

**Responsabilidad**: Páginas y vistas principales

\`\`\`vue

<script setup lang="ts">
import { useUser } from '@/composables/useUser'

const { users, loading, fetchUsers } = useUser()

onMounted(async () => {
  await fetchUsers()
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-for="user in users" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
\`\`\`

**Características**:

- Composition API
- Uso de composables
- Manejo de estados (loading, error)
- Lógica mínima de presentación

### 7. Utils Layer (`/utils`)

**Responsabilidad**: Funciones auxiliares y helpers

Incluye:

- `date.utils.ts`: Formateo de fechas
- `format.utils.ts`: Formateo de texto/números
- `validation.utils.ts`: Validaciones
- `storage.utils.ts`: LocalStorage type-safe

## 💡 Ejemplos de Uso

### Ejemplo 1: Obtener Usuario por ID

\`\`\`vue

<script setup lang="ts">
import { useUser } from '@/composables/useUser'

const { getUser, loading, error } = useUser()

const loadUser = async (userId: number) => {
  try {
    // Primero busca en cache, luego en API si es necesario
    const user = await getUser(userId)
    console.log('Usuario:', user)
  } catch (err) {
    console.error('Error:', err)
  }
}
</script>

\`\`\`

### Ejemplo 2: Forzar Actualización (Bypass Cache)

\`\`\`typescript
// Forzar refresh desde la API
const user = await getUser(userId, true) // forceRefresh = true
\`\`\`

### Ejemplo 3: Crear Usuario

\`\`\`typescript
import { useUser } from '@/composables/useUser'

const { createUser } = useUser()

const newUser = await createUser({
email: 'user@example.com',
name: 'John Doe',
password: 'secure123',
})
\`\`\`

### Ejemplo 4: Actualizar Usuario

\`\`\`typescript
const { updateUser } = useUser()

const updated = await updateUser(userId, {
name: 'Jane Doe',
})
\`\`\`

## 🎯 Mejores Prácticas

### 1. Uso de Cache

✅ **DO**: Usar cache para reducir peticiones
\`\`\`typescript
// Obtener usuario (usa cache si está disponible)
const user = await getUser(userId)
\`\`\`

❌ **DON'T**: Llamar directamente al servicio desde componentes
\`\`\`typescript
// ❌ Malo: Bypass del store y cache
const user = await userService.informationById(userId)
\`\`\`

### 2. Invalidación de Cache

Invalidar cache cuando:

- Se crea un nuevo recurso
- Se actualiza un recurso
- Se elimina un recurso
- El usuario hace logout

\`\`\`typescript
const { refreshCache, invalidateUserCache } = useUser()

// Invalidar todo el cache
refreshCache()

// Invalidar cache de un usuario específico
invalidateUserCache(userId)
\`\`\`

### 3. Manejo de Errores

✅ **DO**: Manejar errores en componentes
\`\`\`typescript
try {
await fetchUsers()
} catch (err) {
// Mostrar mensaje al usuario
showToast('Error cargando usuarios')
}
\`\`\`

### 4. Estados de Carga

✅ **DO**: Mostrar estados de loading y error
\`\`\`vue

<div v-if="loading">Loading...</div>
<div v-else-if="error">Error: {{ error.message }}</div>
<div v-else><!-- Contenido --></div>
\`\`\`

### 5. Type Safety

✅ **DO**: Usar tipos en toda la aplicación
\`\`\`typescript
interface UserFormData {
name: string
email: string
}

const formData = ref<UserFormData>({ name: '', email: '' })
\`\`\`

### 6. Composables

✅ **DO**: Extraer lógica compleja a composables
\`\`\`typescript
// useUserForm.ts
export function useUserForm() {
const formData = ref({...})
const errors = ref({...})

const validate = () => {...}
const submit = async () => {...}

return { formData, errors, validate, submit }
}
\`\`\`

### 7. Servicios

✅ **DO**: Mantener servicios enfocados en un dominio
\`\`\`typescript
// ✅ Bueno: Servicio específico
class UserService { ... }
class ProductService { ... }

// ❌ Malo: Servicio genérico
class ApiService { ... }
\`\`\`

## 🚀 Ventajas de esta Arquitectura

1. **Escalabilidad**: Fácil agregar nuevos dominios (productos, pedidos, etc.)
2. **Mantenibilidad**: Código organizado y fácil de localizar
3. **Testabilidad**: Cada capa se puede testear independientemente
4. **Performance**: Cache inteligente reduce peticiones HTTP
5. **Type Safety**: Errores detectados en tiempo de desarrollo
6. **Reusabilidad**: Composables y servicios reutilizables
7. **Separación de Responsabilidades**: Cada capa hace una cosa bien

## 📚 Recursos Adicionales

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Desarrollado con ❤️ usando Vue 3 + TypeScript + Tailwind CSS + Bun**
`````
