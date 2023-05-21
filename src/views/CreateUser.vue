<template>
  <section>
    <base-card>
      <h1> Kreacija novog korisnika</h1>
      <create-user-form></create-user-form>
    </base-card>
  </section>
</template>

<script>

import CreateUserForm from '@/components/CreateUserForm.vue'
export default ({
  props: ['doctorId'],
  components: {
    CreateUserForm
  },
  data() {
    return {
      doctor: {}
    }
  }
 /*  methods: {
    async fetchData() {

      let requestOptions = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }

      const res = await fetch("http://localhost:9200/doctors", requestOptions)
      let data = await res.json()

      return data
    }
  }, */
  /* async created() {
    const doctors = await this.fetchData()

    let doctor;

    for (doctor of doctors) {
      if (doctor.id == this.doctorId) {
        this.doctor = doctor
      }
    }

  } */
})
</script>
