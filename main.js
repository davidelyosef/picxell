let displayedImage = document.getElementById("image1");
let img = new Image();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
let across_image;
let hslColors;

fetch('assets/colors.json').then(data => data.json())
    .then(json => hslColors = json);

function chooseFile() {
    const input = document.getElementById('file');
    let reader = new FileReader();
    const file = input.files[0];

    reader.onload = e => {
        img.src = displayedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function setPixelImage(across, along) {

    if (img.src === '') {
        img.src = displayedImage.src;
    }

    const width = img.width;
    const height = img.height;
    across_image = across;

    clearCanvas();

    if (across === along) {

        if (height < width) {
            canvas.width = height;
            canvas.height = height;
        } else {
            canvas.width = width;
            canvas.height = width;
        }
        canvas.style.objectPosition = 'right';

        ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
        // other options:
        newCanvas(img, 0, 0);
        newCanvas(img, 0, 0, true);
    } else if (across * 2 === along) { // 32 x 64
        canvas.width = width;
        canvas.height = width * 2;
        ctx.drawImage(img, 0, 0);
    } else if (along * 2 === across) { // 64 x 32
        canvas.width = width;
        canvas.height = width / 2;
        ctx.drawImage(img, 0, 0);
    } else {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
    }

    const pixelArr = ctx.getImageData(0, 0, width, height).data;
    const widthOfPixel = canvas.width / across;

    pixelize(height, width, widthOfPixel, pixelArr, ctx);

    document.getElementById('h2Canvas').innerHTML = `${across} x ${along}`;
}

function pixelize(height, width, widthOfPixel, pixelArr, context) {

    for (let y = 0; y < height; y += Math.floor(widthOfPixel)) {

        for (let x = 0; x < width; x += Math.floor(widthOfPixel)) {
            // pixelize the image
            let p = (x + (y * width)) * 4;
            context.fillStyle = rgbToHsl(pixelArr[p], pixelArr[p + 1], pixelArr[p + 2]);
            context.fillRect(x, y, widthOfPixel, widthOfPixel);
        }
    }
}

function detectColor(h, s, l) {
    let hsl;
    // black
    if (l <= 10) {
        hsl = hslColors.blackOrWhite.black;
    }
    // light gray
    else if (l >= 80 && s < 25) {
        hsl = hslColors.blackOrWhite.light_gray;
    }
    // white
    else if (l >= 80 && s < 50) {
        hsl = hslColors.blackOrWhite.white;
    } else {
        // red
        if (h >= 345 || h <= 15) {
            if (l <= 20) hsl = hslColors.red.dark;
            else if (l >= 70) hsl = hslColors.red.light;
            else hsl = hslColors.red.normal;
        }
        // orange
        else if (h > 15 && h <= 45) {
            if (l <= 20) hsl = hslColors.orange.brown;
            else if (l >= 70) hsl = hslColors.orange.light;
            else hsl = hslColors.orange.normal;
        }
        // yellow
        else if (h > 45 && h <= 75) {
            if (l <= 20) hsl = hslColors.yellow.dark;
            else if (l >= 70) hsl = hslColors.yellow.light;
            else hsl = hslColors.yellow.normal;
        }
        // green
        else if (h > 75 && h <= 165) {
            if (l <= 20) hsl = hslColors.green.dark;
            else if (l >= 70) hsl = hslColors.green.light;
            else hsl = hslColors.green.normal;
        }
        // cyan
        else if (h > 165 && h <= 200) {
            if (l <= 20) hsl = hslColors.cyan.dark;
            else if (l >= 70) hsl = hslColors.cyan.light;
            else hsl = hslColors.blue.cyan;
        }
        // blue
        else if (h > 200 && h <= 260) {
            if (l <= 20) hsl = hslColors.blue.dark; 
            else if (l >= 60) hsl = hslColors.blue.light;
            else hsl = hslColors.blue.normal;
        }
        // purple
        else if (h > 260 && h <= 280) {
            if (l <= 20) hsl = hslColors.purple.dark;
            else if (l >= 70) hsl = hslColors.purple.light;
            else hsl = hslColors.purple.normal;
        }
        // pink
        else if (h > 280 && h <= 344) {
            if (l <= 20) hsl = hslColors.pink.dark;
            else if (l >= 70) hsl = hslColors.pink.light;
            else hsl = hslColors.pink.normal;
        }
    }
    return "hsl(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%)";
}

function newCanvas(image, x, y, boolean) {

    let h2 = document.getElementById('alsoLike');
    h2.innerHTML = 'you may also like';

    let newCanvas = document.createElement('canvas');
    newCanvas.classList.add('another-option');

    const newCtx = newCanvas.getContext("2d");
    let optionsDiv = document.getElementsByClassName('options')[0];

    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    // if true => if calling the function with a lot of parameters
    if (boolean) {
        newCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    } else {
        newCtx.drawImage(image, x, y);
    }

    const pixelArr = newCtx.getImageData(0, 0, image.width, image.height).data;
    const widthOfPixel = newCanvas.width / across_image;

    // pixelize
    pixelize(image.height, image.width, widthOfPixel, pixelArr, newCtx);

    optionsDiv.appendChild(newCanvas);
}

function clearCanvas() {
    document.getElementsByClassName('options')[0].innerHTML = '';
}

function rgbToHsl(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return detectColor(h, s, l);
    // return "hsl(" + h + "," + s + "%," + l + "%)";
}