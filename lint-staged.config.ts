export default {
  // Solo formatear - sin type-check
  '*.{js,ts,vue}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,css}': ['prettier --write'],
}
