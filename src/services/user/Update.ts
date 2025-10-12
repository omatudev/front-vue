import type { User, UpdateUserDTO } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { useUserStore } from '@/stores/user.store'

/**
 * Caso de uso: Actualizar un usuario existente
 * Lógica: Actualiza en la API y sincroniza con el store
 */
export class Update {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(data: UpdateUserDTO): Promise<User> {
    try {
      console.log(`📡 Updating user ${data.id} in API...`)
      const updatedUser = await this.apiRepository.update(data)

      // Actualizar en el store
      this.store.setUser(updatedUser)

      return updatedUser
    } catch (error) {
      console.error(`Error updating user ${data.id}:`, error)
      throw error
    }
  }
}
