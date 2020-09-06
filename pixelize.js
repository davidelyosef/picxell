let displayedImage = document.getElementById("image1");
let img = new Image();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
let across_image;
let hslColors;

fetch('assets/newColors.json').then(data => data.json())
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
    if (l <= 10)
        hsl = hslColors.black;
    // dark gray
    else if (l > 10 && l < 30 && s < 25)
        hsl = hslColors.dark_gray;
    // gray
    else if (l >= 30 && l < 50 && s < 25)
        hsl = hslColors.gray;
    // light gray
    else if (l >= 50 && l < 80 && s < 25)
        hsl = hslColors.light_gray;
    // white
    else if (l >= 80 && s < 50)
        hsl = hslColors.white;
    else {
        // red
        if (h >= 345 || h <= 15) {
            if (l <= 30) hsl = hslColors.dark_red;
            else if (l >= 70) hsl = hslColors.light_red;
            else {
                if (h > 10 && l >= 60) {
                    if (s > 60) hsl = hslColors.dark_orange;
                    else hsl = hslColors.red_gray;
                }
                else hsl = hslColors.red;
            }
        }
        // orange + brown
        else if (h > 15 && h <= 45) {
            if (l < 40) {
                if (l < 30) hsl = hslColors.dark_brown;
                else hsl = hslColors.brown;
            } 
            else if (l > 70) {
                if (s > 70) hsl = hslColors.lighter_orange;
                else hsl = hslColors.light_orange;
            }
            else {
                if (s > 70) hsl = hslColors.orange;
                else if (h >= 40 && s <= 40) hsl = hslColors.light_brown;
                else hsl = hslColors.orange_gray;
            }
        }
        // yellow
        else if (h > 45 && h <= 72) {
            if (l <= 20) hsl = hslColors.light_brown;
            else if (l >= 70) {
                if (s > 90) hsl = hslColors.light_yellow;
                else hsl = hslColors.shadow_yellow;
            }
            else {
                if (s > 20) hsl = hslColors.yellow;
                else hsl = hslColors.yellow_gray;
            }
        }
        // green
        else if (h > 72 && h <= 165) {
            if (h < 100) {
                if (s > 50) hsl = hslColors.green_yellow;
                else hsl = hslColors.green;
            }
            if (h >= 100 && h < 128) {
                if (s > 20) hsl = hslColors.green_glow;
                else hsl = hslColors.green_gray;
            }
            if (h >=128 && h < 147) hsl = hslColors.light_green;
            if (h >= 147 && h < 162) hsl = hslColors.green_olive;
            else hsl = hslColors.green_cyan;
        }
        // cyan
        else if (h > 165 && h <= 200) {
            if (l >= 60) hsl = hslColors.light_cyan;
            else hsl = hslColors.cyan;
        }
        // blue
        else if (h > 200 && h <= 260) {
            if (l <= 27) hsl = hslColors.dark_blue;
            else if (l >= 56) hsl = hslColors.light_blue;
            else {
                if (s > 50) hsl = hslColors.blue;
                else hsl = hslColors.blue_gray;
            }
        }
        // purple
        else if (h > 260 && h <= 280) {
            if (l <= 35) hsl = hslColors.dark_purple;
            else hsl = hslColors.purple;
        }
        // pink
        else if (h > 280 && h <= 344) {
            if (l <= 20) hsl = hslColors.dark_pink;
            else if (l >= 70) hsl = hslColors.light_pink;
            else hsl = hslColors.pink;
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