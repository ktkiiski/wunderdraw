/**
 * This is a solution to Wunderpahkina vol. 5 programming challenge:
 * https://github.com/wunderdogsw/wunderpahkina-vol5
 * 
 * @author Kimmo Kiiski
 */

// The color definition in RGBA values
const COLOR_START_UP = rgb(7, 84, 19);
const COLOR_START_LEFT = rgb(139, 57, 137);
const COLOR_STOP = rgb(51, 69, 169);
const COLOR_TURN_RIGHT = rgb(182, 149, 72);
const COLOR_TURN_LEFT = rgb(123, 131, 154);

// Some directional vector constants
const VECTOR_UP = [0, -1];
const VECTOR_LEFT = [-1, 0];

// Start drawing once the window has loaded the required image
window.onload = () => {
    const sourceContext = makeImageContext(document.getElementById('source-image'));
    const targetCanvas = document.getElementById('target-canvas');
    const targetContext = targetCanvas.getContext('2d');
    // Iterate through all the pixels.
    // Start drawing from the pixels with a starting color
    eachPixel(sourceContext, (color, x, y) => {
        if (color === COLOR_START_UP) {
            // Start drawing up
            draw(sourceContext, targetContext, x, y, VECTOR_UP);
        }
        else if (color === COLOR_START_LEFT) {
            // Start drawing left
            draw(sourceContext, targetContext, x, y, VECTOR_LEFT);
        }
    });
};

/**
 * Draws a partial solution from the starting position towards the direction.
 */
function draw(source, target, x, y, direction) {
    // Draw pixel at the starting position
    drawPixel(target, x, y);
    // Advance to the next position
    const [dx, dy] = direction;
    const nextX = x + dx;
    const nextY = y + dy;
    // Determine the next action from the color at the source image
    const color = getPixelColor(source, nextX, nextY);
    if (color === COLOR_STOP) {
        // Stop drawing and finish with the last pixel
        drawPixel(target, nextX, nextY);
    }
    else if (color === COLOR_TURN_LEFT) {
        // Turn left and continue drawing
        draw(source, target, nextX, nextY, rotateLeft(direction));
    }
    else if (color === COLOR_TURN_RIGHT) {
        // Turn right and continue drawing
        draw(source, target, nextX, nextY, rotateRight(direction));
    }
    else {
        // Continue to the same direction
        draw(source, target, nextX, nextY, direction);
    }
}

/**
 * Iterates through all the pixels on the canvas, calling the
 * given callback for each of them.
 */
function eachPixel(context, callback) {
    for (let y = 0; y < context.canvas.height; y += 1) {
        for (let x = 0; x < context.canvas.width; x += 1) {
            const color = getPixelColor(context, x, y);
            callback(color, x, y);
        }
    }
}

/**
 * Converts the given image object to a canvas and returns its context.
 */
function makeImageContext(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return context;
}

/**
 * Returns the hex value color of a given pixel of the context.
 */
function getPixelColor(context, x, y) {
    return rgb(...context.getImageData(x, y, 1, 1).data);
}

/**
 * Converts RGB color values to a single hex integer for easy comparison.
 */
function rgb(red, green, blue) {
    return red << 16 | green << 8 | blue;
}

/**
 * Rotates a direction vector 90 degrees clockwise.
 */
function rotateRight([x, y]) {
    return [-y, x]; 
}

/**
 * Rotates a direction vector 90 degrees counter-clockwise.
 */
function rotateLeft([x, y]) {
    return [y, -x]; 
}

/**
 * Draw a single black pixel to the canvas context,
 * with a slight gradient effect ;)
 */
function drawPixel(context, x, y) {
    const red = Math.round(255 - y * 255 / context.canvas.height);
    const color = new Uint8ClampedArray([red, 0, 0, 255])
    const pixel = new ImageData(color, 1, 1);
    context.putImageData(pixel, x, y);
}
