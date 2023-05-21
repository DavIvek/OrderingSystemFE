<template>
  <div class="about">
    <h1 class="header">O nama</h1>
    <h4 class="header">Ovdje možete pronaći više informacija o samoj stranici i načinu korištenja.</h4>

    <div class="text-container">
      <p class="paragraph">
        Cilj ovog projekta je razviti web aplikaciju koje će omogućiti povezivanje korisnika
        zdravstvenih
        usluga(pacijenata) i davatelja zdravstvenih usluga(liječnika i medicinskih sestara).<br>
        Korištenjem ove aplikacije
        zdravstveni sustav bi funkcionirao bolje i transparentnije, pacijenti bi puno rjeđe propuštali svoje termine,
        smanjila bi se potreba za administrativnim osobljem.</p>
      <p class="paragraph">
        Pacijenti će moći birati koji termin kod nekog liječnika ili
        medicinske sestre im odgovara. Pacijentima će se slati podsjetnici te će se pratiti dolaze li na rezervirane
        termina i koja je efikasnost cjelokupnog sustava. </p>
      <p class="paragraph">
        Ovakav sustav naručivanja mogao bi se implementirati u gotovo
        svim zdravstvenim sustavima, bilo to na razini bolnice, grada, županije ili cijele države. Skup korisnika koji
        bi
        mogli koristiti ovu aplikaciju je vrlo velik, svim građanima bi odgovaralo kad bi mogli rezervirati termin s
        nekoliko klikova, a i zdravstvenim djelatnicima bi bilo lakše jer bi bolje znali svoje rasporede i što ih čeka u
        radnom danu. </p>
      <p class="paragraph">
        Kada se aplikacija pokrene, vidi se popis liječnika i vrste usluga za koje se može zatražiti termin. Korisnik se
        može prijaviti sa svojim e-mailom te lozinkom ili se može registrirati ako još nema račun.
      </p>
    </div>

    <base-button link to="/" class="button">Natrag na početnu stranicu</base-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "AboutView",
  components: {}
}
</script>


<style>
.about {
  justify-content: center;
  justify-items: center;
  text-align: center;
}

.header {
  text-align: center;
}

.paragraph {
  text-align: center;
  margin-left: 5%;
  margin-right: 5%;
}

.text-container {
  border: 1px solid black;
  border-radius: 10px;
  margin-left: 10%;
  margin-right: 10%;
}

.button {
  margin-top: 5%;
}
</style>