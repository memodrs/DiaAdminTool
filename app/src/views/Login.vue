<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-10 col-md-6 col-lg-4">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h1 class="h4 mb-3 text-center">Anmelden</h1>

          <div v-if="message" :class="['alert', message.type === 'error' ? 'alert-danger' : 'alert-success']">
            {{ message.text }}
          </div>

          <form @submit.prevent="onSubmit" novalidate>
            <div class="mb-3">
              <label class="form-label">E-Mail</label>
              <input
                type="email"
                class="form-control"
                v-model.trim="email"
                required
                autocomplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">Passwort</label>
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                v-model="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
              />
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" v-model="showPassword" id="showPw">
              <label class="form-check-label" for="showPw">Passwort anzeigen</label>
            </div>

            <button
              class="btn btn-primary w-100"
              :disabled="loading"
              type="submit"
            >
              <span v-if="!loading">Anmelden</span>
              <span v-else class="spinner-border spinner-border-sm"></span>
            </button>
          </form>

          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-link p-0" @click="sendReset" :disabled="loading">Passwort vergessen?</button>
            <button class="btn btn-link p-0" @click="gotoRegister">Registrieren</button>
          </div>

          <hr>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '@/firebase'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const message = ref(null)

const clearMessage = () => (message.value = null)

function mapFirebaseError(code) {
  switch (code) {
    case 'auth/invalid-email': return 'Ungültige E-Mail-Adresse.'
    case 'auth/user-disabled': return 'Dieser Account wurde deaktiviert.'
    case 'auth/user-not-found': return 'Kein Benutzer mit dieser E-Mail gefunden.'
    case 'auth/wrong-password': return 'Falsches Passwort.'
    case 'auth/popup-closed-by-user': return 'Anmeldung abgebrochen.'
    default: return 'Es ist ein Fehler aufgetreten. Bitte erneut versuchen.'
  }
}

const onSubmit = async () => {
  clearMessage()
  if (!email.value || !password.value) {
    message.value = { type: 'error', text: 'Bitte E-Mail und Passwort eingeben.' }
    return
  }
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } catch (e) {
    message.value = { type: 'error', text: mapFirebaseError(e.code) }
  } finally {
    loading.value = false
  }
}

const sendReset = async () => {
  clearMessage()
  if (!email.value) {
    message.value = { type: 'error', text: 'Bitte gib zuerst deine E-Mail ein.' }
    return
  }
  loading.value = true
  try {
    await sendPasswordResetEmail(auth, email.value)
    message.value = { type: 'success', text: 'Passwort-Reset-E-Mail gesendet.' }
  } catch (e) {
    message.value = { type: 'error', text: mapFirebaseError(e.code) }
  } finally {
    loading.value = false
  }
}

const gotoRegister = () => router.push({ name: 'Register' })
</script>
