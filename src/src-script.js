import * as Vue from 'vue/dist/vue.esm-bundler.js';

import 'vuetify/styles'; // Global CSS has to be imported

import { VApp } from 'vuetify/lib/components/VApp/index.mjs';
import { VChip } from 'vuetify/lib/components/VChip/index.mjs';
import { VTextField } from 'vuetify/lib/components/VTextField/index.mjs';
import { VForm } from 'vuetify/lib/components/VForm/index.mjs';
import { VBtn } from 'vuetify/lib/components/VBtn/index.mjs';

import { createVuetify } from 'vuetify';

const app = Vue.createApp({
  setup: function() {
    const newColor = Vue.ref('');
    const sendNewColor = () => alert(newColor.value);

    const currentColorR = Vue.ref(Math.floor(Math.random() * 255));
    const currentColorG = Vue.ref(Math.floor(Math.random() * 255));
    const currentColorB = Vue.ref(Math.floor(Math.random() * 255));

    return {
      currentColorR,
      currentColorG,
      currentColorB,
      sendNewColor,
      prevColors: [
        'naranja',
        'celestito'
      ],
      newColor,
    };
  },
});

// import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  theme: { dark: true },
  components: {
    VApp,
    VChip,
    VTextField,
    VForm,
    VBtn,
  },
  directives,
});

app.use(vuetify);

app.mount('#contenedor-de-mi-app');


