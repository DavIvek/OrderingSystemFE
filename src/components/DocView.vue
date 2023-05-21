<template>
    <div class="center">
        <h1>Prikaži:</h1>
        <div>
            <input v-model="calendarSelected" type="radio" id="calendar" name="calen" value="cal">
            <label for="calendar" class="label">Kalendar</label>
            <input v-model="calendarSelected" type="radio" id="nocalendar" name="calen" value="nocal">
            <label for="nocalendar" class="label">Akcije s terminima</label>
        </div>
    </div>
    <div v-if="calendarSelected == 'cal'" style=" padding: 2%;"> 
      <vue-cal class="vuecal--blue-theme" :disable-views="['years', 'year', 'month']" :events="events" :time-cell-height="43" :min-date="minDate" :max-date="maxDate" :time-from="6 * 60" :time-to="23*60" :time-step="30" locale="hr"/>    
    </div>
    <transition>
      <div v-if="calendarSelected == 'nocal'">
        <div class="nocalen">
            <div class="termini">
              <h1>Evidencija dolazanosti:</h1>
              <h1 v-if="allChecks.length == 0" style="margin:3%;">Nema dostupnih termina za evidenciju.</h1>
                <span v-for="(check, index) in allChecks" :key="index" class="checkbox">
                  <label><input type="checkbox" :value="check.id" v-model="checkedNames">{{check.patient.firstname +" "+ check.patient.lastname + " " + new Date(check.start).toLocaleTimeString('hr-HR').slice(0,5)}}</label><br>
                </span>
                <div>
                  <base-button v-if="checkedNames.length != 0" @click="confirmAppeared" class="button">Potvrdi dolazak</base-button>
                  <base-button v-if="checkedNames.length != 0" @click="confirmDisappeared" class="button">Potvrdi nedolazak</base-button>
                </div>
              </div>

            <div class="termini">
              <h1>Odgoda termina:</h1>
              <h1 v-if="allChecksDelay.length == 0" style="margin:3%;">Nema dostupnih termina za odgodu.</h1>
                <span v-for="(check, index) in allChecksDelay" :key="index" class="checkbox">
                    <label><input type="checkbox" :value="check.id" v-model="checkedNamesDelay"> {{check.patient.firstname +" "+ check.patient.lastname + " " + new Date(check.start).toLocaleTimeString('hr-HR').slice(0,5) + " - " + new Date(check.start).toLocaleDateString('hr-HR')}}</label><br>
                </span>
                <div>
                  <base-button v-if="checkedNamesDelay.length != 0" @click="delay24hr" class="button">Odgodi</base-button>
                </div>
            </div>
          </div>
          <div class="adjustSettings">
              <h1>Postavke termina:</h1>
              <div class="settings">
                  <div class="setting">
                      <h2>Koliko vremena unaprijed pacijent smije rezervirati termin:</h2>
                      <h3 style="font-weight: lighter;">(Trenutna vrijednost {{ currentRule }})</h3>
                      <select v-model="selectedRule" class="menu">
                          <option selected disabled hidden value="pick">Odaberite vrijeme:</option>
                          <option value=12>12 sati</option>
                          <option value=24>24 sata</option>
                          <option value=48>48 sati</option>
                          <option value=72>72 sata</option>
                      </select>
                      <div>
                      <base-button v-if="selectedRule != 'pick'" style="margin-top: 0%;" class="button" @click="saveRule">Spremi</base-button>
                      </div>
                  </div>
                  <div v-if="dayFrom <= dayTo">
                    <h1 v-if="dayFrom < dayTo">Radno vrijeme za: {{new Date(dayFrom).toLocaleDateString('hr-HR')}} do {{new Date(dayTo).toLocaleDateString('hr-HR')}}</h1>
                    <h1 v-else>Radno vrijeme za: {{new Date(dayFrom).toLocaleDateString('hr-HR')}}</h1>
                    <div class="schedule">
                      <div class="setting" id="scheduleSetting">
                        <h2>Parni dani:</h2>
                        <div class="workingHours">
                          <div class="option">
                            <input v-model="evenTime" type="radio" id="evenMorning" value="morning">
                            <label for="evenMorning" class="">Ujutro (7:00 - 14:00)</label>
                          </div>
                          <div class="option">
                            <input v-model="evenTime" type="radio" id="evenNoon" value="noon">
                            <label for="evenNoon">Popodne (13:00 - 20:00)</label>
                          </div>
                          <div class="option">
                            <input v-model="evenTime" type="radio" id="evenRest" value="rest">
                            <label for="evenRest">Ostalo:</label>
                          </div>
                          <div v-if="evenTime == 'rest'" class="option">
                            <label for="evenStart">Od: </label>
                            <input type="time" id="evenStart" name="evenStart" value="07:00">
                            <label for="evenEnd">Do: </label>
                            <input type="time" id="evenEnd" name="evenEnd" value="14:00">
                          </div>
                        </div>
                        <div>
                          <h2>Odaberi trajanje termina:</h2>
                          <select v-model="evenLength" class="menu">
                            <option selected disabled hidden value="pick">Odaberite trajanje:</option>
                            <option value="15">15 minuta</option>
                            <option value="30">30 minuta</option>
                            <option value="45">45 minuta</option>
                            <option value="60">60 minuta</option>
                          </select>
                        </div>
                        <div>
                          <h2>Odaberi početak pauze:</h2>
                          <input v-model="evenpauseStart" type="time" id="evenPauseStart" name="evenPauseStart">
                        </div>
                        <div>
                          <h2>Odaberi trajanje pauze:</h2>
                          <select v-model="evenpauseLength" class="menu">
                            <option selected disabled hidden value="pick">Odaberite trajanje:</option>
                            <option value="15">15 minuta</option>
                            <option value="30">30 minuta</option>
                            <option value="45">45 minuta</option>
                            <option value="60">60 minuta</option>
                          </select>
                        </div>
                      </div>
                      <div class="setting" id="scheduleSetting">
                        <h2>Neparni dani:</h2>
                        <div class="workingHours">
                          <div class="option">
                            <input v-model="oddTime" type="radio" id="oddMorning" value="morning">
                            <label for="oddMorning">Ujutro (7:00 - 14:00)</label>
                          </div>
                          <div class="option">
                            <input v-model="oddTime" type="radio" id="oddNoon" value="noon">
                            <label for="oddNoon">Popodne (13:00 - 20:00)</label>
                          </div>
                          <div class="option">
                            <input v-model="oddTime" type="radio" id="oddRest" value="rest">
                            <label for="oddRest">Ostalo:</label>
                          </div>
                          <div v-if="oddTime == 'rest'" class="option">
                            <label for="oddStart">Od: </label>
                            <input type="time" id="oddStart" name="oddStart" value="07:00">
                            <label for="oddEnd">Do: </label>
                            <input type="time" id="oddEnd" name="oddEnd" value="14:00">
                          </div>
                        </div>
                        <div>
                          <h2>Odaberi trajanje termina:</h2>
                          <select v-model="oddLength" class="menu">
                            <option selected disabled hidden value="pick">Odaberite trajanje:</option>
                            <option value="15">15 minuta</option>
                            <option value="30">30 minuta</option>
                            <option value="45">45 minuta</option>
                            <option value="60">60 minuta</option>
                          </select>
                        </div>
                        <div>
                          <h2>Odaberi početak pauze:</h2>
                          <input v-model="oddpauseStart" type="time" id="evenPauseStart" name="oddPauseStart">
                        </div>
                        <div>
                          <h2>Odaberi trajanje pauze:</h2>
                          <select v-model="oddpauseLength" class="menu">
                            <option selected disabled hidden value="pick">Odaberite trajanje:</option>
                            <option value="15">15 minuta</option>
                            <option value="30">30 minuta</option>
                            <option value="45">45 minuta</option>
                            <option value="60">60 minuta</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <base-button v-if="evenTime != '' && oddTime != '' && evenLength != 'pick' && oddLength != 'pick' && evenpauseStart != '' && oddpauseStart != '' && evenpauseLength != 'pick' && oddpauseLength != 'pick'"
                      class="buttonSave" @click="saveSchedule">Spremi raspored</base-button>
                    </div>
                    <div v-if="wrongSch">
                      <h1>Vremena u rasporedu nisu konzistentna.</h1>
                    </div>
                    <div v-if="failedCreate">
                      <h1>Neuspješno stvaranje termina.</h1>
                    </div>
                  </div>
                  <div v-else>
                    <h1>Već ste postavili radno vrijeme za sljedećih 10 dana.</h1>
                  </div>
              </div>         
          </div>
      </div>
    </transition>
</template>



<script>
  // @ is an alias to /src
  import VueCal from "vue-cal";
  import 'vue-cal/dist/vuecal.css';
  import 'vue-cal/dist/i18n/hr.es.js';

  export default {
    name: 'UserHome',
    data(){
        return {
          events: [],
          checkedNames: [],
          allChecks: [],
          calendarSelected: 'cal',
          checkedNamesDelay: [],
          allChecksDelay: [],
          currentRule: "",
          selectedRule: "pick",
          evenTime: "",
          oddTime: "",
          evenLength: "pick",
          oddLength: "pick",
          oddpauseStart: "10:00",
          evenpauseStart: "10:00",
          oddpauseLength: "pick",
          evenpauseLength: "pick",
          token: "",
          myRule: 0,
          stringMap: {12:"12 sati",24:"24 sata", 48:"48 sati", 72:"72 sata"},
          wrongSch: false,
          failedCreate: false,
          latestAppTime: -1,
          dayFrom: "",
          dayTo:""
       }
    },
    components: {	
      VueCal
		},   
    methods: {
       confirmAppeared: async function() {
        let requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          },
          body: null
        };
        let temp = []
        for (var app of this.checkedNames){
          requestOptions.body=JSON.stringify({appointmentId: app, attended: true})
          const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments"+ "/confirm", requestOptions)
          if (res.ok){
            let patient = this.allChecks.filter( ( el ) => el.id == app)[0].patient
            this.allChecks  = this.allChecks.filter( ( el ) => el.id != app)
            temp.push(patient.firstname + " " + patient.lastname)
          }
        }
        
        alert("Potvrđeno dolazak: " + temp);
        this.checkedNames = [];
      }, 
      confirmDisappeared: async function() {
        let requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          },
          body: null
        };
        let temp = []
        for (var app of this.checkedNames){
          requestOptions.body=JSON.stringify({appointmentId: app, attended: false})
          const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments"+ "/confirm", requestOptions)
          if (res.ok){
            let patient = this.allChecks.filter( ( el ) => el.id == app)[0].patient
            this.allChecks  = this.allChecks.filter( ( el ) => el.id != app)
            temp.push(patient.firstname + " " + patient.lastname)
          }
        }
        alert("Potvrđeno nedolazak: " + temp);
        this.checkedNames = [];
      },
      delay24hr: async function() {
        let requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          }
        };
        let temp = []
        let fail = []
        let msg = ""
        for (var app of this.checkedNamesDelay){
          const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments/"+ app + "/postpone", requestOptions)
          let body = await res.json()
       
          
          if (res.ok){
            let patient = this.allChecksDelay.filter( ( el ) => el.id == app)[0].patient
            this.allChecksDelay  = this.allChecksDelay.filter( ( el ) => el.id != app)
            temp.push(patient.firstname + " " + patient.lastname)
          } else {
            let patient = this.allChecksDelay.filter( ( el ) => el.id == app)[0].patient
            fail.push(patient.firstname + " " + patient.lastname)
            msg = body.message
          }
        }
        if (temp.length>0 && fail.length>0) alert("Odgođeno: " + temp, " Neuspješno odgođeno: " + fail + "  zbog " + msg);
        if (temp.length>0 && fail.length==0) alert("Odgođeno: " + temp);
        if (fail.length>0 && temp.length==0) alert("Neuspješno odgođeno: " + fail + "  zbog " + msg);
        this.checkedNamesDelay = [];
      },
      saveRule: async function() {
        let requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          },
          body: JSON.stringify({
            "reservationRule": this.selectedRule
          })
        };
        const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me", requestOptions)
        if (res.ok){
          this.currentRule = this.stringMap[this.selectedRule]
          this.selectedRule = 'pick'
        }
      },
      checkSchedule: function() {  
        //even
        let timestarte = ""
        let timeende = ""
        let pausestarte = this.evenpauseStart.split(":").map(o => parseInt(o))
        let pauselengthe = parseInt(this.evenpauseLength)
        let lengthe = parseInt(this.evenLength)
        if (this.evenTime == 'morning'){
          timestarte = "7:00".split(":").map(o => parseInt(o))
          timeende = "14:00".split(":").map(o => parseInt(o))
        } else if (this.evenTime == 'noon') {
          timestarte = "13:00".split(":").map(o => parseInt(o))
          timeende = "20:00".split(":").map(o => parseInt(o))
        } else if (this.evenTime == 'rest') {
          timestarte = document.getElementById("evenStart").value.split(":").map(o => parseInt(o))
          timeende = document.getElementById("evenEnd").value.split(":").map(o => parseInt(o))
        }
        if (new Date().setHours(timestarte[0],timestarte[1],0,0) >= new Date().setHours(timeende[0],timeende[1],0,0)){
            return false
        }
        if (new Date().setHours(pausestarte[0],pausestarte[1]+pauselengthe,0,0) > new Date().setHours(timeende[0],timeende[1],0,0)){
            return false
        }
        if (new Date().setHours(pausestarte[0],pausestarte[1],0,0) < new Date().setHours(timestarte[0],timestarte[1],0,0)){
            return false
        }
        if (!(new Date().setHours(timestarte[0],timestarte[1]+lengthe,0,0) <= new Date().setHours(pausestarte[0],pausestarte[1],0,0)) && !(new Date().setHours(pausestarte[0],pausestarte[1]+pauselengthe+lengthe,0,0)<=new Date().setHours(timeende[0],timeende[1],0,0))){
          return false
        }
        //odd
        let timestarto = ""
        let timeendo = ""
        let pausestarto = this.oddpauseStart.split(":").map(o => parseInt(o))
        let pauselengtho = parseInt(this.oddpauseLength)
        let lengtho = parseInt(this.oddLength)
        if (this.oddTime == 'morning'){
          timestarto = "7:00".split(":").map(o => parseInt(o))
          timeendo = "14:00".split(":").map(o => parseInt(o))
        } else if (this.oddTime == 'noon') {
          timestarto = "13:00".split(":").map(o => parseInt(o))
          timeendo = "20:00".split(":").map(o => parseInt(o))
        } else if (this.oddTime == 'rest') {
          timestarto = document.getElementById("oddStart").value.split(":").map(o => parseInt(o))
          timeendo = document.getElementById("oddEnd").value.split(":").map(o => parseInt(o))
        }
        if (new Date().setHours(timestarto[0],timestarto[1],0,0) >= new Date().setHours(timeendo[0],timeendo[1],0,0)){
            return false
        }
        if (new Date().setHours(pausestarto[0],pausestarto[1]+pauselengtho,0,0) > new Date().setHours(timeendo[0],timeendo[1],0,0)){
            return false
        }
        if (new Date().setHours(pausestarto[0],pausestarto[1],0,0) < new Date().setHours(timestarto[0],timestarto[1],0,0)){
            return false
        }
        if (!(new Date().setHours(timestarto[0],timestarto[1]+lengtho,0,0) <= new Date().setHours(pausestarto[0],pausestarto[1],0,0)) && !(new Date().setHours(pausestarto[0],pausestarto[1]+pauselengtho+lengtho,0,0)<=new Date().setHours(timeendo[0],timeendo[1],0,0))){
            return false
        }
        return true
      },
      getOdd: function(date) {
        let termini = []
        let timestarto = ""
        let timeendo = ""
        let pausestarto = this.oddpauseStart.split(":").map(o => parseInt(o))
        let pauselengtho = parseInt(this.oddpauseLength)
        let lengtho = parseInt(this.oddLength)
        if (this.oddTime == 'morning'){
          timestarto = "7:00".split(":").map(o => parseInt(o))
          timeendo = "14:00".split(":").map(o => parseInt(o))
        } else if (this.oddTime == 'noon') {
          timestarto = "13:00".split(":").map(o => parseInt(o))
          timeendo = "20:00".split(":").map(o => parseInt(o))
        } else if (this.oddTime == 'rest') {
          timestarto = document.getElementById("oddStart").value.split(":").map(o => parseInt(o))
          timeendo = document.getElementById("oddEnd").value.split(":").map(o => parseInt(o))
        }
        for(let i = new Date(date).setHours(timestarto[0],timestarto[1],0,0); i < new Date(date).setHours(pausestarto[0],pausestarto[1],0,0); i += lengtho*60000){
          termini.push({start: i, end: i+lengtho*60000})
        }
        for (let i = new Date(date).setHours(pausestarto[0],pausestarto[1]+pauselengtho,0,0); i <= new Date(date).setHours(timeendo[0],timeendo[1],0,0)-lengtho*60000; i = i + lengtho*60000){
          termini.push({start: i, end: i+lengtho*60000})
        }
     
        return termini
      },
      getEven: function(date) {
        let termini = []
        let timestarte = ""
        let timeende = ""
        let pausestarte = this.evenpauseStart.split(":").map(o => parseInt(o))
        let pauselengthe = parseInt(this.evenpauseLength)
        let lengthe = parseInt(this.evenLength)
        if (this.evenTime == 'morning'){
          timestarte = "7:00".split(":").map(o => parseInt(o))
          timeende = "14:00".split(":").map(o => parseInt(o))
        } else if (this.evenTime == 'noon') {
          timestarte = "13:00".split(":").map(o => parseInt(o))
          timeende = "20:00".split(":").map(o => parseInt(o))
        } else if (this.evenTime == 'rest') {
          timestarte = document.getElementById("evenStart").value.split(":").map(o => parseInt(o))
          timeende = document.getElementById("evenEnd").value.split(":").map(o => parseInt(o))
        }
        for (let i = new Date(date).setHours(timestarte[0],timestarte[1],0,0); i <= new Date(date).setHours(pausestarte[0],pausestarte[1],0,0)-lengthe*60000; i +=lengthe*60000){
          termini.push({start: i, end: i+lengthe*60000})
        }
        for (let i = new Date(date).setHours(pausestarte[0],pausestarte[1]+pauselengthe,0,0); i <= new Date(date).setHours(timeende[0],timeende[1],0,0)-lengthe*60000; i += lengthe*60000){
          termini.push({start: i, end: i+lengthe*60000})
        }
        return termini
      },
      generateSchedule: function() {
        let termini = []
        let tempStart = new Date(this.dayFrom)
        let tempEnd = new Date(this.dayTo)
        for (let i = tempStart; i <= tempEnd; i.setDate(i.getDate() + 1)){
          if (i.getDay() == 0 || i.getDay() == 6){
            continue
          }
          if (i.getDate()%2 == 0){
            termini = termini.concat(this.getEven(i))
          } else {
            termini = termini.concat(this.getOdd(i))
          } 
        }
        return termini
      },
      saveSchedule: async function() {
        this.wrongSch = false
        this.failedCreate = false
        if (!this.checkSchedule()){
          this.wrongSch = true
        } else {
          var termini = this.generateSchedule()
          let requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
          },
          body: JSON.stringify(termini)
          };
          const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/appointments/create", requestOptions)
          if (res.ok){
            this.wrongSch = false
            this.failedCreate = false
            this.fetchData()
          } else {
            this.failedCreate = true
          }
        }
      },
      setApps: function(data) {
        this.events = data.map(app => {
          return {
            start: new Date(app.start).toISOString().slice(0,10)+ " " + new Date(app.start).toLocaleTimeString('hr-HR').slice(0,5),
            end: new Date(app.end).toISOString().slice(0,10)+ " " + new Date(app.end).toLocaleTimeString('hr-HR').slice(0,5),
            title: app.patient == null ?  "Prazan termin" : (app.patient.firstname + " " + app.patient.lastname +'  '+ app.medicalService.name)
          }
        })
        this.allChecksDelay = data.filter(appointment => appointment.start > new Date().getTime() && appointment.patient!=null)
        this.allChecks = data.filter(appointment => new Date(appointment.start).toDateString() == new Date().toDateString() && appointment.start < new Date().getTime() && appointment.patientAttended==null && appointment.patient!=null)
      },
      setLatestApp : function(data) {
        if (data.length == 0){
          this.latestAppTime = new Date().getTime()
        } else {
          this.latestAppTime = Math.max.apply(Math, data.map(function(o) { return o.end; }))
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
      async fetchData() {
        let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));

        this.token = loginData.token
        let requestOptions = {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loginData.token
          }
        }
        const res = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me/appointments", requestOptions)
        const res1 = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me", requestOptions)
        const res2 = await fetch(process.env.VUE_APP_BACKEND_URL + "/users/me/available-appointments", requestOptions)
        let data = await res.json()
        let data1 = await res1.json()
        let data2 = await res2.json()
        this.myRule = data1.reservationRule
        this.currentRule = this.stringMap[this.myRule]
        this.setApps(data.concat(data2))
        this.setLatestApp(data.concat(data2))
        this.dayFrom = this.addWorkDays(new Date(this.latestAppTime).setHours(0,0,0,0),1)
        this.dayTo = this.addWorkDays(new Date().setHours(0,0,0,0),9)
        // this.dayTo = new Date(this.dayTo)

      }
		},
    computed: {
        minDate () {
          return new Date()
        },
       maxDate () {
          return this.addWorkDays(new Date().setHours(0,0,0,0),9)
        }
    },
    created() {
      this.fetchData()
    }
  }


</script>
  
<style scoped>

.buttonSave{
  margin: 5%;
  margin-top: 3%;
  padding: 2%;
  width: 50%;
  font-size: 20px;
}
.option{
  margin: 2%
}
.workingHours{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.6s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

#scheduleSetting{
  margin: 5%;
  margin-top: 3%;
  padding: 2%;
  width: 80%;
  font-size: 20px;
}

.schedule{
  display: flex;
  justify-content: center;
}

@media screen and (max-width: 600px) {
  .schedule {
    flex-direction: column;
  }
} 
.menu {
  margin: 5%;
  margin-top: 3%;
  padding: 2%;
  width: 75%;
  font-size: 20px;
}

.layout{
  display: flex;
  justify-content: center;
  text-align: center;
  padding-top: 10%;
}

.checkbox {
  display: inline-block;
  margin: 0 1rem 1rem 0;
  padding: 0.5rem;
  border: 1px solid #424242;
  border-radius: 20px;
}

.button{
  margin: 1%;
}

.label{
  margin-right: 1%;
  font-size: 24px;
  font-weight: bold;
}
.nocalen{
  display: flex;
  justify-content: center;
  text-align: center;
  padding-top: 1%;
}

.termini{
  justify-content: center;
  text-align: center;
  margin: 1%;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

.adjustSettings{
  justify-content: center;
  text-align: center;
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 2%;
  margin-bottom: 3%;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

.setting{
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
  margin: 3%;
}
 
.settings{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-left: 10%;
  margin-right: 10%;
}



.center {
  justify-content: center;
  text-align: center;
  padding-left: 25%;
  padding-right: 25%;
}

#calendar{
  margin-right: 1%;
  margin-left: 8%;
  transform: scale(1.4);
}

#nocalendar{
  margin-left: 3%;
  margin-right: 1%;
  transform: scale(1.4);
}

#evenPauseStart {
  border: none;
  color: #2a2c2d;
  font-size: 14px;
  font-family: helvetica;
  width: 180px;
}

/* Wrapper around the hour, minute, second, and am/pm fields as well as 
the up and down buttons and the 'X' button */
#evenPauseStart::-webkit-datetime-edit-fields-wrapper {
  display: flex;
}

/* The space between the fields - between hour and minute, the minute and 
second, second and am/pm */
#evenPauseStart::-webkit-datetime-edit-text {
  padding: 19px 4px;
}

/* The naming convention for the hour, minute, second, and am/pm field is
`-webkit-datetime-edit-{field}-field` */

/* Hour */
#evenPauseStart::-webkit-datetime-edit-hour-field {
  background-color: #f2f4f5;
  border-radius: 15%;
  padding: 19px 13px;
}

/* Minute */
#evenPauseStart::-webkit-datetime-edit-minute-field {
  background-color: #f2f4f5;
  border-radius: 15%;
  padding: 19px 13px;
}

/* AM/PM */
#evenPauseStart::-webkit-datetime-edit-ampm-field {
  background-color: #7155d3;
  border-radius: 15%;
  color: #fff;
  padding: 19px 13px;
}

/* Up/Down arrows for incrementing/decrementing the value */
#evenPauseStart::-webkit-inner-spin-button {
  display: none;
}

</style>