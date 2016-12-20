// The color definition in RGBA values
const COLOR_START_UP = [7, 84, 19, 255];
const COLOR_START_LEFT = [139, 57, 137, 255];
const COLOR_STOP = [51, 69, 169, 255];
const COLOR_TURN_RIGHT = [182, 149, 72, 255];
const COLOR_TURN_LEFT = [123, 131, 154, 255];

// Some directional vector constants
const VECTOR_UP = [0, -1];
const VECTOR_LEFT = [-1, 0];

// Start drawing once the window has loaded the required image
window.onload = () => {
    // Draw the source image to the canvas
    const sourceCanvas = document.createElement('canvas');
    const sourceImage = document.getElementById('source-image');
    sourceCanvas.width = sourceImage.width;
    sourceCanvas.height = sourceImage.height;
    const sourceContext = sourceCanvas.getContext('2d');
    sourceContext.drawImage(sourceImage, 0, 0);

    const targetCanvas = document.getElementById('target-canvas');
    const targetContext = targetCanvas.getContext('2d');
    // Iterate through all the pixels.
    // Start drawing from the pixels with a starting color
    eachPixel(sourceContext, (color, x, y) => {
        if (isEqualRGB(color, COLOR_START_UP)) {
            // Start drawing up
            draw(sourceContext, targetContext, x, y, VECTOR_UP);
        }
        else if (isEqualRGB(color, COLOR_START_LEFT)) {
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
    const [dX, dY] = direction;
    const nextX = x + dX;
    const nextY = y + dY;
    // Determine the next action from the color at the source image
    const color = getPixelColor(source, nextX, nextY);
    if (isEqualRGB(color, COLOR_STOP)) {
        // Stop drawing and finish the stroke
        drawPixel(target, nextX, nextY);
    }
    else if (isEqualRGB(color, COLOR_TURN_LEFT)) {
        // Turn left and continue drawing
        draw(source, target, nextX, nextY, rotateLeft(direction));
    }
    else if (isEqualRGB(color, COLOR_TURN_RIGHT)) {
        // Turn right and continue drawing
        draw(source, target, nextX, nextY, rotateRight(direction));
    }
    else {
        // Continue to the same direction
        draw(source, target, nextX, nextY, direction);
    }
}

/**
 * Iterates through all the pixels on the canvas.
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
 * Reads the pixel color at the given coordinates of the context.
 */
function getPixelColor(context, x, y) {
    return context.getImageData(x, y, 1, 1).data;
}

/**
 * Returns whether or not two arrays, indicating RGBA values,
 * represents the same color.
 */
function isEqualRGB(rgb1, rgb2) {
    return rgb1.every((value, index) => rgb2[index] === value);
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
 * Draw a single black pixel to the canvas context.
 */
function drawPixel(context, x, y) {
    const color = new Uint8ClampedArray([0, 0, 0, 255])
    const pixel = new ImageData(color, 1, 1);
    context.putImageData(pixel, x, y);
}
