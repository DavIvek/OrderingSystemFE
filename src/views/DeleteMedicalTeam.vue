  <template>
    <section>
        <base-card>
        <div v-if="isLoading">
            <base-spinner></base-spinner>
          </div>
    <ul v-else-if="hasTeams">
    <medical-team-item
        v-for="medicalTeam in medicalTeams"
        :key="medicalTeam.id"
        :name="medicalTeam.name"
        :id="medicalTeam.id"
        >
    </medical-team-item>
    </ul>
    <div v-else>
        <h3>There is no team</h3>
      </div>
    </base-card>
    </section>
</template>

<script>
import MedicalTeamItem from "@/components/MedicalTeamItem.vue";
//import UserHome from '@/components/UserHome.vue'
import VueJwtDecode from "vue-jwt-decode";

export default {
    name: "DeleteMedicalTeam",
    components: {
        MedicalTeamItem,
        //BaseButton,
        
        //UserHome
  },
  data() {
    return {
      isLoading: false,
      loginStatus: false,
      error: null,
      medicalTeams: [], 
     
      message:{
        text:""
      }
    };
  },
  computed: {
    hasTeams() {


        return this.medicalTeams.length > 0;
    },
    
  },
  methods: {
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
      const medicalTeams = await fetch(process.env.VUE_APP_BACKEND_URL +"/medical-teams", requestOptions);
      let medicalTeamsData = await medicalTeams.json();


      
      return medicalTeamsData;
    },
    },
    async created() {
        this.getUserDetails();
        this.isLoading = true;

        const returnData = await this.fetchData();

        this.medicalTeams = returnData;
        

        this.isLoading = false;
  },
}
</script>
<style scoped>

</style>