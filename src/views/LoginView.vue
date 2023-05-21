<template>
  <section>
    <base-card>
      <form @submit.prevent="handleSubmit" v-if="!tokenIsValid">
        <h2>Prijava</h2>

        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>

        <div v-else>
          <p class="error-message" v-if="error">Neispravno korisničko ime ili lozinka!</p>
          <div class="form-control" :class="{ invalid: !username.isValid }">
            <label for="username">Korisničko ime</label>
            <input type="text" v-model.trim="username.val" id="username" @blur="clearValidity('username')">
            <p v-if="!username.isValid">Popunite polje.</p>
          </div>

          <div class="form-control" :class="{ invalid: !password.isValid }">
            <label for="password">Lozinka</label>
            <input type="password" id="password" v-model.trim="password.val" @blur="clearValidity('password')">
            <p v-if="!password.isValid">Popunite polje.</p>
          </div>
            <div class="center" style="margin-top: 3%;">
              <base-button style="font-size:large;"  @click="handleSubmit">Prijava</base-button>
            </div>
          
        </div>

      </form>

      <div v-else>
        <h2>Trenutno ste prijavljeni u sustav. Želite se odjaviti?</h2>
        <div class="center">
          <base-button @click="logout">Odjava</base-button>
        </div>
        </div>
    </base-card>
  </section>
</template>

<script>

export default {
  name: "LoginView",
  components: {},
  data() {
    return {
      username: {
        val: "",
        isValid: true,
      },
      password: {
        val: "",
        isValid: true,
      },
      error: false,
      isLoading: false,
      tokenIsValid: false
    }
  },
  methods: {
    clearValidity(input) {
      this[input].isValid = true;
    },
    validateForm() {
      this.formIsValid = true;
      if (this.username.val === "") {
        this.username.isValid = false;
        this.formIsValid = false;
      }
      if (this.password.val === "") {
        this.password.isValid = false;
        this.formIsValid = false;
      }
    },
    async handleSubmit() {
      // reset the error state when the user presses the login button
      this.error = false

      this.validateForm();

      if (!this.formIsValid) {
        return;
      }

      // if the form is valid, start loading(backend communication)
      this.isLoading = true

      const formData = {
        username: this.username.val,
        password: this.password.val,
      };

      this.username.val = ""
      this.password.val = ""

      this.$emit("save-data", formData);

      let requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      };

      let res = await fetch(process.env.VUE_APP_BACKEND_URL + "/auth/signin", requestOptions)

      // loading is finished

      if (!res.ok) {
        this.error = true
        this.isLoading = false
      } else {

        let data = await res.json()


        localStorage.setItem("orderingSystemData", JSON.stringify({
          token: data.token,
          role: data.roles[0],
          timestamp: Date.now()
        }))
        localStorage.setItem("buttonRef", "Odjava");
        location.reload()
        // this.$router.push({name: 'home'})
        location.assign("/")
      }

    },
    logout() {
      localStorage.removeItem("orderingSystemData")
      localStorage.setItem("buttonRef", "Prijava");

      // this.$router.push({name: 'home'})
      location.assign("/")
    }
  },
  created() {
    let object = localStorage.getItem("orderingSystemData")

    if (object !== null) {

      object = JSON.parse(object)
      let timestamp = Number.parseInt(object.timestamp)

      // check if the token is present for more than 24h
      if ((timestamp + 86400000) <= Date.now()) {
        // token is not valid
        this.tokenIsValid = false
        localStorage.removeItem("orderingSystemData")

      } else {
        this.tokenIsValid = true
      }

    } else {
      // orderingSystemData is not present in local storage
      this.tokenIsValid = false
    }
  }
}
</script>

<style scoped>

.center{
  display: flex;
  justify-content: center;
  text-align: center;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type="radio"] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type="radio"] {
  display: inline;
  width: auto;
  border: none;
}

input[type="radio"]:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label:not(.ignore), .invalid h3 {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}

.error-message {
  color: red;
}
</style>
