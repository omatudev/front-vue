import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/domain/entities/User'

/**
 * Store de usuarios usando Composition API
 * Maneja el estado global de los usuarios
 */
export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<Map<number, User>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const allUsers = computed(() => Array.from(users.value.values()))

  const getUserById = computed(() => {
    return (id: number): User | undefined => users.value.get(id)
  })

  const hasUser = computed(() => {
    return (id: number): boolean => users.value.has(id)
  })

  // Actions
  function setUsers(userList: User[]) {
    userList.forEach((user) => {
      users.value.set(user.id, user)
    })
  }

  function setUser(user: User) {
    users.value.set(user.id, user)
  }

  function removeUser(id: number) {
    users.value.delete(id)
  }

  function clearUsers() {
    users.value.clear()
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    // State
    users,
    loading,
    error,
    // Getters
    allUsers,
    getUserById,
    hasUser,
    // Actions
    setUsers,
    setUser,
    removeUser,
    clearUsers,
    setLoading,
    setError,
  }
})
