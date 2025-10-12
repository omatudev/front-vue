import { ref, computed } from 'vue'
import type { User, CreateUserDTO, UpdateUserDTO } from '@/domain/entities/User'
import { GetAll } from '@/services/user/GetAll'
import { GetById } from '@/services/user/GetById'
import { Create } from '@/services/user/Create'
import { Update } from '@/services/user/Update'
import { Delete } from '@/services/user/Delete'
import { useUserStore } from '@/stores/user.store'

/**
 * Composable para interactuar con usuarios
 * Expone métodos simples que las vistas pueden usar
 */
export function useUser() {
  const store = useUserStore()

  // Use Cases
  const getAllUsersUseCase = new GetAll()
  const getUserByIdUseCase = new GetById()
  const createUserUseCase = new Create()
  const updateUserUseCase = new Update()
  const deleteUserUseCase = new Delete()

  // Estado local del composable
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed desde el store
  const users = computed(() => store.allUsers)
  const hasUsers = computed(() => store.allUsers.length > 0)

  /**
   * Obtener todos los usuarios
   * @param forceRefresh - Si true, siempre consulta la API
   */
  async function fetchUsers(forceRefresh = false) {
    loading.value = true
    error.value = null

    try {
      await getAllUsersUseCase.execute(forceRefresh)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener usuarios'
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener un usuario por ID
   * @param id - ID del usuario
   * @param forceRefresh - Si true, siempre consulta la API
   */
  async function fetchUserById(id: number, forceRefresh = false): Promise<User | null> {
    loading.value = true
    error.value = null

    try {
      const user = await getUserByIdUseCase.execute(id, forceRefresh)
      return user
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Error al obtener usuario ${id}`
      console.error(`Error fetching user ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear un nuevo usuario
   */
  async function createUser(data: CreateUserDTO): Promise<User | null> {
    loading.value = true
    error.value = null

    try {
      const newUser = await createUserUseCase.execute(data)
      return newUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear usuario'
      console.error('Error creating user:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar un usuario existente
   */
  async function updateUser(data: UpdateUserDTO): Promise<User | null> {
    loading.value = true
    error.value = null

    try {
      const updatedUser = await updateUserUseCase.execute(data)
      return updatedUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Error al actualizar usuario ${data.id}`
      console.error(`Error updating user ${data.id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar un usuario
   */
  async function deleteUser(id: number): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const success = await deleteUserUseCase.execute(id)
      return success
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Error al eliminar usuario ${id}`
      console.error(`Error deleting user ${id}:`, err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener un usuario específico del store (sin llamada a API)
   */
  function getUserFromStore(id: number): User | undefined {
    return store.getUserById(id)
  }

  /**
   * Limpiar el store de usuarios
   */
  function clearUsers() {
    store.clearUsers()
  }

  return {
    // Estado
    loading,
    error,
    users,
    hasUsers,
    // Métodos
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserFromStore,
    clearUsers,
  }
}
