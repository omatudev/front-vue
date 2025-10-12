# 📚 Ejemplos de Código

Ejemplos completos de implementación siguiendo la arquitectura hexagonal.

## 📖 Tabla de Contenidos

1. [Flujo Completo: GetAll Users](#flujo-completo-getall-users)
2. [Cache-First Strategy](#cache-first-strategy)
3. [Create con Sincronización](#create-con-sincronización)
4. [Error Handling](#error-handling)
5. [Force Refresh](#force-refresh)
6. [Testing con Mocks](#testing-con-mocks)

---

## 1. Flujo Completo: GetAll Users

### Vista

```vue
<!-- views/UsersView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

const { users, loading, error, fetchUsers } = useUser()

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <h1>Users</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</div>
    </div>
  </div>
</template>
```

### Composable

```typescript
// composables/useUser.ts
import { ref, computed } from 'vue'
import type { User } from '@/domain/entities/User'
import { GetAll } from '@/services/user/GetAll'
import { useUserStore } from '@/stores/user.store'

export function useUser() {
  const store = useUserStore()
  const getAllService = new GetAll()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const users = computed(() => store.allUsers)

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

  return { users, loading, error, fetchUsers }
}
```

### Service

```typescript
// services/user/GetAll.ts
import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { useUserStore } from '@/stores/user.store'

export class GetAll {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(forceRefresh = false): Promise<User[]> {
    // 1. Cache-first
    if (!forceRefresh && this.store.allUsers.length > 0) {
      console.log('💾 Using cached users from Store')
      return this.store.allUsers
    }

    // 2. Consultar API
    console.log('📡 Fetching users from API...')
    const users = await this.apiRepository.getAll()

    // 3. Guardar en Store
    this.store.setUsers(users)

    return users
  }
}
```

### Repository

```typescript
// repositories/UserApiRepository.ts
import apiClient from '@/api/client'
import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'

export class UserApiRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/users')
    return data
  }
  // ... otros métodos
}
```

### Store

```typescript
// stores/user.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/domain/entities/User'

export const useUserStore = defineStore('user', () => {
  const users = ref<Map<number, User>>(new Map())

  const allUsers = computed(() => Array.from(users.value.values()))

  function setUsers(newUsers: User[]) {
    users.value.clear()
    newUsers.forEach((user) => users.value.set(user.id, user))
  }

  return { users, allUsers, setUsers }
})
```

---

## 2. Cache-First Strategy

### GetById con Cache

```typescript
// services/user/GetById.ts
import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { useUserStore } from '@/stores/user.store'

export class GetById {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(id: number, forceRefresh = false): Promise<User> {
    // 1. Verificar si existe en Store
    if (!forceRefresh && this.store.hasUser(id)) {
      console.log(`💾 Using cached user ${id} from Store`)
      return this.store.getUserById(id)!
    }

    // 2. No está en cache, consultar API
    console.log(`📡 Fetching user ${id} from API...`)
    const user = await this.apiRepository.getById(id)

    // 3. Guardar en Store para próximas consultas
    this.store.setUser(user)

    return user
  }
}
```

### Uso en Vista

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'

const { fetchUserById } = useUser()
const user = ref(null)

// Primera vez: consulta API
user.value = await fetchUserById(1)

// Segunda vez: usa cache (instantáneo)
user.value = await fetchUserById(1)

// Force refresh: ignora cache
user.value = await fetchUserById(1, true)
</script>
```

---

## 3. Create con Sincronización

### Service

```typescript
// services/user/Create.ts
import type { User, CreateUserDTO } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { useUserStore } from '@/stores/user.store'

export class Create {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(data: CreateUserDTO): Promise<User> {
    try {
      // 1. SIEMPRE crear en API primero
      console.log('📡 Creating user in API...')
      const newUser = await this.apiRepository.create(data)

      // 2. Sincronizar con Store
      this.store.setUser(newUser)
      console.log('✅ User created and synced to Store')

      return newUser
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }
}
```

### Uso en Vista

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'

const { createUser, users } = useUser()

const form = ref({
  name: '',
  email: '',
  username: '',
})

async function handleSubmit() {
  const newUser = await createUser(form.value)

  if (newUser) {
    console.log('Created:', newUser)
    // El Store se actualizó automáticamente
    // `users` es reactive y se actualiza solo
    form.value = { name: '', email: '', username: '' }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" placeholder="Name" />
    <input v-model="form.email" placeholder="Email" />
    <input v-model="form.username" placeholder="Username" />
    <button type="submit">Create User</button>
  </form>

  <div>Total users: {{ users.length }}</div>
</template>
```

---

## 4. Error Handling

### Service con Try/Catch

```typescript
// services/user/Update.ts
import type { User, UpdateUserDTO } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { useUserStore } from '@/stores/user.store'

export class Update {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(data: UpdateUserDTO): Promise<User> {
    try {
      console.log(`📡 Updating user ${data.id} in API...`)
      const updatedUser = await this.apiRepository.update(data)

      // Actualizar Store
      this.store.setUser(updatedUser)
      console.log(`✅ User ${data.id} updated and synced`)

      return updatedUser
    } catch (error) {
      // Log para debugging
      console.error(`Error updating user ${data.id}:`, error)

      // Re-throw para que el composable lo maneje
      throw error
    }
  }
}
```

### Composable con Error State

```typescript
// composables/useUser.ts (fragmento)
async function updateUser(data: UpdateUserDTO): Promise<User | null> {
  loading.value = true
  error.value = null

  try {
    const updatedUser = await updateService.execute(data)
    return updatedUser
  } catch (err) {
    // Manejar diferentes tipos de errores
    if (err instanceof Error) {
      error.value = err.message
    } else if (typeof err === 'string') {
      error.value = err
    } else {
      error.value = `Error al actualizar usuario ${data.id}`
    }

    console.error('Update failed:', err)
    return null
  } finally {
    loading.value = false
  }
}
```

### Vista mostrando Errores

```vue
<script setup lang="ts">
import { useUser } from '@/composables/useUser'

const { error, updateUser } = useUser()

async function handleUpdate(id: number) {
  const result = await updateUser({ id, name: 'New Name' })

  if (!result) {
    // Error handling en UI
    alert('Update failed: ' + error.value)
  }
}
</script>

<template>
  <div v-if="error" class="error-message">⚠️ {{ error }}</div>
</template>
```

---

## 5. Force Refresh

### Uso Práctico

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUser } from '@/composables/useUser'

const { users, loading, fetchUsers } = useUser()
const isRefreshing = ref(false)

onMounted(() => {
  // Carga inicial (usa cache si existe)
  fetchUsers()
})

async function handleRefresh() {
  isRefreshing.value = true

  // Force refresh: siempre consulta API
  await fetchUsers(true)

  isRefreshing.value = false
}

async function handleSoftRefresh() {
  // Soft refresh: usa cache si existe
  await fetchUsers()
}
</script>

<template>
  <div>
    <button @click="handleRefresh" :disabled="loading">
      {{ isRefreshing ? 'Refreshing...' : '🔄 Force Refresh' }}
    </button>

    <button @click="handleSoftRefresh" :disabled="loading">💾 Soft Refresh (cache-first)</button>

    <div v-if="loading">Loading...</div>
    <div v-else>{{ users.length }} users loaded</div>
  </div>
</template>
```

---

## 6. Testing con Mocks

### Mock de Repository

```typescript
// tests/services/GetAll.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GetAll } from '@/services/user/GetAll'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'

const mockUsers: User[] = [
  { id: 1, name: 'John', email: 'john@example.com', username: 'john' },
  { id: 2, name: 'Jane', email: 'jane@example.com', username: 'jane' },
]

const mockRepository: IUserRepository = {
  getAll: vi.fn().mockResolvedValue(mockUsers),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

describe('GetAll Service', () => {
  it('should fetch users from API', async () => {
    const service = new GetAll()
    // Inyectar mock (necesitarías modificar el constructor)

    const result = await service.execute()

    expect(result).toEqual(mockUsers)
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1)
  })

  it('should use cache on second call', async () => {
    const service = new GetAll()

    await service.execute()
    await service.execute() // Segunda vez

    // Solo debe llamar API una vez
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1)
  })

  it('should force refresh when flag is true', async () => {
    const service = new GetAll()

    await service.execute()
    await service.execute(true) // Force refresh

    // Debe llamar API dos veces
    expect(mockRepository.getAll).toHaveBeenCalledTimes(2)
  })
})
```

### Mock de Store

```typescript
// tests/stores/user.store.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '@/stores/user.store'
import type { User } from '@/domain/entities/User'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should set users', () => {
    const store = useUserStore()
    const users: User[] = [{ id: 1, name: 'John', email: 'john@example.com', username: 'john' }]

    store.setUsers(users)

    expect(store.allUsers).toEqual(users)
    expect(store.allUsers.length).toBe(1)
  })

  it('should check if user exists', () => {
    const store = useUserStore()
    const user: User = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      username: 'john',
    }

    store.setUser(user)

    expect(store.hasUser(1)).toBe(true)
    expect(store.hasUser(999)).toBe(false)
  })

  it('should remove user', () => {
    const store = useUserStore()
    const user: User = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      username: 'john',
    }

    store.setUser(user)
    expect(store.hasUser(1)).toBe(true)

    store.removeUser(1)
    expect(store.hasUser(1)).toBe(false)
  })
})
```

---

## 🎯 Resumen de Patrones

| Escenario             | Patrón                                        |
| --------------------- | --------------------------------------------- |
| Primera carga         | Cache-first (verifica Store → API si vacío)   |
| Actualización         | Force refresh con flag `true`                 |
| Crear/Editar/Eliminar | API primero → sincronizar Store               |
| Error handling        | Try/catch en service → propagate a composable |
| Testing               | Mock de IUserRepository                       |

## 📚 Más Información

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura completa
- [STRUCTURE.md](./STRUCTURE.md) - Convenciones y estándares
- [QUICKSTART.md](./QUICKSTART.md) - Crear nuevas entidades
