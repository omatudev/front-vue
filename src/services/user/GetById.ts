import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserApiRepository } from '@/repositories/UserApiRepository'
import { UserStoreRepository } from '@/repositories/UserStoreRepository'
import { useUserStore } from '@/stores/user.store'

/**
 * Caso de uso: Obtener un usuario por ID
 * Lógica: Primero busca en el store. Si no existe, consulta la API.
 */
export class GetById {
  private apiRepository: IUserRepository
  private storeRepository: IUserRepository
  private store = useUserStore()

  constructor() {
    this.apiRepository = new UserApiRepository()
    this.storeRepository = new UserStoreRepository()
  }

  async execute(id: number, forceRefresh = false): Promise<User | null> {
    try {
      // Si forzamos refresh o no existe en el store, ir a la API
      if (forceRefresh || !this.store.hasUser(id)) {
        console.log(`📡 Fetching user ${id} from API...`)
        const user = await this.apiRepository.getById(id)

        // Si encontramos el usuario, guardarlo en el store
        if (user) {
          this.store.setUser(user)
        }
        return user
      }

      // Si existe en el store, usarlo
      console.log(`💾 Using cached user ${id} from Store`)
      return await this.storeRepository.getById(id)
    } catch (error) {
      console.error(`Error in GetById for user ${id}:`, error)
      throw error
    }
  }
}
