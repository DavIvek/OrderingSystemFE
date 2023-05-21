<template>
  <form @submit.prevent="submitForm">

    <div v-if="isSaved">
      <h2>Podatci su uspješno ažurirani.</h2>
    </div>

    <div v-else>
      <div v-if="isLoading">
        <base-spinner></base-spinner>
      </div>

      <div v-else>
        <p class="error-message" v-if="error">{{ errorMessage }}</p>
        <div class="form-control" :class="{ invalid: !firstName.isValid }">
          <label for="firstname">Ime</label>
          <input
              type="text"
              id="firstname"
              placeholder="Ime"
              v-model.trim="firstName.val"
              @blur="clearValidity('firstName')"
          />
          <p v-if="!firstName.isValid">Popunite polje.</p>
        </div>

        <div class="form-control" :class="{ invalid: !lastName.isValid }">
          <label for="lastname">Prezime</label>
          <input
              type="text"
              id="lastname"
              placeholder="Prezime"
              v-model.trim="lastName.val"
              @blur="clearValidity('lastName')"
          />
          <p v-if="!lastName.isValid">Popunite polje.</p>
        </div>

        <div class="form-control" :class="{ invalid: !phone.isValid }">
          <label for="phone">Mobitel</label>
          <input
              type="text"
              id="phone"
              placeholder="091 234 5678"
              v-model.trim="phone.val"
              @blur="clearValidity('phone')"
          />
          <p v-if="!phone.isValid">Popunite polje.</p>
        </div>

        <div class="form-control" :class="{ invalid: !OIB.isValid }">
          <label for="oib">OIB</label>
          <input
              type="text"
              id="oib"
              v-model.trim="OIB.val"
              @blur="clearValidity('OIB')"
          />
          <p v-if="!OIB.isValid">Popunite polje.</p>
        </div>
        <div class="form-control" :class="{ invalid: !username.isValid }">
          <label for="username">Korisničko ime</label>
          <input
              type="text"
              id="username"
              v-model.trim="username.val"
              @blur="clearValidity('username')"
          />
          <p v-if="!username.isValid">Popunite polje.</p>
        </div>

        <div class="form-control" :class="{ invalid: !password.isValid }">
          <label for="password">Lozinka</label>
          <input
              type="password"
              id="password"
              v-model.trim="password.val"
              @blur="clearValidity('password')"
          />
          <p v-if="!password.isValid">Ispravno popunite polje.</p>
        </div>

        <div class="form-control" :class="{ invalid: !confirmPassword.isValid }">
          <label for="confirmPassword">Ponovljena Lozinka</label>
          <input
              type="password"
              id="confirmPassword"
              v-model.trim="confirmPassword.val"
              @blur="clearValidity('confirmPassword')"
          />
          <p v-if="!confirmPassword.isValid">Ispravno popunite polje.</p>
        </div>

        <div v-if="this.role === 'PATIENT'" class="form-control" :class="{invalid: !notifications.isValid}">
          <h3>Obavijesti</h3>
          <div>
            <input
                type="radio"
                id="Email"
                value=0
                v-model="notifications.val"
                @blur="clearValidity('notifications')"
            />
            <label for="Email" class="ignore">E-mail</label>
          </div>
          <div>
            <input
                type="radio"
                id="Sms"
                value=1
                v-model="notifications.val"
                @blur="clearValidity('notifications')"
            />
            <label for="Sms" class="ignore">Sms</label>
          </div>
        </div>

        <div class="form-control" :class="{invalid: !genders.isValid}">
          <h3>Spol</h3>
          <div>
            <input
                type="radio"
                id="muski"
                value="M"
                v-model="genders.val"
                @blur="clearValidity('genders')"
            />
            <label for="muski" class="ignore">Muški</label>
          </div>
          <div>
            <input
                type="radio"
                id="zenski"
                value="F"
                v-model="genders.val"
                @blur="clearValidity('genders')"
            />
            <label for="zenski" class="ignore">Ženski</label>
          </div>
        </div>

        <div class="form-control" :class="{ invalid: !email.isValid }">
          <label for="email">E-mail</label>
          <input
              type="text"
              id="email"
              placeholder="ime@prezime.com"
              v-model.trim="email.val"
              @blur="clearValidity('email')"
          />
          <p v-if="!email.isValid">Popunite polje.</p>
        </div>

        <p v-if="!formIsValid">Molimo popunite polja na ispravan način.</p>
        <base-button>Spremi</base-button>
      </div>
    </div>

  </form>
</template>

<script>
export default {
  name: "EditUserData",
  props: ['korisnik', 'role'],
  emits: ["save-data"],
  data() {
    return {
      firstName: {
        val: this.korisnik.firstname,
        isValid: true,
      },
      lastName: {
        val: this.korisnik.lastname,
        isValid: true,
      },
      OIB: {
        val: this.korisnik.oib,
        isValid: true,
      },
      phone: {
        val: this.korisnik.phoneNumber,
        isValid: true,
      },
      username: {
        val: this.korisnik.username,
        isValid: true,
      },
      password: {
        val: "",
        isValid: true,
      },
      confirmPassword: {
        val: "",
        isValid: true,
      },
      email: {
        val: this.korisnik.email,
        isValid: true,
      },
      genders: {
        val: this.korisnik.gender,
        isValid: true,
      },
      notifications: {
        val: this.korisnik.notification,
        isValid: true,
      },
      formIsValid: true,
      error: false,
      errorMessage: "",
      isLoading: false,
      isSaved: false

    };
  },
  methods: {
    clearValidity(input) {
      this[input].isValid = true;
    },
    validateForm() {

      this.formIsValid = true;

      if (this.firstName.val === "") {
        this.firstName.isValid = false;
        this.formIsValid = false;
      }
      if (this.lastName.val === "") {
        this.lastName.isValid = false;
        this.formIsValid = false;
      }
      if (this.OIB.val === "" || this.OIB.val.length !== 11 && !Number.isInteger(this.OIB.val)) {
        this.OIB.isValid = false;
        this.formIsValid = false;
      }
      if (this.phone.val === "" || !(/^\d+$/.test(this.phone.val))) {
        this.phone.isValid = false;
        this.formIsValid = false;
      }
      if (this.username.val === "") {
        this.username.isValid = false;
        this.formIsValid = false;
      }
      if (this.password.val === "") {
        this.password.isValid = false;
        this.formIsValid = false;
      }
      if (this.confirmPassword.val === "") {
        this.confirmPassword.isValid = false;
        this.formIsValid = false;
      }
      if (this.email.val === "" || !this.email.val.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.+[a-zA-Z]+$/)) {
        this.email.isValid = false;
        this.formIsValid = false;
      }
      if (this.genders.val.length === 0) {
        this.genders.isValid = false;
        this.formIsValid = false;
      }
      // if (this.notifications.val.length === 0) {
      //   this.notifications.isValid = false;
      //   this.formIsValid = false;
      // }
      if (this.confirmPassword.val !== this.password.val) {
        this.confirmPassword.isValid = false
        this.password.isValid = false
        this.formIsValid = false
        this.error = true
        this.errorMessage = "Lozinke nisu jednake"
      }
    },
    async submitForm() {
      // reset the error state when the user presses the login button
      this.error = false
      this.errorMessage = ""

      this.validateForm();

      if (!this.formIsValid) {
        return;
      }

      // if the form is valid, start loading(backend communication)
      this.isLoading = true

      const formData = {
        firstname: this.firstName.val,
        lastname: this.lastName.val,
        oib: this.OIB.val,
        username: this.username.val,
        email: this.email.val,
        phoneNumber: this.phone.val,
        password: this.password.val,
        gender: this.genders.val,
        notification: this.notifications.val,
        role: this.role,
      };
      //console.log(formData);
      this.$emit("save-data", formData);

      let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));
      let token = ""

      if (loginData !== undefined) {
        token = loginData.token
      }

      let requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Request-Method': 'POST',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(formData)
      }

      let res = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me", requestOptions);

      // loading is finished
      this.isLoading = false

      if (!res.ok) {
        this.error = true

        let data = await res.json()
        //console.log(data)
        this.errorMessage = data.message

      } else {

        let data = await res.json()
        //console.log(data)

        // the user has changed his username
        // we get new token
        if(this.korisnik.username !== this.username.val) {
          localStorage.setItem("orderingSystemData", JSON.stringify({
            token: data.token,
            role: data.roles[0],
            timestamp: Date.now()
          }))
        }

        this.isSaved = true

      }
    },
  },
};
</script>

<style scoped>
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