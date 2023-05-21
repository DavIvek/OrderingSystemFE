<template>
    <li :class="{ 'chosen': isChosen }">
      <h3>{{ fullName }}</h3>
      <div class="actions" >
        <base-button @click="choose" class="class" :disabled="disableForChoose">Odaberi</base-button>
        <base-button @click="recall" :disabled="disableForRecall">Poništi odabir</base-button>
      </div>
    </li>
  </template>
  
  <script>
  export default {
    data(){
      return{
        disableForRecall:true,
        disableForChoose:false,
        isChosen: false
      }
    },
    props: ['id', 'firstName', 'lastName', 'rate', 'role', 'selectedDoctorId'],
    computed: {
      
      fullName() {
        localStorage.removeItem("doctorId")
        localStorage.removeItem("nurseId")
        return  this.firstName + ' ' + this.lastName + ', ' + this.role; 
      },
      isDisabled() {
       
        return true
    },
    },
    methods: {
      
      choose() {
        
        if(this.role === "Doctor" && localStorage.getItem("doctorId")==null){
          localStorage.setItem("doctorId", this.id);
          this.disableForRecall=false;
          this.isChosen = true;

        }
        if(this.role === "Nurse" && localStorage.getItem("nurseId")==null){
          localStorage.setItem("nurseId", this.id);
          this.disableForRecall=false;
          this.isChosen = true;
        }
        if(localStorage.getItem("doctorId")!=null && localStorage.getItem("doctorId") != this.id && this.role === "Doctor" ){
          
          alert("Već ste odabrali doktora za svoj tim!")
        }
        if(localStorage.getItem("nurseId")!=null && localStorage.getItem("nurseId") != this.id && this.role === "Nurse" ){
          alert("Već ste odabrali medicinsku sestru/brata za svoj tim!")
        }

  },
      recall() {
        
        
        if(localStorage.getItem("doctorId")!=null && localStorage.getItem("doctorId") == this.id && this.role === "Doctor" ){
          localStorage.removeItem("doctorId")
          alert("Poništen je odabir doktora!")
          this.disableForRecall=true;
          this.isChosen=false;
        }
        if(localStorage.getItem("nurseId")!=null && localStorage.getItem("nurseId") == this.id && this.role === "Nurse" ){
          localStorage.removeItem("nurseId")
          alert("Poništen je odabir medicinske sestre/brata!")
          this.disableForRecall=true;
          this.isChosen=false;
        }

  },
      
  },
  };
  </script>
  
  <style scoped>
  li {
    margin: 1rem 0;
    border: 1px solid #424242;
    border-radius: 12px;
    padding: 1rem;
  }
  .chosen{
    border: 5px solid green;
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
  
  .actions {
    display: flex;
    justify-content: center;
  }
  
  </style>