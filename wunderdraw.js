// The color definition in hex values
const COLOR_START_UP = rgb(7, 84, 19);
const COLOR_START_LEFT = rgb(139, 57, 137);
const COLOR_STOP = rgb(51, 69, 169);
const COLOR_TURN_RIGHT = rgb(182, 149, 72);
const COLOR_TURN_LEFT = rgb(123, 131, 154);

// References to the canvas element and the context
const canvas = document.getElementById('canvas');
const width = canvas.clientWidth;
const height = canvas.clientWidth;
const context = canvas.getContext("2d");

// Draw the source image to the canvas
const sourceImage = document.getElementById('source');
context.drawImage(sourceImage, 0, 0);

/**
 * Converts the given RGB value to a hex value
 * that can be compared with Canvas pixel colors.
 */
function rgb(red, green, blue) {
    return red << 16 | green << 8 | blue;
}
