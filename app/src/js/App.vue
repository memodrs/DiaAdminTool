<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
    <div class="container">
      <a class="navbar-brand versuch" href="#">Admin Tool</a>
      <div class="ms-auto d-flex align-items-center gap-2">
        <button
          v-if="user"
          class="btn btn-outline-secondary btn-sm"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>

  <main class="container py-4">
    <router-view />
  </main>
</template>

<script setup>
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref } from 'vue'
import { auth } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

onAuthStateChanged(auth, (u) => {
  user.value = u
})

const logout = async () => {
  await signOut(auth)
  router.push({ name: 'Login' })
}
</script>
