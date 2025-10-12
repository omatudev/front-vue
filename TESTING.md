# Testing Guide (Pendiente)

Este proyecto **no tiene setup de testing** actualmente. Esta guía muestra cómo agregar tests cuando se necesite.

## 🚧 Estado Actual

- ❌ No hay framework de testing instalado
- ❌ No hay tests escritos
- ❌ No hay configuración de Vitest

## ⚡ Cómo Agregar Testing (Vitest)

### 1. Instalar Dependencias

```bash
bun add -D vitest @vue/test-utils jsdom @vitest/ui happy-dom
```

### 2. Crear `vitest.config.ts`

```typescript
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
    },
  })
)
```

### 3. Actualizar `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 4. Ejemplo de Test: Store

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
})
```

### 5. Ejemplo de Test: Service

```typescript
// tests/services/user/GetAll.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { GetAll } from '@/services/user/GetAll'
import type { User } from '@/domain/entities/User'

const mockUsers: User[] = [
  { id: 1, name: 'John', email: 'john@example.com', username: 'john' },
  { id: 2, name: 'Jane', email: 'jane@example.com', username: 'jane' },
]

describe('GetAll Service', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should fetch users from API when store is empty', async () => {
    const service = new GetAll()

    // Mock del repository
    vi.spyOn(service['apiRepository'], 'getAll').mockResolvedValue(mockUsers)

    const result = await service.execute()

    expect(result).toEqual(mockUsers)
    expect(result.length).toBe(2)
  })

  it('should use cache on second call', async () => {
    const service = new GetAll()
    const spy = vi.spyOn(service['apiRepository'], 'getAll').mockResolvedValue(mockUsers)

    await service.execute() // Primera llamada: API
    await service.execute() // Segunda llamada: Cache

    // Solo debe llamar API una vez
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should force refresh when flag is true', async () => {
    const service = new GetAll()
    const spy = vi.spyOn(service['apiRepository'], 'getAll').mockResolvedValue(mockUsers)

    await service.execute() // Primera llamada
    await service.execute(true) // Force refresh

    // Debe llamar API dos veces
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
```

### 6. Ejemplo de Test: Composable

```typescript
// tests/composables/useUser.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUser } from '@/composables/useUser'

describe('useUser Composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with correct default values', () => {
    const { loading, error, users } = useUser()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(users.value).toEqual([])
  })

  it('should set loading state during fetch', async () => {
    const { loading, fetchUsers } = useUser()

    const promise = fetchUsers()
    expect(loading.value).toBe(true)

    await promise
    expect(loading.value).toBe(false)
  })
})
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Pinia](https://pinia.vuejs.org/cookbook/testing.html)

## 🎯 Recomendaciones

1. **Priorizar tests de servicios**: La lógica de negocio es lo más crítico
2. **Tests de stores**: Validar mutaciones y getters
3. **Tests de composables**: Verificar estados reactivos
4. **Tests de componentes**: Solo los más complejos

## 📋 Coverage Recomendado

- **Services**: 80%+ coverage
- **Stores**: 70%+ coverage
- **Composables**: 60%+ coverage
- **Components**: 50%+ coverage (opcional)

---

**Nota**: Esta es una guía. El testing se agregará cuando el proyecto lo requiera.
