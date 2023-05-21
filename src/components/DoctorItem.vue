<template>
    <li>
      <h3>{{ fullName }}</h3>
      <div class="actions">
        <base-button link :to="'/register/' + this.id">Registrirajte se!</base-button>
      </div>
    </li>
  </template>
  
  <script>
  export default {
    props: ['id', 'firstName', 'lastName', 'rate'],
    computed: {
      fullName() {
        return  this.firstName + ' ' + this.lastName + ', dr. med.';
      }
    }
  };
  </script>
  
  <style scoped>
  li {
    margin: 1rem 0;
    border: 1px solid #424242;
    border-radius: 12px;
    padding: 1rem;
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