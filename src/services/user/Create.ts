import type { User, CreateUserDTO } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { useUserStore } from '@/stores/user.store'

/**
 * Caso de uso: Crear un nuevo usuario
 * Lógica: Siempre crea en la API y actualiza el store
 */
export class Create {
  private apiRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
  }

  async execute(data: CreateUserDTO): Promise<User> {
    try {
      console.log('📡 Creating user in API...')
      const newUser = await this.apiRepository.create(data)

      // Agregar al store
      this.store.setUser(newUser)

      return newUser
    } catch (error) {
      console.error('Error in Create:', error)
      throw error
    }
  }
}
