import type { User, CreateUserDTO, UpdateUserDTO } from '../entities/User'

/**
 * Contrato del repositorio de usuarios
 * Define las operaciones que cualquier implementación debe cumplir
 */
export interface IUserRepository {
  /**
   * Obtener todos los usuarios
   */
  getAll(): Promise<User[]>

  /**
   * Obtener un usuario por ID
   * @param id - ID del usuario
   */
  getById(id: number): Promise<User | null>

  /**
   * Crear un nuevo usuario
   * @param data - Datos del usuario a crear
   */
  create(data: CreateUserDTO): Promise<User>

  /**
   * Actualizar un usuario existente
   * @param data - Datos del usuario a actualizar
   */
  update(data: UpdateUserDTO): Promise<User>

  /**
   * Eliminar un usuario
   * @param id - ID del usuario a eliminar
   */
  delete(id: number): Promise<boolean>
}
