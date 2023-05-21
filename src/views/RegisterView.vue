<template>
  <section>
    <base-card>
      <h1> Registracija kod liječnika {{doctor.firstname + ' ' + doctor.lastname + ', dr.med.' }}</h1>
      <register-form :doctorId="this.doctorId"></register-form>
    </base-card>
  </section>
</template>

<script>
import RegisterForm from '@/components/RegisterForm.vue'

export default ({
  props: ['doctorId'],
  components: {
    RegisterForm
  },
  data() {
    return {
      doctor: {}
    }
  },
  methods: {
    async fetchData() {

      let requestOptions = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }

      const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/doctors", requestOptions)
      let data = await res.json()

      return data
    }
  },
  async created() {
    const doctors = await this.fetchData()

    let doctor;

    for (doctor of doctors) {
      if (doctor.id == this.doctorId) {
        this.doctor = doctor
      }
    }

  }
})
</script>
