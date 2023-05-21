<template>
  <div>
    <base-card>
      <h2 class="title">Korisnički podaci</h2>
      <div>
        <h4 for="firstname">Ime</h4>
        <p id="firstname">{{this.korisnik.firstname}}</p>
      </div>

      <div>
        <h4 for="lastname">Prezime</h4>
        <p id="lastname">{{this.korisnik.lastname}}</p>
      </div>

      <div>
        <h4 for="phone">Mobitel</h4>
        <p id="phone">{{this.korisnik.phoneNumber}}</p>
      </div>

      <div>
        <h4 for="oib">OIB</h4>
        <p id="oib">{{this.korisnik.oib}}</p>
      </div>

      <div>
        <h4 for="username">Korisničko ime</h4>
        <p id="username">{{ this.korisnik.username }}</p>
      </div>

      <div v-if="this.role === 'PATIENT'">
        <h4>Obavijesti</h4>
        <p>{{ getNotifications() }}</p>
      </div>

<!--      <div>-->
<!--        <h4 for="password">Lozinka</h4>-->
<!--        <p id="password">****</p>-->
<!--      </div>-->

      <div>
        <h4>Spol</h4>
        <p>{{ getGender() }}</p>
      </div>

      <div>
        <h4 for="email">E-mail</h4>
        <p id="email">{{this.korisnik.email}}</p>
      </div>
      <br><br>
    </base-card>
  </div>
</template>

<script>
export default {
  name: "ShowUserData",
  props: ['korisnik', 'role'],
  methods: {
    getGender() {
      if(this.korisnik.gender === 'M') {
        return 'Muški'
      } else {
        return 'Ženski'
      }
    },
    getNotifications() {
      if(this.korisnik.notification === 0) {
        return 'E-mail'
      } else {
        return 'Sms'
      }
    }
  }
}
</script>

<style scoped>
.title {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  width: fit-content;
  background-color: #ededed;
  border-radius: 30px;
}

p {
  /*background-color: #ededed;*/
  margin-top: 0;
  border: 1px solid #ededed;
}

.user-data {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

</style>