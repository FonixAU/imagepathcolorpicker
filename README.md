This package, is will take the image file path, and check the pixels in the image.
It then returns the main color present, ignoring transparent pixels.
This should allow for responsive filling of colors in related elements based on
the image being used.

Example Implementation:

import { getColor } from 'imagecolorpicker'

const [HexColor, setHexColor] = useState('');

    useEffect(() => {
      // Call the function with the image path and handle the Promise
      getStackColour(imageUrl)
        .then((result) => {
          const hexColor = result.hex;
          setHexColor(hexColor);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }, []);