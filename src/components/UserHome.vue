<template>
  <div>
      <div v-if="this.role=='ROLE_PATIENT'" id="userDiv">
        <div class="cal">
          <h1>Naručite se za pregled kod:</h1>
          <div class="pickerMed">
              <input v-model="medPerson" type="radio" id="doctor" name="medP" value="doctor">
              <label for="doctor" class="label">Doktora</label>
              <input v-model="medPerson" type="radio" id="nurse" name="medP" value="nurse">
              <label for="nurse" class="label">Sestre</label>
          </div>
        </div>
        
          <div v-if="medPerson == 'doctor'" class="cal">
            <div v-if="reservedD == false">
              <v-date-picker locale="hr" mode="date" v-model="date" is-expanded :min-date='new Date()' :max-date='addWorkDays(new Date().setHours(0,0,0,0),9).format()' color="purple"/>
              <div v-if="this.date != null && times.length==0" class="home">
                  <h1>Nema slobodnih termina na odabrani dan.</h1>
              </div>
              <select v-if="this.date != null && times.length>0" v-model="timeR" class="menu">
                <option selected disabled hidden value="pick">Izaberi vrijeme</option>
                <option v-for="(time, index) in times" :key="index" :value="time.id">{{new Date(time.start).toTimeString().slice(0, 5) }}</option>
              </select>
              <select v-if="this.date != null && times.length>0" v-model="checkR" class="menu" style="margin-top: 0;">
                <option selected disabled hidden value="pick">Odaberite tip pregleda</option>
                <option v-for="(check, index) in checks" :key="index" :value="check.id">{{ check.name }}</option>
              </select>
              <div v-if="this.date != null && timeR != 'pick' && checkR != 'pick'" class="reserve-button">
                <base-button @click="reservationD" style="font-size: 20px;">Rezerviraj</base-button>
              </div>
              <div v-if="this.reserveFailed">
                <h1>{{errorMsg}}</h1>
              </div>
              <div v-if="tooMuch">
                <h1>Previše termina ste propustili!</h1>
                <h1>Kontaktirajte dr. {{ doctorLN }}  na broj: {{ doctornum }} ili e-mail: {{ doctormail }}</h1>
              </div>
            </div>
            <div v-if="reservedD == true" class="reservedMsg">
              <h1>Rezervirali ste {{this.Dappointment.medicalService.name}} kod dr. {{ this.Dappointment.medicalPerson.lastname}} u {{new Date(this.Dappointment.start).toTimeString().slice(0,5) }} {{new Date(this.Dappointment.start).toLocaleDateString('hr-HR') }}</h1>
              <div class="cancel-button">
                  <base-button @click="cancelD" style="font-size: 20px;">Otkaži termin</base-button>
              </div>
              <div v-if="this.cancelDfailed">
                <h1>{{ errorMsg }}</h1>
              </div>
            </div>
          </div>

          <div v-if="medPerson == 'nurse'" class="cal">
            <div v-if="reservedN == false">
              <div v-if="nurseCancel==true">
                <v-date-picker locale="hr" mode="date" v-model="dateN" is-expanded :min-date='new Date()' :max-date='addWorkDays(new Date().setHours(0,0,0,0),9).format()' color="purple"/>
                <div v-if="this.dateN != null && timesN.length==0" class="home">
                    <h1>Nema slobodnih termina na odabrani dan.</h1>
                </div>
                <select v-if="this.dateN != null && timesN.length>0" v-model="serviceR" class="menu">
                  <option selected disabled hidden value="pick">Odaberite tip usluge</option>
                  <option v-for="(service, index) in services" :key="index" :value="service.id">{{ service.name }}</option>
                </select>
                <select v-if="this.dateN != null && timesFixN.length>0" v-model="timeN" class="menu" style="margin-top: 0;">
                  <option selected disabled hidden value="pick">Izaberi vrijeme</option>
                  <option v-for="(time, index) in timesFixN" :key="index" :value="time.id">{{ new Date(time.start).toTimeString().slice(0, 5) }}</option>
                </select>
                <div v-if="this.dateN != null && timesFixN.length==0 && serviceR != 'pick'" class="home">
                    <h1>Nema termina za tu uslugu.</h1>
                </div>
                <div v-if="this.dateN != null && timeN != 'pick' && serviceR != 'pick'" class="reserve-button">
                  <base-button @click="reservationN" style="font-size: 20px;">Rezerviraj</base-button>
                </div>
                <div v-if="this.reserveFailedNurse">
                  <h1>{{errorMsgN}}</h1>
                </div>
              </div>
              <div v-if="nurseCancel == false">
                  <div v-if="servicesPossible.length>0">
                    <select v-model="serviceR" class="menu">
                      <option selected disabled hidden value="pick">Odaberite tip usluge</option>
                      <option v-for="(service, index) in servicesPossible" :key="index" :value="service.id">{{ service.name }}</option>
                    </select>
                    <div v-if="serviceR != 'pick'" class="reserve-button">
                      <base-button @click="reservationNFirst" style="font-size: 20px;">Rezerviraj</base-button>
                    </div>
                    <div v-if="this.reserveFailedNurse">
                      <h1>{{errorMsgN}}</h1>
                    </div>
                  </div>
                  <div v-if="servicesPossible.length==0">
                    <h1>Nema slobodnih termina ni za jednu uslugu medicinske sestre.</h1>
                  </div>
              </div>
            </div>
            <div v-if="reservedN == true" class="reservedMsg">
                  <h1>Rezervirali ste {{this.Nappointment.medicalService.name}} kod sestre {{ this.Nappointment.medicalPerson.lastname}} u {{new Date(this.Nappointment.start).toTimeString().slice(0,5) }} {{new Date(this.Nappointment.start).toLocaleDateString('hr-HR') }}</h1>
                  <div class="cancel-button">
                    <base-button @click="cancelN" style="font-size: 20px;">Otkaži termin</base-button>
                  </div>
                  <div v-if="this.cancelNfailed">
                    <h1>{{ errorMsgN }}</h1>
                  </div>
            </div>
          </div>
        
      </div>
      <div v-else-if="this.role=='ROLE_DOCTOR'">
        <doc-view></doc-view>
      </div>
      <div v-else-if="this.role=='ROLE_NURSE'">
        <nurse-view></nurse-view>
      </div>
      <div v-else class="home">
        <h1>{{ this.userName }}</h1>
        <div>
          <base-button @click="goToCreateUser()">Kreiraj korisnika!</base-button>
          <base-button @click="goToCreateMedicalTeam()">Stvori tim!</base-button>
          <base-button @click="goToDeleteMedicalTeam()">Izbriši tim!</base-button>
        </div>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
import DocView from '@/components/DocView.vue'
import NurseView from '@/components/NurseView.vue'

export default {
  name: 'UserHome',
  data() {
    return {
      user: {},
      date: new Date(),
      dateN: new Date(),
      role: JSON.parse(localStorage.getItem("orderingSystemData")).role,
      times: [],
      timeR: "pick",
      timesN: [],
      timeN: "pick",
      checks: [],
      checkR: "pick",
      services: [],
      servicesPossible: [],
      serviceR: "pick",
      medPerson: "doctor",
      reservedD: false,
      reservedN: false,
      timesFixN: [],
      token: "",
      reserveFailed: false,
      Dappointment: null,
      Nappointment: null,
      cancelDfailed: false,
      cancelNfailed: false,
      nurseCancel: false,
      allDaysNurse: [],
      nurseIds: {},
      reserveFailedNurse: false,
      appointmentIds: {},
      tooMuch: false,
      doctormail: "",
      doctornum: "",
      doctorLN: "",
      errorMsg: "",
      errorMsgN: "",
    }
  },
  components: {
    DocView,
    NurseView
  },
  methods: {
    async reservationD() {
      this.errorMsg = ""
      this.tooMuch = false
      this.reserveFailed = false
      const reservation = {
        id: this.timeR,
        medicalServiceId: this.checkR
      };
      
      let requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
        body: JSON.stringify(reservation)
      };
      let res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments/reserve", requestOptions)
      let body = await res.json()
      if (res.ok) {
        this.Dappointment = JSON.parse(JSON.stringify(this.times.filter(time => time.id == this.timeR)[0]))
        this.Dappointment.medicalService = this.checks.filter(checks => checks.id == this.checkR)[0]
        this.reservedD = true
      }  else if (body.message == "Greška: Pacijent se nije pojavio na više od 10% zakazanih termina te ga se stoga upućuje na izravan dogovor s doktorom!") {
        this.tooMuch = true
      } else {
        this.errorMsg = body.message
        this.reservedD = false
        this.reserveFailed = true
      }
    },
    async reservationN() {
      this.reserveFailedNurse = false
      const reservation = {
        id: this.timeN,
        medicalServiceId: this.serviceR
      };

      let requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
        body: JSON.stringify(reservation)
      };
      let res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments/reserve", requestOptions)
      let body = await res.json()
      if (res.ok) {
        this.reservedN = true
        this.Nappointment = this.timesN.filter(time => time.id == this.timeN)[0]
      } else {
        this.errorMsgN = body.message
        this.reservedN = false
        this.reserveFailedNurse = true
      }
    },
    async reservationNFirst() {
      this.reserveFailedNurse = false
      const reservation = {
        id: this.appointmentIds[this.serviceR],
        medicalServiceId: this.serviceR
      }
      let requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
        body: JSON.stringify(reservation)
      };
      let res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments/reserve", requestOptions)
      let body = await res.json()
      if (res.ok) {
        await this.fetchData()
        this.reservedN = true
        this.serviceR = "pick"
      } else {
        this.errorMsgN = body.message
        this.reservedN = false
        this.reserveFailedNurse = true
      }
    },
    addWorkDays: function(startDate, daysToAdd) {
        startDate = new Date(startDate)
        let dw=startDate.getDay()
        startDate.setDate(startDate.getDate()-((dw==6)?1:(dw==0)?2:0))
        var avance = 2 * Math.floor(daysToAdd / 5)
        var exceso = (daysToAdd % 5) + startDate.getDay() 
        if (exceso>=6) avance +=2 
        startDate.setDate(startDate.getDate() + daysToAdd + avance)
        return startDate
    },
    goToCreateUser() {
      this.$router.push("/createUser");
    },
    goToCreateMedicalTeam() {
      this.$router.push("/createMedicalTeam");
    },
    goToDeleteMedicalTeam() {
      this.$router.push("/deleteMedicalTeam");
    },
    setShowDate(d) {
      this.showDate = d;
    },
    async cancelD() {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
      };
      let res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments/"+this.Dappointment.id+"/cancel", requestOptions)

      if (res.ok) {
        this.reservedD = false
        this.Dappointment = null
      } else {
        this.cancelDfailed = true
        let body = await res.json()
        this.errorMsg = body.message
      }
    },
    async cancelN() {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
      };
      let res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments/"+this.Nappointment.id+"/cancel", requestOptions)
      if (res.ok) {
        this.reservedN = false
        this.Nappointment = null
        this.nurseCancel = true
      } else {
        this.cancelNfailed = true
        let body = await res.json()
        this.errorMsgN = body.message
      }
    },
    setChecks(data) {
        this.checks = data.filter(service => service.type != null)
        this.timeN = "pick"
    },
    setTimes(data) {
        this.times = []
        if (this.date == null){
          return
        }
        for (let i = 0; i < data.length; i++) {
          if (new Date(data[i].start).toDateString() == this.date.toDateString()){
            this.times.push(data[i])
            //this.times.push(new Date(data[i].start).toTimeString().slice(0, 5))
          }
        }
        this.times.sort((a,b) => a.start - b.start)
    },
    setTimesN(data) {
        this.timesN = []
        if (this.dateN == null){
          return
        }
        for (let i = 0; i < data.length; i++) {
          if (new Date(data[i].start).toDateString() == this.dateN.toDateString()){
            this.timesN.push(data[i])
          }
          if (data[i].start > new Date().getTime()){
            this.allDaysNurse.push(data[i])
          }
        }
        this.allDaysNurse.sort((a,b) => a.start - b.start)
        this.timesN.sort((a,b) => a.start - b.start)
    },
    setServices(data) {
        this.services = data.filter(service => service.type == null)
        for (let i = 0; i < this.allDaysNurse.length; i++) {
          if (this.allDaysNurse[i].medicalService != null) {
            let ser = this.services.filter(service => service.id == this.allDaysNurse[i].medicalService.id)[0]
            if ( ser == null || this.servicesPossible.filter(s => s.name == ser.name).length > 0 ){
              continue
            }
            this.servicesPossible.push(ser)
            this.nurseIds[this.allDaysNurse[i].medicalService.id] = this.allDaysNurse[i].medicalPerson.id
            this.appointmentIds[this.allDaysNurse[i].medicalService.id] = this.allDaysNurse[i].id
          }
        }
        this.timeR = "pick"
    },
    updateTimesN() {
        this.timeN = "pick"
        for (let i = 0; i < this.timesN.length; i++) {
          if (this.timesN[i].medicalService != null && this.timesN[i].medicalService.id == this.serviceR){
            this.timesFixN.push(JSON.parse(JSON.stringify(this.timesN[i])))
          }
        }
  
        if (this.dateN == null){
          return
        }
        this.timesFixN.sort((a,b) => a.start - b.start)
    },
    setAppointments(data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].medicalService != null && data[i].medicalService.type != null && data[i].start > new Date().getTime()) {
            this.Dappointment = JSON.parse(JSON.stringify(data[i]));
          } else if (data[i].medicalService != null && data[i].medicalService.type == null && data[i].start > new Date().getTime()) {
            this.Nappointment = JSON.parse(JSON.stringify(data[i]));
          }
        }
        if (this.Dappointment != null) {
          this.reservedD = true;
        }
        if (this.Nappointment != null) {
          this.reservedN = true;
        }
    },
    doctordata(data) {
      this.doctormail = data.doctor.email
      this.doctornum = data.doctor.phoneNumber
      this.doctorLN = data.doctor.lastname
    },
    async fetchData() {
        if (this.role == 'ROLE_PATIENT') {
          let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));
      
          this.token = loginData.token
          let requestOptions = {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + loginData.token
            }
          }
          this.errorMsg = ""
          this.errorMsgN = ""
          this.tooMuch = false
          this.reserveFailed = false
          this.reserveFailedNurse = false
          const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/services", requestOptions)
          const res2 = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me/available-appointments", requestOptions)
          const res3 = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me/available-appointments/nurse", requestOptions)
          const res4 = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me/appointments", requestOptions)
          const res5 = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me", requestOptions)
          let data = await res.json()
          let data2 = await res2.json()
          let data3 = await res3.json()
          let data4 = await res4.json()
          let data5 = await res5.json()
          this.setAppointments(data4)
          this.setChecks(data)
          this.setTimes(data2)
          this.setTimesN(data3)
          this.setServices(data)
          this.doctordata(data5)
        }
    },
  },
  watch: {
    'date': function () {
      this.fetchData()
    },
    'dateN': function () {
      this.timesFixN = []
      this.serviceR = 'pick'
      this.fetchData()
    },
    'serviceR': async function () {
      this.timesFixN = []
      this.updateTimesN()

    },
  },
  async created() {
    this.fetchData()
  },
  props: ['userName']
}

</script>

<style scoped>
.label{
  font-size: 24px;
  font-weight: bold;
}

#nurse{
  margin-left: 5%;
  margin-right: 1.5%;
  transform: scale(1.4);
}

#doctor{
  margin-right: 1.5%;
  transform: scale(1.4);
}

.pickerMed{
  margin: 3%;
}

.home {
  display: grid;
  justify-content: center;
  text-align: center;
}

.menu {
  margin: 5%;
  padding: 2%;
  width: 75%;
  font-size: 20px;
}


ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.reservedMsg {
  margin: 10%;
}

.button {
  margin-bottom: 15%;
}

.cal {
  justify-content: center;
  text-align: center;
  padding-left: 25%;
  padding-right: 25%;
}

.reserve-button {
  display: grid;
  justify-content: center;
  text-align: center;
}

.cancel-button {
  display: grid;
  justify-content: center;
  text-align: center;
}

#userDiv {
  width: 100%;
}
</style>
  