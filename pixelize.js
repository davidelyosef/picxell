let img = document.getElementById("image1");

function chooseFile() {
    const input = document.getElementById('file');
    let reader = new FileReader();
    const file = input.files[0];

    reader.onload = e => {
        img.src = e.target.result;
        // console.log('img: ', img);
    };
    reader.readAsDataURL(file);

    // console.log('file: ', file);
}

function setPixelImage(across, along) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext("2d");

    const width = img.width;
    const height = img.height;
    // console.log(`Image dimensions: height: ${height}, width: ${width}`);

    // find what higher? height or width
    console.log(`canvas: ${canvas.width} and height: ${canvas.height}.`);

    if (across === along) {
        if (height < width) {
            canvas.width = height;
            canvas.height = height;
        } else {
            canvas.width = width;
            canvas.height = width;
        }
        canvas.style.objectPosition = 'right';

        ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2 );
        // ctx.drawImage(img, 0, 0);
        // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
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

    // console.log('number of pixels across: ' + canvas.width / widthOfPixel + '\n' + ' number of pixels along: ' + canvas.height / widthOfPixel);
    // console.log('widthOfPixel: ', widthOfPixel);

    for (let y = 0; y < height; y += Math.floor(widthOfPixel)) {
        for (let x = 0; x < width; x += Math.floor(widthOfPixel)) {
            // pixelize the image
            let p = (x + (y * width)) * 4;
            ctx.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")";
            ctx.fillRect(x, y, widthOfPixel, widthOfPixel);
        }
    }

    document.getElementById('h2Canvas').innerHTML = `${across} x ${along}`;

}