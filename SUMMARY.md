# 📋 Resumen Ejecutivo para Agentes

**Última actualización**: 11 de octubre de 2025

Este documento contiene los estándares y decisiones clave del proyecto para que cualquier agente pueda trabajar efectivamente.

## 🎯 Arquitectura

- **Patrón**: Hexagonal (Ports & Adapters) simplificado
- **Stack**: Vue 3.5 + TypeScript 5.9 + Pinia 3.0 + Axios + Bun
- **Estrategia de Cache**: **Store-first** (verificar Store → API si no hay datos)

## 📁 Estructura de Carpetas

```
src/
├── domain/              # Entidades + Interfaces (contratos)
├── services/            # Lógica de negocio (Use Cases)
├── repositories/        # Implementaciones (API + Store)
├── stores/              # Pinia stores (cache)
├── api/                 # Axios client
├── composables/         # Vue composables
├── views/               # Vistas
├── components/          # Componentes reutilizables
├── layouts/             # Layouts
└── router/              # Vue Router
```

## 🔤 Convenciones de Nombres

### ⚠️ REGLA CRÍTICA: Evitar Redundancia

**El contexto lo da la carpeta, el archivo debe ser conciso.**

| Concepto     | Patrón             | Ejemplo                             | ❌ NO usar                             |
| ------------ | ------------------ | ----------------------------------- | -------------------------------------- |
| Carpetas     | lowercase          | `services/user/`                    | `use-cases/`, `Services/`              |
| Entidades    | PascalCase.ts      | `User.ts`                           | `user.ts`                              |
| Interfaces   | I + PascalCase.ts  | `IUserRepository.ts`                | `UserRepository.ts`                    |
| Services     | PascalCase.ts      | `GetAll.ts` → `class GetAll`        | `GetAllUsers.ts`, `GetAllUsersUseCase` |
| Repositories | PascalCase.ts      | `UserApiRepository.ts`              | `UserRepository.ts`                    |
| Stores       | camelCase.store.ts | `user.store.ts` → `useUserStore()`  | `userStore.ts`, `User.store.ts`        |
| Composables  | camelCase.ts + use | `useUser.ts` → `function useUser()` | `UserComposable.ts`                    |
| Componentes  | PascalCase.vue     | `UserCard.vue`                      | `userCard.vue`                         |
| Vistas       | PascalCaseView.vue | `UsersView.vue`                     | `users.vue`                            |

### Ejemplos Correctos vs Incorrectos

✅ **BIEN**:

```
services/user/GetAll.ts       → export class GetAll
services/user/Create.ts       → export class Create
stores/user.store.ts          → export const useUserStore
composables/useUser.ts        → export function useUser
```

❌ **MAL**:

```
services/user/GetAllUsers.ts     → export class GetAllUsersUseCase
use-cases/user/GetAllUsers.ts    → (kebab-case en carpetas)
stores/userStore.ts              → (sin .store.ts)
composables/UserComposable.ts    → (sin use prefix)
```

## 🏗️ Patrones de Código

### 1. Domain Layer (Contratos)

```typescript
// domain/entities/User.ts
export interface User {
  id: number
  name: string
  email: string
}

export type CreateUserDTO = Omit<User, 'id'>
export type UpdateUserDTO = Partial<User> & { id: number }

// domain/repositories/IUserRepository.ts
export interface IUserRepository {
  getAll(): Promise<User[]>
  getById(id: number): Promise<User>
  create(data: CreateUserDTO): Promise<User>
  update(data: UpdateUserDTO): Promise<User>
  delete(id: number): Promise<boolean>
}
```

### 2. Service Layer (Lógica de Negocio)

**Patrón Cache-First**:

```typescript
// services/user/GetAll.ts
export class GetAll {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(forceRefresh = false): Promise<User[]> {
    // 1. Cache-first
    if (!forceRefresh && this.store.allUsers.length > 0) {
      return this.store.allUsers
    }

    // 2. API + guardar en Store
    const users = await this.apiRepository.getAll()
    this.store.setUsers(users)
    return users
  }
}
```

**Mutaciones (Create/Update/Delete)**:

```typescript
// services/user/Create.ts
export class Create {
  async execute(data: CreateUserDTO): Promise<User> {
    // 1. API primero
    const newUser = await this.apiRepository.create(data)

    // 2. Sincronizar Store
    this.store.setUser(newUser)

    return newUser
  }
}
```

### 3. Repository Layer

```typescript
// repositories/UserApiRepository.ts
export class UserApiRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/users')
    return data
  }
}

// repositories/UserStoreRepository.ts
export class UserStoreRepository implements IUserRepository {
  private store = useUserStore()

  async getAll(): Promise<User[]> {
    return this.store.allUsers
  }

  async create(): Promise<User> {
    throw new Error('Create not supported in Store')
  }
}
```

**Nota**: Store es READ-ONLY para cache. Mutaciones van siempre a API primero.

### 4. Store Layer (Pinia)

```typescript
// stores/user.store.ts
export const useUserStore = defineStore('user', () => {
  // State con Map para O(1) lookups
  const users = ref<Map<number, User>>(new Map())

  // Getters computed
  const allUsers = computed(() => Array.from(users.value.values()))
  const getUserById = computed(() => (id: number) => users.value.get(id))
  const hasUser = computed(() => (id: number) => users.value.has(id))

  // Actions
  function setUsers(newUsers: User[]) {
    users.value.clear()
    newUsers.forEach((user) => users.value.set(user.id, user))
  }

  function setUser(user: User) {
    users.value.set(user.id, user)
  }

  function removeUser(id: number) {
    users.value.delete(id)
  }

  return { users, allUsers, getUserById, hasUser, setUsers, setUser, removeUser }
})
```

**Decisión**: Usar `Map<id, Entity>` en lugar de arrays para búsquedas O(1).

### 5. Composable Layer

```typescript
// composables/useUser.ts
export function useUser() {
  const store = useUserStore()

  // Instanciar services
  const getAllService = new GetAll()
  const createService = new Create()

  // Estado local
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed desde store
  const users = computed(() => store.allUsers)

  // Métodos
  async function fetchUsers(forceRefresh = false) {
    loading.value = true
    error.value = null
    try {
      await getAllService.execute(forceRefresh)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, users, fetchUsers }
}
```

### 6. View Layer

```vue
<!-- views/UsersView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

const { users, loading, fetchUsers } = useUser()

onMounted(() => fetchUsers())
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-for="user in users" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
```

**Reglas**:

- `<script setup>` + TypeScript
- No estilos inline ni CSS
- Solo lógica de presentación

## 🔄 Flujo de Datos

```
Vista → Composable → Service → Repository → [API | Store]
                                    ↓
                                  Store (sync)
```

**Lectura (GetAll, GetById)**:

1. Service verifica Store
2. Si no hay datos → API
3. Guardar en Store
4. Retornar datos

**Escritura (Create, Update, Delete)**:

1. Service llama API
2. Sincroniza Store
3. Retornar resultado

## 📊 TypeScript

- **Strict mode**: Siempre activado
- **Interfaces**: Para contratos y entidades
- **Types**: Para DTOs y uniones
- **Prefijo `I`**: Solo para interfaces de contratos (`IUserRepository`)

```typescript
// Interface para contrato
export interface IUserRepository {}

// Interface para entidad
export interface User {}

// Type para DTO
export type CreateUserDTO = Omit<User, 'id'>
```

## 🎨 Orden de Imports

```typescript
// 1. Vue / Librerías externas
import { ref, computed } from 'vue'

// 2. Types
import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'

// 3. Services
import { GetAll } from '@/services/user/GetAll'

// 4. Repositories
import { UserApiRepository } from '@/repositories/UserApiRepository'

// 5. Stores
import { useUserStore } from '@/stores/user.store'

// 6. Utils
import { formatDate } from '@/utils/date'
```

## ⚠️ Reglas Importantes

1. **No kebab-case en carpetas**: `services/user/` NO `use-cases/`
2. **No redundancia**: `services/user/Create.ts` NO `CreateUser.ts`
3. **Cache-first**: Siempre verificar Store antes de API
4. **Store read-only**: Mutaciones van a API → sincronizar Store
5. **Map en stores**: `Map<id, Entity>` para búsquedas O(1)
6. **Sin estilos**: No CSS en componentes/vistas
7. **Composables con `use` prefix**: `useUser`, `useProduct`
8. **Stores con `.store.ts`**: `user.store.ts` → `useUserStore()`

## 🚀 Agregar Nueva Entidad (Checklist)

Para agregar `Product`:

- [ ] `domain/entities/Product.ts` + DTOs
- [ ] `domain/repositories/IProductRepository.ts`
- [ ] `repositories/ProductApiRepository.ts`
- [ ] `repositories/ProductStoreRepository.ts`
- [ ] `stores/product.store.ts` con Map
- [ ] `services/product/GetAll.ts`
- [ ] `services/product/GetById.ts`
- [ ] `services/product/Create.ts`
- [ ] `services/product/Update.ts`
- [ ] `services/product/Delete.ts`
- [ ] `composables/useProduct.ts`
- [ ] `views/ProductsView.vue`

## 📚 Documentación Disponible

- **README.md** (188 líneas) - Overview y quick start
- **ARCHITECTURE.md** (1337 líneas) - Arquitectura hexagonal detallada
- **STRUCTURE.md** (1604 líneas) - Convenciones y estándares completos
- **QUICKSTART.md** (463 líneas) - Crear nuevas entidades paso a paso
- **EXAMPLES.md** (578 líneas) - Ejemplos de código completos

## 🎯 Comandos Útiles

```bash
bun install      # Instalar dependencias
bun dev          # Desarrollo
bun build        # Build producción
bun lint         # ESLint
bun type-check   # TypeScript check
```

---

**Este documento es la referencia rápida para cualquier agente trabajando en el proyecto.**
