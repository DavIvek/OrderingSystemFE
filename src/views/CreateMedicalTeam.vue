<template>
  <div class="home">
    <div class="sections-container">
      <section class="left-section">
        <h3>Odaberite doktora:</h3>
        <base-card>
          <div v-if="isLoading">
            <base-spinner></base-spinner>
          </div>
          <ul v-else-if="hasDoctors">
            <medical-person-item
              v-for="doctor in doctors"
              :key="doctor.id"
              :id="doctor.id"
              :first-name="doctor.firstname"
              :last-name="doctor.lastname"
              :role="doctor.role['description']"
              
            >
            </medical-person-item>
          </ul>
          <h3 v-else>Nema osoblja.</h3>
        </base-card>
      </section>

      <section class="middle-section" >
        <h3>Odaberite medicinsku sestru/brata:</h3>
        <base-card>
          <div v-if="isLoading">
            <base-spinner></base-spinner>
          </div>
          <ul v-else-if="hasNurses" >
            <medical-person-item
              v-for="nurse in nurses"
              :key="nurse.id"
              :id="nurse.id"
              :first-name="nurse.firstname"
              :last-name="nurse.lastname"
              :role="nurse.role['description']"
            ></medical-person-item>
          </ul>
          <h3 v-else>Nema osoblja.</h3>
        </base-card>
      </section>


      <section class="right-section" >
        <div class="home">
          <form @submit.prevent="submitForm">
          <div class="form-control" :class="{ invalid: !medicalTeamName.isValid }">
        <label for="medicalteamname">Ime tima:</label>
          <input class="inputStyle"
            type="text"
            id="medicalteamname"
            placeholder="Ime tima"
            v-model.trim="medicalTeamName.val"
            @blur="clearValidity('medicalTeamName')"
          />
          <p v-if="!medicalTeamName.isValid">{{message.text}}</p>
          <base-button >Potvrdi izradu tima!</base-button>
          </div>
          </form>
        </div>
       <!--  <div class="form-control" :class="{ invalid: !firstName.isValid }">
        <label for="firstname">Ime</label>
        <input
          type="text"
          id="firstname"
          placeholder="Ime"
          v-model.trim="firstName.val"
          @blur="clearValidity('firstName')"
        />
        <p v-if="!firstName.isValid">Popunite polje.</p>
      </div> -->
        
      </section>
    </div>
    
  </div>
  
      
</template>

<script>
// @ is an alias to /src
import MedicalPersonItem from "@/components/MedicalPersonItem.vue";
//import UserHome from '@/components/UserHome.vue'
import VueJwtDecode from "vue-jwt-decode";
//import BaseButton from '@/components/ui/BaseButton.vue';
//import BaseButton from '@/components/ui/BaseButton.vue';


export default {
  name: "CreateMedicalTeam",
  components: {
    MedicalPersonItem,
    //BaseButton,
    
    //UserHome
  },
  data() {
    return {
      isLoading: false,
      loginStatus: false,
      error: null,
      doctors: [], //[{id:1, firstName:"Jurica", lastName: "Bačani"}, {id:2, firstName:"David", lastName: "Iveković"}, {id:3, firstName:"Mateo", lastName: "Bencek"}]
      nurses: [],
      doctorChosen:false,
      nurseChosen:false,
      //medicalteamname:"",
      medicalTeamName: {
        val: "",
        isValid: true,
      },
      message:{
        text:""
      }
    };
  },
  computed: {
    hasDoctors() {
      return this.doctors.length > 0;
    },
    hasNurses() {
      return this.nurses.length > 0;
    },
  },
  methods: {
    clearValidity(input) {
      this[input].isValid = true;
    },
    validateForm() {
      this.formIsValid = true;

      if (this.medicalTeamName.val === "" ){
        this.medicalTeamName.isValid = false;
        this.formIsValid = false;
        this.message.text="Popunite polje!"

      } 
      
      if(this.medicalTeamName.val !== "" && ( localStorage.getItem("doctorId")==null || localStorage.getItem("nurseId")==null)) {
        this.medicalTeamName.isValid = false;
        this.formIsValid = false;
        this.message.text="Odaberite doktora i medicinsku sestru!"
      }
    },
    async submitForm() {
      // reset the error state when the user presses the create button
      this.error = false;
      this.errorMessage = "";

      this.validateForm();

      if (!this.formIsValid ) {
        return;
      }

      // if the form is valid, start loading(backend communication)
      this.isLoading = true;
   
       const formData = {
        name: this.medicalTeamName.val,
        doctorId: localStorage.getItem("doctorId"),
        nurseId: localStorage.getItem("nurseId"),
      };

      
      //this.$emit("save-data", formData);
      let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));

      let requestOptions = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loginData.token
          },
        body: JSON.stringify(formData),
      };
     
        let res = await fetch(
          process.env.VUE_APP_BACKEND_URL +"/medical-teams",
          requestOptions
        );

      // loading is finished
      this.isLoading = false;
      this.$router.push({ name: "afterCreate" });
      if (!res.ok) {
        this.error = true;

        let data = await res.json();

        this.errorMessage = data.message;
      } else {

        this.$router.push({ name: "afterCreate" });
      }
      
    },
    checkSessionValidity(user) {
      this.loginStatus = user.exp > Date.now() / 10 ** 3;
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
        this.userName = this.user["sub"];
        this.checkSessionValidity(this.user);
      }
    },
    async fetchData() {
      let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));
      let requestOptions = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + loginData.token
        },
      };

      const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/doctors", requestOptions);
      let data = await res.json();

      const res2 = await fetch(process.env.VUE_APP_BACKEND_URL + "/nurses", requestOptions);
      let data2 = await res2.json();

      const medicalTeams = await fetch(process.env.VUE_APP_BACKEND_URL +"/medical-teams", requestOptions);
      let medicalTeamsData = await medicalTeams.json();

      const doctorsAlreadyInTeam = [];
      const nursesAlreadyInTeam = [];
      const doctorData=[];
      const nurseData=[];
      medicalTeamsData.forEach(element => {
        
        doctorsAlreadyInTeam.push(element["doctorId"]);
        nursesAlreadyInTeam.push(element["nurseId"]);
      })

      data.forEach(element => {
        if(!(doctorsAlreadyInTeam.includes(element["id"]))){
          
          doctorData.push(element);
        }  
      });
      data2.forEach(element => {
        if(!(nursesAlreadyInTeam.includes(element["id"]))){
          nurseData.push(element);
        }  
      });


      let returnData = [doctorData, nurseData]; //data.concat(data2)

      return returnData;
    },
  },
  async created() {
    this.getUserDetails();
    this.isLoading = true;

    const returnData = await this.fetchData();

    this.doctors = returnData[0];
    this.nurses = returnData[1];

    this.isLoading = false;
  },
};
</script>

<style>
.actions {
    display: flex;
    justify-content: center;
  }
.home {
  display: flex;
  justify-content: center;
  text-align: center;
}
.sections-container {
  display: flex;
  justify-content: center;
}
.inputStyle{
  margin-bottom: 5px;
}
.left-section {
  width: 40%;
}

.middle-section {
  margin-left: 5%;
  width: 40%;
}
.right-section {
  display:flex;
  margin-left: 10%;
  width: 30%;
  justify-content: end;
  align-items: center;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.disabled{
  background-color: aquamarine;
}
.button {
  margin-bottom: 15%;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
