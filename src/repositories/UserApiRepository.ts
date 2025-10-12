import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User, CreateUserDTO, UpdateUserDTO } from '@/domain/entities/User'
import apiClient from '@/api/client'

/**
 * Implementación del repositorio que obtiene datos desde la API
 */
export class UserApiRepository implements IUserRepository {
  private readonly endpoint = '/users'

  async getAll(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(this.endpoint)
      return response.data
    } catch (error) {
      console.error('Error fetching users from API:', error)
      throw new Error('No se pudieron obtener los usuarios')
    }
  }

  async getById(id: number): Promise<User | null> {
    try {
      const response = await apiClient.get<User>(`${this.endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching user ${id} from API:`, error)
      return null
    }
  }

  async create(data: CreateUserDTO): Promise<User> {
    try {
      const response = await apiClient.post<User>(this.endpoint, data)
      return response.data
    } catch (error) {
      console.error('Error creating user in API:', error)
      throw new Error('No se pudo crear el usuario')
    }
  }

  async update(data: UpdateUserDTO): Promise<User> {
    try {
      const response = await apiClient.put<User>(`${this.endpoint}/${data.id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating user ${data.id} in API:`, error)
      throw new Error('No se pudo actualizar el usuario')
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`)
      return true
    } catch (error) {
      console.error(`Error deleting user ${id} from API:`, error)
      return false
    }
  }
}
