# 📂 Estructura y Convenciones del Proyecto# 📂 Estructura del Proyecto - Arquitectura Hexagonal# 📂 Estructura del Proyecto - Arquitectura Hexagonal# 📂 Estructura del Proyecto - Arquitectura Hexagonal# ✅ Estructura Final Correcta

Este documento define los **estándares de código y convenciones** que debe seguir cualquier agente o desarrollador trabajando en este proyecto.## 🏗️ Vista General## 🏗️ Vista General## 🏗️ Vista General# 📂 Estructura del Proyecto - Arquitectura Hexagonal

## 📁 Estructura de Carpetas`````````

````src/

src/

├── domain/                    # 🎯 CAPA DE DOMINIO (Núcleo de negocio)├── domain/                    # 🎯 CAPA DE DOMINIOsrc/

│   ├── entities/              # Modelos de negocio + DTOs

│   │   └── User.ts           # interface User, CreateUserDTO, UpdateUserDTO│   ├── entities/              # Modelos de negocio

│   └── repositories/          # Contratos (Interfaces)

│       └── IUserRepository.ts # interface IUserRepository│   │   └── User.ts           # Entidad User + DTOs├── domain/                    # 🎯 CAPA DE DOMINIOsrc/src/

│

├── services/                  # 🎬 LÓGICA DE NEGOCIO (Use Cases)│   └── repositories/          # Contratos (Interfaces)

│   └── user/                  # Agrupados por entidad

│       ├── GetAll.ts         # class GetAll│       └── IUserRepository.ts # Interface del repositorio│   ├── entities/              # Modelos de negocio

│       ├── GetById.ts        # class GetById

│       ├── Create.ts         # class Create├── services/                  # 🎬 SERVICIOS (Use Cases / Lógica de negocio)

│       ├── Update.ts         # class Update

│       └── Delete.ts         # class Delete│   └── user/                  # Servicios de usuarios│   │   └── User.ts           # Entidad User + DTOs├── domain/                    # 🎯 CAPA DE DOMINIO├── domain/                    # 🎯 CAPA DE DOMINIO

│

├── repositories/              # 🔌 IMPLEMENTACIONES (Adaptadores)│       ├── GetAllUsers.ts    # Obtener todos los usuarios

│   ├── UserApiRepository.ts  # class UserApiRepository implements IUserRepository

│   └── UserStoreRepository.ts # class UserStoreRepository implements IUserRepository│       ├── GetUserById.ts    # Obtener usuario por ID│   └── repositories/          # Contratos (Interfaces)

│

├── stores/                    # 💾 ESTADO GLOBAL (Pinia)│       ├── CreateUser.ts     # Crear usuario

│   └── user.store.ts         # useUserStore()

││       ├── UpdateUser.ts     # Actualizar usuario│       └── IUserRepository.ts # Interface del repositorio│   ├── entities/              # Modelos de negocio│   ├── entities/              # Modelos de negocio

├── api/                       # 🌐 HTTP CLIENT

│   └── client.ts             # Axios con interceptors│       └── DeleteUser.ts     # Eliminar usuario

│

├── composables/               # 🎨 COMPOSABLES VUE├── repositories/              # 🔌 IMPLEMENTACIONES├── services/                 # 🎬 CASOS DE USO

│   └── useUser.ts            # useUser() - expone services a vistas

││   ├── UserApiRepository.ts  # Implementación con API

├── views/                     # 📄 VISTAS

│   └── UsersView.vue         # Páginas de la aplicación│   └── UserStoreRepository.ts # Implementación con Store│   └── user/                  # Use cases de usuarios│   │   └── User.ts           # Entidad User + DTOs│   │   └── User.ts           # Entidad User + DTOs

│

├── components/                # 🧩 COMPONENTES REUTILIZABLES├── stores/                    # 💾 ESTADO GLOBAL (Pinia)

├── layouts/                   # 📐 LAYOUTS

│   └── DefaultLayout.vue│   └── user.store.ts         # Store de usuarios (cache)│       ├── GetAllUsers.ts    # Obtener todos los usuarios

├── router/                    # 🛣️ VUE ROUTER

│   └── index.ts├── api/                       # 🌐 CONFIGURACIÓN HTTP

├── utils/                     # 🛠️ UTILIDADES

└── assets/                    # 🎨 ASSETS ESTÁTICOS│   └── client.ts             # Axios con interceptors│       ├── GetUserById.ts    # Obtener usuario por ID│   └── repositories/          # Contratos (Interfaces)│   └── repositories/          # Contratos (Interfaces)

    └── main.css

```├── composables/               # 🎨 COMPOSABLES VUE



## 📝 Convenciones de Nombres│   └── useUser.ts            # Composable de usuarios│       ├── CreateUser.ts     # Crear usuario



### ⚠️ REGLA IMPORTANTE: Evitar Redundancia├── views/                     # 📄 VISTAS



**El contexto lo da la carpeta, el archivo debe ser conciso.**│   └── UsersView.vue         # Vista de usuarios│       ├── UpdateUser.ts     # Actualizar usuario│       └── IUserRepository.ts # Interface del repositorio│       └── IUserRepository.ts # Interface del repositorio



❌ **MAL** (redundante):├── components/                # 🧩 COMPONENTES REUTILIZABLES

````

services/user/CreateUser.ts → class CreateUserUseCase├── layouts/ # 📐 LAYOUTS│ └── DeleteUser.ts # Eliminar usuario

services/user/GetAllUsers.ts → class GetAllUsersUseCase

```│ └── DefaultLayout.vue     # Layout por defecto



✅ **BIEN** (conciso):├── router/                    # 🛣️ RUTAS├── repositories/              # 🔌 IMPLEMENTACIONES├── services/                 # 🎬 CASOS DE USO├── services/                 # 🎬 CASOS DE USO

```

services/user/Create.ts → class Create│ └── index.ts # Configuración de Vue Router

services/user/GetAll.ts → class GetAll

```├── utils/                     # 🛠️ UTILIDADES│   ├── UserApiRepository.ts  # Implementación con API



**Razón**: La carpeta `services/user/` ya indica que es un servicio de usuarios, no es necesario repetir "User" en el nombre del archivo ni de la clase.├── assets/                    # 🎨 ASSETS ESTÁTICOS



### 1. Archivos TypeScript│   └── main.css              # Estilos globales│   └── UserStoreRepository.ts # Implementación con Store│   └── user/                  # Use cases de usuarios│   └── user/                  # Use cases de usuarios



#### Clases y Tipos (PascalCase.ts)├── App.vue                    # Componente raíz

```

domain/entities/User.ts ← Entidad principal└── main.ts # Punto de entrada├── stores/ # 💾 ESTADO GLOBAL (Pinia)

domain/repositories/IUserRepository.ts ← Interface (prefijo "I")

repositories/UserApiRepository.ts ← Implementación con contexto```

services/user/GetAll.ts ← Use Case (nombre conciso)

```│ └── user.store.ts         # Store de usuarios (cache)│       ├── GetAllUsers.ts    # Obtener todos los usuarios│       ├── GetAllUsers.ts    # Obtener todos los usuarios



#### Composables (camelCase.ts con prefijo "use")## 📝 Convenciones de Nombres

```

composables/useUser.ts ← function useUser()├── api/ # 🌐 CONFIGURACIÓN HTTP

composables/useProduct.ts ← function useProduct()

```### Archivos TypeScript/JavaScript



#### Stores (camelCase.store.ts)│   └── client.ts             # Axios con interceptors│       ├── GetUserById.ts    # Obtener usuario por ID│       ├── GetUserById.ts    # Obtener usuario por ID

```

stores/user.store.ts ← useUserStore()#### 1. Clases y Tipos (PascalCase)

stores/product.store.ts ← useProductStore()

```├── composables/               # 🎨 COMPOSABLES VUE



**Razón**: Seguimos convención de Pinia para identificar fácilmente los stores.**Formato**: `PascalCase.ts`



#### Configuración (lowercase.ts)│   └── useUser.ts            # Composable de usuarios│       ├── CreateUser.ts     # Crear usuario│       ├── CreateUser.ts     # Crear usuario

```

api/client.ts ← Configuración de Axios```

router/index.ts ← Configuración de Vue Router

```domain/entities/User.ts ← Entidad├── views/                     # 📄 VISTAS



### 2. Archivos Vuedomain/repositories/IUserRepository.ts ← Interface



#### Componentes (PascalCase.vue)repositories/UserApiRepository.ts     ← Clase de repositorio│   └── UsersView.vue         # Vista de usuarios│       ├── UpdateUser.ts     # Actualizar usuario│       ├── UpdateUser.ts     # Actualizar usuario

```

components/UserCard.vuerepositories/UserStoreRepository.ts ← Clase de repositorio

components/ProductList.vue

layouts/DefaultLayout.vueservices/user/GetAllUsers.ts ← Clase de servicio/use case├── components/ # 🧩 COMPONENTES REUTILIZABLES

```

```

#### Vistas (PascalCase.vue con sufijo "View")

````├── layouts/                   # 📐 LAYOUTS│       └── DeleteUser.ts     # Eliminar usuario│       └── DeleteUser.ts     # Eliminar usuario

views/UsersView.vue

views/ProductsView.vue**Razón**: Representan clases, interfaces o tipos. Sigue convenciones de POO (TypeScript/Java/C#).

views/HomeView.vue

```│   └── DefaultLayout.vue     # Layout por defecto



### 3. Carpetas---



**Siempre en lowercase, sin guiones**├── router/                    # 🛣️ RUTAS├── repositories/              # 🔌 IMPLEMENTACIONES├── repositories/              # 🔌 IMPLEMENTACIONES



✅ **BIEN**:#### 2. Stores (camelCase.store.ts)

````

services/user/│ └── index.ts # Configuración de Vue Router

services/product/

domain/entities/**Formato**: `camelCase.store.ts`

domain/repositories/

````├── utils/                     # 🛠️ UTILIDADES│   ├── UserApiRepository.ts  # Implementación con API│   ├── UserApiRepository.ts  # Implementación con API



❌ **MAL**:```

````

use-cases/ ← No usar kebab-casestores/user.store.ts├── assets/ # 🎨 ASSETS ESTÁTICOS

Services/ ← No usar PascalCase

user-services/ ← No usar guionesstores/product.store.ts

```

stores/auth.store.ts│   └── main.css              # Estilos globales│   └── UserStoreRepository.ts # Implementación con Store│   └── UserStoreRepository.ts # Implementación con Store

**Razón**: Simplicidad y consistencia. Las carpetas son contenedores, no clases.

```

## 🏗️ Patrones de Arquitectura

├── App.vue # Componente raíz

### Repository Pattern

**Razón**:

````typescript

// 1. Interface en domain/repositories/- ✅ **Convención oficial de Pinia**└── main.ts                    # Punto de entrada├── stores/                    # 💾 ESTADO GLOBAL (Pinia)├── stores/                    # 💾 ESTADO GLOBAL (Pinia)

export interface IUserRepository {

  getAll(): Promise<User[]>- ✅ El ID del store es `'user'`, el archivo lo refleja

  getById(id: number): Promise<User>

  create(data: CreateUserDTO): Promise<User>- ✅ El sufijo `.store` funciona como **namespace visual**```

  update(data: UpdateUserDTO): Promise<User>

  delete(id: number): Promise<boolean>- ✅ Agrupa archivos relacionados alfabéticamente

}

- ✅ Consistente con ecosistema Vue/Nuxt│   └── user.store.ts         # Store de usuarios (cache)│   └── user.store.ts         # Store de usuarios (cache)

// 2. Implementación API en repositories/

export class UserApiRepository implements IUserRepository {

  async getAll(): Promise<User[]> {

    const { data } = await apiClient.get<User[]>('/users')**Ejemplo**:## 📝 Convenciones de Nombres

    return data

  }```typescript

}

// archivo: user.store.ts├── api/                       # 🌐 CONFIGURACIÓN HTTP├── api/                       # 🌐 CONFIGURACIÓN HTTP

// 3. Implementación Store en repositories/

export class UserStoreRepository implements IUserRepository {export const useUserStore = defineStore('user', () => {

  private store = useUserStore()

    //                                      ↑### Archivos TypeScript/JavaScript

  async getAll(): Promise<User[]> {

    return this.store.allUsers  //                            ID del store = 'user'

  }

}})│   └── client.ts             # Axios con interceptors│   └── client.ts             # Axios con interceptors

````

````

### Service Pattern (Use Cases)

#### 1. Clases y Tipos (PascalCase)

**Convención de nombres**:

- Archivo: `services/user/GetAll.ts`**Alternativa NO usada**: `UserStore.ts` (PascalCase)

- Clase: `export class GetAll`

- Método: `async execute(...)`- Es válida pero no sigue la convención de Pinia├── composables/               # 🎨 COMPOSABLES VUE├── composables/               # 🎨 COMPOSABLES VUE



```typescript- Puede confundirse con una clase

// services/user/GetAll.ts

import type { User } from '@/domain/entities/User'- No es el estándar en proyectos Vue**Formato**: `PascalCase.ts`

import type { IUserRepository } from '@/domain/repositories/IUserRepository'

import { UserApiRepository } from '@/repositories/UserApiRepository'

import { useUserStore } from '@/stores/user.store'

---│   └── useUser.ts            # Composable de usuarios│   └── useUser.ts            # Composable de usuarios

export class GetAll {

  private apiRepository: IUserRepository

  private store = useUserStore()

#### 3. Composables (useCamelCase.ts)```

  constructor() {

    this.apiRepository = new UserApiRepository()

  }

**Formato**: `useCamelCase.ts`domain/entities/User.ts              ← Entidad├── views/                     # 📄 VISTAS

  async execute(forceRefresh = false): Promise<User[]> {

    // Cache-first: verificar Store

    if (!forceRefresh && this.store.allUsers.length > 0) {

      console.log('💾 Using cached users from Store')```domain/repositories/IUserRepository.ts ← Interface

      return this.store.allUsers

    }composables/useUser.ts



    // No hay cache: consultar APIcomposables/useAuth.tsrepositories/UserApiRepository.ts     ← Clase de repositorio│   └── UsersView.vue         # Vista de usuarios```

    console.log('📡 Fetching users from API...')

    const users = await this.apiRepository.getAll()composables/useProduct.ts



    // Guardar en Store para futuros accesos```repositories/UserStoreRepository.ts   ← Clase de repositorio

    this.store.setUsers(users)

    return users

  }

}**Razón**: Convención estándar de Vue 3 para composables.services/user/GetAllUsers.ts        ← Clase de use case├── components/                # 🧩 COMPONENTES REUTILIZABLES

````

**Patrón Cache-First**:

1. Verificar Store (cache)---```

2. Si no hay datos o `forceRefresh`, consultar API

3. Guardar resultado en Store

4. Retornar datos

#### 4. Archivos de configuración (camelCase.ts)├── layouts/ # 📐 LAYOUTSsrc/

### Store Pattern (Pinia)

````typescript

// stores/user.store.ts**Formato**: `camelCase.ts`**Razón**: Representan clases, interfaces o tipos. Sigue convenciones de POO (TypeScript/Java/C#).

import { defineStore } from 'pinia'

import { ref, computed } from 'vue'

import type { User } from '@/domain/entities/User'

```│   └── DefaultLayout.vue     # Layout por defecto├── config/ # Configuración

export const useUserStore = defineStore('user', () => {

  // Stateapi/client.ts

  const users = ref<Map<number, User>>(new Map())

router/index.ts---

  // Getters

  const allUsers = computed(() => Array.from(users.value.values()))```

  const getUserById = computed(() => (id: number) => users.value.get(id))

  const hasUser = computed(() => (id: number) => users.value.has(id))├── router/                    # 🛣️ RUTAS│ └── apiConfig.ts # ✅ camelCase



  // Actions**Razón**: Archivos funcionales simples, no representan clases.

  function setUsers(newUsers: User[]) {

    users.value.clear()#### 2. Stores (camelCase.store.ts)

    newUsers.forEach(user => users.value.set(user.id, user))

  }---



  function setUser(user: User) {│   └── index.ts              # Configuración de Vue Router│

    users.value.set(user.id, user)

  }### Componentes Vue



  function removeUser(id: number) {**Formato**: `camelCase.store.ts`

    users.value.delete(id)

  }**Formato**: `PascalCase.vue`



  return {├── utils/                     # 🛠️ UTILIDADES├── services/ # Servicios (Comunicación con API)

    users,

    allUsers,```

    getUserById,

    hasUser,views/UsersView.vue```

    setUsers,

    setUser,components/UserCard.vue

    removeUser,

  }layouts/DefaultLayout.vuestores/user.store.ts├── assets/                    # 🎨 ASSETS ESTÁTICOS│ ├── httpClient.ts # ✅ camelCase

})

````

**Convenciones**:stores/product.store.ts

- Usar Composition API setup syntax

- State: `ref` o `reactive`**Razón**: Convención oficial de Vue para componentes.

- Getters: `computed`

- Actions: funciones normalesstores/auth.store.ts│ └── main.css # Estilos globales│ └── userService.ts # ✅ camelCase

- Usar `Map<id, Entity>` para cache eficiente

❌ **NO usar**:

### Composable Pattern

- `usersView.vue` (camelCase)```

````typescript

// composables/useUser.ts- `users-view.vue` (kebab-case)

import { ref, computed } from 'vue'

import type { User } from '@/domain/entities/User'- `user-card.vue` (kebab-case)├── App.vue                    # Componente raíz│

import { GetAll } from '@/services/user/GetAll'

import { GetById } from '@/services/user/GetById'

import { Create } from '@/services/user/Create'

import { useUserStore } from '@/stores/user.store'---**Razón**:



export function useUser() {

  const store = useUserStore()

### Carpetas- ✅ **Convención oficial de Pinia**└── main.ts                    # Punto de entrada├── stores/ # Estado global (Pinia)

  // Instanciar services

  const getAllService = new GetAll()

  const getByIdService = new GetById()

  const createService = new Create()**Formato**: `lowercase` (sin guiones)- ✅ El ID del store es `'user'`, el archivo lo refleja



  // Estado local

  const loading = ref(false)

  const error = ref<string | null>(null)```- ✅ El sufijo `.store` funciona como **namespace visual**```│ └── userStore.ts # ✅ camelCase



  // Computed desde store✅ services/      (simple, sin guiones)

  const users = computed(() => store.allUsers)

✅ repositories/  (sin guiones)- ✅ Agrupa archivos relacionados alfabéticamente

  // Métodos que ejecutan services

  async function fetchUsers(forceRefresh = false) {✅ composables/   (sin guiones)

    loading.value = true

    error.value = null- ✅ Consistente con ecosistema Vue/Nuxt│

    try {

      await getAllService.execute(forceRefresh)❌ use-cases/     (kebab-case, evitar)

    } catch (err) {

      error.value = err instanceof Error ? err.message : 'Error'❌ api-client/    (kebab-case, evitar)

    } finally {

      loading.value = false```

    }

  }**Ejemplo**:## 📝 Convenciones de Nombres├── interfaces/ # Tipos e Interfaces



  return { loading, error, users, fetchUsers }**Razón**:

}

```- ✅ Más simple y limpio```typescript



**Convenciones**:- ✅ Consistente con carpetas estándar (`node_modules`, `src`)

- Prefix `use` (useUser, useProduct)

- Retornar objeto con estado y métodos- ✅ Fácil de escribir (sin shift + guión)// archivo: user.store.ts│ ├── commonInterface.ts # ✅ camelCase

- Manejar loading y error states

- Exponer computed desde store- ✅ Compatible con todos los sistemas operativos



## 🎨 Convenciones de Códigoexport const useUserStore = defineStore('user', () => {



### TypeScript**Nota sobre `services/`**:



- **Strict mode**: Siempre activado- Originalmente era `use-cases/` (con guión)  //                                      ↑### Archivos TypeScript/JavaScript│ └── userInterface.ts # ✅ camelCase

- **Interfaces**: Prefijo `I` para interfaces de contratos (`IUserRepository`)

- **Types vs Interfaces**: - Renombrado a `services/` por simplicidad

  - `interface` para contratos y entidades

  - `type` para DTOs y uniones- Los archivos dentro siguen siendo clases de Use Cases  //                            ID del store = 'user'



```typescript- El nombre "services" es más común en el ecosistema

// Entidad

export interface User {})│

  id: number

  name: string---

  email: string

}```



// DTOs### Resumen Rápido

export type CreateUserDTO = Omit<User, 'id'>

export type UpdateUserDTO = Partial<User> & { id: number }- **Domain/Entities**: `PascalCase.ts` → `User.ts`├── composables/ # Composables reutilizables

````

| Tipo | Convención | Ejemplo |

### Imports

|------|-----------|---------|**Alternativa NO usada**: `UserStore.ts` (PascalCase)

**Orden de imports**:

1. Vue / Librerías externas| Clases/Tipos/Interfaces | `PascalCase.ts` | `User.ts`, `UserApiRepository.ts` |

2. Types

3. Domain (entities, repositories)| Stores | `camelCase.store.ts` | `user.store.ts` |- Es válida pero no sigue la convención de Pinia- **Repositories**: `PascalCaseRepository.ts` → `UserApiRepository.ts`│ └── useUser.ts # ✅ usePascalCase

4. Services

5. Repositories| Composables | `useCamelCase.ts` | `useUser.ts` |

6. Stores

7. Utils| Componentes Vue | `PascalCase.vue` | `UsersView.vue` |- Puede confundirse con una clase

```typescript| Configuración | `camelCase.ts`|`client.ts` |

import { ref, computed } from 'vue'

import type { User } from '@/domain/entities/User'| **Carpetas** | **`lowercase`** | **`services/`, `repositories/`** |- No es el estándar en proyectos Vue- **Use Cases**: `PascalCase.ts` → `GetAllUsers.ts`│

import type { IUserRepository } from '@/domain/repositories/IUserRepository'

import { GetAll } from '@/services/user/GetAll'

import { UserApiRepository } from '@/repositories/UserApiRepository'

import { useUserStore } from '@/stores/user.store'---

````



### Vue Components

## 🎯 Importaciones Correctas---- **Stores**: `camelCase.store.ts` → `user.store.ts`├── views/ # Vistas/Páginas

```vue

<script setup lang="ts">

import { onMounted } from 'vue'

import { useUser } from '@/composables/useUser'```typescript



const { users, loading, fetchUsers } = useUser()// Domain



onMounted(() => fetchUsers())import type { User } from '@/domain/entities/User'#### 3. Composables (useCamelCase.ts)- **Composables**: `useCamelCase.ts` → `useUser.ts`│ ├── HomeView.vue # ✅ PascalCase

</script>

import type { IUserRepository } from '@/domain/repositories/IUserRepository'

<template>

  <div v-if="loading">Loading...</div>

  <div v-else>

    <div v-for="user in users" :key="user.id">// Services (Use Cases)

      {{ user.name }}

    </div>import { GetAllUsersUseCase } from '@/services/user/GetAllUsers'**Formato**: `useCamelCase.ts`- **API Client**: `camelCase.ts` → `client.ts`│ └── UsersView.vue # ✅ PascalCase

  </div>

</template>import { GetUserByIdUseCase } from '@/services/user/GetUserById'

````

**Convenciones**:

- `<script setup>` + TypeScript// Repositories

- No usar estilos inline ni CSS en componentes

- Props con `defineProps<T>()`import { UserApiRepository } from '@/repositories/UserApiRepository'```│

- Emits con `defineEmits<T>()`

import { UserStoreRepository } from '@/repositories/UserStoreRepository'

## 🚀 Agregar Nueva Entidad

composables/useUser.ts

Para agregar una nueva entidad (ejemplo: `Product`):

// Stores (nota: .store.ts en el import)

### 1. Domain Layer

````typescriptimport { useUserStore } from '@/stores/user.store'composables/useAuth.ts### Componentes Vue├── components/ # Componentes reutilizables

// domain/entities/Product.ts

export interface Product {

  id: number

  name: string// APIcomposables/useProduct.ts

  price: number

}import apiClient from '@/api/client'



export type CreateProductDTO = Omit<Product, 'id'>```│ └── UserCard.vue # ✅ PascalCase

export type UpdateProductDTO = Partial<Product> & { id: number }

// Composables

// domain/repositories/IProductRepository.ts

export interface IProductRepository {import { useUser } from '@/composables/useUser'

  getAll(): Promise<Product[]>

  getById(id: number): Promise<Product>```

  create(data: CreateProductDTO): Promise<Product>

  update(data: UpdateProductDTO): Promise<Product>**Razón**: Convención estándar de Vue 3 para composables.- **Formato**: `PascalCase.vue`│

  delete(id: number): Promise<boolean>

}---

````

### 2. Repositories Layer

````typescript## 🔄 Flujo de Datos

// repositories/ProductApiRepository.ts

export class ProductApiRepository implements IProductRepository {---- **Ejemplos**: `UsersView.vue`, `DefaultLayout.vue`├── layouts/ # Layouts

  async getAll(): Promise<Product[]> {

    const { data } = await apiClient.get<Product[]>('/products')```

    return data

  }Vista (UsersView.vue)

}

    ↓

// repositories/ProductStoreRepository.ts

export class ProductStoreRepository implements IProductRepository {Composable (useUser.ts)#### 4. Archivos de configuración (camelCase.ts)- ❌ NO usar: `usersView.vue`, `users-view.vue`│ └── DefaultLayout.vue # ✅ PascalCase

  private store = useProductStore()

  async getAll(): Promise<Product[]> {    ↓

    return this.store.allProducts

  }Service/UseCase (GetAllUsers.ts)

}

```    ↓ decide



### 3. Store LayerRepository Interface (IUserRepository)**Formato**: `camelCase.ts`│

```typescript

// stores/product.store.ts    ↓ implementa

export const useProductStore = defineStore('product', () => {

  const products = ref<Map<number, Product>>(new Map())UserApiRepository ← Axios → API

  const allProducts = computed(() => Array.from(products.value.values()))

      o

  function setProducts(newProducts: Product[]) {

    products.value.clear()UserStoreRepository ← Pinia → Store```## 🎯 Importaciones Correctas├── utils/ # Utilidades

    newProducts.forEach(p => products.value.set(p.id, p))

  }```



  return { products, allProducts, setProducts }api/client.ts

})

```---



### 4. Services Layerrouter/index.ts│ ├── dateUtils.ts # ✅ camelCase

```typescript

// services/product/GetAll.ts## 📁 Descripción de Carpetas

export class GetAll {

  private apiRepository: IProductRepository```

  private store = useProductStore()

### `domain/`

  constructor() {

    this.apiRepository = new ProductApiRepository()**Propósito**: Núcleo del negocio, sin dependencias externas```typescript│ ├── formatUtils.ts # ✅ camelCase

  }



  async execute(forceRefresh = false): Promise<Product[]> {

    if (!forceRefresh && this.store.allProducts.length > 0) {- `entities/` - Modelos de dominio (User, Post, etc.)**Razón**: Archivos funcionales simples, no representan clases.

      return this.store.allProducts

    }- `repositories/` - Contratos (interfaces) que definen operaciones

    const products = await this.apiRepository.getAll()

    this.store.setProducts(products)// Domain│ ├── storageUtils.ts # ✅ camelCase

    return products

  }**Naming**:

}

```- Carpeta: `lowercase`---



### 5. Composable Layer- Archivos: `PascalCase.ts` para entidades e interfaces

```typescript

// composables/useProduct.tsimport type { User } from '@/domain/entities/User'│ └── validationUtils.ts # ✅ camelCase

export function useProduct() {

  const getAllService = new GetAll()---

  const loading = ref(false)

  const products = computed(() => useProductStore().allProducts)### Componentes Vue



  async function fetchProducts(forceRefresh = false) {### `services/`

    loading.value = true

    await getAllService.execute(forceRefresh)**Propósito**: Lógica de negocio aislada (Use Cases)import type { IUserRepository } from '@/domain/repositories/IUserRepository'│

    loading.value = false

  }



  return { loading, products, fetchProducts }- Decide cuándo usar API o Store**Formato**: `PascalCase.vue`

}

```- Orquesta repositorios



### 6. View Layer- Sincroniza cache├── router/ # Configuración de rutas

```vue

<!-- views/ProductsView.vue -->

<script setup lang="ts">

import { onMounted } from 'vue'**Naming**: ```

import { useProduct } from '@/composables/useProduct'

- Carpeta: `services/` (sin guiones)

const { products, loading, fetchProducts } = useProduct()

onMounted(() => fetchProducts())- Subcarpetas: `user/`, `product/`views/UsersView.vue// Use Cases│ └── index.ts

</script>

- Archivos: `PascalCase.ts` (son clases)

<template>

  <div v-if="loading">Loading...</div>components/UserCard.vue

  <div v-else>

    <div v-for="product in products" :key="product.id">**Por qué `services/` y no `use-cases/`**:

      {{ product.name }} - ${{ product.price }}

    </div>- ✅ Más simple (sin guiones)layouts/DefaultLayout.vueimport { GetAllUsersUseCase } from '@/services/user/GetAllUsers'│

  </div>

</template>- ✅ Nombre más común en el ecosistema

````

- ✅ Más corto y directo```

## 📊 Resumen de Estándares

- ✅ Los archivos dentro siguen siendo Use Cases

| Concepto | Patrón | Ejemplo |

|----------|--------|---------|import { GetUserByIdUseCase } from '@/services/user/GetUserById'├── assets/ # Assets estáticos

| Carpetas | lowercase | `services/user/` |

| Entidades | PascalCase.ts | `User.ts` |---

| Interfaces | I + PascalCase.ts | `IUserRepository.ts` |

| Services | PascalCase.ts (conciso) | `GetAll.ts` → `class GetAll` |**Razón**: Convención oficial de Vue para componentes.

| Repositories | PascalCase.ts | `UserApiRepository.ts` |

| Stores | camelCase.store.ts | `user.store.ts` → `useUserStore()` |### `repositories/`

| Composables | camelCase.ts + use | `useUser.ts` → `function useUser()` |

| Componentes | PascalCase.vue | `UserCard.vue` |**Propósito**: Implementaciones de contratos│ └── main.css

| Vistas | PascalCaseView.vue | `UsersView.vue` |

---

- `*ApiRepository.ts` - Implementación con Axios❌ **NO usar**:

**Estos estándares fueron decididos para mantener simplicidad, evitar redundancia y seguir convenciones de Vue/TypeScript.**

- `*StoreRepository.ts` - Implementación con Pinia

- `usersView.vue` (camelCase)// Repositories│

**Naming**:

- Carpeta: `repositories/`- `users-view.vue` (kebab-case)

- Archivos: `PascalCase.ts` con sufijo `Repository`

- `user-card.vue` (kebab-case)import { UserApiRepository } from '@/repositories/UserApiRepository'├── App.vue # Componente raíz

---

### `stores/`

**Propósito**: Estado global reactivo con Pinia---import { UserStoreRepository } from '@/repositories/UserStoreRepository'├── HomeView.vue # Vista principal

- Cache de datos

- Operaciones CRUD en memoria

### Resumen Rápido└── main.ts # Punto de entrada

**Naming**:

- Carpeta: `stores/`

- Archivos: `camelCase.store.ts` (convención Pinia)

| Tipo | Convención | Ejemplo |// Stores

---

|------|-----------|---------|

### `api/`

**Propósito**: Configuración HTTP| Clases/Tipos/Interfaces | `PascalCase.ts` | `User.ts`, `UserApiRepository.ts` |import { useUserStore } from '@/stores/user.store'````

- Cliente Axios| Stores | `camelCase.store.ts` | `user.store.ts` |

- Interceptors

- Manejo de errores| Composables | `useCamelCase.ts` | `useUser.ts` |

**Naming**: | Componentes Vue | `PascalCase.vue` | `UsersView.vue` |

- Carpeta: `api/`

- Archivos: `camelCase.ts`| Configuración | `camelCase.ts` | `client.ts` |// API## 📝 Convenciones de Nombres

---

### `composables/`---import apiClient from '@/api/client'

**Propósito**: Lógica reutilizable para vistas

- Expone use cases (services)

- Loading/error states## 🎯 Importaciones Correctas### Archivos TypeScript/JavaScript

- Reactividad Vue

**Naming**:

- Carpeta: `composables/````typescript// Composables

- Archivos: `useCamelCase.ts` (convención Vue)

// Domain

---

import type { User } from '@/domain/entities/User'import { useUser } from '@/composables/useUser'- **Formato**: `camelCase.ts`

## 🚀 Agregar Nueva Entidad

import type { IUserRepository } from '@/domain/repositories/IUserRepository'

Para agregar `Product`:

```- **Ejemplos**: `userService.ts`, `apiConfig.ts`, `dateUtils.ts`

### 1. Domain

````// Use Cases

domain/

├── entities/Product.tsimport { GetAllUsersUseCase } from '@/services/user/GetAllUsers'- ❌ NO usar: `user.service.ts`, `user-service.ts`, `UserService.ts`

└── repositories/IProductRepository.ts

```import { GetUserByIdUseCase } from '@/services/user/GetUserById'



### 2. Repositories## 🔄 Flujo de Datos

````

repositories/// Repositories

├── ProductApiRepository.ts

└── ProductStoreRepository.tsimport { UserApiRepository } from '@/repositories/UserApiRepository'### Componentes Vue

```

import { UserStoreRepository } from '@/repositories/UserStoreRepository'

### 3. Store

```

stores/product.store.ts ← Nota: camelCase.store.ts

```// Stores (nota: .store.ts en el import)



### 4. Services (Use Cases)import { useUserStore } from '@/stores/user.store'Vista (UsersView.vue)- **Formato**: `PascalCase.vue`

```

services/

└── product/

    ├── GetAllProducts.ts// API    ↓- **Ejemplos**: `UserCard.vue`, `UsersView.vue`, `DefaultLayout.vue`

    ├── GetProductById.ts

    ├── CreateProduct.tsimport apiClient from '@/api/client'

    ├── UpdateProduct.ts

    └── DeleteProduct.tsComposable (useUser.ts)- ❌ NO usar: `userCard.vue`, `user-card.vue`, `users.vue`

````

// Composables

### 5. Composable

```import { useUser } from '@/composables/useUser'    ↓

composables/useProduct.ts

````

### 6. VistaUse Case (GetAllUsers.ts)### Composables

```````vue
<script setup>
---

import { useProduct } from '@/composables/useProduct'

const { products, fetchProducts } = useProduct()    ↓ decide
</script>

```## 🔄 Flujo de Datos ---Repository Interface (IUserRepository)- **Formato**: `usePascalCase.ts`
## 📊 Ejemplo Completo: User``` ```Vista (UsersView.vue) ↓ implementa- **Ejemplos**: `useUser.ts`,
`useAuth.ts`, `useProduct.ts` User Entity Flow: ───────────────── ↓ domain/entities/User.ts →
Interface UserComposable (useUser.ts)UserApiRepository ← Axios → API
domain/repositories/IUserRepository.ts → Contract ↓ repositories/UserApiRepository.ts → API
Implementation repositories/UserStoreRepository.ts → Store ImplementationUse Case (GetAllUsers.ts)
o## 🎯 Importaciones Correctas stores/user.store.ts → Pinia Store (cache) ↓ decide
services/user/GetAllUsers.ts → Business Logic (Use Case)Repository Interface
(IUserRepository)UserStoreRepository ← Pinia → Store composables/useUser.ts → Vue Composable ↓
implementa views/UsersView.vue → UI ComponentUserApiRepository ← Axios → API``````typescript
```````

    o

---

UserStoreRepository ← Pinia → Store// Config

## 🎯 Ventajas de esta Estructura

`````

1. **Separación Clara** - Cada capa tiene responsabilidad única

2. **Testeable** - Fácil mock de dependencias## 📁 Descripción de Carpetasimport { API_CONFIG, API_ENDPOINTS } from '@/config/apiConfig'

3. **Escalable** - Agregar features sin modificar existentes

4. **Mantenible** - Código organizado y predecible---

5. **Type-Safe** - TypeScript en toda la cadena

6. **Convenciones** - Sigue estándares de Vue/Pinia/TypeScript

7. **Simple** - Sin kebab-case en carpetas

## 📁 Descripción de Carpetas

---

### `domain/`// Services

## 🤔 FAQ sobre Naming

### `domain/`

### ¿Por qué `user.store.ts` y no `UserStore.ts`?

**Propósito**: Núcleo del negocio, sin dependencias externas**Propósito**: Núcleo del negocio, sin dependencias externasimport { httpClient } from '@/services/httpClient'

**Respuesta**: Convención oficial de Pinia y ecosistema Vue.



**Ventajas de `user.store.ts`**:

- ✅ Refleja el ID del store: `defineStore('user', ...)`- `entities/` - Modelos de dominio (User, Post, etc.)import { userService } from '@/services/userService'

- ✅ Namespace visual con sufijo `.store`

- ✅ Agrupa archivos relacionados alfabéticamente- `repositories/` - Contratos (interfaces) que definen operaciones

- ✅ Diferencia clara de clases (`UserRepository.ts`)

- `entities/` - Modelos de dominio (User, Post, etc.)

**`UserStore.ts` también es válido** si tu equipo prefiere PascalCase estricto, pero pierde las ventajas arriba mencionadas.

**Naming**: `PascalCase.ts` para entidades e interfaces

---

- `repositories/` - Contratos (interfaces) que definen operaciones// Stores

### ¿Por qué `services/` y no `use-cases/`?

---

**Respuesta**: Simplicidad y consistencia.

import { useUserStore } from '@/stores/userStore'

**Ventajas de `services/`**:

- ✅ Sin guiones (más simple de escribir)### `services/`

- ✅ Consistente con otras carpetas (`repositories`, `composables`)

- ✅ Nombre más común en el ecosistema**Propósito**: Lógica de negocio aislada### `services/`

- ✅ Más corto



**Nota**: Los archivos dentro siguen siendo Use Cases (clases de lógica de negocio), solo el nombre de la carpeta cambió por simplicidad.

- Decide cuándo usar API o Store**Propósito**: Lógica de negocio aislada// Interfaces

---

- Orquesta repositorios

**Arquitectura**: Hexagonal (Ports & Adapters) simplificada

**Convenciones**: Vue 3 + Pinia + TypeScript  - Sincroniza cacheimport type { User, UserCreateDTO } from '@/interfaces/userInterface'

**Naming**: PascalCase para clases, camelCase.store para stores, lowercase para carpetas



**Naming**: `PascalCase.ts` (son clases)- Decide cuándo usar API o Storeimport type { ApiResponse, ApiError } from '@/interfaces/commonInterface'



---- Orquesta repositorios



### `repositories/`- Sincroniza cache// Composables

**Propósito**: Implementaciones de contratos

import { useUser } from '@/composables/useUser'

- `*ApiRepository.ts` - Implementación con Axios

- `*StoreRepository.ts` - Implementación con Pinia### `repositories/`



**Naming**: `PascalCase.ts` con sufijo `Repository`**Propósito**: Implementaciones de contratos// Utils



---import { formatDate } from '@/utils/dateUtils'



### `stores/`- `*ApiRepository.ts` - Implementación con Axiosimport { isValidEmail } from '@/utils/validationUtils'

**Propósito**: Estado global reactivo con Pinia

- `*StoreRepository.ts` - Implementación con Pinia

- Cache de datos

- Operaciones CRUD en memoria// Components



**Naming**: `camelCase.store.ts` (convención Pinia)### `stores/`import UserCard from '@/components/UserCard.vue'



---**Propósito**: Estado global reactivo con Pinia



### `api/`// Views

**Propósito**: Configuración HTTP

- Cache de datosimport UsersView from '@/views/UsersView.vue'

- Cliente Axios

- Interceptors- Operaciones CRUD en memoria````

- Manejo de errores



**Naming**: `camelCase.ts`

### `api/`## ✨ Ejemplo de Uso

---

**Propósito**: Configuración HTTP

### `composables/`

**Propósito**: Lógica reutilizable para vistas```vue



- Expone use cases- Cliente Axios<script setup lang="ts">

- Loading/error states

- Reactividad Vue- Interceptorsimport { useUser } from '@/composables/useUser'



**Naming**: `useCamelCase.ts` (convención Vue)- Manejo de erroresimport type { User } from '@/interfaces/userInterface'



---



## 🚀 Agregar Nueva Entidad### `composables/`const { users, loading, fetchUsers } = useUser()



Para agregar `Product`:**Propósito**: Lógica reutilizable para vistas



### 1. DomainonMounted(async () => {

`````

domain/- Expone use cases await fetchUsers()

├── entities/Product.ts

└── repositories/IProductRepository.ts- Loading/error states})

```

- Reactividad Vue</script>

### 2. Repositories

```

repositories/

├── ProductApiRepository.ts## 🚀 Agregar Nueva Entidad<template>

└── ProductStoreRepository.ts

```<div v-if="loading">Loading...</div>



### 3. StorePara agregar `Product`:  <div v-else>

```

stores/product.store.ts ← Nota: camelCase.store.ts <div v-for="user in users" :key="user.id">

```````

1. **Domain**      {{ user.name }}

### 4. Use Cases

``````    </div>

services/

└── product/domain/  </div>

    ├── GetAllProducts.ts

    ├── GetProductById.ts├── entities/Product.ts</template>

    ├── CreateProduct.ts

    ├── UpdateProduct.ts└── repositories/IProductRepository.ts```

    └── DeleteProduct.ts

```````

### 5. Composable## ✅ TODO Correcto Ahora

```

composables/useProduct.ts2. **Repositories**

```

````- ✅ Archivos en una sola carpeta por tipo (no por módulos)

### 6. Vista

```vuerepositories/- ✅ camelCase para archivos TS/JS

<script setup>

import { useProduct } from '@/composables/useProduct'├── ProductApiRepository.ts- ✅ PascalCase para componentes Vue

const { products, fetchProducts } = useProduct()

</script>└── ProductStoreRepository.ts- ✅ Sin puntos en nombres (no `user.service.ts`)

````

```- ✅ Sin guiones en nombres (no `user-service.ts`)

---

- ✅ Estructura plana y clara

## 📊 Ejemplo Completo: User

3. **Store**

````

User Entity Flow:stores/product.store.ts

─────────────────```



domain/entities/User.ts           → Interface User4. **Use Cases**

domain/repositories/IUserRepository.ts → Contract```

services/

repositories/UserApiRepository.ts  → API Implementation└── product/

repositories/UserStoreRepository.ts → Store Implementation    ├── GetAllProducts.ts

    ├── GetProductById.ts

stores/user.store.ts               → Pinia Store (cache)    ├── CreateProduct.ts

    ├── UpdateProduct.ts

services/user/GetAllUsers.ts      → Business Logic    └── DeleteProduct.ts

```

composables/useUser.ts             → Vue Composable

5. **Composable**

views/UsersView.vue                → UI Component```

```composables/useProduct.ts

```

---

6. **Vista**

## 🎯 Ventajas de esta Estructura```vue

<script setup>

1. **Separación Clara** - Cada capa tiene responsabilidad únicaimport { useProduct } from '@/composables/useProduct'

2. **Testeable** - Fácil mock de dependenciasconst { products, fetchProducts } = useProduct()

3. **Escalable** - Agregar features sin modificar existentes</script>

4. **Mantenible** - Código organizado y predecible```

5. **Type-Safe** - TypeScript en toda la cadena

6. **Convenciones** - Sigue estándares de Vue/Pinia/TypeScript## 📊 Ejemplo Completo: User



---```

User Entity Flow:

## 🤔 FAQ sobre Naming─────────────────



### ¿Por qué `user.store.ts` y no `UserStore.ts`?domain/entities/User.ts           → Interface User

domain/repositories/IUserRepository.ts → Contract

**Respuesta**: Convención oficial de Pinia y ecosistema Vue.

repositories/UserApiRepository.ts  → API Implementation

**Ventajas de `user.store.ts`**:repositories/UserStoreRepository.ts → Store Implementation

- ✅ Refleja el ID del store: `defineStore('user', ...)`

- ✅ Namespace visual con sufijo `.store`stores/user.store.ts               → Pinia Store (cache)

- ✅ Agrupa archivos relacionados alfabéticamente

- ✅ Diferencia clara de clases (`UserRepository.ts`)services/user/GetAllUsers.ts      → Business Logic



**`UserStore.ts` también es válido** si tu equipo prefiere PascalCase estricto, pero pierde las ventajas arriba mencionadas.composables/useUser.ts             → Vue Composable



---views/UsersView.vue                → UI Component

```

**Arquitectura**: Hexagonal (Ports & Adapters) simplificada

**Convenciones**: Vue 3 + Pinia + TypeScript## 🎯 Ventajas de esta Estructura


1. **Separación Clara** - Cada capa tiene responsabilidad única
2. **Testeable** - Fácil mock de dependencias
3. **Escalable** - Agregar features sin modificar existentes
4. **Mantenible** - Código organizado y predecible
5. **Type-Safe** - TypeScript en toda la cadena

---

**Arquitectura**: Hexagonal (Ports & Adapters) simplificada
````

```

```
