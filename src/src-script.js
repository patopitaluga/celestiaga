import * as Vue from 'vue/dist/vue.esm-bundler.js';

import 'vuetify/styles'; // Global CSS has to be imported

import { VAlert } from 'vuetify/lib/components/VAlert/index.mjs';
import { VApp } from 'vuetify/lib/components/VApp/index.mjs';
import { VChip } from 'vuetify/lib/components/VChip/index.mjs';
import { VTextField } from 'vuetify/lib/components/VTextField/index.mjs';
import { VForm } from 'vuetify/lib/components/VForm/index.mjs';
import { VBtn } from 'vuetify/lib/components/VBtn/index.mjs';

import { HslColorSpace } from './hsl-color-space.js';

import { createVuetify } from 'vuetify';

const commonColors = [
  { name: 'negro',    r: 0,   g: 0,   b: 0,   },
  { name: 'gris',     r: 128, g: 128, b: 128, },
  { name: 'blanco',   r: 255, g: 255, b: 255, },
  { name: 'marrón',   r: 128, g: 0,   b: 0,   },
  { name: 'rojo',     r: 255, g: 0,   b: 0,   },
  { name: 'violeta',  r: 128, g: 0,   b: 128, },
  { name: 'fucsia',   r: 255, g: 0,   b: 255, },
  { name: 'verde',    r: 0,   g: 128, b: 0,   },
  { name: 'amarillo', r: 255, g: 255, b: 0,   },
  { name: 'azul',     r: 0,   g: 0,   b: 255, },
];

const app = Vue.createApp({
  setup: function() {
    const newColor = Vue.ref('');
    const iaPrediction = Vue.ref('…');
    const currentColorR = Vue.ref(Math.floor(Math.random() * 255));
    const currentColorG = Vue.ref(Math.floor(Math.random() * 255));
    const currentColorB = Vue.ref(Math.floor(Math.random() * 255));
    const userInsertedColors = Vue.ref([]);

    const predict = (r, g, b) => {
      const colorsList = (userInsertedColors.value.length) ? userInsertedColors.value : commonColors;
      let minDist = 99999999;
      let foundCol = '';
      colorsList.forEach((eachCommonColor) => {
        const dist = HslColorSpace.euclideanDistance([r, g, b], [eachCommonColor.r, eachCommonColor.g, eachCommonColor.b]);
        if (dist < minDist) {
          foundCol = eachCommonColor.name;
          minDist = dist;
        }
      });
      return foundCol;
    };

    const sendNewColor = () => {
      if (newColor.value !== '') {
        if (!userInsertedColors.value.some((_) => _.name === newColor.value))
          userInsertedColors.value = [...userInsertedColors.value, { name: newColor.value, r: currentColorR.value, g: currentColorG.value, b: currentColorB.value, }];
        newColor.value = '';
      }
      currentColorR.value = Math.floor(Math.random() * 255);
      currentColorG.value = Math.floor(Math.random() * 255);
      currentColorB.value = Math.floor(Math.random() * 255);
      iaPrediction.value = '…';
      HslColorSpace.createCanvasPalette(200);
      HslColorSpace.markColorInPalette(currentColorR.value, currentColorG.value, currentColorB.value);

      iaPrediction.value = predict(currentColorR.value, currentColorG.value, currentColorB.value);
    };

    const clickColorPill = (_) => {
      newColor.value = _;
      sendNewColor();
    };

    const fgDarkOrLight = (r, g, b) =>
      (r * .299 + g * .587 + b * .114 > 186) ? '#000' : '#fff';

    Vue.onMounted(() => {
      HslColorSpace.createCanvasPalette(200);
      HslColorSpace.markColorInPalette(currentColorR.value, currentColorG.value, currentColorB.value);

      iaPrediction.value = predict(currentColorR.value, currentColorG.value, currentColorB.value);
    });

    return {
      clickColorPill,
      fgDarkOrLight,
      currentColorR,
      currentColorG,
      currentColorB,
      sendNewColor,
      userInsertedColors,
      newColor,
      iaPrediction,
    };
  },
});

// import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  theme: { dark: true },
  components: {
    VAlert,
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

console.log(`
The Fox for: Angus MacGyver Hackerspace - Jan/2023

 φ▒╦,
]▓╬╣▓▓▄            ,»φ╣╩
 ╣╬╩╬▓▓╬╬╬╣▓▓▓╣▒▒▓╬╬▓█▓
 ]▓╬╬╣╬╩░╠╩╩╠╣▓╬╬╣▓▓▓█Γ
  ╚╬╬╬╠░φ▒▒╠╬╬╬╬╣╣▓▓▓▓▓φ,,
   ╠╩╠▒▒╠╠╚╙╙╙╙╙╠╣╣╬╬▓╬╬╬╬╬╣▒▒▒φ╗╗╗╦σσα,
  φ╠░░╠╠╬▒φ░░░φ░φ╬╬╣╬╬╬▒▒╚╠╬╬╬╬╬╬╬╬╬╬╬╬╬╣▒ε
  ╠╠▒╠╣▓▓▓▓▓▓▓▓▒╚╠╬╠╩╩╠▒▒░╠╠╠╬╬╬╬╬╠╬╬╬╬╬╠╬╬╬▒╓
 φ╠╬╣▓██████▓▓▓╣▓▓█▓▒╓║╬╠▒░▒▒╠╠╬╬╬╬╠╠╠╬╠╠╠╬╬╬╣▒,
  ╠╬╣██████████▓╬╬╠▒╠╬╬╬╬╬▒▒╠╠╠╬╬╬╠╠╠╬╬╠▒╠╠╬╬╬▓▓╦
  "╫▓▓████▓▓█████╬╠▒╠╬╬╬╬╬╬╠▒▒╠╠╠╠▒▒╠╩╩╚▒╠╬╬╬╬╣▓▓╬ε
    ╚▓██████████▓▓▓╣╬╬╠╠╬╬╬╬╬╠▒╠╠╠▒▒╚░░░╠╠╬╬╬╬╣▓╬╬╣ε
      ╚▓██████▓▓▓▓▓▓▓▓╬▒▒╚╚╚╠╠▒╚▒▒░░¡░φ╠╠╬╬╬╬╬╣╬╙╚▒╚░
        '╚╣╬▓▓▓▓▓▓▓╬╬╬▒▒░░░░▒╠╬╠╬╣╬▒░░▒╠╠╬╬╬╬╬╩░░░▒░░░
           ░░'░╠╩╙╙╙╙╙╙╚░░░░╠╢▓▓▓╬▓▓╬▒╠╠╠╠╠╬╬▒└!░!╚▒░░
           φ~.φ╬        "!░░▒╠╬╬╬╠╣▓▓▓╬╠╩▒╚╩╩▒⌐'" ;░φφφ≥
           !░;╟▒          '░░╩╚╣╬╬╬╬╬▓▓▓▒░░░░░..  '"╙╚▒░░
           '░φ╬⌐           !░Γ  '╙╝╝▒▒░╙╙╩Åφ▒▒▒░   ].^╚░░░
            .╠▒            '░        "╚╠▒φε' └╣▒.-.░░░░░░░░ε
            '╚⌐             [         ,░░╠╙    .░░;░░░!░░░┌!░φ,
             "             '[        φ╠╠╩      φ╩   [░ '''' '^^".,,,,,
                                    ;░╙       '"           --░≥▒▓███████▓▄▄
  ≥        "      ,          "' '       ".                  '""╚╬▓███████████▓▄
                  "                                               "╙╙╙╩╩╩▀▀▀██▀⌐
`);
