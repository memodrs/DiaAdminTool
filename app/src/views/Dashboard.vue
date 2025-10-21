<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Dashboard</h5>
        <button class="btn btn-primary" @click="openModal">
          Kunden anlegen
        </button>
      </div>

      <p class="text-muted mt-3 mb-0">
        Lege einen neuen Kunden unter deinem Benutzerkonto in Firestore an.
      </p>

      <!-- Feedback -->
      <div v-if="message" class="alert mt-3" :class="message.type === 'error' ? 'alert-danger' : 'alert-success'">
        {{ message.text }}
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="createCustomer">
        <div class="modal-header">
          <h5 class="modal-title">Neuen Kunden anlegen</h5>
          <button type="button" class="btn-close" :disabled="loading" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Kundenname</label>
            <input
              v-model.trim="customerName"
              type="text"
              class="form-control"
              placeholder="z. B. Acme GmbH"
              required
              :disabled="loading"
              autofocus
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="closeModal">
            Abbrechen
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="!loading">Anlegen</span>
            <span v-else class="spinner-border spinner-border-sm"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
// Bootstrap Modal (JS-API)
import Modal from 'bootstrap/js/dist/modal'

const customerName = ref('')
const loading = ref(false)
const message = ref(null)

const modalRef = ref(null)
let modalInstance = null

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value, { backdrop: 'static' })
  }
})

const openModal = () => {
  message.value = null
  customerName.value = ''
  modalInstance?.show()
}

const closeModal = () => {
  modalInstance?.hide()
}

const createCustomer = async () => {
  message.value = null
  if (!customerName.value) return

  // aktuellen User prüfen
  const user = auth.currentUser
  if (!user) {
    message.value = { type: 'error', text: 'Du bist nicht eingeloggt.' }
    closeModal()
    return
  }

  loading.value = true
  try {
    await addDoc(collection(db, `users/${user.uid}/customers`), {
      name: customerName.value,
      createdAt: serverTimestamp(),
    })
    message.value = { type: 'success', text: `Kunde „${customerName.value}“ wurde angelegt.` }
    closeModal()
  } catch (e) {
    console.error(e)
    message.value = { type: 'error', text: 'Anlegen fehlgeschlagen. Bitte später erneut versuchen.' }
    closeModal()
  } finally {
    loading.value = false
  }
}
</script>
