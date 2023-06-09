import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BaseCard from './components/ui/BaseCard.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';



const app = createApp(App);
app.use(router);
app.component('base-card', BaseCard);
app.component('base-button', BaseButton);
app.component('base-spinner', BaseSpinner);
app.use(VCalendar, {});
app.mount('#app');
