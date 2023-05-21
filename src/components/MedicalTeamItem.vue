<template>
    <li :class="{ 'chosen': isChosen }">
      <h3>{{ fullName }}</h3>
      <div class="actions" >
        <base-button @click="choose"  :disabled="disableForChoose">Obriši tim</base-button>
        
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
    props: ['id', 'name'],
    computed: {
      
      fullName() {
        
        return  this.name; 
      },
      
    },
    methods: {
      
      async choose() {
        
        this.isChosen = true;
        let loginData = JSON.parse(localStorage.getItem("orderingSystemData"));
       
        let requestOptions = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + loginData.token
            }
        };
        let path = process.env.VUE_APP_BACKEND_URL +"/medical-teams/delete/" + this.id;
        let res = await fetch(
            path,
            requestOptions
        );
        if (!res.ok) {
        this.error = true;

        let data = await res.json();
        this.errorMessage = data.message;
      } else {

        this.$router.push("/");
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