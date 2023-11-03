function rgbToHex(rgb) {
  const match = /rgb\((\d+), (\d+), (\d+)\)/.exec(rgb);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    return `#${hexR}${hexG}${hexB}`;
  }
  return null;
}

function colorDifference(rgb1, rgb2) {
  const match1 = /rgb\((\d+), (\d+), (\d+)\)/.exec(rgb1);
  const match2 = /rgb\((\d+), (\d+), (\d+)\)/.exec(rgb2);

  if (match1 && match2) {
    const r1 = parseInt(match1[1]);
    const g1 = parseInt(match1[2]);
    const b1 = parseInt(match1[3]);

    const r2 = parseInt(match2[1]);
    const g2 = parseInt(match2[2]);
    const b2 = parseInt(match2[3]);

    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;

    // Calculate the Euclidean color difference
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  return Number.MAX_SAFE_INTEGER; // Return a large value if format doesn't match
}

export function getColor(imagePath) {
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

        let isUnique = true;

        // Check against existing colors
        for (const existingColor in colorCounts) {
          if (colorDifference(existingColor, color) < 50) {
            isUnique = false;
            break;
          }
        }

        if (isUnique) {
          if (colorCounts[color]) {
            colorCounts[color]++;
          } else {
            colorCounts[color] = 1;
          }
        }
      }

      // Create a copy of colorCounts to retain the original color palette

      // Sort the colorCounts object by count in descending order
      const sortedColors = Object.keys(colorCounts).sort(
        (a, b) => colorCounts[b] - colorCounts[a]
      );
      
      var top5temp = sortedColors.slice(0, 5)

      if (top5temp.length < 5){
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        const color = `rgb(${r}, ${g}, ${b})`;

        if (a === 0) {
          continue; // Skip transparent pixel
        }

        let isUnique = true;

        // Check against existing colors
        for (const existingColor in colorCounts) {
          if (colorDifference(existingColor, color) < 0) {
            isUnique = false;
            break;
          }
        }

        if (isUnique) {
          if (colorCounts[color]) {
            colorCounts[color]++;
          } else {
            colorCounts[color] = 1;
          }
        }
      }
      var leanientColors = Object.keys(colorCounts).sort(
        (a, b) => colorCounts[b] - colorCounts[a]
      );
      
      var leanientTop = leanientColors.slice(0, 5)

    const remainingColours = top5temp.length
      // Get the top 5 colors
      for(let i = remainingColours; i < 5 ; i++){
        for (let j = remainingColours; j < leanientColors.length - remainingColours ; j++)
        if (!top5temp.includes(leanientTop[j])) {
          top5temp.push(leanientTop[j]);
          break; // Exit the loop after adding a unique color
        }
      }
    }

      const top5Colors = top5temp
      


      resolve({
        rgb: sortedColors[0],
        hex: rgbToHex(sortedColors[0]),
        count: colorCounts[sortedColors[0]],
        colorPallete: top5Colors,
      });
    };
  });
}

