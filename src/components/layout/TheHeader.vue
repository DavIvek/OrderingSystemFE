<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">Sustav naručivanja</router-link>
      </h1>
      <ul>
        <li id="korisnik" v-show="loginStatus">
          <router-link to="/user">{{ userFunction() }}</router-link>
        </li>
        <li>
          <router-link to="/about">O nama</router-link>
        </li>
        <li>
          <router-link to="/login">{{ funkcija() }}</router-link>

        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";


export default {
  name: 'TheHeader',
  data() {
    return {
      isLoading: false,
      user: {},
      loginStatus: false,
    }
  },
  methods: {
    checkSessionValidity(user) {
      this.loginStatus = user.exp > (Date.now() / 10 ** 3);
    },
    funkcija() {
      let text = localStorage.getItem("buttonRef")

      if (text !== null) {
        return text
      } else {
        return 'Prijava'
      }
    },
    userFunction() {
      // let link = document.getElementById("korisnik")
      if (this.loginStatus) {
        // document.getElementById("korisnik").display = "none"
        return 'Korisnik'
      } else {
        // document.getElementById("korisnik").display = "none"
        return ''
      }
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
        this.checkSessionValidity(this.user);
      }
    }/* ,
    logUserOut() {
      localStorage.removeItem("orderingSystemData");
      this.loginStatus = false;
      this.$router.push({name: 'home'})
      this.$forceUpdate();
    } */
  },
  created() {
    this.getUserDetails();
  }
}

</script>

<style scoped>
header {
  width: 100%;
  height: 5rem;
  background-color: #3d008d;
  display: flex;
  justify-content: center;
  align-items: center;
}

header a {
  text-decoration: none;
  color: #f391e3;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
}

a:active,
a:hover,
a.router-link-active {
  border: 1px solid #f391e3;
}

h1 {
  margin: 0;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}
</style>