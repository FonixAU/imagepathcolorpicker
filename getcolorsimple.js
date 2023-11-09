function rgbToHex(rgb) {
    var hex = rgb.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
    };

export function getColorSimple(imagePath) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imagePath;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const pixels = imageData.data;

        const colorCounts = {};
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          const color = `rgb(${r}, ${g}, ${b})`;

          if (a === 0) {
            continue; // Skip transparent pixel
          }
          if (colorCounts[color]) {
            colorCounts[color]++;
          } else {
            colorCounts[color] = 1;
          }
        }

        let mostRepeatedColor = null;
        let maxCount = 0;

        for (const color in colorCounts) {
          if (colorCounts[color] > maxCount) {
            mostRepeatedColor = color;
            maxCount = colorCounts[color];
          }
        }

        const mostRepeatedColorHex = rgbToHex(mostRepeatedColor);

          resolve({
            rgb: mostRepeatedColor,
            hex: mostRepeatedColorHex,
            count: maxCount,
            colorPallete: colorCounts
          })
        }
    });
}
