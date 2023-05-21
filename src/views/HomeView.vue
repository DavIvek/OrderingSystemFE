<template>
  <div>
    <div v-if="!loginStatus" class="home">
      <h1> Sustav za naručivanje </h1>

      <base-button link to="/login" class="button">Prijavi se</base-button>

      <section>
        <h3>Nemate račun? Registrirajte se kod svog liječnika.</h3>
        <base-card>
          <div v-if="isLoading">
            <base-spinner></base-spinner>
          </div>
          <ul v-else-if="hasDoctors">
            <doctor-item
                v-for="doctor in doctors"
                :key="doctor.id"
                :id="doctor.id"
                :first-name="doctor.firstname"
                :last-name="doctor.lastname"
            ></doctor-item>
          </ul>
          <h3 v-else>Nema doktora.</h3>
        </base-card>
      </section>

    </div>
    <user-home v-else :user-name="userName"></user-home>
  </div>
</template>

<script>
// @ is an alias to /src
import DoctorItem from '@/components/DoctorItem.vue'
import UserHome from '@/components/UserHome.vue'
import VueJwtDecode from 'vue-jwt-decode'

export default {
  name: 'HomeView',
  components: {
    DoctorItem,
    UserHome
  },
  data() {
    return {
      isLoading: false,
      loginStatus: false,
      error: null,
      doctors: [] //[{id:1, firstName:"Jurica", lastName: "Bačani"}, {id:2, firstName:"David", lastName: "Iveković"}, {id:3, firstName:"Mateo", lastName: "Bencek"}]
    }
  },
  computed: {
    hasDoctors() {
      return this.doctors.length > 0;
    },
  },
  methods: {
    checkSessionValidity(user) {
      this.loginStatus = user.exp > (Date.now() / 10 ** 3);
    },
    getUserDetails() {
      // get token from localstorage
      let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));
      if (loginData != undefined) {
        let token = loginData.token;
        try {
          //decode token here and attach to the user object
          let decoded = VueJwtDecode.decode(token);
          this.user = decoded;
        } catch (error) {
          // return error in production env

        }
        this.userName = this.user['sub']
        this.checkSessionValidity(this.user);
      }
    },
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
    this.getUserDetails();
    this.isLoading = true

    const data = await this.fetchData()
    this.doctors = data

    this.isLoading = false

  }
}
</script>

<style scoped>
.home {
  display: grid;
  justify-content: center;
  text-align: center;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

  .button {
    margin-bottom: 10%;
  }

</style>
