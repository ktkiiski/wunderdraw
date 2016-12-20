// The color definition in RGBA values
const COLOR_START_UP = [7, 84, 19, 255];
const COLOR_START_LEFT = [139, 57, 137, 255];
const COLOR_STOP = [51, 69, 169, 255];
const COLOR_TURN_RIGHT = [182, 149, 72, 255];
const COLOR_TURN_LEFT = [123, 131, 154, 255];

// Some directional vector constants
const VECTOR_UP = [0, -1];
const VECTOR_LEFT = [-1, 0];

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
    // Iterate through all the pixels. Start drawing from starting colors
    eachPixel(sourceContext, (color, x, y) => {
        if (rgbEqual(color, COLOR_START_UP)) {
            // Start drawing up
            draw(sourceContext, targetContext, x, y, VECTOR_UP);
        }
        else if (rgbEqual(color, COLOR_START_LEFT)) {
            // Start drawing left
            draw(sourceContext, targetContext, x, y, VECTOR_LEFT);
        }
    });
};

/**
 * Draws the figure starting at the position
 * and towards the given direction.
 */
function draw(source, target, startX, startY, direction) {
    const [dX, dY] = direction;
    const endX = startX + dX;
    const endY = startY + dY;
    target.moveTo(startX, startY);
    target.lineTo(endX, endY);
    const color = getPixelColor(source, endX, endY);
    if (rgbEqual(color, COLOR_STOP)) {
        // Stop drawing and finish the stroke
        target.stroke();
    }
    else if (rgbEqual(color, COLOR_TURN_LEFT)) {
        // Turn left and continue drawing
        draw(source, target, endX, endY, rotateLeft(direction));
    }
    else if (rgbEqual(color, COLOR_TURN_RIGHT)) {
        // Turn right and continue drawing
        draw(source, target, endX, endY, rotateRight(direction));
    }
    else {
        // Continue to the same direction
        draw(source, target, endX, endY, direction);
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
