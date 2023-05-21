<template>
  <div class="actions">
    <h1>Stvaranje uspješno provedeno!</h1>
    <div class="actions">
      <base-button @click="goBack()" class="button">Vrati me na početnu stranicu</base-button>
      
    </div>
  </div>
</template>
<script>
export default ({
    methods:{
       goBack(){
       this.$router.push('/'); 
          }
      }

})
</script>

<style scoped>
.actions {
    display: grid;
    justify-content: center;
    align-items: center;
  }
.button {
  margin-left: 5px;
  margin-top: 35px;
}
</style>
