import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { useUserStore } from '@/stores/user.store'

/**
 * Caso de uso: Eliminar un usuario
 * Lógica: Elimina en la API y actualiza el store
 */
export class Delete {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(id: number): Promise<boolean> {
    try {
      console.log(`📡 Deleting user ${id} from API...`)
      const success = await this.apiRepository.delete(id)

      if (success) {
        // Eliminar del store
        this.store.removeUser(id)
      }

      return success
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error)
      throw error
    }
  }
}
