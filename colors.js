import { Vibrant } from './node_modules/node-vibrant/src/vibrant.ts';
var an_img = document.createElement('img');
an_img.setAttribute('src', 'http://placekitten.com/g/200/300')

an_img.addEventListener('load', function () {
    var vibrant = new Vibrant(
        img,
        64, /* amount of colors in initial palette from which the swatches will be generated, defaults to 64 */
        5 /* quality. 0 is highest, but takes way more processing. defaults to 5. */
    )
    var swatches = vibrant.swatches()
    for (var swatch in swatches)
        if (swatches.hasOwnProperty(swatch) && swatches[swatch])
            console.log(swatch, swatches[swatch].getHex())

    /*
     * Results into:
     * Vibrant #7a4426
     * Muted #7b9eae
     * DarkVibrant #348945
     * DarkMuted #141414
     * LightVibrant #f3ccb4
     */
});