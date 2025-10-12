import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User, CreateUserDTO, UpdateUserDTO } from '@/domain/entities/User'
import { useUserStore } from '@/stores/user.store'

/**
 * Implementación del repositorio que obtiene datos desde el Store de Pinia
 * Útil para leer datos cacheados sin hacer llamadas a la API
 */
export class UserStoreRepository implements IUserRepository {
  private store = useUserStore()

  async getAll(): Promise<User[]> {
    return Promise.resolve(this.store.allUsers)
  }

  async getById(id: number): Promise<User | null> {
    const user = this.store.getUserById(id)
    return Promise.resolve(user || null)
  }

  async create(_data: CreateUserDTO): Promise<User> {
    // El store no crea usuarios, esto debería ir a la API
    // Aquí solo para cumplir con el contrato
    throw new Error('Create operation not supported in StoreRepository')
  }

  async update(data: UpdateUserDTO): Promise<User> {
    // Actualizar en el store local
    const existingUser = this.store.getUserById(data.id)
    if (!existingUser) {
      throw new Error(`User with id ${data.id} not found in store`)
    }

    const updatedUser = { ...existingUser, ...data }
    this.store.setUser(updatedUser)
    return Promise.resolve(updatedUser)
  }

  async delete(id: number): Promise<boolean> {
    this.store.removeUser(id)
    return Promise.resolve(true)
  }
}
