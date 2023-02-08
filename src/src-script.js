import * as Vue from 'vue/dist/vue.esm-bundler.js';

import 'vuetify/styles'; // Global CSS has to be imported

// Frontend components
import { VAlert } from 'vuetify/lib/components/VAlert/index.mjs';
import { VApp } from 'vuetify/lib/components/VApp/index.mjs';
import { VChip } from 'vuetify/lib/components/VChip/index.mjs';
import { VTextField } from 'vuetify/lib/components/VTextField/index.mjs';
import { VForm } from 'vuetify/lib/components/VForm/index.mjs';
import { VBtn } from 'vuetify/lib/components/VBtn/index.mjs';
import { VTooltip } from 'vuetify/lib/components/VTooltip/index.mjs';
import { createVuetify } from 'vuetify';

// Utility to create the canvas palette.
import { HslColorSpace } from './hsl-color-space.js';

const tfKnnClassifier = knnClassifier.create();

/**
 * Predict new color name considering which one of the list is the closest (not using ML). Used as a "control result".
 * @param {number} r -
 * @param {number} g -
 * @param {number} b -
 * @param {array} colorsListParam -
 */
const predictByClosest = (r, g, b, colorsListParam) => {
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

  const colorsList = colorsListParam.length > 0 ? colorsListParam : commonColors;
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

const app = Vue.createApp({
  setup: function() {
    const vrSelectedColorName = Vue.ref('');
    const vrHoverColor = Vue.ref(' ');
    const vrPrediction = Vue.ref('…');
    const vrCurrentColorR = Vue.ref(Math.floor(Math.random() * 255));
    const vrCurrentColorG = Vue.ref(Math.floor(Math.random() * 255));
    const vrCurrentColorB = Vue.ref(Math.floor(Math.random() * 255));
    const vrUserInsertedColors = Vue.ref([]);

    let theCanvas;

    const makeAPrediction = () => {
      vrPrediction.value = '…';

      const newColorTensor = tf.tensor([[vrCurrentColorR.value, vrCurrentColorG.value, vrCurrentColorB.value, ]]);
      tfKnnClassifier.predictClass(newColorTensor)
        .then((result) => {
          console.log('Prediction for: ', vrCurrentColorR.value, vrCurrentColorG.value, vrCurrentColorB.value);
          console.log(result);
          vrPrediction.value = result.label;
        });

      // Control
      /* vrPrediction.value = predictByClosest(
        vrCurrentColorR.value,
        vrCurrentColorG.value,
        vrCurrentColorB.value,
        vrUserInsertedColors.value
      ); */
    };

    const mtdSendNewColor = () => {
      if (vrSelectedColorName.value !== '') {
        const thisColorTensor = tf.tensor([[vrCurrentColorR.value, vrCurrentColorG.value, vrCurrentColorB.value, ]]);

        const foundIndex = vrUserInsertedColors.value.findIndex((_) => _.name === vrSelectedColorName.value);

        tfKnnClassifier.addExample(thisColorTensor, vrSelectedColorName.value);
        if (foundIndex > -1) {
        } else {
          // HslColorSpace.createCanvasPalette(theCanvas, 200);
          const { canvasX, canvasY, } = HslColorSpace.markColorInPalette(theCanvas, vrCurrentColorR.value, vrCurrentColorG.value, vrCurrentColorB.value);

          vrUserInsertedColors.value = [
            ...vrUserInsertedColors.value,
            {
              name: vrSelectedColorName.value,
              r: vrCurrentColorR.value,
              g: vrCurrentColorG.value,
              b: vrCurrentColorB.value,
              canvasX,
              canvasY,
            }
          ];
        }
        vrSelectedColorName.value = '';
      }

      // Establish new color
      vrCurrentColorR.value = Math.floor(Math.random() * 255);
      vrCurrentColorG.value = Math.floor(Math.random() * 255);
      vrCurrentColorB.value = Math.floor(Math.random() * 255);

      makeAPrediction(vrCurrentColorR.value, vrCurrentColorR.value, vrCurrentColorR.value);
    };

    /**
     *
     */
    const mtdHandleClickColorPill = (_) => {
      vrSelectedColorName.value = _;
      mtdSendNewColor();
    };

    const mtdFgDarkOrLight = (r, g, b) =>
      (r * .299 + g * .587 + b * .114 > 186) ? '#000' : '#fff';

    Vue.onMounted(() => {
      theCanvas = document.getElementById('thecanvas');

      HslColorSpace.createCanvasPalette(theCanvas, 200);

      theCanvas.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX - theCanvas.offsetLeft;
        const mouseY = event.clientY - theCanvas.offsetTop;
        const markRadius = 2;
        vrUserInsertedColors.value.forEach((eachColorMarked) => {
          if (
            mouseX > eachColorMarked.canvasX - markRadius &&
            mouseX < eachColorMarked.canvasX + markRadius &&
            mouseY > eachColorMarked.canvasY - markRadius &&
            mouseY < eachColorMarked.canvasY + markRadius
          )
            vrHoverColor.value = eachColorMarked.name;
        });
        //console.log(event.clientX, event.clientY)
      });

      // HslColorSpace.markColorInPalette(theCanvas, vrCurrentColorR.value, vrCurrentColorG.value, vrCurrentColorB.value);

      // control
      /* vrPrediction.value = predictByClosest(
        vrCurrentColorR.value,
        vrCurrentColorG.value,
        vrCurrentColorB.value,
        vrUserInsertedColors.value
      );*/
    });

    return {
      mtdFgDarkOrLight,
      mtdHandleClickColorPill,
      mtdSendNewColor,

      vrCurrentColorB,
      vrCurrentColorG,
      vrCurrentColorR,
      vrHoverColor,
      vrSelectedColorName,
      vrPrediction,
      vrUserInsertedColors,
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
    VTooltip,
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
