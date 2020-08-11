// To start press in terminal: 'node pixelize'
const resizeOptimizeImages = require('resize-optimize-images');

const widthOfPixel = 15;
const originalWidth = 750;
const originalHeight = 500;

(async () => {
    // Set the options.
    let options = {
        images: ['hero.jpg'],
        width: originalWidth / widthOfPixel,
        height: originalHeight / widthOfPixel, 
    };

    // Shrink the image.
    await resizeOptimizeImages(options);

    options.width = originalWidth;
    options.height = originalHeight;
    // Return to original dimensions.
    await resizeOptimizeImages(options);
})();