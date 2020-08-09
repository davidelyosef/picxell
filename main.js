(() => {

    // the colors that we have
    const colors = [
        [255, 0, 0, 255], // red 0
        [121, 42, 35, 121], // dark red 1
        [220, 115, 122, 220], // pink 2
        [255, 196, 156, 255], // beige 3
        [140, 153, 162, 140], // gray 4
        [235, 239, 242, 235], // white 5
        [140, 184, 211, 140], // cyan 6
        [0, 79, 145, 235], // blue 7
        [0, 33, 68, 235], // dark blue 8
        [90, 31, 87, 90], // purple 9 
        [126, 75, 46, 126], // brown 10
        [1, 200, 97, 1], // green 11
        [2, 141, 82, 2], // dark green 12
        [2, 1, 9, 2] // black 13
    ];
    // document ready
    window.onload = function () {
        // get color of pixel in image
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        let img = document.getElementById("scream");

        // get height n width of element and set it to the canvas
        const height = img.clientHeight;
        const width = img.clientWidth;
        canvas.width = width;
        canvas.height = height;

        // resize the image in order to 'pixelize' it
        // code here...

        // draw canvas
        ctx.drawImage(img, 0, 0);

        // get image data
        // getImageData parameters: 
        // (x, y, width of the rectangular area you will copy,height of the rectangular area you will copy)
        const widthOfPixel = 15;
        for (let across = 0; across <= width; across = across + widthOfPixel) {
            // rgba = `rgba(${data[0]},${data[1]}, ${data[2]}, ${data[3]})`;

            // if color is in some range change it to a color we have 
            for (let along = 0; along <= height; along = along + widthOfPixel) {
                let data = ctx.getImageData(across, along, 1, 1).data;
                // if it's cyan
                if (data[0] <= 157 && data[0] >= 54 &&
                    data[1] >= 140 && data[1] <= 219 &&
                    data[3] >= 163 && data[3] <= 255) {
                    ctx.putImageData(chooseColor(6, widthOfPixel), across, along);
                }
                // if it's blue
                else if (data[0] >= 70 && data[0] <= 140 &&
                    data[1] >= 90 && data[1] <= 185 &&
                    data[2] >= 160 && data[2] <= 200) {
                    ctx.putImageData(chooseColor(7, widthOfPixel), across, along);
                }
                // if it's dark blue
                else if (data[0] >= 0 && data[0] <= 22 &&
                    data[1] >= 29 && data[1] <= 79 &&
                    data[2] >= 56 && data[2] <= 115) {
                    ctx.putImageData(chooseColor(8, widthOfPixel), across, along);
                }

            }
        }
        console.log('number of pixels accross: ' + width / widthOfPixel + '\n' + ' number of pixels along: ' + height / widthOfPixel);
    }

    // return an object with the color info according to the given index
    function chooseColor(index, widthOfPixel) {

        const pixelsMultiply4 = 900
        const arr = new Uint8ClampedArray(pixelsMultiply4);
        // pixels => pixelsMultiply4 / 4(4 values: r,g,b,a)
        let convertingData = new ImageData(arr, widthOfPixel);
        // height => pixels / width
        // pixels/(4 * width) = height 

        // Iterate through every pixel
        for (let i = 0; i < arr.length; i += 4) {
            arr[i + 0] = colors[index][0]; // R value
            arr[i + 1] = colors[index][1]; // G value
            arr[i + 2] = colors[index][2]; // B value
            arr[i + 3] = colors[index][3]; // A value
        }
        convertingData['border'] = '1px solid gray';
        return convertingData;
    }

})();