let displayedImage = document.getElementById("image1");
let img = new Image();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
let across_image;

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
    } 
    else if (across * 2 === along) { // 32 x 64
        canvas.width = width;
        canvas.height = width * 2;
        ctx.drawImage(img, 0, 0);
    } 
    else if (along * 2 === across) { // 64 x 32
        canvas.width = width;
        canvas.height = width / 2;
        ctx.drawImage(img, 0, 0);
    } 
    else {
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
            context.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")";
            context.fillRect(x, y, widthOfPixel, widthOfPixel);
        }
    }
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