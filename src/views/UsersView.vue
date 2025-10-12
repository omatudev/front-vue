<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

// Usar el composable
const { users, loading, error, fetchUsers, fetchUserById } = useUser()

// Cargar usuarios al montar el componente
onMounted(async () => {
  await fetchUsers()
})

// Función para recargar desde la API
const refreshUsers = async () => {
  await fetchUsers(true) // forceRefresh = true
}

// Función para ver detalles de un usuario
const viewUserDetails = async (id: number) => {
  const user = await fetchUserById(id)
  if (user) {
    alert(`Usuario: ${user.name}\nEmail: ${user.email}\nUsername: ${user.username}`)
  }
}
</script>

<template>
  <div>
    <div>
      <h1>Usuarios</h1>
      <button :disabled="loading" @click="refreshUsers">
        {{ loading ? 'Cargando...' : '🔄 Refrescar' }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error">❌ {{ error }}</div>

    <!-- Loading State -->
    <div v-if="loading && users.length === 0">
      <p>Cargando usuarios...</p>
    </div>

    <!-- Users List -->
    <div v-else-if="users.length > 0">
      <div v-for="user in users" :key="user.id" @click="viewUserDetails(user.id)">
        <div>
          <span>{{ user.name.charAt(0).toUpperCase() }}</span>
          <span>#{{ user.id }}</span>
        </div>

        <h3>{{ user.name }}</h3>
        <p><span>Email:</span> {{ user.email }}</p>
        <p><span>Username:</span> @{{ user.username }}</p>

        <div v-if="user.company">
          <p>🏢 {{ user.company.name }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <p>No hay usuarios disponibles</p>
    </div>

    <!-- Info Footer -->
    <div>
      <p>💡 Arquitectura Hexagonal</p>
      <p>
        Los datos se obtienen primero del <strong>Store</strong> (cache). Si no existen, se consulta
        la <strong>API</strong> y se guardan automáticamente.
      </p>
      <p>Abre la consola para ver el flujo: 📡 API o 💾 Store</p>
    </div>
  </div>
</template>
