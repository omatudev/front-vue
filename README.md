# front-vue-ts

> 🚀 **Vue 3 + TypeScript Production Template** with Hexagonal Architecture, Pinia, Axios, and Husky git hooks

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)](https://vuejs.org/)

**Production-ready Vue 3 template** implementing **Hexagonal Architecture** (Ports & Adapters) with intelligent Store-first caching, TypeScript strict mode, and automated git hooks.

## ⭐ Features

- ✅ **Vue 3.5** - Composition API with `<script setup>`
- ✅ **TypeScript 5.9** - Strict mode with full type safety
- ✅ **Hexagonal Architecture** - Clean separation of concerns
- ✅ **Pinia 3.0** - State management with intelligent caching
- ✅ **Axios 1.12** - HTTP client with interceptors
- ✅ **Husky** - Pre-commit hooks with type-checking
- ✅ **Conventional Commits** - Enforced with commitlint
- ✅ **ESLint + Prettier** - Automatic code formatting
- ✅ **Bun** - Fast runtime and package manager
- ✅ **Vite** - Lightning-fast HMR and build

## 🚀 Stack Tecnológico

- **Vue 3.5** - Composition API con `<script setup>`
- **TypeScript 5.9** - Strict mode
- **Pinia 3.0** - State management
- **Axios 1.12** - HTTP client
- **Vue Router 4.5** - SPA routing
- **Bun** - Runtime y package manager
- **Vite** - Build tool
- **Husky** - Git hooks con validación pre-commit
- **Commitlint** - Conventional Commits enforcement

## 📁 Estructura del Proyecto

```
src/
├── domain/              # 🎯 Entidades y contratos (interfaces)
│   ├── entities/        # Modelos de negocio con DTOs
│   └── repositories/    # Interfaces (IUserRepository)
├── services/            # 🎬 Lógica de negocio (Use Cases)
│   └── user/            # GetAll.ts, GetById.ts, Create.ts, Update.ts, Delete.ts
├── repositories/        # 🔌 Implementaciones (API/Store)
│   ├── UserApiRepository.ts
│   └── UserStoreRepository.ts
├── stores/              # 💾 Estado global Pinia (cache)
├── api/                 # 🌐 Axios client con interceptors
├── composables/         # 🎨 Vue composables (useUser)
├── views/               # 📄 Vistas
├── components/          # 🧩 Componentes reutilizables
├── layouts/             # 📐 Layouts
└── router/              # 🛣️ Vue Router
```

## 🏗️ Arquitectura

```
Vista → Composable → Service (Use Case) → Repository → [API | Store]
```

**Cache Inteligente**: Los services verifican primero el Store. Si hay datos, los usa. Si no, consulta la API y actualiza el Store.

## 🎯 Use as Template

### Method 1: GitHub Template (Recommended)

1. Click "Use this template" button on GitHub
2. Create your new repository
3. Clone and start coding!

### Method 2: Manual Clone

```bash
# Clone the repository
git clone https://github.com/yourusername/front-vue-ts.git my-project
cd my-project

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env with your API URL

# Start development
bun dev
```

## 🛠️ Comandos

```bash
bun install    # Instalar dependencias
bun dev        # Desarrollo (localhost:5173)
bun build      # Build producción
bun preview    # Preview build
bun lint       # ESLint + Oxlint
bun format     # Prettier
bun clean      # Limpiar dist y node_modules
bun reset      # clean + install
```

## 🪝 Git Hooks (Husky)

Este proyecto tiene **validaciones automáticas** en cada commit:

- **Pre-commit**: Prettier + ESLint + TypeScript type-check
- **Commit-msg**: Valida formato Conventional Commits

```bash
# Ejemplo de commit válido
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login bug"
git commit -m "docs: update README"
```

Ver [HUSKY.md](./HUSKY.md) para más detalles.

## 🌍 Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
VITE_API_BASE_URL=https://api.omatu.dev
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Vue Hexagonal App
```

## 📖 Uso Rápido

### En una Vista

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

const { users, loading, error, fetchUsers } = useUser()

onMounted(() => {
  fetchUsers() // Primera vez: API → Store
  // Próximas veces: Store (cache) ✅
})
</script>

<template>
  <div v-if="loading">Cargando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else v-for="user in users" :key="user.id">
    {{ user.name }}
  </div>
</template>
```

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

### Crear un Service

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
    // Cache-first: verificar Store
    if (!forceRefresh && this.store.hasUser(id)) {
      return this.store.getUserById(id)!
    }

    // No hay cache: consultar API y guardar
    const user = await this.apiRepository.getById(id)
    this.store.setUser(user)
    return user
  }
}
```

## 📚 Documentación Adicional

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura hexagonal detallada
- **[STRUCTURE.md](./STRUCTURE.md)** - Convenciones y estándares de código
- **[QUICKSTART.md](./QUICKSTART.md)** - Crear nuevos features paso a paso
- **[EXAMPLES.md](./EXAMPLES.md)** - Ejemplos completos de implementación

## ⚡ Ventajas de esta Arquitectura

- ✅ **Testeable**: Mock fácil de repositorios y services
- ✅ **Intercambiable**: Cambiar origen de datos sin tocar lógica
- ✅ **Escalable**: Agregar features sin romper código existente
- ✅ **SOLID**: Dependency Inversion y Single Responsibility
- ✅ **Performance**: Cache automático Store-first
- ✅ **Type-safe**: TypeScript estricto con interfaces

## 🔧 Configuración

- **API Base URL**: Configurar en `src/api/client.ts`
- **Auth Token**: Auto-inyectado en headers (ver interceptors en `client.ts`)
- **Error Handling**: Centralizado en interceptors de Axios

---

**Creado con Vue 3 + TypeScript + Arquitectura Hexagonal**
}

```

## 📚 Documentación

}
```

## 📚 Documentación Adicional

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura hexagonal detallada
- **[STRUCTURE.md](./STRUCTURE.md)** - Convenciones y estándares de código
- **[QUICKSTART.md](./QUICKSTART.md)** - Crear nuevos features paso a paso
- **[EXAMPLES.md](./EXAMPLES.md)** - Ejemplos completos de implementación

## ⚡ Ventajas de esta Arquitectura

- ✅ **Testeable**: Mock fácil de repositorios y services
- ✅ **Intercambiable**: Cambiar origen de datos sin tocar lógica
- ✅ **Escalable**: Agregar features sin romper código existente
- ✅ **SOLID**: Dependency Inversion y Single Responsibility
- ✅ **Performance**: Cache automático Store-first
- ✅ **Type-safe**: TypeScript estricto con interfaces

## � Configuración

- **API Base URL**: Configurar en `src/api/client.ts`
- **Auth Token**: Auto-inyectado en headers (ver interceptors en `client.ts`)
- **Error Handling**: Centralizado en interceptors de Axios

---

**Creado con Vue 3 + TypeScript + Arquitectura Hexagonal**
