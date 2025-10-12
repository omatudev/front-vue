import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { UserStoreRepository } from '@/repositories/UserStoreRepository'
import { useUserStore } from '@/stores/user.store'

/**
 * Caso de uso: Obtener todos los usuarios
 * Lógica: Si el store tiene usuarios, los devuelve. Si no, consulta la API.
 */
export class GetAll {
  private apiRepository: IUserRepository
  private storeRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
    this.storeRepository = new UserStoreRepository()
  }

  async execute(forceRefresh = false): Promise<User[]> {
    try {
      // Si forzamos refresh o el store está vacío, ir a la API
      if (forceRefresh || this.store.allUsers.length === 0) {
        console.log('📡 Fetching users from API...')
        const users = await this.apiRepository.getAll()

        // Guardar en el store para futuros accesos
        this.store.setUsers(users)
        return users
      }

      // Si hay datos en el store, usarlos
      console.log('💾 Using cached users from Store')
      return await this.storeRepository.getAll()
    } catch (error) {
      console.error('Error in GetAll:', error)
      throw error
    }
  }
}
