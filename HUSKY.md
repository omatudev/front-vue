# 🪝 Git Hooks con Husky

Este proyecto usa **Husky v10** para ejecutar validaciones automáticas antes de cada commit.

## 🔍 Validaciones Automáticas

### Pre-commit Hook

Antes de cada commit, se ejecutan automáticamente:

1. **Prettier** - Formateo automático del código
2. **ESLint** - Corrección automática de errores de linting

**Nota**: El type-check de TypeScript NO se ejecuta en pre-commit para mantener los commits rápidos. Debe ejecutarse manualmente antes de hacer push.

```bash
# Ejecutar type-check manualmente
bun run type-check
```

### Commit Message Hook

Valida que el mensaje de commit siga el estándar **Conventional Commits**.

## 📝 Formato de Commits (Conventional Commits)

### Estructura

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types Permitidos

| Type       | Descripción                                     | Ejemplo                                 |
| ---------- | ----------------------------------------------- | --------------------------------------- |
| `feat`     | Nueva funcionalidad                             | `feat: add user authentication`         |
| `fix`      | Corrección de bugs                              | `fix: resolve login validation bug`     |
| `docs`     | Cambios en documentación                        | `docs: update API documentation`        |
| `style`    | Cambios de formato (sin afectar lógica)         | `style: format code with prettier`      |
| `refactor` | Refactorización (sin agregar features ni fixes) | `refactor: simplify user service`       |
| `perf`     | Mejoras de performance                          | `perf: optimize database queries`       |
| `test`     | Agregar o corregir tests                        | `test: add unit tests for user service` |
| `chore`    | Cambios en build o herramientas                 | `chore: update dependencies`            |
| `ci`       | Cambios en CI/CD                                | `ci: add deployment workflow`           |
| `build`    | Cambios en sistema de build                     | `build: configure vite for production`  |
| `revert`   | Revertir commits previos                        | `revert: revert commit abc123`          |

### Ejemplos

✅ **Correctos**:

```bash
git commit -m "feat: add login functionality"
git commit -m "fix: resolve memory leak in user service"
git commit -m "docs: update README with installation steps"
git commit -m "refactor(user): simplify validation logic"
git commit -m "perf: improve API response time"
```

❌ **Incorrectos**:

```bash
git commit -m "Added new feature"           # No sigue formato
git commit -m "Fix bug"                     # No descriptivo
git commit -m "Update code"                 # Muy genérico
git commit -m "feat: Add user login."       # No debe terminar en punto
git commit -m "FEAT: add login"             # Type debe ser lowercase
```

## 🚫 Si el commit falla

### Errores de Formato

```bash
❌ Commit message does not follow Conventional Commits format.

Examples:
  feat: add user authentication
  fix: resolve login bug
  docs: update README with setup instructions

Format: <type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert
```

**Solución**: Reescribe el mensaje siguiendo el formato correcto.

### Errores de Tipos (TypeScript)

```bash
src/services/user/GetAll.ts:10:15 - error TS2339: Property 'name' does not exist on type 'User'.

❌ Pre-commit check failed. Fix errors before committing.
```

**Solución**: Corrige los errores de tipos antes de commitear.

### Errores de Linting

```bash
src/components/UserCard.vue
  5:7  error  'user' is assigned a value but never used  @typescript-eslint/no-unused-vars

❌ Pre-commit check failed. Fix errors before committing.
```

**Solución**: Corrige los errores de linting o ejecuta `bun run lint` para auto-fix.

## 🛠️ Bypass de Validaciones (NO RECOMENDADO)

Si necesitas hacer commit sin validaciones (emergencias solamente):

```bash
git commit -m "fix: emergency hotfix" --no-verify
```

⚠️ **ADVERTENCIA**: Solo usar en casos extremos. Siempre es mejor corregir los errores.

## 🔧 Configuración

Los hooks están configurados en:

- **Pre-commit**: `.husky/pre-commit`
- **Commit-msg**: `.husky/commit-msg`
- **Lint-staged**: `lint-staged.config.ts`
- **Commitlint**: `commitlint.config.ts`

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint](https://commitlint.js.org/)
- [Lint-staged](https://github.com/okonet/lint-staged)

---

**✨ Buenas prácticas = Código de calidad**
