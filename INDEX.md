# 📚 Índice de Documentación - front-vue-ts

Guía de navegación completa del template.

## 🎯 Inicio Rápido

**¿Primera vez aquí?** Lee en este orden:

1. **[README.md](./README.md)** - Overview del template y setup inicial
2. **[SUMMARY.md](./SUMMARY.md)** - Resumen ejecutivo de estándares (para agentes IA)
3. **[HUSKY.md](./HUSKY.md)** - Git hooks y Conventional Commits
4. **[QUICKSTART.md](./QUICKSTART.md)** - Crear tu primera entidad paso a paso

## 📖 Documentación Completa (8 archivos)

### 1. README.md (240+ líneas)

**Propósito**: Documentación principal del template

- Características y features
- Stack tecnológico completo
- Uso como template en GitHub
- Comandos disponibles
- Variables de entorno
- Guía de git hooks
- Ejemplo básico de uso

### 2. SUMMARY.md (290 líneas)

**Propósito**: Referencia rápida para agentes IA y desarrolladores

- Tabla de convenciones de nombres
- Patrones de código compactos
- Reglas críticas destacadas
- Checklist para agregar entidad
- Flujo de datos simplificado

### 3. HUSKY.md (170 líneas)

**Propósito**: Guía de git hooks y commits

- Configuración de Husky
- Conventional Commits explicado
- Tipos de commit permitidos
- Ejemplos correctos/incorrectos
- Cómo resolver errores
- Bypass de validaciones (emergencias)

### 4. ARCHITECTURE.md (1337 líneas)

**Propósito**: Arquitectura hexagonal detallada

- Capas del sistema explicadas
- Flujo de datos completo
- Domain, Services, Repositories
- Store pattern con Pinia
- Composable pattern
- Ventajas de la arquitectura

### 5. STRUCTURE.md (1604 líneas)

**Propósito**: Convenciones y estándares del proyecto

- Convenciones de nombres (archivos, carpetas, clases)
- Patrones de código (Repository, Service, Store)
- Reglas importantes (evitar redundancia, lowercase folders)
- Checklist para agregar nueva entidad
- Orden de imports correcto
- Ejemplos correctos vs incorrectos

### 6. QUICKSTART.md (463 líneas)

**Propósito**: Tutorial práctico paso a paso

- Crear entidad `Product` completa
- Código de todas las capas:
  - Domain (entities + repositories)
  - Repositories (API + Store)
  - Store (Pinia)
  - Services (Use Cases)
  - Composable
  - Vista
- Tips y mejores prácticas

### 7. EXAMPLES.md (578 líneas)

**Propósito**: Ejemplos de código completos

- Flujo completo GetAll Users
- Cache-first strategy
- Create con sincronización
- Error handling
- Force refresh
- Testing con mocks (para cuando se implemente)

### 8. TESTING.md (200 líneas)

**Propósito**: Guía de testing (para implementación futura)

- Setup de Vitest (cuando se necesite)
- Ejemplos de tests de stores
- Ejemplos de tests de services
- Ejemplos de tests de composables
- Coverage recomendado
- **Nota**: El proyecto NO tiene testing actualmente

## 🗂️ Por Tema

### Convenciones de Nombres

- **STRUCTURE.md** → Sección "Convenciones de Nombres"
- **SUMMARY.md** → Tabla completa de convenciones

### Git Hooks y Commits

- **HUSKY.md** → Configuración completa de Husky
- **README.md** → Sección "Git Hooks"

### Cache Strategy

- **ARCHITECTURE.md** → Sección "Service Layer"
- **EXAMPLES.md** → Sección "Cache-First Strategy"

### Error Handling

- **EXAMPLES.md** → Sección "Error Handling"
- **ARCHITECTURE.md** → Sección "Composable Layer"

### Testing (Pendiente)

- **TESTING.md** → Guía completa de Vitest

### Agregar Nueva Entidad

- **QUICKSTART.md** → Todo el documento
- **STRUCTURE.md** → Sección "Agregar Nueva Entidad"
- **SUMMARY.md** → Checklist rápido

## 📊 Resumen de Documentación

| Documento           | Líneas | Propósito                   | Audiencia              |
| ------------------- | ------ | --------------------------- | ---------------------- |
| **README.md**       | 240    | Overview y setup            | Todos                  |
| **SUMMARY.md**      | 290    | Referencia rápida           | Agentes/AI             |
| **HUSKY.md**        | 170    | Git hooks y commits         | Desarrolladores        |
| **ARCHITECTURE.md** | 1337   | Arquitectura completa       | Arquitectos/Seniors    |
| **STRUCTURE.md**    | 1604   | Estándares detallados       | Todos                  |
| **QUICKSTART.md**   | 463    | Tutorial práctico           | Desarrolladores nuevos |
| **EXAMPLES.md**     | 578    | Ejemplos de código          | Desarrolladores        |
| **TESTING.md**      | 200    | Guía de testing (pendiente) | Desarrolladores        |
| **INDEX.md**        | 243    | Índice de navegación        | Todos                  |

**Total**: 8 archivos principales + INDEX.md = ~5000 líneas de documentación

## 🎯 Uso Recomendado

### Si eres un Agente/AI

1. **Leer primero**: SUMMARY.md
2. **Consultar**: STRUCTURE.md (convenciones)
3. **Ejemplos**: EXAMPLES.md

### Si eres Developer Junior

1. **Leer primero**: README.md
2. **Tutorial**: QUICKSTART.md
3. **Consultar**: EXAMPLES.md

### Si eres Developer Senior

1. **Leer primero**: README.md + ARCHITECTURE.md
2. **Referencia**: STRUCTURE.md
3. **Profundizar**: ARCHITECTURE.md

### Si vas a Onboardear a alguien

1. README.md (5 min)
2. ARCHITECTURE.md - Sección "Flujo de Datos" (10 min)
3. QUICKSTART.md (20 min)
4. Hands-on: Crear una entidad nueva siguiendo QUICKSTART.md

## 🔍 Buscar Información

### "¿Cómo nombro un archivo service?"

→ **STRUCTURE.md** sección "Convenciones de Nombres" → Services
→ **SUMMARY.md** tabla de convenciones

Respuesta: `services/user/GetAll.ts` → `export class GetAll`

### "¿Cómo funciona el cache?"

→ **ARCHITECTURE.md** sección "Service Layer"
→ **EXAMPLES.md** sección "Cache-First Strategy"

Respuesta: Verifica Store → Si no hay datos → API → Guarda en Store

### "¿Cómo creo una nueva entidad?"

→ **QUICKSTART.md** (todo el documento)
→ **SUMMARY.md** sección "Agregar Nueva Entidad"

Respuesta: 7 pasos (Domain → Repository → Store → Services → Composable → View)

### "¿Por qué usar Map en stores?"

→ **ARCHITECTURE.md** sección "Store Layer"
→ **SUMMARY.md** nota en "Store Layer"

Respuesta: Búsquedas O(1) vs O(n) con arrays

### "¿Cómo testeo un service?"

→ **EXAMPLES.md** sección "Testing con Mocks"

Respuesta: Mock de IUserRepository con vitest

## 📁 Estructura de la Documentación

```
/
├── README.md           # 📘 Overview y setup
├── INDEX.md            # 📑 Este archivo (navegación)
├── SUMMARY.md          # 📋 Referencia rápida para agentes
│
├── ARCHITECTURE.md     # 🏗️ Arquitectura detallada
├── STRUCTURE.md        # 📂 Convenciones y estándares
│
├── QUICKSTART.md       # ⚡ Tutorial paso a paso
└── EXAMPLES.md         # 📚 Ejemplos de código
```

## 🚀 Quick Links

- [Ver estructura del proyecto](./STRUCTURE.md#estructura-de-carpetas)
- [Convenciones de nombres](./STRUCTURE.md#convenciones-de-nombres)
- [Flujo de datos](./ARCHITECTURE.md#flujo-de-datos)
- [Cache strategy](./ARCHITECTURE.md#service-layer)
- [Agregar entidad](./QUICKSTART.md#crear-nueva-entidad-paso-a-paso)
- [Ejemplos completos](./EXAMPLES.md)
- [Estándares para agentes](./SUMMARY.md)

---

**Documentación actualizada**: 11 de octubre de 2025
