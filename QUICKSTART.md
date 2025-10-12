# ⚡ Guía Rápida

Guía paso a paso para trabajar con este proyecto de arquitectura hexagonal.

## 🚀 Inicio Rápido

```bash
bun install          # Instalar dependencias
bun dev              # Desarrollo (localhost:5173)
bun build            # Build producción
bun lint             # ESLint
```

## 📝 Crear Nueva Entidad paso a paso

### Ejemplo: Agregar entidad `Product`

#### 1. Domain Layer - Entidad y Contrato

```typescript
// domain/entities/Product.ts
export interface Product {
  id: number
  name: string
  price: number
  description: string
}

export type CreateProductDTO = Omit<Product, 'id'>
export type UpdateProductDTO = Partial<Product> & { id: number }
```

```typescript
// domain/repositories/IProductRepository.ts
import type { Product, CreateProductDTO, UpdateProductDTO } from '../entities/Product'

export interface IProductRepository {
  getAll(): Promise<Product[]>
  getById(id: number): Promise<Product>
  create(data: CreateProductDTO): Promise<Product>
  update(data: UpdateProductDTO): Promise<Product>
  delete(id: number): Promise<boolean>
}
```

#### 2. Repository Layer - Implementaciones

```typescript
// repositories/ProductApiRepository.ts
import apiClient from '@/api/client'
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'

export class ProductApiRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    const { data } = await apiClient.get<Product[]>('/products')
    return data
  }

  async getById(id: number): Promise<Product> {
    const { data } = await apiClient.get<Product>(`/products/${id}`)
    return data
  }

  async create(productData: CreateProductDTO): Promise<Product> {
    const { data } = await apiClient.post<Product>('/products', productData)
    return data
  }

  async update(productData: UpdateProductDTO): Promise<Product> {
    const { data } = await apiClient.put<Product>(`/products/${productData.id}`, productData)
    return data
  }

  async delete(id: number): Promise<boolean> {
    await apiClient.delete(`/products/${id}`)
    return true
  }
}
```

```typescript
// repositories/ProductStoreRepository.ts
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { useProductStore } from '@/stores/product.store'

export class ProductStoreRepository implements IProductRepository {
  private store = useProductStore()

  async getAll(): Promise<Product[]> {
    return this.store.allProducts
  }

  async getById(id: number): Promise<Product> {
    const product = this.store.getProductById(id)
    if (!product) throw new Error(`Product ${id} not found in Store`)
    return product
  }

  async create(productData: CreateProductDTO): Promise<Product> {
    throw new Error('Create operation not supported in Store')
  }

  async update(productData: UpdateProductDTO): Promise<Product> {
    throw new Error('Update operation not supported in Store')
  }

  async delete(id: number): Promise<boolean> {
    throw new Error('Delete operation not supported in Store')
  }
}
```

#### 3. Store Layer - Pinia Store

```typescript
// stores/product.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/domain/entities/Product'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Map<number, Product>>(new Map())

  // Getters
  const allProducts = computed(() => Array.from(products.value.values()))
  const getProductById = computed(() => (id: number) => products.value.get(id))
  const hasProduct = computed(() => (id: number) => products.value.has(id))

  // Actions
  function setProducts(newProducts: Product[]) {
    products.value.clear()
    newProducts.forEach((product) => products.value.set(product.id, product))
  }

  function setProduct(product: Product) {
    products.value.set(product.id, product)
  }

  function removeProduct(id: number) {
    products.value.delete(id)
  }

  function clearProducts() {
    products.value.clear()
  }

  return {
    products,
    allProducts,
    getProductById,
    hasProduct,
    setProducts,
    setProduct,
    removeProduct,
    clearProducts,
  }
})
```

#### 4. Service Layer - Lógica de Negocio

```typescript
// services/product/GetAll.ts
import type { Product } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { ProductApiRepository } from '@/repositories/ProductApiRepository'
import { useProductStore } from '@/stores/product.store'

export class GetAll {
  private apiRepository: IProductRepository
  private store = useProductStore()

  constructor() {
    this.apiRepository = new ProductApiRepository()
  }

  async execute(forceRefresh = false): Promise<Product[]> {
    // Cache-first
    if (!forceRefresh && this.store.allProducts.length > 0) {
      console.log('💾 Using cached products from Store')
      return this.store.allProducts
    }

    // Consultar API
    console.log('📡 Fetching products from API...')
    const products = await this.apiRepository.getAll()

    // Guardar en Store
    this.store.setProducts(products)

    return products
  }
}
```

```typescript
// services/product/GetById.ts
import type { Product } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { ProductApiRepository } from '@/repositories/ProductApiRepository'
import { useProductStore } from '@/stores/product.store'

export class GetById {
  private apiRepository: IProductRepository
  private store = useProductStore()

  constructor() {
    this.apiRepository = new ProductApiRepository()
  }

  async execute(id: number, forceRefresh = false): Promise<Product> {
    // Cache-first
    if (!forceRefresh && this.store.hasProduct(id)) {
      console.log(`💾 Using cached product ${id} from Store`)
      return this.store.getProductById(id)!
    }

    // Consultar API
    console.log(`📡 Fetching product ${id} from API...`)
    const product = await this.apiRepository.getById(id)

    // Guardar en Store
    this.store.setProduct(product)

    return product
  }
}
```

```typescript
// services/product/Create.ts
import type { Product, CreateProductDTO } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { ProductApiRepository } from '@/repositories/ProductApiRepository'
import { useProductStore } from '@/stores/product.store'

export class Create {
  private apiRepository: IProductRepository
  private store = useProductStore()

  constructor() {
    this.apiRepository = new ProductApiRepository()
  }

  async execute(data: CreateProductDTO): Promise<Product> {
    try {
      console.log('📡 Creating product in API...')
      const newProduct = await this.apiRepository.create(data)

      // Actualizar Store
      this.store.setProduct(newProduct)

      return newProduct
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }
}
```

**Nota**: Crear también `Update.ts` y `Delete.ts` siguiendo el mismo patrón.

#### 5. Composable Layer - Vue Integration

```typescript
// composables/useProduct.ts
import { ref, computed } from 'vue'
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/domain/entities/Product'
import { GetAll } from '@/services/product/GetAll'
import { GetById } from '@/services/product/GetById'
import { Create } from '@/services/product/Create'
import { Update } from '@/services/product/Update'
import { Delete } from '@/services/product/Delete'
import { useProductStore } from '@/stores/product.store'

export function useProduct() {
  const store = useProductStore()

  // Services
  const getAllService = new GetAll()
  const getByIdService = new GetById()
  const createService = new Create()
  const updateService = new Update()
  const deleteService = new Delete()

  // Estado local
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed desde store
  const products = computed(() => store.allProducts)
  const hasProducts = computed(() => store.allProducts.length > 0)

  // Métodos
  async function fetchProducts(forceRefresh = false) {
    loading.value = true
    error.value = null
    try {
      await getAllService.execute(forceRefresh)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener productos'
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id: number, forceRefresh = false): Promise<Product | null> {
    loading.value = true
    error.value = null
    try {
      return await getByIdService.execute(id, forceRefresh)
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Error al obtener producto ${id}`
      return null
    } finally {
      loading.value = false
    }
  }

  async function createProduct(data: CreateProductDTO): Promise<Product | null> {
    loading.value = true
    error.value = null
    try {
      return await createService.execute(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear producto'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(data: UpdateProductDTO): Promise<Product | null> {
    loading.value = true
    error.value = null
    try {
      return await updateService.execute(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar producto'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      return await deleteService.execute(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar producto'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    loading,
    error,
    products,
    hasProducts,
    // Métodos
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
```

#### 6. View Layer - UI

```vue
<!-- views/ProductsView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useProduct } from '@/composables/useProduct'

const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } =
  useProduct()

onMounted(() => {
  fetchProducts()
})

async function handleRefresh() {
  await fetchProducts(true)
}

async function handleCreate() {
  await createProduct({
    name: 'New Product',
    price: 99.99,
    description: 'A great product',
  })
}

async function handleUpdate(id: number) {
  await updateProduct({
    id,
    name: 'Updated Product',
  })
}

async function handleDelete(id: number) {
  await deleteProduct(id)
}
</script>

<template>
  <div>
    <h1>Products</h1>

    <button @click="handleRefresh">Refresh</button>
    <button @click="handleCreate">Create Product</button>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-for="product in products" :key="product.id">
        <h3>{{ product.name }}</h3>
        <p>Price: ${{ product.price }}</p>
        <p>{{ product.description }}</p>
        <button @click="handleUpdate(product.id)">Update</button>
        <button @click="handleDelete(product.id)">Delete</button>
      </div>
    </div>
  </div>
</template>
```

## 🎯 Resumen de Pasos

Para agregar nueva entidad:

1. **Domain**: Entidad + Interface del repositorio
2. **Repositories**: ApiRepository + StoreRepository
3. **Store**: Pinia store con Map<id, Entity>
4. **Services**: GetAll, GetById, Create, Update, Delete
5. **Composable**: useEntity() con loading/error
6. **View**: Usar composable

## 🔥 Tips

- **Nombres concisos**: `services/product/Create.ts` → `class Create` (no `CreateProduct`)
- **Cache-first**: Siempre verificar Store antes de API
- **Mutaciones**: Create/Update/Delete → API primero, luego Store
- **TypeScript strict**: Usar types para DTOs, interfaces para contratos
- **No estilos**: Sin CSS en componentes

## 📚 Más Información

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura detallada
- [STRUCTURE.md](./STRUCTURE.md) - Convenciones y estándares
- [EXAMPLES.md](./EXAMPLES.md) - Ejemplos completos
