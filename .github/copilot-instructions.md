# GitHub Copilot Instructions

## 📋 Instrucciones para Agentes IA

**IMPORTANTE**: Este proyecto sigue estándares específicos. Lee estos archivos antes de generar código:

1. **SUMMARY.md** - Referencia rápida de estándares (LEER PRIMERO)
2. **STRUCTURE.md** - Convenciones detalladas
3. **EXAMPLES.md** - Ejemplos de código

## 🏗️ Arquitectura

- **Patrón**: Hexagonal (Ports & Adapters) simplificado
- **Stack**: Vue 3.5 + TypeScript 5.9 + Pinia 3.0 + Axios
- **Cache Strategy**: **Store-first** (verificar Store → API si no hay datos)

## 📝 Convenciones Críticas

### ⚠️ REGLA PRINCIPAL: Evitar Redundancia

**El contexto lo da la carpeta, el archivo debe ser conciso.**

✅ **CORRECTO**:

```
services/user/Create.ts       → export class Create
services/user/GetAll.ts       → export class GetAll
```

❌ **INCORRECTO**:

```
services/user/CreateUser.ts      → export class CreateUserUseCase
services/user/GetAllUsers.ts     → export class GetAllUsersUseCase
```

### Tabla de Convenciones

| Concepto     | Patrón             | Ejemplo                             | ❌ NO usar                |
| ------------ | ------------------ | ----------------------------------- | ------------------------- |
| Carpetas     | lowercase          | `services/user/`                    | `use-cases/`, `Services/` |
| Services     | PascalCase.ts      | `GetAll.ts` → `class GetAll`        | `GetAllUsers.ts`          |
| Stores       | camelCase.store.ts | `user.store.ts` → `useUserStore()`  | `userStore.ts`            |
| Composables  | use + camelCase    | `useUser.ts` → `function useUser()` | `UserComposable.ts`       |
| Repositories | PascalCase.ts      | `UserApiRepository.ts`              | `UserRepo.ts`             |
| Interfaces   | I + PascalCase.ts  | `IUserRepository.ts`                | `UserRepository.ts`       |

## 🎯 Estructura de Carpetas

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

## 🔄 Patrón Cache-First (SIEMPRE seguir)

### Lectura (GetAll, GetById)

```typescript
async execute(forceRefresh = false): Promise<User[]> {
  // 1. Cache-first: verificar Store
  if (!forceRefresh && this.store.allUsers.length > 0) {
    return this.store.allUsers
  }

  // 2. No hay cache: consultar API
  const users = await this.apiRepository.getAll()

  // 3. Guardar en Store
  this.store.setUsers(users)

  return users
}
```

### Escritura (Create, Update, Delete)

```typescript
async execute(data: CreateUserDTO): Promise<User> {
  // 1. API primero
  const newUser = await this.apiRepository.create(data)

  // 2. Sincronizar Store
  this.store.setUser(newUser)

  return newUser
}
```

## 🎨 Patrones de Código

### Service (Use Case)

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
    // Cache-first logic here
  }
}
```

### Store (Pinia)

```typescript
// stores/user.store.ts
export const useUserStore = defineStore('user', () => {
  // IMPORTANTE: Usar Map para búsquedas O(1)
  const users = ref<Map<number, User>>(new Map())

  const allUsers = computed(() => Array.from(users.value.values()))
  const getUserById = computed(() => (id: number) => users.value.get(id))
  const hasUser = computed(() => (id: number) => users.value.has(id))

  function setUsers(newUsers: User[]) {
    users.value.clear()
    newUsers.forEach((user) => users.value.set(user.id, user))
  }

  return { users, allUsers, getUserById, hasUser, setUsers }
})
```

### Composable

```typescript
// composables/useUser.ts
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

  return { loading, error, users, fetchUsers }
}
```

### Vista

```vue
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

## 🚫 Reglas Importantes

1. **NO usar kebab-case en carpetas**: `services/user/` NO `use-cases/`
2. **NO redundancia en nombres**: `Create.ts` NO `CreateUser.ts`
3. **Cache-first SIEMPRE**: Verificar Store antes de API
4. **Store read-only**: Mutaciones van a API → sincronizar Store
5. **Map en stores**: `Map<id, Entity>` para búsquedas O(1)
6. **Sin estilos**: No CSS en componentes/vistas
7. **TypeScript strict**: Siempre activado

## 📦 Agregar Nueva Entidad (Checklist)

Para agregar `Product`:

1. ✅ `domain/entities/Product.ts` + DTOs
2. ✅ `domain/repositories/IProductRepository.ts`
3. ✅ `repositories/ProductApiRepository.ts`
4. ✅ `repositories/ProductStoreRepository.ts`
5. ✅ `stores/product.store.ts` con `Map<number, Product>`
6. ✅ `services/product/GetAll.ts`
7. ✅ `services/product/GetById.ts`
8. ✅ `services/product/Create.ts`
9. ✅ `services/product/Update.ts`
10. ✅ `services/product/Delete.ts`
11. ✅ `composables/useProduct.ts`
12. ✅ `views/ProductsView.vue`

## 📚 Documentación de Referencia

- **SUMMARY.md** - Resumen ejecutivo (290 líneas)
- **STRUCTURE.md** - Convenciones completas (1604 líneas)
- **ARCHITECTURE.md** - Arquitectura detallada (1337 líneas)
- **QUICKSTART.md** - Tutorial paso a paso (463 líneas)
- **EXAMPLES.md** - Ejemplos completos (578 líneas)

## 🎯 Orden de Imports

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

---

**Última actualización**: 11 de octubre de 2025

**Cuando generes código, SIEMPRE sigue estas convenciones.**
