// The color definition in RGBA values
const COLOR_START_UP = [7, 84, 19, 255];
const COLOR_START_LEFT = [139, 57, 137, 255];
const COLOR_STOP = [51, 69, 169, 255];
const COLOR_TURN_RIGHT = [182, 149, 72, 255];
const COLOR_TURN_LEFT = [123, 131, 154, 255];

// Some directional vector constants
const VECTOR_UP = [0, -1];
const VECTOR_LEFT = [-1, 0];

// References to the canvas element and the context
const canvas = document.getElementById('canvas');
const width = canvas.clientWidth;
const height = canvas.clientWidth;
const context = canvas.getContext("2d");
context.strokeStyle = "#FFFFFF";

const sourceImage = document.getElementById('source');
window.onload = () => {
    // Draw the source image to the canvas
    context.drawImage(sourceImage, 0, 0);

    // Iterate through all the pixels
    eachPixel(canvas, (context, color, x, y) => {
        if (rgbEqual(color, COLOR_START_UP)) {
            // Start drawing up
            draw(context, x, y, VECTOR_UP);
        }
        else if (rgbEqual(color, COLOR_START_LEFT)) {
            // Start drawing left
            draw(context, x, y, VECTOR_LEFT);
        }
    });
};

/**
 * Draws the figure starting at the position
 * and towards the given direction.
 */
function draw(context, startX, startY, direction) {
    const [dX, dY] = direction;
    const endX = startX + dX;
    const endY = startY + dY;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    const color = getPixelColor(context, endX, endY);
    if (rgbEqual(color, COLOR_STOP)) {
        // Stop drawing and finish the stroke
        context.stroke();
    }
    else if (rgbEqual(color, COLOR_TURN_LEFT)) {
        // Turn left and continue drawing
        draw(context, endX, endY, rotateLeft(direction));
    }
    else if (rgbEqual(color, COLOR_TURN_RIGHT)) {
        // Turn right and continue drawing
        draw(context, endX, endY, rotateRight(direction));
    }
    else {
        // Continue to the same direction
        draw(context, endX, endY, direction);
    }
}

/**
 * Iterates through all the pixels on the canvas.
 */
function eachPixel(canvas, callback) {
    const context = canvas.getContext("2d");
    for (let y = 0; y < canvas.clientHeight; y += 1) {
        for (let x = 0; x < canvas.clientWidth; x += 1) {
            const color = getPixelColor(context, x, y);
            callback(context, color, x, y);
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
function rgbEqual(rgb1, rgb2) {
    return rgb1.every((value, index) => rgb2[index] === value);
}

/**
 * Rotates the given direction vector by 90 degrees clockwise,
 * returning a copied vector.
 */
function rotateRight([x, y]) {
    return [-y, x]; 
}

/**
 * Rotates the given direction vector by 90 degrees clockwise,
 * returning a copied vector.
 */
function rotateLeft([x, y]) {
    return [y, -x]; 
}
