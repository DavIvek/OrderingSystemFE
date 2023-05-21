<template>
  <div>

    <div v-if="isLoading">
      <base-card>
        <base-spinner></base-spinner>
      </base-card>
    </div>

    <div v-if="!isLoading && editData">
      <base-card>
        <edit-user-data :korisnik="korisnik" :role="role"></edit-user-data>
        <base-button @click="changeState" class="back-button">Povratak</base-button>
      </base-card>
    </div>

    <div v-else>
      <h1>Korisnik: {{ userName }}</h1>
      <show-user-data :korisnik="korisnik" :role="role"></show-user-data>

      <div v-if="role !== 'ADMIN'" class="button-container">
        <base-button @click="changeState">Uredi podatke</base-button>
      </div>
    </div>

  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import ShowUserData from "@/components/ShowUserData";
import EditUserData from "@/components/EditUserData";
import BaseCard from "@/components/ui/BaseCard";
import BaseSpinner from "@/components/ui/BaseSpinner";

export default {
  name: "UserView",
  components: {BaseSpinner, BaseCard, EditUserData, ShowUserData},
  data() {
    return {
      user: {},
      userData: {},
      userName: "",
      korisnik: {},
      editData: false,
      role: "",
      isLoading: false
    }
  },
  methods: {
    async changeState() {
      this.editData = !this.editData
      this.korisnik = await this.fetchStatus()
    },
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
        this.userData.userName = this.userName
        this.checkSessionValidity(this.user);
      }
    },
    async fetchStatus() {
      let data = ""

      let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));
      let token = ""

      if (loginData !== undefined) {
        token = loginData.token
      }

      let requestOptions = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }

      try {
        const res = await fetch(process.env.VUE_APP_BACKEND_URL +"/users/me", requestOptions)
        data = await res.json()
      } catch (exc) {
        data = exc
      }

      return data
    }
  },
  async created() {
    this.isLoading = true
    this.getUserDetails()
    const data = await this.fetchStatus()
    this.isLoading = false
    this.korisnik = data
    this.role = this.korisnik.role.name
  }
}
</script>

<style scoped>


h1 {
  text-align: center;
}

base-card {
  width: 100%;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.back-button {
  margin-top: 0.5rem;
}

</style>