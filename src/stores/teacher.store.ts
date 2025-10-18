import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTeacherStore = defineStore('teacher', () => {
  const name = ref<string>(localStorage.getItem('teacherName') || '')

  function setName(newName: string) {
    name.value = newName
    localStorage.setItem('teacherName', newName)
  }

  return { name, setName }
})
