<script>
import { auth, db } from '@/firebase'
import { addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore'
import Modal from 'bootstrap/js/dist/modal'
import dashboardTemplate from '../../html/DashboardTemplate.html?raw'

export default {
  name: 'CustomerModal',
  template: dashboardTemplate,

  data() {
    return {
      customerName: '',
      loading: false,
      message: null,
      modalInstance: null,
      customers: [], 
    }
  },

  mounted() {
    if (this.$refs.modalRef) {
      this.modalInstance = new Modal(this.$refs.modalRef, { backdrop: 'static' })
    }
    this.getData();
  },

  methods: {
    openModal() {
      this.message = null;
      this.customerName = '';
      this.modalInstance?.show();
    },

    closeModal() {
      this.modalInstance?.hide();
    },

    async createCustomer() {
      this.message = null;
      if (!this.customerName) return;

      const user = auth.currentUser;
      if (!user) {
        this.message = { type: 'error', text: 'Du bist nicht eingeloggt.' };
        this.closeModal();
        return;
      }

      this.loading = true;
      try {
        await addDoc(collection(db, `users/${user.uid}/customers`), {
          name: this.customerName,
          createdAt: serverTimestamp(),
        });
        this.message = {
          type: 'success',
          text: `Kunde „${this.customerName}“ wurde angelegt.`,
        };
        this.closeModal();
        await this.getData(); 
      } catch (e) {
        console.error(e);
        this.message = {
          type: 'error',
          text: 'Anlegen fehlgeschlagen. Bitte später erneut versuchen.',
        };
        this.closeModal();
      } finally {
        this.loading = false;
      }
    },

    // Neue Methode: Alle Kunden holen
    async getData() {
      const user = auth.currentUser;
      if (!user) {
        this.customers = [];
        return;
      }

      this.loading = true;
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/customers`))
        this.customers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (e) {
        console.error('Fehler beim Laden der Kunden:', e);
        this.customers = [];
      } finally {
        this.loading = false;
      }
    },
  },


}
</script>
