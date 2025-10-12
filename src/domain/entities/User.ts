// Entidad de dominio - Modelo de Usuario
export interface User {
  id: number
  name: string
  email: string
  username: string
  phone?: string
  website?: string
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company?: {
    name: string
    catchPhrase: string
    bs: string
  }
}

// DTO para crear/actualizar usuario
export interface CreateUserDTO {
  name: string
  email: string
  username: string
  phone?: string
  website?: string
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  id: number
}
