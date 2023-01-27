export const HslColorSpace = {
  /**
   *
   * @param {object} _hsbColor - E.g. { h: 100, s: 250, b: 200}
   * @returns {object} - E.g. { r: 100, g: 250, b: 200}
   */
  hsb2rgb: (_hsbColor) => {
    const H = _hsbColor.h * 0.016666666666666667;
    const S = _hsbColor.s * 0.01;
    const B = _hsbColor.b * 0.01 * 255;
    const i = H << 0 % 6;
    const f = H - i;
    const p = B * (1 - S);
    const q = B * (1 - f * S);
    const t = B * (1 - (1 - f) * S);

    switch (i) {
      case 0: return { r: Math.round(B), g: Math.round(t), b: Math.round(p) };
      case 1: return { r: Math.round(q), g: Math.round(B), b: Math.round(p) };
      case 2: return { r: Math.round(p), g: Math.round(B), b: Math.round(t) };
      case 3: return { r: Math.round(p), g: Math.round(q), b: Math.round(B) };
      case 4: return { r: Math.round(t), g: Math.round(p), b: Math.round(B) };
      case 5: return { r: Math.round(B), g: Math.round(p), b: Math.round(q) };
    }
  },

  /**
   *
   * @param {number} size -
   * @param {number} markedR -
   * @param {number} markedG -
   * @param {number} markedB -
   */
  createCanvasPalette: (size) => {
    const bottom = size * size * 4;
    const hueStep = 360 / size;
    const satStep = 200 / size;
    const hsbColor = { h: 0, s: 100, b: 0, };
    let row = size;

    const canvas = document.getElementById('thecanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = canvas.height = size;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    while (row--) {
      let col = size;
      hsbColor.h = 0;

      while (col--) {
        const pos = bottom - (row * size + col) * 4;
        const rgbColor = HslColorSpace.hsb2rgb(hsbColor);

        imageData.data[pos] = rgbColor.r;
        imageData.data[pos + 1] = rgbColor.g;
        imageData.data[pos + 2] = rgbColor.b;
        imageData.data[pos + 3] = 255;
        hsbColor.h += hueStep;
      }
      if (row < size / 2)
        hsbColor.s -= satStep;
      hsbColor.b += satStep;
    }

    ctx.putImageData(imageData, 0, 0);
  },

  euclideanDistance: (col1, col2) => {
    const deltaR = col1[0] - col2[0];
    const deltaG = col1[1] - col2[1];
    const deltaB = col1[2] - col2[2];
    return deltaR * deltaR + deltaG * deltaG + deltaB * deltaB;
  },

  markColorInPalette: (r, g, b) => {
    const canvas = document.getElementById('thecanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let minDist = 99999999;
    for (let y = canvas.height; y >= 0; y--) {
      for (let x = canvas.width; x >= 0; x--) {
        const data = ctx.getImageData(x, y, 1, 1).data;
        minDist = Math.min(minDist, HslColorSpace.euclideanDistance([r, g, b], [data[0], data[1], data[2]]));
      }
    }
    let match = false;
    for (let y = canvas.height; y >= 0; y--) {
      for (let x = canvas.width; x >= 0; x--) {
        if (!match) {
          const data = ctx.getImageData(x, y, 1, 1).data;
          if (HslColorSpace.euclideanDistance([r, g, b], [data[0], data[1], data[2]]) === minDist) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.strokeStyle = (HslColorSpace.euclideanDistance([r, g, b], [0, 0, 0]) > 50000) ? '#000' : '#fff';
            ctx.stroke();
            match = true;
          }
        }
      }
    }
  },
};
