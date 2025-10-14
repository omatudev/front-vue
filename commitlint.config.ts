export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bugs
        'docs', // Cambios en documentación
        'style', // Cambios de formato (sin afectar código)
        'refactor', // Refactorización (sin agregar features ni arreglar bugs)
        'perf', // Mejoras de performance
        'test', // Agregar o corregir tests
        'chore', // Cambios en build o herramientas
        'ci', // Cambios en CI/CD
        'build', // Cambios en build system
        'revert', // Revertir commits previos
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-case': [0], // Deshabilitado para permitir mensajes generados por IA
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
}
